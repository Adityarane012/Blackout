"use client"

import { useEffect, useState } from "react"
import { UserButton, SignInButton, useAuth } from "@clerk/nextjs"

interface Scenario {
  id: string
  name: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
}

const SCENARIOS: Scenario[] = [
  { id: "normal", name: "Normal Operations", description: "Standard traffic patterns", severity: "low" },
  { id: "traffic-spike", name: "Traffic Surge", description: "10x traffic increase", severity: "medium" },
  { id: "db-failure", name: "Database Failure", description: "Primary DB goes offline", severity: "high" },
  { id: "cascade", name: "Cascade Event", description: "Multi-system failure chain", severity: "critical" },
  { id: "region-outage", name: "Region Outage", description: "US-EAST zone failure", severity: "critical" },
]

interface WorkspaceHeaderProps {
  isRunning: boolean
  speed: number
  onToggleSimulation: () => void
  onSpeedChange: (speed: number) => void
  onReset: () => void
  onScenarioChange: (scenario: Scenario) => void
  currentScenario: string
  onOpenImport: () => void
  onAbort: () => void
  onSaveArchitecture?: () => void
}

export function WorkspaceHeader({
  isRunning,
  speed,
  onToggleSimulation,
  onSpeedChange,
  onReset,
  onScenarioChange,
  currentScenario,
  onOpenImport,
  onAbort,
  onSaveArchitecture,
}: WorkspaceHeaderProps) {
  const { userId } = useAuth()
  const [isScenarioOpen, setIsScenarioOpen] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    setSessionId(Date.now().toString(36).toUpperCase().slice(-6))
  }, [])

  const selectedScenario = SCENARIOS.find((s) => s.id === currentScenario) || SCENARIOS[0]

  const severityColors = {
    low: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    high: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    critical: "text-red-400 bg-red-500/10 border-red-500/30",
  }

  return (
    <header className="h-16 bg-card/90 border-b border-border/50 flex items-center justify-between px-6 relative z-50">
      {/* Left - Logo */}
      <div className="flex items-center gap-6">
        <button
          onClick={onAbort}
          className="flex items-center gap-3 group/logo cursor-pointer text-left hover:opacity-90 active:scale-95 transition-all duration-200"
          title="Abort simulation uplink and return to base control."
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/10 to-purple-500/10 group-hover/logo:from-red-500/20 group-hover/logo:to-orange-500/20 border border-cyan-500/30 group-hover/logo:border-red-500/50 flex items-center justify-center shadow-lg shadow-cyan-500/5 group-hover/logo:glow-red transition-all duration-300">
              <div className="group-hover/logo:hidden block transition-all">
                <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L21 7.2v9.6L12 22L3 16.8V7.2L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                  <circle cx="12" cy="5" r="1" fill="currentColor" />
                  <circle cx="6" cy="15.5" r="1" fill="currentColor" />
                  <circle cx="18" cy="15.5" r="1" fill="currentColor" />
                  <path d="M12 5v5M12 14v6M6 15.5L10.5 13M18 15.5L13.5 13" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
                </svg>
              </div>
              <div className="group-hover/logo:block hidden text-red-400 animate-pulse transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 group-hover/logo:bg-red-500 rounded-full animate-pulse transition-colors" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold tracking-tight text-foreground group-hover/logo:text-red-400 transition-colors">BLACKOUT</h1>
              <span className="text-[8px] font-mono font-bold bg-secondary/80 border border-border group-hover/logo:border-red-500/30 group-hover/logo:text-red-400 group-hover/logo:bg-red-500/10 px-1.5 py-0.5 rounded opacity-0 group-hover/logo:opacity-100 transition-all uppercase tracking-wider">Abort</span>
            </div>
            <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground group-hover/logo:text-red-500/70 transition-colors">
              Infrastructure Simulator
            </p>
          </div>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-border/50" />

        {/* Scenario Selector */}
        <div className="relative">
          <button
            onClick={() => setIsScenarioOpen(!isScenarioOpen)}
            className="flex items-center gap-3 px-4 py-2 bg-secondary/50 hover:bg-secondary/80 border border-border/50 hover:border-border rounded-lg transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Scenario:</span>
              <span className="text-sm font-mono font-medium text-foreground">{selectedScenario.name}</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase border ${severityColors[selectedScenario.severity]}`}>
              {selectedScenario.severity}
            </span>
            <svg className={`w-4 h-4 text-muted-foreground transition-transform ${isScenarioOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {isScenarioOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-card border border-border/50 rounded-lg shadow-2xl shadow-black/50 overflow-hidden">
              {SCENARIOS.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => {
                    onScenarioChange(scenario)
                    setIsScenarioOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors ${
                    scenario.id === currentScenario ? "bg-secondary/30" : ""
                  }`}
                >
                  <div className="text-left">
                    <div className="text-sm font-mono text-foreground">{scenario.name}</div>
                    <div className="text-[10px] text-muted-foreground">{scenario.description}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase border ${severityColors[scenario.severity]}`}>
                    {scenario.severity}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center - Simulation Controls */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
        {/* Play/Pause */}
        <button
          onClick={onToggleSimulation}
          className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-200 ${
            isRunning
              ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 glow-cyan"
              : "bg-secondary/50 border-border text-muted-foreground hover:border-cyan-500/30 hover:text-cyan-400"
          }`}
        >
          {isRunning ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Speed Control */}
        <div className="flex items-center gap-1 bg-secondary/30 border border-border/30 rounded-lg p-1">
          {[0.5, 1, 2, 4].map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2.5 py-1.5 rounded text-xs font-mono transition-all duration-200 ${
                speed === s
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Reset */}
        <button
          onClick={onReset}
          className="w-10 h-10 rounded-lg bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Right - Status Indicators */}
      <div className="flex items-center gap-4">
        {/* Ingest Architecture Button */}
        <button
          onClick={onOpenImport}
          className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/15 border border-purple-500/30 hover:border-purple-500/50 rounded-lg text-purple-400 font-mono text-xs uppercase tracking-wider transition-all duration-200 group"
        >
          <svg className="w-3.5 h-3.5 text-purple-400/80 group-hover:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span>Ingest System</span>
        </button>

        {/* Save Architecture */}
        {userId ? (
          <button
            onClick={() => {
              if (onSaveArchitecture) onSaveArchitecture()
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 rounded-lg text-cyan-400 font-mono text-xs uppercase tracking-wider transition-all duration-200 group"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>Save</span>
          </button>
        ) : (
          <SignInButton mode="modal">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-border rounded-lg text-zinc-300 font-mono text-xs uppercase tracking-wider transition-all duration-200 group">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span>Sign in to Save</span>
            </button>
          </SignInButton>
        )}

        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/30 border border-border/30 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Live</span>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-mono text-muted-foreground">Session</div>
          <div className="text-xs font-mono text-foreground mr-2">{sessionId ? `SIM-${sessionId}` : "SIM-······"}</div>
        </div>
        {userId && <UserButton afterSignOutUrl="/" />}
      </div>
    </header>
  )
}
