"use client"

export function ApiContent() {
  return (
    <div className="w-full max-w-3xl py-12 px-6 lg:px-12">
      
      {/* Header */}
      <div className="mb-10 space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Trigger Cascade Simulation</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Initiates a synthetic failure cascade on your specified infrastructure target. The engine will evaluate the graph and propagate the stress upstream deterministically.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-10 pb-4 border-b border-border/50">
        <span className="font-mono text-xs font-bold px-2 py-1 rounded border text-green-400 bg-green-500/10 border-green-500/20">POST</span>
        <span className="font-mono text-sm text-foreground">/v1/simulations/cascade</span>
      </div>

      <h2 className="text-xl font-bold text-foreground mt-12 mb-6">Request Body</h2>
      
      {/* Parameters */}
      <div className="space-y-6">
        
        {/* Target */}
        <div className="border-b border-border/50 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-sm font-semibold text-foreground">target_node_id</span>
            <span className="font-mono text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded">string</span>
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Required</span>
          </div>
          <p className="text-sm text-muted-foreground">The unique identifier of the infrastructure node where the initial failure or stress should be injected (e.g., `db-primary-us-east`).</p>
        </div>

        {/* Duration */}
        <div className="border-b border-border/50 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-sm font-semibold text-foreground">duration_ms</span>
            <span className="font-mono text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded">integer</span>
          </div>
          <p className="text-sm text-muted-foreground">The length of the simulation in milliseconds. Defaults to <code className="text-foreground bg-muted px-1 rounded">300000</code> (5 minutes).</p>
        </div>

        {/* Severity */}
        <div className="border-b border-border/50 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-sm font-semibold text-foreground">severity</span>
            <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">enum</span>
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Required</span>
          </div>
          <p className="text-sm text-muted-foreground">The intensity of the injected failure. Must be one of:</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2"><code className="text-foreground bg-muted px-1 font-mono rounded">LATENCY_SPIKE</code><span className="text-muted-foreground">- Injects a random delay of 200-2000ms.</span></li>
            <li className="flex items-center gap-2"><code className="text-foreground bg-muted px-1 font-mono rounded">CONNECTION_DROP</code><span className="text-muted-foreground">- Refuses 50% of incoming connections.</span></li>
            <li className="flex items-center gap-2"><code className="text-foreground bg-muted px-1 font-mono rounded">COMPLETE_OUTAGE</code><span className="text-muted-foreground">- Total node unresponsiveness.</span></li>
          </ul>
        </div>

        {/* Dry Run */}
        <div className="border-b border-border/50 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-sm font-semibold text-foreground">dry_run</span>
            <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded">boolean</span>
          </div>
          <p className="text-sm text-muted-foreground">If <code className="text-foreground bg-muted px-1 rounded">true</code>, the API will evaluate the graph and return the predicted blast radius without actually modifying any load balancer weights or network policies. Highly recommended for production environments.</p>
        </div>

      </div>

    </div>
  )
}
