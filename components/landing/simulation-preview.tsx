"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface SimNode {
  id: string
  label: string
  x: number
  y: number
  status: "healthy" | "stress" | "failure"
}

const demoNodes: SimNode[] = [
  { id: "lb", label: "Load Balancer", x: 50, y: 10, status: "healthy" },
  { id: "api1", label: "API-1", x: 30, y: 30, status: "healthy" },
  { id: "api2", label: "API-2", x: 70, y: 30, status: "healthy" },
  { id: "cache", label: "Redis", x: 50, y: 50, status: "healthy" },
  { id: "srv1", label: "Auth", x: 20, y: 50, status: "healthy" },
  { id: "srv2", label: "Users", x: 80, y: 50, status: "healthy" },
  { id: "db1", label: "Primary DB", x: 35, y: 75, status: "healthy" },
  { id: "db2", label: "Replica", x: 65, y: 75, status: "healthy" },
]

const connections = [
  ["lb", "api1"],
  ["lb", "api2"],
  ["api1", "cache"],
  ["api2", "cache"],
  ["api1", "srv1"],
  ["api2", "srv2"],
  ["srv1", "db1"],
  ["srv2", "db2"],
  ["cache", "db1"],
  ["db1", "db2"],
]

const cascadeSequence = [
  { nodeId: "db1", status: "stress" as const, delay: 0 },
  { nodeId: "db1", status: "failure" as const, delay: 1000 },
  { nodeId: "cache", status: "stress" as const, delay: 1500 },
  { nodeId: "srv1", status: "stress" as const, delay: 2000 },
  { nodeId: "cache", status: "failure" as const, delay: 2500 },
  { nodeId: "api1", status: "stress" as const, delay: 3000 },
  { nodeId: "srv1", status: "failure" as const, delay: 3500 },
  { nodeId: "api1", status: "failure" as const, delay: 4000 },
  { nodeId: "lb", status: "stress" as const, delay: 4500 },
]

export function SimulationPreview() {
  const [nodes, setNodes] = useState<SimNode[]>(demoNodes)
  const [isAnimating, setIsAnimating] = useState(false)
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])

  const runCascade = () => {
    if (isAnimating) return
    setIsAnimating(true)

    // Reset nodes
    setNodes(demoNodes.map((n) => ({ ...n, status: "healthy" })))

    // Clear any existing timeouts
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []

    // Run cascade sequence
    cascadeSequence.forEach(({ nodeId, status, delay }) => {
      const timeout = setTimeout(() => {
        setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, status } : n)))
      }, delay)
      timeoutsRef.current.push(timeout)
    })

    // Reset after sequence
    const resetTimeout = setTimeout(() => {
      setNodes(demoNodes.map((n) => ({ ...n, status: "healthy" })))
      setIsAnimating(false)
    }, 7000)
    timeoutsRef.current.push(resetTimeout)
  }

  useEffect(() => {
    // Auto-run cascade every 10 seconds
    const interval = setInterval(() => {
      runCascade()
    }, 10000)

    // Initial run
    const initialDelay = setTimeout(() => {
      runCascade()
    }, 2000)

    return () => {
      clearInterval(interval)
      clearTimeout(initialDelay)
      timeoutsRef.current.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getStatusColor = (status: SimNode["status"]) => {
    switch (status) {
      case "healthy":
        return "bg-cyan-500"
      case "stress":
        return "bg-amber-500"
      case "failure":
        return "bg-red-500"
    }
  }

  const getStatusGlow = (status: SimNode["status"]) => {
    switch (status) {
      case "healthy":
        return "shadow-[0_0_20px_rgba(34,211,238,0.5)]"
      case "stress":
        return "shadow-[0_0_20px_rgba(251,191,36,0.5)]"
      case "failure":
        return "shadow-[0_0_25px_rgba(239,68,68,0.6)]"
    }
  }

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 font-mono text-sm tracking-wider mb-4 block">THE SOLUTION</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Visualize failure</span>
            <br />
            <span className="text-cyan-400">before it happens.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Watch cascading failures propagate through your infrastructure in a stunning real-time visualization.
          </p>
        </motion.div>

        {/* Simulation preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden border border-cyan-500/20 bg-background/50 backdrop-blur-sm"
        >
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(34,211,238,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full">
            {connections.map(([from, to], idx) => {
              const fromNode = nodes.find((n) => n.id === from)
              const toNode = nodes.find((n) => n.id === to)
              if (!fromNode || !toNode) return null

              const fromStatus = fromNode.status
              const toStatus = toNode.status
              const isAffected = fromStatus !== "healthy" || toStatus !== "healthy"

              return (
                <line
                  key={idx}
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke={isAffected ? (toStatus === "failure" || fromStatus === "failure" ? "#ef4444" : "#fbbf24") : "#22d3ee"}
                  strokeWidth="2"
                  strokeOpacity={isAffected ? 0.6 : 0.3}
                  strokeDasharray={isAffected ? "5,5" : "none"}
                  className="transition-all duration-500"
                />
              )
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div
                className={`w-4 h-4 rounded-full ${getStatusColor(node.status)} ${getStatusGlow(
                  node.status
                )} transition-all duration-300`}
              />
              <span className="absolute top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-muted-foreground whitespace-nowrap">
                {node.label}
              </span>
            </div>
          ))}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500" />
              <span className="text-muted-foreground">Healthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Stress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-muted-foreground">Failure</span>
            </div>
          </div>

          {/* Status indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isAnimating ? "bg-red-500 animate-pulse" : "bg-cyan-500"}`} />
            <span className="text-xs font-mono text-muted-foreground">
              {isAnimating ? "SIMULATING CASCADE" : "MONITORING"}
            </span>
          </div>
        </motion.div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          {[
            { title: "Real-time Visualization", description: "See failures propagate through your system graph instantly" },
            { title: "Dependency Mapping", description: "Automatic discovery and visualization of service relationships" },
            { title: "Failure Scenarios", description: "Test what-if scenarios without touching production" },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="text-center"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
