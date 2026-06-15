"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { InfraNode } from "../network-graph"

interface LeftSidebarProps {
  nodes: InfraNode[]
  selectedNode: InfraNode | null
  onNodeSelect: (node: InfraNode | null) => void
  onTriggerFailure: (nodeId: string) => void
  onOpenCustomFault: () => void
  onCascadeMode: () => void
  liveAnalysis: { rootCause?: string, primaryImpact?: string, secondaryImpact?: string, recommendation?: string } | null
}

export function LeftSidebar({
  nodes,
  selectedNode,
  onNodeSelect,
  onTriggerFailure,
  onOpenCustomFault,
  onCascadeMode,
  liveAnalysis,
}: LeftSidebarProps) {
  const healthyCount = nodes.filter((n) => n.status === "healthy").length
  const stressCount = nodes.filter((n) => n.status === "stress").length
  const failureCount = nodes.filter((n) => n.status === "failure").length
  const totalNodes = nodes.length
  const healthPercentage = totalNodes > 0 ? Math.round((healthyCount / totalNodes) * 100) : 0

  const riskScore = Math.min(100, failureCount * 25 + stressCount * 10)
  const avgLoad = totalNodes > 0 ? nodes.reduce((sum, n) => sum + n.load, 0) / totalNodes : 0

  return (
    <aside className="w-80 bg-card/90 border-r border-border/50 flex flex-col overflow-hidden">
      {/* AI Analysis Panel */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-purple-400">AI Analysis</h2>
        </div>
        
        <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-3 min-h-[80px]">
          {liveAnalysis ? (
            <div className="space-y-2">
              <div className="text-xs font-mono">
                <span className="text-purple-400 uppercase tracking-wider text-[10px] block mb-0.5">Root Cause</span>
                <span className="text-foreground/90">{liveAnalysis.rootCause || "Analyzing..."}</span>
              </div>
              {liveAnalysis.primaryImpact && (
                <div className="text-xs font-mono">
                  <span className="text-orange-400 uppercase tracking-wider text-[10px] block mb-0.5">Primary Impact</span>
                  <span className="text-foreground/90">{liveAnalysis.primaryImpact}</span>
                </div>
              )}
              {liveAnalysis.secondaryImpact && (
                <div className="text-xs font-mono">
                  <span className="text-orange-400/80 uppercase tracking-wider text-[10px] block mb-0.5">Secondary Impact</span>
                  <span className="text-foreground/90">{liveAnalysis.secondaryImpact}</span>
                </div>
              )}
              <div className="text-xs font-mono pt-2 mt-2 border-t border-purple-500/20">
                <span className="text-cyan-400 uppercase tracking-wider text-[10px] block mb-0.5">Recommendation</span>
                <span className="text-foreground/90">{liveAnalysis.recommendation}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs font-mono text-purple-300/60 leading-relaxed">System operating within normal parameters. Awaiting telemetry anomalies.</p>
          )}
        </div>

        {/* Risk Score */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Cascade Risk</span>
            <span className={`text-sm font-mono font-bold ${riskScore > 60 ? "text-red-400" : riskScore > 30 ? "text-orange-400" : "text-cyan-400"}`}>
              {riskScore}%
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                riskScore > 60 ? "bg-red-500" : riskScore > 30 ? "bg-orange-500" : "bg-cyan-500"
              }`}
              style={{ width: `${riskScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Outage Intelligence */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-red-400">Outage Intelligence</h2>
        </div>

        <div className="space-y-2">
          {/* Fault Injection */}
          <button
            onClick={onOpenCustomFault}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/30 hover:border-orange-500/50 rounded-lg transition-all duration-200 group"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-xs font-mono uppercase tracking-wider text-orange-400">Inject Fault</span>
            </div>
            <svg className="w-4 h-4 text-orange-400/50 group-hover:text-orange-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Cascade Mode */}
          <button
            onClick={onCascadeMode}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-red-500/10 hover:bg-red-500/15 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-all duration-200 group"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-xs font-mono uppercase tracking-wider text-red-400">Cascade Mode</span>
            </div>
            <svg className="w-4 h-4 text-red-400/50 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Failed Nodes List */}
        {failureCount > 0 && (
          <div className="mt-3 space-y-1">
            <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Failed Nodes</span>
            {nodes
              .filter((n) => n.status === "failure")
              .map((node) => (
                <button
                  key={node.id}
                  onClick={() => onNodeSelect(node)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded text-left transition-colors"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-mono text-red-400">{node.label}</span>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Reliability Metrics */}
      <div className="p-4 flex-1 overflow-auto">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-cyan-500" />
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Reliability Metrics</h2>
        </div>

        {/* Health Overview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-foreground">Network Health</span>
            <motion.span 
              key={healthPercentage}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`text-lg font-mono font-bold ${healthPercentage > 80 ? "text-cyan-400" : healthPercentage > 50 ? "text-orange-400" : "text-red-400"}`}
            >
              {healthPercentage}%
            </motion.span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden flex">
            <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${(healthyCount / totalNodes) * 100}%` }} />
            <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${(stressCount / totalNodes) * 100}%` }} />
            <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${(failureCount / totalNodes) * 100}%` }} />
          </div>
        </div>

        {/* Node Status Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
            <motion.div key={healthyCount} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="text-2xl font-mono font-bold text-cyan-400">{healthyCount}</motion.div>
            <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Healthy</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
            <motion.div key={stressCount} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="text-2xl font-mono font-bold text-orange-400">{stressCount}</motion.div>
            <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Stress</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-red-500/5 border border-red-500/20">
            <motion.div key={failureCount} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="text-2xl font-mono font-bold text-red-400">{failureCount}</motion.div>
            <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Failed</div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="space-y-3">
          <MetricRow label="Avg Load" value={`${avgLoad.toFixed(0)}%`} status={avgLoad > 80 ? "critical" : avgLoad > 60 ? "warning" : "normal"} />
          <MetricRow label="Active Connections" value={`${nodes.reduce((sum, n) => sum + (n.connections?.length || 0), 0)}`} status="normal" />
          <MetricRow label="Regions" value="3 Active" status="normal" />
          <MetricRow label="Redundancy" value={failureCount > 0 ? "Degraded" : "Full"} status={failureCount > 0 ? "warning" : "normal"} />
        </div>
      </div>

      {/* Selected Node Detail */}
      {selectedNode && (
        <div className="p-4 border-t border-border/50 bg-card/60">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                selectedNode.status === "healthy" ? "bg-cyan-400" : 
                selectedNode.status === "stress" ? "bg-orange-400" : "bg-red-400 animate-pulse"
              }`} />
              <h3 className="text-sm font-mono font-bold text-foreground">{selectedNode.label}</h3>
            </div>
            <button onClick={() => onNodeSelect(null)} className="text-muted-foreground hover:text-foreground transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="px-2 py-1.5 bg-secondary/30 rounded text-center">
              <div className="text-[9px] font-mono uppercase text-muted-foreground">Type</div>
              <div className="text-xs font-mono text-foreground capitalize">{selectedNode.type}</div>
            </div>
            <div className="px-2 py-1.5 bg-secondary/30 rounded text-center">
              <div className="text-[9px] font-mono uppercase text-muted-foreground">Load</div>
              <div className={`text-xs font-mono font-bold ${selectedNode.load > 80 ? "text-red-400" : selectedNode.load > 60 ? "text-orange-400" : "text-cyan-400"}`}>
                {selectedNode.load.toFixed(0)}%
              </div>
            </div>
          </div>

          <button
            onClick={() => onTriggerFailure(selectedNode.id)}
            className="w-full px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded text-red-400 text-xs font-mono uppercase tracking-wider transition-all duration-200"
          >
            Simulate Failure
          </button>
        </div>
      )}
    </aside>
  )
}

function MetricRow({ label, value, status }: { label: string; value: string; status: "normal" | "warning" | "critical" }) {
  const statusColors = {
    normal: "text-foreground",
    warning: "text-orange-400",
    critical: "text-red-400",
  }

  return (
    <div className="flex items-center justify-between py-2 border-b border-border/30">
      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className={`text-sm font-mono font-medium ${statusColors[status]}`}>{value}</span>
    </div>
  )
}
