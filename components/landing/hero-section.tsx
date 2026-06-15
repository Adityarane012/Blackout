"use client"

import { motion } from "framer-motion"
import { ArrowRight, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"

interface SimNode {
  id: string
  label: string
  x: number
  y: number
  status: "healthy" | "stress" | "failure"
}

const demoNodes: SimNode[] = [
  { id: "lb", label: "us-east-lb", x: 50, y: 15, status: "healthy" },
  { id: "api1", label: "api-gateway-1", x: 25, y: 35, status: "healthy" },
  { id: "api2", label: "api-gateway-2", x: 75, y: 35, status: "healthy" },
  { id: "cache", label: "redis-cluster", x: 50, y: 55, status: "healthy" },
  { id: "srv1", label: "auth-svc", x: 15, y: 55, status: "healthy" },
  { id: "srv2", label: "payment-svc", x: 85, y: 55, status: "healthy" },
  { id: "db1", label: "pg-primary", x: 30, y: 80, status: "healthy" },
  { id: "db2", label: "pg-replica", x: 70, y: 80, status: "healthy" },
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
  { nodeId: "db1", status: "failure" as const, delay: 800 },
  { nodeId: "cache", status: "stress" as const, delay: 1200 },
  { nodeId: "srv1", status: "stress" as const, delay: 1800 },
  { nodeId: "cache", status: "failure" as const, delay: 2200 },
  { nodeId: "api1", status: "stress" as const, delay: 2800 },
  { nodeId: "srv1", status: "failure" as const, delay: 3400 },
  { nodeId: "api1", status: "failure" as const, delay: 4000 },
  { nodeId: "lb", status: "stress" as const, delay: 4800 },
]

export function HeroSection() {
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
    const interval = setInterval(() => {
      runCascade()
    }, 8000)

    const initialDelay = setTimeout(() => {
      runCascade()
    }, 1500)

    return () => {
      clearInterval(interval)
      clearTimeout(initialDelay)
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [])

  const getStatusColor = (status: SimNode["status"]) => {
    switch (status) {
      case "healthy": return "bg-zinc-700"
      case "stress": return "bg-amber-500"
      case "failure": return "bg-red-500"
    }
  }

  const getStatusGlow = (status: SimNode["status"]) => {
    switch (status) {
      case "healthy": return "shadow-none"
      case "stress": return "shadow-[0_0_20px_rgba(251,191,36,0.5)]"
      case "failure": return "shadow-[0_0_30px_rgba(239,68,68,0.7)]"
    }
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center pt-32 pb-16 px-6 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_0%,_rgba(8,8,18,1)_100%)] pointer-events-none z-0" />
      
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center flex-grow">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-card/50 text-muted-foreground text-xs font-mono tracking-widest backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            BLACKOUT ENGINE V1.0
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-[1.1]">
            Predict infrastructure <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">collapse.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Simulate failure cascades before your users experience them.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/simulator">
            <Button
              size="lg"
              className="px-8 font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all rounded-full h-12"
            >
              Launch Simulator
            </Button>
          </Link>
          <Link href="/docs/getting-started/introduction" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-full">
            <Button
              size="lg"
              variant="outline"
              tabIndex={-1}
              className="px-8 font-semibold border-border/50 bg-transparent hover:bg-secondary/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:border-cyan-500/30 transition-all duration-300 rounded-full h-12 group"
            >
              Read Docs <ChevronRight className="ml-2 w-4 h-4 text-muted-foreground group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300" />
            </Button>
          </Link>
        </motion.div>

        {/* Massive Network Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative w-full flex-grow min-h-[400px] max-h-[600px] rounded-3xl border border-border/50 bg-card/10 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black"
        >
          {/* Subtle grid in visual */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
          
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
                  stroke={isAffected ? (toStatus === "failure" || fromStatus === "failure" ? "#ef4444" : "#fbbf24") : "#3f3f46"}
                  strokeWidth="2"
                  strokeOpacity={isAffected ? 0.8 : 0.4}
                  strokeDasharray={isAffected ? "6,6" : "none"}
                  className="transition-all duration-500"
                />
              )
            })}
          </svg>

          {nodes.map((node) => (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div className="relative">
                <div
                  className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${getStatusColor(node.status)} ${getStatusGlow(node.status)} transition-all duration-500 z-10 relative`}
                />
                {(node.status === "failure" || node.status === "stress") && (
                   <div className={`absolute inset-0 rounded-full animate-ping opacity-50 ${node.status === "failure" ? "bg-red-500" : "bg-amber-500"}`} />
                )}
              </div>
              <span className={`absolute top-6 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-mono whitespace-nowrap transition-colors duration-500 ${node.status === "failure" ? "text-red-400" : node.status === "stress" ? "text-amber-400" : "text-muted-foreground"}`}>
                {node.label}
              </span>
            </div>
          ))}

          <div className="absolute top-6 right-6 border border-border/50 bg-background/80 backdrop-blur-md px-4 py-2 rounded-lg font-mono text-xs flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isAnimating ? "bg-red-500 animate-pulse" : "bg-zinc-500"}`} />
            <span className="text-muted-foreground">{isAnimating ? "CASCADE DETECTED" : "SYSTEM IDLE"}</span>
          </div>

        </motion.div>
      </div>
    </section>
  )
}
