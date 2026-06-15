"use client"

import { motion } from "framer-motion"
import { Terminal, Activity, BrainCircuit, BarChart3 } from "lucide-react"

export function FeatureShowcase() {
  return (
    <section className="py-32 px-6 overflow-hidden bg-background">
      <div className="max-w-6xl mx-auto space-y-40">
        
        {/* Section 1: Generate Chaos */}
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-6"
          >
            <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center">
              <Terminal className="w-6 h-6 text-foreground" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Generate Chaos.</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
              Ditch the static tests. Use our AI engine to spin up unpredictable traffic spikes, packet drops, and database deadlocks in seconds.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full"
          >
            <div className="rounded-2xl border border-border bg-card/50 overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="h-10 border-b border-border bg-muted/50 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <div className="ml-4 text-xs font-mono text-muted-foreground">chaos-engine-v1.0</div>
              </div>
              <div className="p-6 font-mono text-sm space-y-3">
                <div className="text-muted-foreground">~ ❯ blackout apply --scenario="db-stress"</div>
                <div className="text-foreground">Initializing synthetic traffic burst...</div>
                <div className="text-amber-400">Warning: Load exceeding 100k req/s</div>
                <div className="text-foreground">Simulating connection pool exhaustion on <span className="text-cyan-400">pg-primary</span></div>
                <div className="text-green-400">Chaos scenario injected successfully.</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Section 2: Watch It Break */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-6"
          >
            <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center">
              <Activity className="w-6 h-6 text-foreground" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Watch It Break.</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
              Track the exact moment a single slow query turns into a system-wide outage. Visualize cascading degradation in real time.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full"
          >
            <div className="relative aspect-video rounded-2xl border border-border bg-card/50 overflow-hidden shadow-2xl flex items-center justify-center p-8">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(8,8,18,0.4)_100%)]" />
               <div className="w-full h-full relative">
                 {/* Mock UI for propagation */}
                 <div className="absolute top-1/2 left-4 w-12 h-12 rounded-full border border-red-500/30 bg-red-500/10 -translate-y-1/2 animate-ping" />
                 <div className="absolute top-1/2 left-4 w-12 h-12 rounded-full bg-red-500 flex items-center justify-center -translate-y-1/2 z-10 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                   <div className="w-4 h-4 bg-background rounded-sm" />
                 </div>
                 
                 <div className="absolute top-1/2 left-[4rem] right-[4rem] h-0.5 bg-gradient-to-r from-red-500 via-amber-500 to-zinc-700 -translate-y-1/2" />
                 
                 <div className="absolute top-1/2 right-4 w-16 h-16 rounded-xl border border-border bg-card -translate-y-1/2 z-10 flex flex-col items-center justify-center gap-1 overflow-hidden">
                   <div className="w-full h-1 bg-amber-500 animate-pulse" />
                   <div className="w-8 h-2 bg-muted rounded-sm mt-2" />
                   <div className="w-10 h-2 bg-muted rounded-sm" />
                 </div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Section 3: Find The Weak Link */}
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-6"
          >
            <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-foreground" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Find The Weak Link.</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
              Let our AI analyze the collapse chain. We automatically highlight single points of failure and recommend architectural fixes before you deploy.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full"
          >
            <div className="rounded-2xl border border-border bg-card/50 p-6 shadow-2xl backdrop-blur-md">
               <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                  <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                  <span className="text-sm font-mono tracking-widest text-muted-foreground uppercase">AI Cascade Analysis</span>
               </div>
               <div className="space-y-4">
                 <div className="flex justify-between items-center bg-background rounded-lg p-3 border border-border/50">
                    <span className="text-muted-foreground text-sm font-mono">Critical Path</span>
                    <span className="text-sm font-mono text-foreground">DB-1 → Redis → API</span>
                 </div>
                 <div className="flex justify-between items-center bg-background rounded-lg p-3 border border-border/50">
                    <span className="text-muted-foreground text-sm font-mono">Predicted Impact</span>
                    <span className="text-sm font-mono text-foreground">4 services, ~12k users</span>
                 </div>
                 <div className="mt-6 p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                   <p className="text-sm text-cyan-400 font-mono mb-2">Recommendation</p>
                   <p className="text-sm text-foreground/80">Implement circuit breakers on <span className="font-mono text-cyan-300">api-gateway</span> to prevent retry storms from overwhelming the downstream database replica.</p>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Section 4: Measure Resilience */}
        <div className="flex flex-col items-center text-center pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-6 mb-16"
          >
            <div className="w-12 h-12 mx-auto rounded-xl bg-card border border-border flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-foreground" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Measure Resilience.</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Stop guessing if your system can handle the load. Put a hard number on your infrastructure's fault tolerance.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
          >
             <div className="p-8 rounded-2xl border border-border bg-card/30 flex flex-col items-center justify-center">
                <div className="text-4xl md:text-5xl font-bold font-mono text-foreground mb-2">94<span className="text-muted-foreground text-2xl">/100</span></div>
                <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Resilience Score</div>
             </div>
             <div className="p-8 rounded-2xl border border-border bg-card/30 flex flex-col items-center justify-center">
                <div className="text-4xl md:text-5xl font-bold font-mono text-foreground mb-2">3<span className="text-muted-foreground text-2xl">.2s</span></div>
                <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Avg Recovery</div>
             </div>
             <div className="p-8 rounded-2xl border border-border bg-card/30 flex flex-col items-center justify-center">
                <div className="text-4xl md:text-5xl font-bold font-mono text-red-400 mb-2">2</div>
                <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Single Points</div>
             </div>
             <div className="p-8 rounded-2xl border border-border bg-card/30 flex flex-col items-center justify-center">
                <div className="text-4xl md:text-5xl font-bold font-mono text-foreground mb-2">10k+</div>
                <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Max Req/S</div>
             </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
