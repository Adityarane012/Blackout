"use client"

import { Terminal, Copy, AlertTriangle, Info, CheckCircle2 } from "lucide-react"

export function DocsContent() {
  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-6 lg:px-12">
      
      {/* Header */}
      <div className="mb-10 space-y-4">
        <div className="flex items-center gap-2 text-sm font-mono text-cyan-400">
          <span>Simulation Engine</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">Cascade Failure</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Cascade Failure Engine</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          The core deterministic state-machine that propagates synthetic failures across your imported architecture graph.
        </p>
      </div>

      <div className="prose prose-invert prose-p:leading-loose prose-headings:font-semibold prose-a:text-cyan-400 max-w-none">
        
        <h2 className="text-2xl font-bold text-foreground mt-12 mb-6" id="overview">Overview</h2>
        <p className="text-muted-foreground">
          Unlike traditional chaos engineering tools that rely on random network partitioning, BLACKOUT uses a deterministic graph traversal model. When a synthetic stress is injected into a node, the Cascade Engine evaluates the node's upstream dependents and calculates propagation probability based on historical retry-storm data.
        </p>

        {/* Note Callout */}
        <div className="my-8 p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 flex gap-4">
          <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-cyan-400 mb-1">Prerequisite</h5>
            <p className="text-sm text-foreground/80 m-0">You must have an active architecture graph imported (via AWS integration or manual JSON definition) before initiating a cascade simulation.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-6" id="how-it-works">How it works</h2>
        
        <h3 className="text-lg font-semibold text-foreground mt-8 mb-4">1. State Injection</h3>
        <p className="text-muted-foreground">
          The engine modifies the state of a targeted node `N` from <span className="font-mono text-xs bg-card px-1.5 py-0.5 rounded border border-border">HEALTHY</span> to <span className="font-mono text-xs bg-card px-1.5 py-0.5 rounded border border-border text-amber-400">STRESS</span> or <span className="font-mono text-xs bg-card px-1.5 py-0.5 rounded border border-border text-red-400">FAILURE</span>.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-8 mb-4">2. Deterministic Propagation</h3>
        <p className="text-muted-foreground">
          If `N` is set to `FAILURE`, the engine immediately queries the graph for all nodes `M` where `M` depends on `N`. The state of `M` is degraded based on your defined resilience thresholds.
        </p>

        {/* Architecture Diagram Mockup */}
        <div className="my-8 rounded-2xl border border-border bg-card/50 overflow-hidden shadow-xl p-8 flex flex-col items-center justify-center">
           <div className="flex items-center justify-center gap-8 w-full">
             <div className="flex flex-col items-center gap-2">
               <div className="w-16 h-16 rounded-xl bg-red-500/10 border-2 border-red-500 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                  <span className="font-mono text-xs text-red-400">DB-1</span>
               </div>
               <span className="text-xs text-muted-foreground uppercase">Failure</span>
             </div>
             
             <div className="flex flex-col gap-1 items-center">
                <span className="text-[10px] font-mono text-muted-foreground">timeout (5000ms)</span>
                <div className="w-24 h-0.5 bg-gradient-to-r from-red-500 to-amber-500 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-amber-500 border-b-[4px] border-b-transparent" />
                </div>
             </div>

             <div className="flex flex-col items-center gap-2">
               <div className="w-16 h-16 rounded-xl bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center">
                  <span className="font-mono text-xs text-amber-400">API</span>
               </div>
               <span className="text-xs text-muted-foreground uppercase">Stress (Retry Storm)</span>
             </div>
           </div>
           <p className="text-xs text-muted-foreground mt-8 text-center max-w-sm">Fig 1. Upstream propagation of database failure causing an API gateway retry storm.</p>
        </div>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-6" id="trigger">Triggering a simulation</h2>
        <p className="text-muted-foreground">
          You can initiate a cascade manually via the dashboard, or programmatically using the BLACKOUT CLI.
        </p>

        {/* Code Block Mockup */}
        <div className="my-6 rounded-xl border border-border bg-[#0d0d0d] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background/50">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Terminal className="w-3.5 h-3.5" />
              bash
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-xs">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
          <div className="p-4 overflow-x-auto">
            <pre className="text-sm font-mono leading-loose">
              <span className="text-purple-400">blackout</span> simulate cascade \<br/>
              <span className="text-zinc-400">  --target</span>=<span className="text-green-400">"db-primary-us-east"</span> \<br/>
              <span className="text-zinc-400">  --duration</span>=<span className="text-orange-400">300s</span> \<br/>
              <span className="text-zinc-400">  --severity</span>=<span className="text-red-400">CRITICAL</span>
            </pre>
          </div>
        </div>

        {/* Warning Callout */}
        <div className="my-8 p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex gap-4">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-red-400 mb-1">Production Warning</h5>
            <p className="text-sm text-foreground/80 m-0">Do not attach the CLI to a live production cluster unless the <code className="text-xs bg-red-500/10 text-red-400 px-1 py-0.5 rounded">--dry-run</code> flag is explicitly set. The engine will modify actual load balancer routing weights if configured.</p>
          </div>
        </div>

      </div>
    </div>
  )
}
