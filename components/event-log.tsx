"use client"

import { useEffect, useState, useRef } from "react"

interface Event {
  id: string
  timestamp: Date
  type: "info" | "warning" | "critical" | "ai" | "chain"
  message: string
  nodeId?: string
  chain?: {
    cause_node_id: string
    trigger_metric: string
    impact_node_id: string
    reason: string
  }
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
  const getTypeColor = (type: Event['type']) => {
    const styles = {
      info: "border-cyan-400/30 text-cyan-400",
      warning: "border-orange-400/30 text-orange-400",
      critical: "border-red-400/30 text-red-400",
      ai: "border-purple-500/30 text-purple-400",
      chain: "border-yellow-500/30 text-yellow-400",
    }
    return styles[type]
  }

  return (
    <div className={`border-l-2 ${getTypeColor(event.type).split(" ")[0]} bg-secondary/20 rounded-r px-3 py-2`}>
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${getTypeColor(event.type)}`}>
            {event.type}
          </span>
          {event.nodeId && (
            <span className="text-[10px] font-mono text-muted-foreground border border-border/50 px-1.5 py-0.5 rounded">
              NODE: {event.nodeId}
            </span>
          )}
          <span className="text-[10px] font-mono text-muted-foreground ml-auto opacity-50">
            {event.timestamp.toLocaleTimeString(undefined, {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              fractionalSecondDigits: 2,
            })}
          </span>
        </div>
        
        {event.chain ? (
          <div className="mt-1.5 bg-background/50 border border-border/30 rounded p-2 text-[11px] font-mono space-y-1">
            <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Cause:</span>
                <span className="text-red-400">{event.chain.cause_node_id}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Trigger Metric:</span>
                <span className="text-orange-400 uppercase">{event.chain.trigger_metric}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Impact:</span>
                <span className="text-cyan-400">{event.chain.impact_node_id}</span>
            </div>
            <div className="text-foreground/80 pt-1 border-t border-border/30 mt-1">
                &quot;{event.chain.reason}&quot;
            </div>
          </div>
        ) : (
          <p className="text-xs font-mono text-foreground/90 leading-relaxed mt-1">{event.message}</p>
        )}
      </div>
    </div>
  )
}

export type { Event }
