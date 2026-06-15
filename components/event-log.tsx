"use client"

import { useEffect, useState, useRef } from "react"

interface Event {
  id: string
  timestamp: Date
  type: "info" | "warning" | "critical" | "ai"
  message: string
  nodeId?: string
}

interface EventLogProps {
  events: Event[]
}

export function EventLog({ events }: EventLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [events, isExpanded])

  const displayEvents = isExpanded ? events.slice(-20) : events.slice(-5)

  return (
    <div className="absolute right-4 bottom-4 z-40">
      <div
        className={`bg-card/90 backdrop-blur-xl border border-border/50 rounded-lg overflow-hidden transition-all duration-300 ${
          isExpanded ? "w-96 h-80" : "w-80 h-48"
        }`}
      >
        {/* Header */}
        <div className="px-4 py-2 border-b border-border/50 flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Event Log</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted-foreground">{events.length} events</span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <svg className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Events */}
        <div ref={scrollRef} className="p-2 overflow-y-auto" style={{ height: isExpanded ? "calc(100% - 40px)" : "calc(100% - 40px)" }}>
          <div className="space-y-1">
            {displayEvents.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>
    </div>
  )
}

function EventItem({ event }: { event: Event }) {
  const typeStyles = {
    info: "border-l-cyan-400 text-cyan-400",
    warning: "border-l-orange-400 text-orange-400",
    critical: "border-l-red-400 text-red-400",
    ai: "border-l-purple-500 text-purple-400",
  }

  const typeIcons = {
    info: "●",
    warning: "▲",
    critical: "✕",
    ai: "◆",
  }

  return (
    <div className={`border-l-2 ${typeStyles[event.type].split(" ")[0]} bg-secondary/20 rounded-r px-3 py-2`}>
      <div className="flex items-start gap-2">
        <span className={`text-xs ${typeStyles[event.type].split(" ")[1]}`}>{typeIcons[event.type]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[9px] font-mono text-muted-foreground">
              {event.timestamp.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
            {event.nodeId && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-secondary rounded text-muted-foreground">
                {event.nodeId}
              </span>
            )}
          </div>
          <p className="text-xs font-mono text-foreground/80 leading-relaxed break-words">{event.message}</p>
        </div>
      </div>
    </div>
  )
}

export type { Event }
