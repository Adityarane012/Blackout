"use client"

import { useMemo, useRef } from "react"
import type { Event } from "../event-log"

interface PlaybackTimelineProps {
  events: Event[]
  isRunning: boolean
  elapsedTime: number
  onSeek?: (time: number) => void
}

export function PlaybackTimeline({ events, isRunning, elapsedTime }: PlaybackTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null)

  const markers = useMemo(
    () =>
      events.slice(-20).map((event, idx) => ({
        time: idx * 5,
        type: event.type,
        message: event.message,
      })),
    [events]
  )

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const markerColors = {
    info: "bg-cyan-500",
    warning: "bg-orange-500",
    critical: "bg-red-500",
    ai: "bg-purple-500",
  }

  return (
    <div className="h-20 bg-card/90 border-t border-border/50 flex items-center px-6 gap-6">
      {/* Time Display */}
      <div className="flex flex-col items-center min-w-[80px]">
        <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Elapsed</span>
        <span className="text-xl font-mono font-bold text-foreground tabular-nums">{formatTime(elapsedTime)}</span>
      </div>

      {/* Divider */}
      <div className="w-px h-12 bg-border/50" />

      {/* Timeline Track */}
      <div className="flex-1 relative" ref={timelineRef}>
        {/* Labels */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Simulation Timeline</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-cyan-500" />
              <span className="text-[9px] font-mono text-muted-foreground">Info</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-[9px] font-mono text-muted-foreground">Warning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[9px] font-mono text-muted-foreground">Critical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-[9px] font-mono text-muted-foreground">AI</span>
            </div>
          </div>
        </div>

        {/* Track Background */}
        <div className="relative h-8 bg-secondary/30 rounded-lg border border-border/30 overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-0 flex">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="flex-1 border-r border-border/20 last:border-r-0" />
            ))}
          </div>

          {/* Event Markers */}
          {markers.map((marker, idx) => (
            <div
              key={idx}
              className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-4 rounded-sm ${markerColors[marker.type]} opacity-80 hover:opacity-100 transition-opacity cursor-pointer group`}
              style={{ left: `${Math.min((marker.time / 100) * 100, 98)}%` }}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-card border border-border rounded text-[10px] font-mono text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {marker.message.slice(0, 40)}...
              </div>
            </div>
          ))}

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-lg shadow-cyan-400/50"
            style={{ left: `${Math.min((elapsedTime / 300) * 100, 100)}%` }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-400 rotate-45" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-400 rotate-45" />
          </div>

          {/* Glow effect when running */}
          {isRunning && (
            <div
              className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-cyan-400/20 to-transparent pointer-events-none"
              style={{ left: `${Math.min((elapsedTime / 300) * 100, 100)}%`, transform: "translateX(-100%)" }}
            />
          )}
        </div>

        {/* Time Labels */}
        <div className="flex justify-between mt-1">
          <span className="text-[9px] font-mono text-muted-foreground">00:00</span>
          <span className="text-[9px] font-mono text-muted-foreground">01:00</span>
          <span className="text-[9px] font-mono text-muted-foreground">02:00</span>
          <span className="text-[9px] font-mono text-muted-foreground">03:00</span>
          <span className="text-[9px] font-mono text-muted-foreground">04:00</span>
          <span className="text-[9px] font-mono text-muted-foreground">05:00</span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-12 bg-border/50" />

      {/* Recent Events Mini Feed */}
      <div className="w-64 flex flex-col">
        <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Recent Events</span>
        <div className="flex-1 space-y-0.5 overflow-hidden">
          {events.slice(-3).reverse().map((event, idx) => (
            <div key={event.id} className={`flex items-center gap-2 text-[10px] font-mono truncate ${idx === 0 ? "text-foreground" : "text-muted-foreground"}`}>
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${markerColors[event.type]}`} />
              <span className="truncate">{event.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
