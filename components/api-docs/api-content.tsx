"use client"

export function ApiContent() {
  return (
    <div className="w-full max-w-3xl py-12 px-6 lg:px-12">
      
      {/* Header */}
      <div className="mb-10 space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Trigger Simulation</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Initiates a predictive failure cascade on your uploaded infrastructure architecture graph. The engine evaluates the graph and returns the predicted blast radius.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-10 pb-4 border-b border-border/50">
        <span className="font-mono text-xs font-bold px-2 py-1 rounded border text-green-400 bg-green-500/10 border-green-500/20">POST</span>
        <span className="font-mono text-sm text-foreground">/v1/simulations</span>
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
          <p className="text-sm text-muted-foreground">The unique identifier of the node in your uploaded graph where the initial failure should be simulated (e.g., `db-primary-us-east`).</p>
        </div>

        {/* Duration */}
        <div className="border-b border-border/50 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-sm font-semibold text-foreground">duration_ms</span>
            <span className="font-mono text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded">integer</span>
          </div>
          <p className="text-sm text-muted-foreground">The length of the simulation time-window in milliseconds. Defaults to <code className="text-foreground bg-muted px-1 rounded">300000</code> (5 minutes).</p>
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
            <li className="flex items-center gap-2"><code className="text-foreground bg-muted px-1 font-mono rounded">LATENCY_SPIKE</code><span className="text-muted-foreground">- Evaluates probability of downstream timeouts.</span></li>
            <li className="flex items-center gap-2"><code className="text-foreground bg-muted px-1 font-mono rounded">CONNECTION_DROP</code><span className="text-muted-foreground">- Simulates connection rejections.</span></li>
            <li className="flex items-center gap-2"><code className="text-foreground bg-muted px-1 font-mono rounded">COMPLETE_OUTAGE</code><span className="text-muted-foreground">- Total node failure cascade.</span></li>
          </ul>
        </div>
      </div>

    </div>
  )
}
