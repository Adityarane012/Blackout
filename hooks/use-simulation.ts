"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { Connection, InfraNode } from "@/components/network-graph"
import type { Event as SimEvent } from "@/components/event-log"
import { getInitialState } from "@/lib/propagation"
import { useAuth } from "@clerk/nextjs"

const EVENT_THROTTLE_MS = 1500
const MIN_TICK_MS = 1000

export const INITIAL_NODES: InfraNode[] = getInitialState().nodes;

export function generateConnections(nodes: InfraNode[]): Connection[] {
  const connections: Connection[] = []
  nodes.forEach((node) => {
    if (node.connections) {
      node.connections.forEach((targetId) => {
        connections.push({
          from: node.id,
          to: targetId,
          traffic: 50,
          latency: 25,
          status: "active",
        })
      })
    }
  })
  return connections
}

export function useSimulation() {
  const { userId } = useAuth()
  const initialState = getInitialState();
  const [initialNodes, setInitialNodes] = useState<InfraNode[]>(initialState.nodes)
  const [initialConnections, setInitialConnections] = useState<Connection[]>(initialState.connections)
  
  const [nodes, setNodes] = useState<InfraNode[]>(initialState.nodes)
  const [connections, setConnections] = useState<Connection[]>(initialState.connections)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [blastRadiusNodeIds, setBlastRadiusNodeIds] = useState<string[]>([])
  const [events, setEvents] = useState<SimEvent[]>([])

  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [currentScenario, setCurrentScenario] = useState("normal")
  const [elapsedTime, setElapsedTime] = useState(0)

  // Timeline fetched from backend
  const [playbackTimeline, setPlaybackTimeline] = useState<any[]>([])
  const [simulationId, setSimulationId] = useState<string | null>(null)

  // AI & Post Mortem States
  const [isAnalyzingPostMortem, setIsAnalyzingPostMortem] = useState(false)
  const [postMortemReport, setPostMortemReport] = useState("")
  const [postMortemScore, setPostMortemScore] = useState(100)
  const [isPostMortemOpen, setIsPostMortemOpen] = useState(false)

  const eventIdRef = useRef(2)
  const playbackIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isPostMortemGeneratedRef = useRef(false)
  const archIdRef = useRef<string | null>(null)

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) ?? null : null

  useEffect(() => {
    setEvents([
      { id: "init-1", timestamp: new Date(), type: "info", message: "BLACKOUT Deterministic Engine initialized." },
      { id: "init-2", timestamp: new Date(), type: "ai", message: "Neo4j connection verified. Graph ready for simulation." },
    ])
  }, [])

  const addEvent = useCallback((type: SimEvent["type"], message: string, nodeId?: string, force = false) => {
    eventIdRef.current += 1
    setEvents((prev) => [
      ...prev.slice(-49),
      { id: `event-${eventIdRef.current}`, timestamp: new Date(), type, message, nodeId },
    ])
  }, [])

  const generatePostMortemReport = useCallback(async (simId: string, scenarioName: string) => {
    if (isPostMortemGeneratedRef.current || !simId) return;
    isPostMortemGeneratedRef.current = true;
    
    setIsRunning(false);
    setIsAnalyzingPostMortem(true);
    setIsPostMortemOpen(true);

    try {
      const res = await fetch("/v1/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simulationId: simId,
          scenario: scenarioName,
          userId: userId || undefined,
          archId: archIdRef.current || undefined
        })
      });
      const data = await res.json();
      setPostMortemReport(data.report || "Failed to compile post-mortem.");
      setPostMortemScore(data.reliabilityScore ?? 0);
      
      // Highlight bottlenecks visually
      if (data.criticalNodes) {
         setBlastRadiusNodeIds(data.criticalNodes.map((cn: any) => cn.node.id));
      }
    } catch (err) {
      console.error("Post-Mortem generation failed:", err);
      setPostMortemReport("Error connecting to neural uplink.");
    } finally {
      setIsAnalyzingPostMortem(false);
    }
  }, []);

  const triggerSimulation = useCallback(async (scenarioId: string, targetId?: string) => {
    addEvent("warning", `Running Deterministic Cascade: ${scenarioId}`, targetId, true)
    setIsRunning(true)
    setElapsedTime(0)
    
    try {
      // 1. Send architecture to Neo4j validation layer
      const archRes = await fetch("/v1/architectures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId || undefined,
          name: "Simulation Run",
          graph: {
            nodes: initialNodes,
            edges: initialConnections.map(c => ({ source: c.from, target: c.to }))
          }
        })
      })
      if (!archRes.ok) throw new Error("Graph validation failed");
      const archData = await archRes.json();
      archIdRef.current = archData.id;
      
      // 2. Trigger the simulation traverse
      const simRes = await fetch("/v1/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: scenarioId,
          target: targetId
        })
      })
      
      const data = await simRes.json();
      setSimulationId(data.id);
      setPlaybackTimeline(data.timeline || []);
      
    } catch (err) {
      console.error(err)
      addEvent("critical", "Simulation Engine Error: Failed to generate timeline.")
      setIsRunning(false)
    }
  }, [initialNodes, initialConnections, addEvent])

  const triggerNodeFailure = useCallback((nodeId: string) => {
    setCurrentScenario("custom_node_failure")
    triggerSimulation("custom_node_failure", nodeId)
  }, [triggerSimulation])

  const injectRandomFailure = useCallback(() => {
    const activeNodes = nodes.filter((n) => n.status === "healthy")
    if (activeNodes.length === 0) return
    const randomNode = activeNodes[Math.floor(Math.random() * activeNodes.length)]
    triggerSimulation("custom_node_failure", randomNode.id)
  }, [nodes, triggerSimulation])

  const triggerCascadeMode = useCallback(() => {
    setCurrentScenario("database_saturation")
    triggerSimulation("database_saturation", "db-1")
  }, [triggerSimulation])

  const handleScenarioChange = useCallback((scenario: { id: string; name: string }) => {
    setCurrentScenario(scenario.id)
    if (scenario.id === "black_friday_traffic") {
      triggerSimulation("black_friday_traffic")
    } else if (scenario.id === "database_saturation") {
      triggerSimulation("database_saturation", "db-1")
    } else if (scenario.id === "retry_storm") {
      triggerSimulation("retry_storm", "api-gateway")
    }
  }, [triggerSimulation])

  // Playback Loop
  useEffect(() => {
    if (!isRunning || playbackTimeline.length === 0) {
      if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current)
      return
    }

    const maxTick = Math.max(...playbackTimeline.map(ev => parseInt(ev.tick.replace("T+", ""))))
    
    const tickMs = Math.max(MIN_TICK_MS, 1000 / speed)
    playbackIntervalRef.current = setInterval(() => {
      setElapsedTime(prev => {
        const nextTick = prev + 1
        
        // Find events for this tick
        const tickEvents = playbackTimeline.filter(ev => ev.tick === `T+${nextTick-1}`)
        if (tickEvents.length > 0) {
          setNodes(currentNodes => {
            let updatedNodes = [...currentNodes]
            tickEvents.forEach(ev => {
              addEvent(ev.state === "FAILED" ? "critical" : "warning", ev.message, ev.nodeId, true)
              updatedNodes = updatedNodes.map(n => 
                n.id === ev.nodeId ? { ...n, status: ev.state.toLowerCase() as any } : n
              )
            })
            return updatedNodes
          })
          
          // Update connections visually
          setConnections(currentConns => {
             return currentConns.map(conn => {
                const sourceFailed = tickEvents.some(ev => ev.nodeId === conn.to && ev.state === "FAILED")
                if (sourceFailed) return { ...conn, status: "down", traffic: 0 }
                return conn
             })
          })
        }
        
        // End simulation if we passed max tick
        if (nextTick > maxTick + 1) {
           clearInterval(playbackIntervalRef.current!)
           setIsRunning(false)
           if (!isPostMortemGeneratedRef.current && simulationId) {
             generatePostMortemReport(simulationId, currentScenario)
           }
        }
        
        return nextTick
      })
    }, tickMs)

    return () => clearInterval(playbackIntervalRef.current!)
  }, [isRunning, playbackTimeline, speed, simulationId, currentScenario, generatePostMortemReport, addEvent])

  const resetSimulation = useCallback(() => {
    setIsRunning(false)
    setNodes(initialNodes)
    setConnections(initialConnections)
    setSelectedNodeId(null)
    setBlastRadiusNodeIds([])
    setElapsedTime(0)
    setPlaybackTimeline([])
    setSimulationId(null)
    setEvents([
      { id: "reset-1", timestamp: new Date(), type: "info", message: "Simulation grid restored." },
    ])
    eventIdRef.current = 2
    isPostMortemGeneratedRef.current = false
    setPostMortemReport("")
    setPostMortemScore(100)
    setIsPostMortemOpen(false)
  }, [initialNodes, initialConnections])

  const loadCustomTopology = useCallback((customNodes: InfraNode[]) => {
    const customConns = generateConnections(customNodes)
    setInitialNodes(customNodes)
    setInitialConnections(customConns)
    setNodes(customNodes)
    setConnections(customConns)
    setSelectedNodeId(null)
    setElapsedTime(0)
    setIsRunning(false)
    setEvents([
      { id: "custom-init-1", timestamp: new Date(), type: "info", message: "Custom architecture validated by backend." }
    ])
    eventIdRef.current = 2
    isPostMortemGeneratedRef.current = false
    setPostMortemReport("")
    setIsPostMortemOpen(false)
  }, [])

  const saveCurrentArchitecture = useCallback(async (name: string) => {
    if (!userId) return;
    try {
      const archRes = await fetch("/v1/architectures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          name: name,
          environment: "production",
          graph: {
            nodes: initialNodes,
            edges: initialConnections.map(c => ({ source: c.from, target: c.to }))
          }
        })
      })
      if (!archRes.ok) throw new Error("Failed to save");
      addEvent("info", `Architecture '${name}' saved to your dashboard.`);
    } catch(err) {
      console.error(err);
      addEvent("critical", "Failed to save architecture.");
    }
  }, [userId, initialNodes, initialConnections, addEvent]);

  return {
    nodes,
    connections,
    selectedNode,
    setSelectedNodeId,
    events,
    isRunning,
    setIsRunning,
    speed,
    setSpeed,
    currentScenario,
    elapsedTime,
    addEvent,
    triggerNodeFailure,
    injectRandomFailure,
    triggerCascadeMode,
    resetSimulation,
    handleScenarioChange,
    loadCustomTopology,
    isAnalyzingPostMortem,
    postMortemReport,
    postMortemScore,
    isPostMortemOpen,
    setIsPostMortemOpen,
    generatePostMortemReport: () => simulationId && generatePostMortemReport(simulationId, currentScenario),
    blastRadiusNodeIds,
    saveCurrentArchitecture,
  }
}
