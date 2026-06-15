"use client"

import { LandingHeader } from "@/components/landing/landing-header"
import { Footer } from "@/components/landing/footer"
import { AnimatedGraphBackground } from "@/components/landing/animated-graph-background"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShieldAlert, Network, Terminal, BrainCircuit } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col selection:bg-cyan-500/30">
      
      {/* Background patterns */}
      <div className="fixed inset-0 z-0">
        <AnimatedGraphBackground />
      </div>
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(34,211,238,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(8,8,18,0.85)_100%)]" />

      <LandingHeader />

      <main className="relative z-10 flex-grow pt-32 pb-32">
        
        {/* SECTION 1 - Hero */}
        <section className="px-6 max-w-5xl mx-auto text-center pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              Software failures shouldn't be <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-cyan-500">discovered in production.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
              BLACKOUT helps engineering teams predict cascading outages before users experience them. We are building the intelligence layer for modern infrastructure.
            </p>
          </motion.div>
        </section>

        {/* SECTION 2 & 3 - The Problem & Why BLACKOUT */}
        <section className="px-6 max-w-6xl mx-auto py-20">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* The Problem Narrative */}
            <div>
              <h2 className="text-3xl font-bold mb-6">The infrastructure complexity crisis.</h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed font-light">
                <p>
                  As systems move from monoliths to deeply nested microservices, outages are no longer isolated. A single database timeout in a non-critical path can trigger a retry storm that brings down an entire API gateway.
                </p>
                <p>
                  Traditional integration testing is blind to these cascading failures. Staging environments lack the chaos of real production traffic, and standard observability tools only tell you what went wrong <span className="italic text-foreground">after</span> the incident occurs.
                </p>
                <p className="text-foreground font-medium">
                  We built BLACKOUT to bridge the gap between static testing and production chaos.
                </p>
              </div>
            </div>

            {/* Visual Comparison */}
            <div className="relative rounded-2xl border border-border bg-[#0a0a0a]/80 backdrop-blur-md p-8 overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Network className="w-32 h-32 text-cyan-500" />
               </div>
               
               <div className="space-y-8 relative z-10">
                 {/* Traditional */}
                 <div>
                   <h4 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest mb-4">Traditional Testing</h4>
                   <div className="flex items-center gap-4 text-sm font-mono">
                     <div className="bg-card px-3 py-1.5 rounded border border-border">Unit Test</div>
                     <span className="text-muted-foreground">→</span>
                     <div className="bg-green-500/10 text-green-400 border border-green-500/30 px-3 py-1.5 rounded">Expected Behavior</div>
                   </div>
                 </div>

                 <div className="h-px w-full bg-border/50" />

                 {/* BLACKOUT */}
                 <div>
                   <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-4">BLACKOUT Engine</h4>
                   <div className="flex flex-col gap-3 text-sm font-mono">
                     <div className="flex items-center gap-3">
                       <div className="bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1.5 rounded">Synthetic Chaos (Node Failure)</div>
                     </div>
                     <div className="pl-6 border-l border-border/50 ml-4 flex flex-col gap-3 py-2">
                       <span className="text-muted-foreground">↓ propagates to</span>
                       <div className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded w-fit">API Gateway (Retry Storm)</div>
                       <span className="text-muted-foreground">↓ propagates to</span>
                       <div className="bg-purple-500/10 text-purple-400 border border-purple-500/30 px-3 py-1.5 rounded w-fit">Auth Service (Resource Exhaustion)</div>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded shadow-[0_0_15px_rgba(34,211,238,0.2)]">Infrastructure Intelligence</div>
                     </div>
                   </div>
                 </div>
               </div>
            </div>

          </div>
        </section>

        {/* SECTION 4 - Our Vision */}
        <section className="px-6 max-w-4xl mx-auto text-center py-32">
           <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
             The future of reliability is <span className="text-cyan-400">predictive</span>.
           </h2>
           <p className="text-xl text-muted-foreground font-light leading-relaxed mb-12">
             Our long-term vision is the creation of fully autonomous infrastructure digital twins. By combining graph theory with AI-driven chaos generation, BLACKOUT enables teams to run millions of simulated failure scenarios before a single line of code reaches production.
           </p>
        </section>

        {/* SECTION 5 - Core Principles */}
        <section className="px-6 max-w-6xl mx-auto py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-card/30 backdrop-blur-md border border-border/50 p-8 rounded-2xl flex flex-col gap-4 group hover:border-cyan-500/30 transition-colors">
              <ShieldAlert className="w-8 h-8 text-cyan-400" />
              <h3 className="text-xl font-bold">Predict Before Production</h3>
              <p className="text-muted-foreground font-light leading-relaxed">Don't wait for your users to find your single points of failure. Simulate them deterministically in a safe environment.</p>
            </div>

            <div className="bg-card/30 backdrop-blur-md border border-border/50 p-8 rounded-2xl flex flex-col gap-4 group hover:border-cyan-500/30 transition-colors">
              <Network className="w-8 h-8 text-cyan-400" />
              <h3 className="text-xl font-bold">Visualize Hidden Dependencies</h3>
              <p className="text-muted-foreground font-light leading-relaxed">Map the true topology of your architecture, uncovering cyclical dependencies and hidden bottlenecks.</p>
            </div>

            <div className="bg-card/30 backdrop-blur-md border border-border/50 p-8 rounded-2xl flex flex-col gap-4 group hover:border-cyan-500/30 transition-colors">
              <Terminal className="w-8 h-8 text-cyan-400" />
              <h3 className="text-xl font-bold">Stress Systems Safely</h3>
              <p className="text-muted-foreground font-light leading-relaxed">Inject latency, drop connections, and exhaust resources programmatically without risking production SLAs.</p>
            </div>

            <div className="bg-card/30 backdrop-blur-md border border-border/50 p-8 rounded-2xl flex flex-col gap-4 group hover:border-cyan-500/30 transition-colors">
              <BrainCircuit className="w-8 h-8 text-cyan-400" />
              <h3 className="text-xl font-bold">Learn From Synthetic Chaos</h3>
              <p className="text-muted-foreground font-light leading-relaxed">Leverage AI to analyze cascade probabilities and generate actionable remediation strategies automatically.</p>
            </div>

          </div>
        </section>

        {/* SECTION 6 - CTA */}
        <section className="px-6 max-w-4xl mx-auto text-center py-32">
          <h2 className="text-3xl font-bold mb-8">Start Simulating Failure</h2>
          <Link href="/simulator">
            <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 font-bold px-8 h-14 rounded-full text-lg shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              Launch BLACKOUT
            </Button>
          </Link>
        </section>

      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
