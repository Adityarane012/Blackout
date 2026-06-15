"use client"

import { LandingHeader } from "@/components/landing/landing-header"
import { Footer } from "@/components/landing/footer"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const tiers = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for exploring basic failure scenarios on small architectures.",
    features: [
      "Up to 15 nodes per graph",
      "Standard predefined outage scenarios",
      "Basic blast-radius visualization",
      "Community support"
    ],
    buttonText: "Start for Free",
    variant: "outline" as const
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo",
    description: "For SRE teams that need dynamic AI generation and complex topology testing.",
    features: [
      "Unlimited infrastructure nodes",
      "AI-Generated synthetic outage chaos",
      "Full cascading failure simulation",
      "AI Failure Analysis & Root Cause explanations",
      "Reliability Scoring Dashboard"
    ],
    buttonText: "Upgrade to Pro",
    variant: "default" as const,
    highlight: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Dedicated infrastructure intelligence for large-scale enterprise deployments.",
    features: [
      "Custom architecture import parsers",
      "Historical simulation comparisons",
      "On-premise deployment options",
      "Dedicated SRE success manager",
      "SLA & Priority Support"
    ],
    buttonText: "Contact Sales",
    variant: "outline" as const
  }
]

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col selection:bg-cyan-500/30">
      
      {/* Sleek Grid Background */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_transparent_0%,_rgba(8,8,18,1)_100%)]" />

      <LandingHeader />

      <main className="relative z-10 flex-grow pt-32 pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Predictable Pricing for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">Unpredictable Failures.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              Choose the tier that matches your infrastructure's complexity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {tiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col p-8 rounded-2xl transition-all duration-300 ${
                  tier.highlight 
                    ? "bg-card/10 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.05)] md:-translate-y-2" 
                    : "bg-transparent border border-border/50 hover:border-border"
                }`}
              >
                {/* Internal Glow for Highlighted Tier */}
                {tier.highlight && (
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent rounded-2xl pointer-events-none" />
                )}
                
                <div className="mb-8 relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
                    {tier.highlight && (
                      <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold rounded-full border border-cyan-500/20 uppercase tracking-wider">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-5xl font-light tracking-tighter text-foreground">{tier.price}</span>
                    {tier.period && <span className="text-muted-foreground font-mono text-sm">{tier.period}</span>}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed h-14">{tier.description}</p>
                </div>

                <div className="flex-grow relative z-10">
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3 text-sm">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${tier.highlight ? "text-cyan-400" : "text-muted-foreground"}`} />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  variant={tier.variant} 
                  className={`w-full rounded-full h-12 font-semibold transition-all relative z-10 ${
                    tier.highlight 
                      ? "bg-foreground text-background hover:bg-foreground/90" 
                      : "bg-transparent border-border/50 hover:bg-secondary/50 text-foreground"
                  }`}
                >
                  {tier.buttonText}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
