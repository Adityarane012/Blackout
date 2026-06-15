"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { useState } from "react"
import { X, AlertTriangle, Zap, Clock, Activity } from "lucide-react"
import type { InfraNode } from "../network-graph"

export type FaultType = "Complete Outage" | "Latency Spike" | "Packet Loss" | "Database Saturation" | "Queue Congestion" | "API Failure"
export type FaultSeverity = "Low" | "Medium" | "High" | "Critical"

export interface FaultInjectionParams {
  targetNodeId: string
  faultType: FaultType
  severity: FaultSeverity
  duration: number // in seconds
}

interface InjectFaultModalProps {
  isOpen: boolean
  onClose: () => void
  nodes: InfraNode[]
  onInject: (params: FaultInjectionParams) => void
}

const FAULT_TYPES: FaultType[] = [
  "Complete Outage",
  "Latency Spike",
  "Packet Loss",
  "Database Saturation",
  "Queue Congestion",
  "API Failure"
]

const SEVERITIES: FaultSeverity[] = ["Low", "Medium", "High", "Critical"]

export function InjectFaultModal({ isOpen, onClose, nodes, onInject }: InjectFaultModalProps) {
  const [targetNodeId, setTargetNodeId] = useState<string>(nodes[0]?.id || "")
  const [faultType, setFaultType] = useState<FaultType>("Complete Outage")
  const [severity, setSeverity] = useState<FaultSeverity>("Critical")
  const [duration, setDuration] = useState<number>(30)

  // Ensure targetNodeId is valid when nodes change or modal opens
  if (isOpen && !targetNodeId && nodes.length > 0) {
    setTargetNodeId(nodes[0].id)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetNodeId) return
    onInject({ targetNodeId, faultType, severity, duration })
    onClose()
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border/50 bg-card p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-xl">
          
          <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
            <Dialog.Title className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Inject Targeted Fault
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground">
              Configure parameters to manually trigger a cascading failure simulation.
            </Dialog.Description>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Target Node */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Target Node
              </label>
              <select
                value={targetNodeId}
                onChange={(e) => setTargetNodeId(e.target.value)}
                className="w-full flex h-10 w-full items-center justify-between rounded-md border border-border/50 bg-secondary/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {nodes.map(node => (
                  <option key={node.id} value={node.id} className="bg-card text-foreground">
                    {node.label} ({node.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Fault Type */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-orange-400" />
                Fault Type
              </label>
              <select
                value={faultType}
                onChange={(e) => setFaultType(e.target.value as FaultType)}
                className="w-full flex h-10 w-full items-center justify-between rounded-md border border-border/50 bg-secondary/30 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              >
                {FAULT_TYPES.map(type => (
                  <option key={type} value={type} className="bg-card text-foreground">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Severity */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Severity
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as FaultSeverity)}
                  className="w-full flex h-10 w-full items-center justify-between rounded-md border border-border/50 bg-secondary/30 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                >
                  {SEVERITIES.map(s => (
                    <option key={s} value={s} className="bg-card text-foreground">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  Duration (Sec)
                </label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                  className="w-full flex h-10 w-full rounded-md border border-border/50 bg-secondary/30 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border/30">
              <Dialog.Close asChild>
                <button type="button" className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                  Cancel
                </button>
              </Dialog.Close>
              <button 
                type="submit"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all"
              >
                Execute Injection
              </button>
            </div>
          </form>

          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
