import { INFRASTRUCTURE_TOPOLOGY, NodeDefinition } from "./graph-definition";
import { InfraNode, Connection } from "@/components/network-graph";
import { Event as SimEvent } from "@/components/event-log";

export interface SimulationState {
  nodes: InfraNode[];
  connections: Connection[];
  events: SimEvent[];
}

// Generate the initial network state based on the topology definition
export function getInitialState(): SimulationState {
  const nodes: InfraNode[] = INFRASTRUCTURE_TOPOLOGY.map((def) => ({
    id: def.id,
    label: def.label,
    type: def.type,
    status: "healthy",
    x: def.x,
    y: def.y,
    load: def.baseLoad,
    connections: def.dependencies,
    region: def.region,
  }));

  const connections: Connection[] = [];
  INFRASTRUCTURE_TOPOLOGY.forEach((source) => {
    source.dependencies.forEach((targetId) => {
      connections.push({
        from: source.id,
        to: targetId,
        traffic: 50,
        latency: 25,
        status: "active",
      });
    });
  });

  return { nodes, connections, events: [] };
}

// State Machine transitions: healthy -> stressed -> degraded -> failed
export function calculateNextTick(
  nodes: InfraNode[],
  connections: Connection[],
  scenario: string,
  speed: number
): { nodes: InfraNode[]; connections: Connection[]; events: Omit<SimEvent, "id" | "timestamp">[] } {
  const newNodes = JSON.parse(JSON.stringify(nodes)) as InfraNode[];
  const newConnections = JSON.parse(JSON.stringify(connections)) as Connection[];
  const events: Omit<SimEvent, "id" | "timestamp">[] = [];

  // 1. Establish scenario multipliers
  let trafficMultiplier = 1.0;
  if (scenario === "traffic-spike") {
    trafficMultiplier = 2.0;
  }

  // 2. Identify currently failed nodes
  const failedNodeIds = new Set(newNodes.filter((n) => n.status === "failure").map((n) => n.id));
  const stressedNodeIds = new Set(newNodes.filter((n) => n.status === "stress").map((n) => n.id));
  const degradedNodeIds = new Set(newNodes.filter((n) => n.status === "degraded").map((n) => n.id));

  // Helper to check if a node has any failed dependencies
  const getFailedDependenciesCount = (node: InfraNode): number => {
    return (node.connections || []).filter((depId) => failedNodeIds.has(depId)).length;
  };

  // Helper to check total dependencies count
  const getDependenciesCount = (node: InfraNode): number => {
    return (node.connections || []).length;
  };

  // 3. Process each node's state and load
  newNodes.forEach((node) => {
    if (node.status === "failure") {
      node.load = 0;
      return;
    }

    const baseLoad = (node as any).baseLoad || 35;

    // A. Base load fluctuation + scenario traffic spike
    let targetLoad = baseLoad * trafficMultiplier;

    // B. Calculate stress propagation from failed dependencies (UPSTREAM cascade)
    // If our dependencies are failed, our latency and queue size rise dramatically
    const failedDeps = getFailedDependenciesCount(node);
    const totalDeps = getDependenciesCount(node);

    if (failedDeps > 0) {
      const severityRatio = failedDeps / Math.max(1, totalDeps);
      // Large load penalty for failed dependencies
      targetLoad += severityRatio * 45;
    }

    // C. Traffic redistribution within the same tier (redundancy failover load)
    // If another node of our type is failed, we absorb a portion of their load
    const sameTypeNodes = newNodes.filter((n) => n.type === node.type && n.id !== node.id);
    const failedSameType = sameTypeNodes.filter((n) => n.status === "failure");
    if (failedSameType.length > 0) {
      const activeSameType = sameTypeNodes.filter((n) => n.status !== "failure").length + 1;
      targetLoad += (failedSameType.length / activeSameType) * 25;
    }

    // D. Soft flow: ease load towards target load
    const loadDelta = targetLoad - node.load;
    // Smoother increments, influenced by simulation speed
    const easing = 0.25;
    let loadStep = loadDelta * easing + (Math.random() - 0.5) * 4;
    
    node.load = Math.max(10, Math.min(100, Math.round(node.load + loadStep)));

    // E. State Machine Transitions
    const oldStatus = node.status;
    let newStatus: InfraNode["status"] = node.status;

    if (node.load >= 92) {
      newStatus = "degraded";
    } else if (node.load >= 75) {
      newStatus = "stress";
    } else if (node.load < 65) {
      newStatus = "healthy";
    }

    // Degraded nodes have a compounding probability of total collapse (failure)
    if (newStatus === "degraded") {
      // Base collapse chance 8% per tick, increased if dependencies are dead
      const collapseProbability = 0.08 + (failedDeps * 0.05);
      if (Math.random() < collapseProbability) {
        newStatus = "failure";
        events.push({
          type: "critical",
          message: `CRITICAL: ${node.label} crashed under excessive cascade load.`,
          nodeId: node.id,
        });
      }
    }

    if (newStatus !== oldStatus && newStatus !== "failure") {
      if (newStatus === "stress" && oldStatus === "healthy") {
        events.push({
          type: "warning",
          message: `WARNING: ${node.label} load elevated (${node.load}%). Latency rising.`,
          nodeId: node.id,
        });
      } else if (newStatus === "degraded" && oldStatus !== "degraded") {
        events.push({
          type: "critical",
          message: `DEGRADED: ${node.label} queue saturated (${node.load}%). Retry storms active.`,
          nodeId: node.id,
        });
      } else if (newStatus === "healthy" && oldStatus === "stress") {
        events.push({
          type: "info",
          message: `RECOVERED: ${node.label} traffic load returned to normal.`,
          nodeId: node.id,
        });
      }
    }

    node.status = newStatus;
  });

  // 4. Update connections status based on node states
  newConnections.forEach((conn) => {
    const fromNode = newNodes.find((n) => n.id === conn.from);
    const toNode = newNodes.find((n) => n.id === conn.to);

    if (!fromNode || !toNode) return;

    if (fromNode.status === "failure" || toNode.status === "failure") {
      conn.status = "down";
      conn.traffic = 0;
      conn.latency = 999;
    } else if (fromNode.status === "degraded" || toNode.status === "degraded") {
      conn.status = "degraded";
      conn.traffic = Math.max(10, Math.round(conn.traffic * 0.6));
      conn.latency = Math.min(500, conn.latency + 80);
    } else if (fromNode.status === "stress" || toNode.status === "stress") {
      conn.status = "degraded";
      conn.traffic = Math.round(conn.traffic * 0.95);
      conn.latency = Math.min(200, conn.latency + 30);
    } else {
      conn.status = "active";
      // Normal flow
      conn.traffic = 50 * trafficMultiplier;
      conn.latency = 25;
    }
  });

  return { nodes: newNodes, connections: newConnections, events };
}
