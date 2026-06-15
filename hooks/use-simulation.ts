"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { Connection, InfraNode } from "@/components/network-graph"
import type { Event as SimEvent } from "@/components/event-log"
import { calculateNextTick, getInitialState } from "@/lib/propagation"

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
  const initialState = getInitialState();
  const [initialNodes, setInitialNodes] = useState<InfraNode[]>(initialState.nodes)
  const [initialConnections, setInitialConnections] = useState<Connection[]>(initialState.connections)
  const [nodes, setNodes] = useState<InfraNode[]>(initialState.nodes)
  const [connections, setConnections] = useState<Connection[]>(initialState.connections)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [blastRadiusNodeIds, setBlastRadiusNodeIds] = useState<string[]>([])
  const [events, setEvents] = useState<SimEvent[]>([])

  useEffect(() => {
    if (!selectedNodeId) {
      setBlastRadiusNodeIds([])
      return
    }

    const controller = new AbortController()
    fetch(`/api/blast-radius?nodeId=${selectedNodeId}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.ids) {
          setBlastRadiusNodeIds(data.ids)
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch blast radius:", err)
        }
      })

    return () => controller.abort()
  }, [selectedNodeId])

  useEffect(() => {
    setEvents([
      { id: "init-1", timestamp: new Date(), type: "info", message: "BLACKOUT core initialized." },
      { id: "init-2", timestamp: new Date(), type: "ai", message: "AI SRE core online. Ready for fault injection." },
    ])
  }, [])

  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [currentScenario, setCurrentScenario] = useState("normal")
  const [elapsedTime, setElapsedTime] = useState(0)

  // AI & Post Mortem States
  const [isAnalyzingPostMortem, setIsAnalyzingPostMortem] = useState(false)
  const [postMortemReport, setPostMortemReport] = useState("")
  const [isPostMortemOpen, setIsPostMortemOpen] = useState(false)

  const eventIdRef = useRef(2)
  const lastEventAtRef = useRef(0)
  const tickCountRef = useRef(0)
  const isPostMortemGeneratedRef = useRef(false)
  const cascadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) ?? null : null

  const addEvent = useCallback((type: SimEvent["type"], message: string, nodeId?: string, force = false) => {
    const now = Date.now()
    if (!force && now - lastEventAtRef.current < EVENT_THROTTLE_MS) return
    lastEventAtRef.current = now
    eventIdRef.current += 1
    setEvents((prev) => [
      ...prev.slice(-49),
      { id: `event-${eventIdRef.current}`, timestamp: new Date(), type, message, nodeId },
    ])
  }, [])

  // Action: Generate Post-Mortem Incident Report
  const generatePostMortemReport = useCallback(async (currentEvents: SimEvent[], scenarioName: string, duration: number) => {
    if (isPostMortemGeneratedRef.current) return;
    isPostMortemGeneratedRef.current = true;
    
    setIsRunning(false);
    setIsAnalyzingPostMortem(true);
    setIsPostMortemOpen(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          events: currentEvents,
          scenario: scenarioName,
          elapsedTime: duration
        })
      });
      const data = await res.json();
      setPostMortemReport(data.report || "Failed to compile post-mortem report stream.");
    } catch (err) {
      console.error("Post-Mortem generation failed:", err);
      setPostMortemReport("Error connecting to neural uplink. Telemetry link lost.");
    } finally {
      setIsAnalyzingPostMortem(false);
    }
  }, []);

  // Action: Manual Trigger of Node Failure
  const triggerNodeFailure = useCallback(
    (nodeId: string) => {
      const nodeName = nodes.find((n) => n.id === nodeId)?.label || nodeId
      addEvent("critical", `MANUAL INJECTION: Failed node ${nodeName}.`, nodeId, true)

      setNodes((prev) =>
        prev.map((node) =>
          node.id === nodeId ? { ...node, status: "failure" as const, load: 0 } : node
        )
      )
      
      setConnections((prev) =>
        prev.map((conn) =>
          conn.from === nodeId || conn.to === nodeId
            ? { ...conn, status: "down" as const, traffic: 0, latency: 999 }
            : conn
        )
      )
    },
    [nodes, addEvent]
  )

  // Action: Random Fault Injection
  const injectRandomFailure = useCallback(() => {
    const activeNodes = nodes.filter((n) => n.status === "healthy")
    if (activeNodes.length === 0) return
    const randomNode = activeNodes[Math.floor(Math.random() * activeNodes.length)]
    
    addEvent("warning", `CHAOS INJECTION: Elevated stress spike on ${randomNode.label}.`, randomNode.id, true)
    
    setNodes((prev) =>
      prev.map((node) =>
        node.id === randomNode.id ? { ...node, status: "stress" as const, load: 88 } : node
      )
    )
  }, [nodes, addEvent])

  // Action: Chaos Cascade Mode
  const triggerCascadeMode = useCallback(() => {
    addEvent("critical", "CASCADE FAILURE INITIATED: Tripping database node.", undefined, true)
    triggerNodeFailure("db-1")
  }, [addEvent, triggerNodeFailure])

  // Reset Simulator
  const resetSimulation = useCallback(() => {
    setIsRunning(false)
    setNodes(initialNodes)
    setConnections(initialConnections)
    setSelectedNodeId(null)
    setBlastRadiusNodeIds([])
    setElapsedTime(0)
    setEvents([
      { id: "reset-1", timestamp: new Date(), type: "info", message: "Simulation core re-calibrated. Grid restored." },
      { id: "reset-2", timestamp: new Date(), type: "ai", message: "AI neural net monitoring online. Ready." },
    ])
    eventIdRef.current = 2
    lastEventAtRef.current = 0
    tickCountRef.current = 0
    isPostMortemGeneratedRef.current = false
    setPostMortemReport("")
    setIsPostMortemOpen(false)
  }, [initialNodes, initialConnections])

  // Action: Load Custom User Topology
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
      { id: "custom-init-1", timestamp: new Date(), type: "info", message: "Custom system architecture loaded." },
      { id: "custom-init-2", timestamp: new Date(), type: "ai", message: "AI diagnostic analysis active. Ready to run simulation." }
    ])
    eventIdRef.current = 2
    lastEventAtRef.current = 0
    tickCountRef.current = 0
    isPostMortemGeneratedRef.current = false
    setPostMortemReport("")
    setIsPostMortemOpen(false)
  }, [])

  // Action: Trigger scenario shifts
  const handleScenarioChange = useCallback(
    (scenario: { id: string; name: string }) => {
      setCurrentScenario(scenario.id)
      addEvent("info", `Scenario active: ${scenario.name}.`, undefined, true)

      if (scenario.id === "traffic-spike") {
        addEvent("warning", "SYSTEM ALERT: Sudden 10x traffic multiplier hitting edge gateways.", undefined, true)
      } else if (scenario.id === "db-failure") {
        triggerNodeFailure("db-1")
      } else if (scenario.id === "cascade") {
        triggerCascadeMode()
      }
    },
    [addEvent, triggerNodeFailure, triggerCascadeMode]
  )

  // Simulation Tick Logic
  const runTick = useCallback(() => {
    setNodes((prevNodes) => {
      let finalNodes = prevNodes
      let finalConnections = connections

      // Synchronize connections state functional update
      setConnections((prevConnections) => {
        const result = calculateNextTick(prevNodes, prevConnections, currentScenario, speed)
        
        finalNodes = result.nodes
        finalConnections = result.connections

        // Append calculated alerts
        result.events.forEach((evt) => {
          addEvent(evt.type, evt.message, evt.nodeId, true)
        })

        return result.connections
      })

      // Increment tick counts
      tickCountRef.current += 1

      // 5-Tick SRE AI commentary fetch
      if (tickCountRef.current % 5 === 0) {
        fetch("/api/commentary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nodes: finalNodes,
            activeScenario: currentScenario,
            recentEvents: events.slice(-5)
          })
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.commentary) {
              addEvent("ai", data.commentary, undefined, true)
            }
          })
          .catch((err) => console.error("Telemetry narration failure:", err))
      }

      // Check for total blackout (Zero health / all nodes degraded/failure)
      const healthyNodes = finalNodes.filter(n => n.status === "healthy").length
      if (healthyNodes === 0 && !isPostMortemGeneratedRef.current) {
        addEvent("critical", "SYSTEM BLACKOUT: Complete infrastructure collapse detected.", undefined, true)
        // Set short timeout to let state flush before post-mortem opens
        setTimeout(() => {
          generatePostMortemReport(
            [...events, { id: "ext", timestamp: new Date(), type: "critical", message: "Catastrophic cascade complete." }],
            currentScenario,
            elapsedTime
          )
        }, 500)
      }

      return finalNodes
    })
  }, [currentScenario, speed, addEvent, generatePostMortemReport, elapsedTime, events, connections])

  // Start/Stop Tick Timer
  useEffect(() => {
    if (!isRunning) {
      if (cascadeIntervalRef.current) {
        clearInterval(cascadeIntervalRef.current)
        cascadeIntervalRef.current = null
      }
      return
    }

    const tickMs = Math.max(MIN_TICK_MS, 1000 / speed)
    cascadeIntervalRef.current = setInterval(() => {
      runTick()
      setElapsedTime((t) => t + 1)
    }, tickMs)

    return () => {
      if (cascadeIntervalRef.current) {
        clearInterval(cascadeIntervalRef.current)
        cascadeIntervalRef.current = null
      }
    }
  }, [isRunning, speed, runTick])

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
    
    // AI and post-mortem states
    isAnalyzingPostMortem,
    postMortemReport,
    isPostMortemOpen,
    setIsPostMortemOpen,
    generatePostMortemReport: () => generatePostMortemReport(events, currentScenario, elapsedTime),
    blastRadiusNodeIds,
  }
}
