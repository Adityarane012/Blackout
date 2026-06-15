"use client"

import { useEffect, useState } from "react"

interface SystemStatsProps {
  healthyCount: number
  stressCount: number
  failureCount: number
  totalTraffic: number
  avgLatency: number
}

export function SystemStats({ healthyCount, stressCount, failureCount, totalTraffic, avgLatency }: SystemStatsProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const totalNodes = healthyCount + stressCount + failureCount
  const healthPercentage = totalNodes > 0 ? Math.round((healthyCount / totalNodes) * 100) : 0

  return (
    <div className="absolute left-4 top-4 space-y-3 z-40">
      {/* System Status Header */}
      <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-lg p-4 w-64">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">System Status</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">
            {time.toLocaleTimeString("en-US", { hour12: false })}
          </span>
        </div>

        {/* Health Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-foreground">Network Health</span>
            <span className={`text-xs font-mono font-bold ${healthPercentage > 80 ? "text-cyan-400" : healthPercentage > 50 ? "text-orange-400" : "text-red-400"}`}>
              {healthPercentage}%
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                healthPercentage > 80 ? "bg-cyan-400" : healthPercentage > 50 ? "bg-orange-400" : "bg-red-400"
              }`}
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
        </div>

        {/* Node Counts */}
        <div className="grid grid-cols-3 gap-2">
          <StatBox label="Healthy" value={healthyCount} color="cyan" />
          <StatBox label="Stress" value={stressCount} color="orange" />
          <StatBox label="Failed" value={failureCount} color="red" />
        </div>
      </div>

      {/* Traffic Stats */}
      <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-lg p-4 w-64">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Network Traffic</span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Throughput</span>
              <span className="text-sm font-mono font-bold text-foreground">{(totalTraffic / 1000).toFixed(1)}K rps</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((totalTraffic / 100000) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Avg Latency</span>
              <span className={`text-sm font-mono font-bold ${avgLatency > 100 ? "text-red-400" : avgLatency > 50 ? "text-orange-400" : "text-cyan-400"}`}>
                {avgLatency.toFixed(0)}ms
              </span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  avgLatency > 100 ? "bg-red-400" : avgLatency > 50 ? "bg-orange-400" : "bg-cyan-400"
                }`}
                style={{ width: `${Math.min((avgLatency / 200) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value, color }: { label: string; value: number; color: "cyan" | "orange" | "red" }) {
  const colorClasses = {
    cyan: "text-cyan-400 border-cyan-500/30 bg-cyan-500/5",
    orange: "text-orange-400 border-orange-500/30 bg-orange-500/5",
    red: "text-red-400 border-red-500/30 bg-red-500/5",
  }

  return (
    <div className={`text-center p-2 rounded border ${colorClasses[color]}`}>
      <div className={`text-lg font-mono font-bold ${colorClasses[color].split(" ")[0]}`}>{value}</div>
      <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  )
}
