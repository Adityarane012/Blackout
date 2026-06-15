"use client"

import { useState } from "react"
import { Copy, Play, Check } from "lucide-react"

export function ApiPlayground() {
  const [activeTab, setActiveTab] = useState("cURL")
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getCodeContent = () => {
    switch(activeTab) {
      case "TypeScript":
        return `import { Blackout } from '@blackout/sdk';

const blackout = new Blackout(process.env.BLACKOUT_API_KEY);

const simulation = await blackout.simulations.trigger({
  targetNodeId: "db-primary-us-east",
  severity: "COMPLETE_OUTAGE",
  durationMs: 300000
});

console.log(simulation.predictedBlastRadius);`
      case "Python":
        return `import blackout
import os

client = blackout.Client(api_key=os.environ.get("BLACKOUT_API_KEY"))

simulation = client.simulations.trigger(
    target_node_id="db-primary-us-east",
    severity="COMPLETE_OUTAGE",
    duration_ms=300000
)

print(simulation.predicted_blast_radius)`
      default:
        return `curl -X POST https://api.blackout.dev/v1/simulations \\
  -H "Authorization: Bearer $BLACKOUT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "target_node_id": "db-primary-us-east",
    "severity": "COMPLETE_OUTAGE",
    "duration_ms": 300000
  }'`
    }
  }

  return (
    <aside className="fixed top-14 right-0 z-30 hidden w-1/2 lg:w-[45%] xl:w-[50%] shrink-0 overflow-y-auto border-l border-border/50 bg-[#0d0d0d] lg:block h-[calc(100vh-3.5rem)] pt-12 px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      <div className="w-full max-w-xl mx-auto space-y-12">
        
        {/* Request Block */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground">Example Request</h4>
            <div className="flex gap-1 bg-card border border-border p-1 rounded-md">
              {["cURL", "TypeScript", "Python"].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs px-3 py-1 rounded transition-colors ${
                    activeTab === tab 
                      ? "bg-muted text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-black overflow-hidden shadow-2xl relative group">
            <button 
              onClick={handleCopy}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-border p-1.5 rounded-md"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <div className="p-4 overflow-x-auto">
              <pre className="text-[13px] font-mono leading-loose text-zinc-300">
                {getCodeContent()}
              </pre>
            </div>
            <div className="bg-card/50 border-t border-border p-3 flex justify-end">
              <button className="flex items-center gap-2 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-md transition-colors">
                <Play className="w-3 h-3" /> Send Test Request
              </button>
            </div>
          </div>
        </div>

        {/* Response Block */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Response</h4>
          <div className="rounded-xl border border-border bg-black overflow-hidden shadow-2xl relative">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card/50">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-mono text-green-400">200 OK</span>
            </div>
            <div className="p-4 overflow-x-auto">
              <pre className="text-[13px] font-mono leading-loose">
<span className="text-purple-400">{"{"}</span>
  <span className="text-blue-400">"id"</span>: <span className="text-green-400">"sim_9a8b7c6d5e"</span>,
  <span className="text-blue-400">"status"</span>: <span className="text-green-400">"evaluating"</span>,
  <span className="text-blue-400">"target_node_id"</span>: <span className="text-green-400">"db-primary-us-east"</span>,
  <span className="text-blue-400">"predicted_blast_radius"</span>: <span className="text-purple-400">{"{"}</span>
    <span className="text-blue-400">"affected_nodes"</span>: [<span className="text-green-400">"api-gateway-1"</span>, <span className="text-green-400">"auth-svc"</span>, <span className="text-green-400">"redis-cluster"</span>],
    <span className="text-blue-400">"severity_score"</span>: <span className="text-amber-400">89</span>,
    <span className="text-blue-400">"cascade_probability"</span>: <span className="text-amber-400">0.97</span>
  <span className="text-purple-400">{"}"}</span>
<span className="text-purple-400">{"}"}</span>
              </pre>
            </div>
          </div>
        </div>

      </div>
    </aside>
  )
}
