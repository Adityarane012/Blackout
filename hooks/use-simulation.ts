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
  const rootCauseRef = useRef<string | null>(null)

  const [liveAnalysis, setLiveAnalysis] = useState<{
    rootCause?: string;
    primaryImpact?: string;
    secondaryImpact?: string;
    recommendation?: string;
  } | null>(null)

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
          target: targetId,
          archId: archData.id
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

  const triggerTargetedFault = useCallback(async (params: { targetNodeId: string, faultType: string, severity: string, duration: number }) => {
    setCurrentScenario("targeted_fault")
    addEvent("warning", `Injecting ${params.severity} ${params.faultType} into ${params.targetNodeId}...`, params.targetNodeId, true)
    
    setIsRunning(true)
    setElapsedTime(0)
    
    try {
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
      
      const simRes = await fetch("/v1/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: "targeted_fault",
          target: params.targetNodeId,
          fault_type: params.faultType,
          severity: params.severity,
          duration: params.duration,
          archId: archData.id
        })
      })
      
      const data = await simRes.json();
      setSimulationId(data.id);
      setPlaybackTimeline(data.timeline || []);
    } catch (err) {
      console.error(err)
      addEvent("critical", "Simulation Engine Error: Failed to generate targeted timeline.")
      setIsRunning(false)
    }
  }, [userId, initialNodes, initialConnections, addEvent])

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
            
            // For live analysis
            let newFailed: string[] = []
            let newStressed: string[] = []

            tickEvents.forEach(ev => {
              addEvent(ev.state === "FAILED" ? "critical" : ev.state === "STRESSED" ? "warning" : "info", ev.message, ev.nodeId, true)
              
              if (ev.state === "FAILED") newFailed.push(ev.nodeId)
              if (ev.state === "STRESSED" || ev.state === "DEGRADED") newStressed.push(ev.nodeId)

              updatedNodes = updatedNodes.map(n => {
                if (n.id === ev.nodeId) {
                  const newStatus = ev.state.toLowerCase() as any
                  let newLoad = n.load
                  if (newStatus === "failed") newLoad = 0
                  if (newStatus === "stress") newLoad = Math.min(100, n.load + 40)
                  if (newStatus === "degraded") newLoad = Math.min(90, n.load + 20)
                  return { ...n, status: newStatus, load: newLoad }
                }
                return n
              })
            })

            // Update live analysis
            setLiveAnalysis(prev => {
              const rootCause = prev?.rootCause || (newFailed.length > 0 ? updatedNodes.find(n => n.id === newFailed[0])?.label : undefined)
              const primaryImpact = prev?.primaryImpact || (newFailed.length > 1 ? updatedNodes.find(n => n.id === newFailed[1])?.label : (newStressed.length > 0 ? updatedNodes.find(n => n.id === newStressed[0])?.label : undefined))
              const secondaryImpact = newStressed.length > 1 ? updatedNodes.find(n => n.id === newStressed[newStressed.length-1])?.label : prev?.secondaryImpact
              
              let recommendation = "Monitor system health."
              if (rootCause && primaryImpact) {
                 recommendation = `Introduce circuit breakers between ${rootCause} and ${primaryImpact}.`
              } else if (rootCause) {
                 recommendation = `Scale up redundancy for ${rootCause}.`
              }

              return {
                rootCause,
                primaryImpact: primaryImpact !== rootCause ? primaryImpact : undefined,
                secondaryImpact: secondaryImpact !== primaryImpact ? secondaryImpact : undefined,
                recommendation
              }
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
    setLiveAnalysis(null)
    setEvents([
      { id: "reset-1", timestamp: new Date(), type: "info", message: "Simulation grid restored." },
    ])
    eventIdRef.current = 2
    isPostMortemGeneratedRef.current = false
    setPostMortemReport("")
    setPostMortemScore(100)
    setIsPostMortemOpen(false)
  }, [initialNodes, initialConnections])

  const handleScenarioChange = useCallback((scenario: { id: string; name: string }) => {
    setCurrentScenario(scenario.id)
    if (scenario.id === "normal") {
      resetSimulation()
    } else {
      triggerSimulation(scenario.id)
    }
  }, [triggerSimulation, resetSimulation])

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

  const loadArchitectureFromBackend = useCallback(async (archId: string) => {
    try {
      const res = await fetch(`/v1/architectures/${archId}`)
      if (!res.ok) throw new Error("Architecture not found")
      const data = await res.json()
      
      archIdRef.current = archId
      setInitialNodes(data.nodes)
      setInitialConnections(data.connections)
      setNodes(data.nodes)
      setConnections(data.connections)
      setSelectedNodeId(null)
      setElapsedTime(0)
      setIsRunning(false)
      setEvents([
        { id: "load-1", timestamp: new Date(), type: "info", message: `Architecture loaded successfully.` }
      ])
      eventIdRef.current = 2
      isPostMortemGeneratedRef.current = false
      setPostMortemReport("")
      setIsPostMortemOpen(false)
    } catch (err) {
      console.error(err)
      addEvent("critical", "Failed to load architecture from backend.")
    }
  }, [addEvent])

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
    triggerTargetedFault,
    injectRandomFailure,
    triggerCascadeMode,
    resetSimulation,
    handleScenarioChange,
    loadCustomTopology,
    loadArchitectureFromBackend,
    isAnalyzingPostMortem,
    postMortemReport,
    postMortemScore,
    isPostMortemOpen,
    setIsPostMortemOpen,
    generatePostMortemReport: () => simulationId && generatePostMortemReport(simulationId, currentScenario),
    blastRadiusNodeIds,
    saveCurrentArchitecture,
    liveAnalysis
  }
}
