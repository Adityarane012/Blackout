"use client"

import { useState, useEffect, useCallback } from "react"

interface SimulationControlsProps {
  isRunning: boolean
  speed: number
  onToggleSimulation: () => void
  onSpeedChange: (speed: number) => void
  onReset: () => void
  onRandomFailure: () => void
  onCascadeMode: () => void
}

export function SimulationControls({
  isRunning,
  speed,
  onToggleSimulation,
  onSpeedChange,
  onReset,
  onRandomFailure,
  onCascadeMode,
}: SimulationControlsProps) {
  const [showCascadeWarning, setShowCascadeWarning] = useState(false)

  const handleCascade = useCallback(() => {
    setShowCascadeWarning(true)
    setTimeout(() => {
      setShowCascadeWarning(false)
      onCascadeMode()
    }, 500)
  }, [onCascadeMode])

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40">
      <div className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-lg p-4 flex items-center gap-4">
        {/* Play/Pause */}
        <button
          onClick={onToggleSimulation}
          className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
            isRunning
              ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20"
              : "bg-secondary/50 border-border text-muted-foreground hover:border-cyan-500/30 hover:text-cyan-400"
          }`}
        >
          {isRunning ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-border" />

        {/* Speed Control */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Speed</span>
          <div className="flex items-center gap-1">
            {[0.5, 1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-1 rounded text-xs font-mono transition-all duration-200 ${
                  speed === s
                    ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-400"
                    : "bg-secondary/30 border border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-border" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRandomFailure}
            className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 hover:border-orange-500/50 rounded text-orange-400 text-xs font-mono uppercase tracking-wider transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/10"
          >
            Inject Fault
          </button>

          <button
            onClick={handleCascade}
            className={`px-4 py-2 border rounded text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
              showCascadeWarning
                ? "bg-red-500/30 border-red-500 text-red-300 animate-pulse"
                : "bg-red-500/10 hover:bg-red-500/20 border-red-500/30 hover:border-red-500/50 text-red-400 hover:shadow-lg hover:shadow-red-500/10"
            }`}
          >
            {showCascadeWarning ? "⚠ INITIATING" : "Cascade Mode"}
          </button>

          <button
            onClick={onReset}
            className="px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-border rounded text-muted-foreground hover:text-foreground text-xs font-mono uppercase tracking-wider transition-all duration-200"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
