"use client"

import { useEffect, useState, useRef } from "react"
import type { InfraNode } from "./network-graph"

interface NodeDetailPanelProps {
  node: InfraNode | null
  onClose: () => void
  onTriggerFailure: (nodeId: string) => void
}

export function NodeDetailPanel({ node, onClose, onTriggerFailure }: NodeDetailPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (node) {
      setIsAnalyzing(true)
      setAnalysisResult(null)
      const timer = setTimeout(() => {
        setIsAnalyzing(false)
        setAnalysisResult(generateAnalysis(node))
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [node])

  if (!node) return null

  const statusColors = {
    healthy: { bg: "bg-cyan-500/10", border: "border-cyan-500/50", text: "text-cyan-400", glow: "shadow-cyan-500/20" },
    stress: { bg: "bg-orange-500/10", border: "border-orange-500/50", text: "text-orange-400", glow: "shadow-orange-500/20" },
    degraded: { bg: "bg-yellow-500/10", border: "border-yellow-500/50", text: "text-yellow-400", glow: "shadow-yellow-500/20" },
    failure: { bg: "bg-red-500/10", border: "border-red-500/50", text: "text-red-400", glow: "shadow-red-500/20" },
  }

  const colors = statusColors[node.status]

  return (
    <div
      ref={panelRef}
      className={`absolute right-4 top-4 w-80 ${colors.bg} backdrop-blur-xl border ${colors.border} rounded-lg shadow-2xl ${colors.glow} overflow-hidden z-50`}
    >
      {/* Header */}
      <div className="relative px-4 py-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${node.status === "healthy" ? "bg-cyan-400" : node.status === "stress" ? "bg-orange-400" : "bg-red-400"} ${node.status !== "healthy" ? "animate-pulse" : ""}`} />
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">{node.label}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Status */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Status</label>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded ${colors.bg} border ${colors.border}`}>
            <span className={`text-xs font-mono uppercase font-bold ${colors.text}`}>{node.status}</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard label="Load" value={`${node.load}%`} status={node.load > 80 ? "critical" : node.load > 60 ? "warning" : "normal"} />
          <MetricCard label="Type" value={node.type} status="normal" />
          <MetricCard label="Region" value={node.region || "US-EAST"} status="normal" />
          <MetricCard label="Connections" value={`${node.connections.length}`} status="normal" />
        </div>

        {/* AI Analysis */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            <label className="text-[10px] font-mono uppercase tracking-widest text-purple-400">AI Analysis</label>
          </div>
          <div className="bg-purple-500/5 border border-purple-500/20 rounded p-3 min-h-[60px]">
            {isAnalyzing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                <span className="text-xs font-mono text-purple-400">Analyzing cascade risk...</span>
              </div>
            ) : (
              <p className="text-xs font-mono text-purple-300/80 leading-relaxed">{analysisResult}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onTriggerFailure(node.id)}
            className="flex-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded text-red-400 text-xs font-mono uppercase tracking-wider transition-all duration-200 hover:shadow-lg hover:shadow-red-500/10"
          >
            Simulate Failure
          </button>
          <button
            onClick={onClose}
            className="px-3 py-2 bg-secondary/50 hover:bg-secondary border border-border/50 rounded text-muted-foreground text-xs font-mono uppercase tracking-wider transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, status }: { label: string; value: string; status: "normal" | "warning" | "critical" }) {
  const statusColors = {
    normal: "text-foreground",
    warning: "text-orange-400",
    critical: "text-red-400",
  }

  return (
    <div className="bg-secondary/30 border border-border/30 rounded p-2">
      <label className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground block mb-1">{label}</label>
      <span className={`text-sm font-mono font-bold ${statusColors[status]}`}>{value}</span>
    </div>
  )
}

function generateAnalysis(node: InfraNode): string {
  const analyses = {
    healthy: [
      "Node operating within normal parameters. No cascade risk detected.",
      "All connections stable. Traffic flow optimal.",
      "System health nominal. Redundancy paths available.",
    ],
    stress: [
      `High load detected (${node.load}%). Risk of cascade failure to ${node.connections.length} connected nodes.`,
      "Elevated latency observed. Recommend load balancing intervention.",
      "Resource utilization approaching threshold. Monitor closely.",
    ],
    degraded: [
      `Node state degraded (${node.load}%). Request queues saturated.`,
      "Queue backpressure actively throttling upstream requests.",
      "Degraded performance baseline. Cascade danger level: elevated.",
    ],
    failure: [
      `CRITICAL: Node failure confirmed. ${node.connections.length} downstream services at risk.`,
      "Cascade propagation imminent. Initiating failover protocols.",
      "Service disruption detected. Estimated impact: HIGH priority.",
    ],
  }

  const options = analyses[node.status]
  return options[Math.floor(Math.random() * options.length)]
}
