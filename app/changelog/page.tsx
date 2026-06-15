"use client"

import { LandingHeader } from "@/components/landing/landing-header"
import { Footer } from "@/components/landing/footer"
import { AnimatedGraphBackground } from "@/components/landing/animated-graph-background"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

const changelog = [
  {
    version: "v1.2.0",
    date: "June 15, 2026",
    title: "User Persistence & Cloud Profiles",
    description: "Added lightweight Clerk authentication and integrated a persistent Neo4j backend to save your architectures, simulation history, and AI resilience reports.",
    changes: [
      {
        type: "feature",
        items: [
          "Integrated Clerk Next.js App Router authentication with custom themed login/signup flows.",
          "Created User Dashboard to track saved Architectures, recent Simulations, and Average Resilience metrics.",
          "Updated Simulation Engine and Workspace Header to allow saving architectures to a cloud profile.",
          "Added User nodes to Neo4j to properly map OWNS and RAN relationships for all user data."
        ]
      },
      {
        type: "improvement",
        items: [
          "Added missing API Reference documentation index page.",
          "Fixed reactive styling on Documentation Table of Contents."
        ]
      }
    ]
  },
  {
    version: "v1.1.0",
    date: "June 15, 2026",
    title: "Platform UI Overhaul: A Premium Developer Experience",
    description: "We've completely redesigned BLACKOUT to reflect the highly technical, serious nature of the infrastructure intelligence we provide. Say goodbye to generic SaaS grids.",
    changes: [
      {
        type: "improvement",
        items: [
          "Redesigned the main Hero section, integrating a massive, interactive cascading failure graph directly into the viewport.",
          "Completely overhauled the Features page with an asymmetrical, narrative-driven flow and technical UI mockups.",
          "Refined the Pricing page for a sleeker, high-contrast aesthetic with premium typography and cleaner hover states."
        ]
      }
    ]
  },
  {
    version: "v1.0.0",
    date: "June 15, 2026",
    title: "Initial Release: The Future of SRE",
    description: "Welcome to the official launch of BLACKOUT. We are excited to release the core prediction engine.",
    changes: [
      {
        type: "feature",
        items: [
          "Infrastructure Graph Engine with real-time dependency rendering.",
          "AI Outage Scenario Generator: Synthesize traffic spikes, database failures, and chaotic conditions.",
          "Cascade Failure Engine: Deterministic state-machine propagation of upstream database stress.",
          "Reliability Dashboard with severity metrics."
        ]
      },
      {
        type: "improvement",
        items: [
          "Optimized background physics rendering for heavy node counts.",
          "Added Cyberpunk CRT-scanline styling for immersive simulations."
        ]
      }
    ]
  }
]

export default function ChangelogPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col">
      <div className="fixed inset-0 z-0">
        <AnimatedGraphBackground />
      </div>
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(34,211,238,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.15) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)" }} />
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(8,8,18,0.6)_100%)]" />

      <LandingHeader />

      <main className="relative z-10 flex-grow pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Changelog</h1>
            <p className="text-xl text-muted-foreground">
              New updates and improvements to the BLACKOUT simulation engine.
            </p>
          </motion.div>

          <div className="space-y-16">
            {changelog.map((release, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative pl-8 md:pl-0"
              >
                {/* Timeline Line */}
                <div className="absolute left-0 top-2 bottom-[-4rem] w-px bg-border/50 md:left-48" />
                
                <div className="md:grid md:grid-cols-[12rem_1fr] md:gap-8">
                  {/* Date & Version sidebar */}
                  <div className="mb-4 md:mb-0 md:text-right relative">
                    {/* Timeline Node */}
                    <div className="absolute left-[-2.25rem] md:left-auto md:right-[-2.35rem] top-1.5 w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)] z-10" />
                    
                    <div className="text-sm font-semibold text-cyan-400 mb-1">{release.date}</div>
                    <div className="text-2xl font-bold text-foreground">{release.version}</div>
                  </div>

                  {/* Content */}
                  <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-2xl p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-3">{release.title}</h2>
                    <p className="text-muted-foreground mb-8">{release.description}</p>

                    <div className="space-y-8">
                      {release.changes.map((group, gIndex) => (
                        <div key={gIndex}>
                          <div className="flex items-center gap-2 mb-4">
                            <Badge 
                              variant="outline" 
                              className={`uppercase tracking-wider text-xs font-bold border-opacity-50 ${
                                group.type === 'feature' ? 'text-green-400 border-green-500/30 bg-green-500/10' :
                                group.type === 'bugfix' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
                                'text-blue-400 border-blue-500/30 bg-blue-500/10'
                              }`}
                            >
                              {group.type}
                            </Badge>
                          </div>
                          <ul className="space-y-3">
                            {group.items.map((item, iIndex) => (
                              <li key={iIndex} className="text-muted-foreground flex items-start">
                                <span className="mr-3 text-border mt-1.5">-</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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
