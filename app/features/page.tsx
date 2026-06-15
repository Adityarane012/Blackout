"use client"

import { LandingHeader } from "@/components/landing/landing-header"
import { Footer } from "@/components/landing/footer"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Network, Terminal, BrainCircuit, BarChart3 } from "lucide-react"

// Custom Hook for cascade animation
function useCascade() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev >= 6 ? 0 : prev + 1))
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return step
}

function CascadeHero() {
  const step = useCascade()

  const nodes = [
    { id: "front", label: "Frontend", x: 10, y: 50 },
    { id: "auth", label: "Auth-Service", x: 35, y: 50 },
    { id: "queue", label: "Kafka-Queue", x: 65, y: 50 },
    { id: "db", label: "Primary-DB", x: 90, y: 50 },
  ]

  // Sequence: 0=Healthy, 1=DB Stress, 2=DB Fail, 3=Queue Fail, 4=Auth Fail, 5=Front Fail, 6=Resetting
  const getStatus = (id: string) => {
    if (step === 0 || step === 6) return "healthy"
    if (id === "db") {
      if (step === 1) return "stress"
      if (step >= 2) return "failure"
    }
    if (id === "queue" && step >= 3) return "failure"
    if (id === "auth" && step >= 4) return "failure"
    if (id === "front" && step >= 5) return "failure"
    
    // Ripple stress effects
    if (id === "queue" && step === 2) return "stress"
    if (id === "auth" && step === 3) return "stress"
    if (id === "front" && step === 4) return "stress"

    return "healthy"
  }

  const getColor = (status: string) => {
    if (status === "healthy") return "bg-zinc-700"
    if (status === "stress") return "bg-amber-500"
    if (status === "failure") return "bg-red-500"
    return "bg-zinc-700"
  }

  return (
    <div className="relative w-full aspect-[21/9] max-h-[600px] border border-border/50 bg-card/10 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
      
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Edges */}
        {[0, 1, 2].map((i) => {
           const fromStatus = getStatus(nodes[i].id)
           const toStatus = getStatus(nodes[i+1].id)
           const isFailing = fromStatus === "failure" || toStatus === "failure"
           const isStress = fromStatus === "stress" || toStatus === "stress"
           return (
            <line
              key={i}
              x1={`${nodes[i].x}%`} y1={`${nodes[i].y}%`}
              x2={`${nodes[i+1].x}%`} y2={`${nodes[i+1].y}%`}
              stroke={isFailing ? "#ef4444" : isStress ? "#fbbf24" : "#3f3f46"}
              strokeWidth="2"
              strokeDasharray={isFailing ? "6,6" : "none"}
              className="transition-all duration-500"
            />
           )
        })}
      </svg>

      {nodes.map((n) => {
        const status = getStatus(n.id)
        return (
          <div key={n.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
            <div className="relative flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full ${getColor(status)} transition-all duration-500 z-10`} />
              {status !== "healthy" && (
                <div className={`absolute top-0 w-4 h-4 rounded-full animate-ping opacity-75 ${status === "failure" ? "bg-red-500" : "bg-amber-500"}`} />
              )}
              <span className={`mt-4 text-xs font-mono transition-colors duration-500 ${status === "failure" ? "text-red-400" : status === "stress" ? "text-amber-400" : "text-muted-foreground"}`}>
                {n.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen bg-background selection:bg-cyan-500/30">
      
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <LandingHeader />

      <main className="relative z-10 pt-32 pb-32">
        
        {/* HERO SECTION */}
        <section className="max-w-6xl mx-auto px-6 mb-40 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Watch It Break.</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-16">
              See exactly how a single failure snowballs into a platform-wide outage. Don't wait for production to find out.
            </p>
            <CascadeHero />
          </motion.div>
        </section>

        {/* NARRATIVE FLOW */}
        <div className="max-w-6xl mx-auto px-6 space-y-40">
          
          {/* Section 1: Infrastructure Mapping */}
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="flex-1 space-y-6">
              <Network className="w-8 h-8 text-cyan-400" />
              <h2 className="text-4xl font-bold tracking-tight">Map Your Reality.</h2>
              <p className="text-lg text-muted-foreground">Automatic dependency discovery builds a living, breathing digital twin of your microservices architecture.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-100px" }} className="flex-1 w-full relative aspect-square md:aspect-[4/3] rounded-2xl border border-border bg-card/30 overflow-hidden flex items-center justify-center p-8">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(8,8,18,0.8)_100%)]" />
               <div className="relative w-full h-full flex items-center justify-center">
                 <div className="w-12 h-12 rounded-lg border border-cyan-500/30 bg-cyan-500/10 shadow-[0_0_30px_rgba(34,211,238,0.2)] absolute z-10" />
                 <div className="w-8 h-8 rounded-lg border border-border bg-card absolute top-1/4 left-1/4" />
                 <div className="w-8 h-8 rounded-lg border border-border bg-card absolute bottom-1/4 left-1/3" />
                 <div className="w-8 h-8 rounded-lg border border-border bg-card absolute top-1/3 right-1/4" />
                 <div className="w-8 h-8 rounded-lg border border-border bg-card absolute bottom-1/3 right-1/4" />
                 {/* Decorative connecting lines */}
                 <svg className="absolute inset-0 w-full h-full opacity-30"><line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#22d3ee" strokeWidth="1"/><line x1="50%" y1="50%" x2="33%" y2="75%" stroke="#22d3ee" strokeWidth="1"/><line x1="50%" y1="50%" x2="75%" y2="33%" stroke="#22d3ee" strokeWidth="1"/><line x1="50%" y1="50%" x2="75%" y2="66%" stroke="#22d3ee" strokeWidth="1"/></svg>
               </div>
            </motion.div>
          </div>

          {/* Section 2: Chaos Generation */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-16">
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="flex-1 space-y-6">
              <Terminal className="w-8 h-8 text-purple-400" />
              <h2 className="text-4xl font-bold tracking-tight">Generate Chaos.</h2>
              <p className="text-lg text-muted-foreground">Inject synthetic stress instantly. Push 100k requests to a queue or simulate packet loss with a single command.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-100px" }} className="flex-1 w-full rounded-2xl border border-border bg-[#0d0d0d] overflow-hidden shadow-2xl">
              <div className="h-10 border-b border-border/50 bg-background/50 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-600" />
                <div className="w-3 h-3 rounded-full bg-zinc-600" />
                <div className="w-3 h-3 rounded-full bg-zinc-600" />
              </div>
              <div className="p-6 font-mono text-sm leading-loose">
                <span className="text-muted-foreground">~ ❯</span> <span className="text-purple-400">blackout</span> apply --target=us-east-1 --type=latency_spike<br/>
                <span className="text-zinc-500">Initializing chaotic sequence...</span><br/>
                <span className="text-zinc-300">Target acquired: <span className="text-cyan-400 font-bold">redis-cluster-primary</span></span><br/>
                <span className="text-amber-400">Injecting 500ms latency overhead</span><br/>
                <span className="text-green-400">Simulation running.</span>
              </div>
            </motion.div>
          </div>

          {/* Section 3: Root Cause Analysis */}
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="flex-1 space-y-6">
              <BrainCircuit className="w-8 h-8 text-cyan-400" />
              <h2 className="text-4xl font-bold tracking-tight">Find the Weak Link.</h2>
              <p className="text-lg text-muted-foreground">Automated blast-radius detection pinpoints exactly where the architecture collapses and predicts the impact.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-100px" }} className="flex-1 w-full rounded-2xl border border-border bg-card/30 p-8">
               <div className="space-y-4">
                 <div className="flex justify-between items-center bg-background rounded-lg p-4 border border-border/50">
                    <span className="text-muted-foreground text-sm font-mono uppercase tracking-widest">Critical Path</span>
                    <span className="text-sm font-mono text-foreground">Auth → Queue → DB</span>
                 </div>
                 <div className="flex justify-between items-center bg-background rounded-lg p-4 border border-border/50">
                    <span className="text-muted-foreground text-sm font-mono uppercase tracking-widest">Cascade Probability</span>
                    <span className="text-sm font-mono text-red-400">89% HIGH</span>
                 </div>
                 <div className="mt-6 p-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
                   <p className="text-sm font-mono text-cyan-400 mb-2 uppercase tracking-widest">AI Recommendation</p>
                   <p className="text-foreground/80 leading-relaxed">Implement a circuit breaker on the Auth Service to prevent upstream queue saturation.</p>
                 </div>
               </div>
            </motion.div>
          </div>

          {/* Section 4: Resilience Insights */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-16">
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="flex-1 space-y-6">
              <BarChart3 className="w-8 h-8 text-purple-400" />
              <h2 className="text-4xl font-bold tracking-tight">Measure Resilience.</h2>
              <p className="text-lg text-muted-foreground">Stop guessing. Get hard, definitive metrics on your system's fault tolerance after every simulation run.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-100px" }} className="flex-1 w-full grid grid-cols-2 gap-4">
                <div className="p-8 rounded-2xl border border-border bg-card/30 flex flex-col items-center justify-center aspect-square">
                  <div className="text-5xl md:text-6xl font-bold font-mono text-foreground mb-4">94</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Resilience Score</div>
                </div>
                <div className="p-8 rounded-2xl border border-border bg-card/30 flex flex-col items-center justify-center aspect-square">
                  <div className="text-5xl md:text-6xl font-bold font-mono text-cyan-400 mb-4">3.2<span className="text-2xl text-muted-foreground">s</span></div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Recovery Time</div>
                </div>
            </motion.div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
