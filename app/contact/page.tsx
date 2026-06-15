"use client"

import { LandingHeader } from "@/components/landing/landing-header"
import { Footer } from "@/components/landing/footer"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageSquare, Handshake, Terminal, Lightbulb, ExternalLink, Github, Linkedin } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col selection:bg-cyan-500/30">
      
      {/* Sleek Grid Background */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_transparent_0%,_rgba(8,8,18,1)_100%)]" />

      <LandingHeader />

      <main className="relative z-10 flex-grow pt-32 pb-32 px-6">
        
        {/* Hero */}
        <section className="max-w-5xl mx-auto text-center pt-12 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Let's Talk <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">Infrastructure.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
              Questions, feedback, partnerships, or technical discussions. We're here for it.
            </p>
          </motion.div>
        </section>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_400px] gap-16">
          
          {/* Form Section */}
          <div className="space-y-12">
            <div className="bg-card/10 backdrop-blur-xl border border-border/50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-8">Send a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Name</label>
                    <input 
                      type="text" 
                      placeholder="Jane Doe"
                      className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Email</label>
                    <input 
                      type="email" 
                      placeholder="jane@example.com"
                      className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Subject</label>
                  <select className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-foreground appearance-none">
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Product Feedback</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Message</label>
                  <textarea 
                    rows={6}
                    placeholder="How can we help?"
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-muted-foreground/50 resize-none"
                  />
                </div>

                <Button className="w-full bg-foreground text-background hover:bg-foreground/90 font-bold h-12 rounded-lg">
                  Send Message
                </Button>
              </form>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-12">
            
            {/* Contact Methods */}
            <div>
              <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-6">Direct Channels</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-card/10 hover:border-border transition-colors">
                  <Terminal className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Technical Support</h4>
                    <p className="text-sm text-muted-foreground mb-1">Architecture and API help.</p>
                    <a href="mailto:support@blackout.dev" className="text-sm text-cyan-400 hover:underline">support@blackout.dev</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-card/10 hover:border-border transition-colors">
                  <Handshake className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Partnerships</h4>
                    <p className="text-sm text-muted-foreground mb-1">Enterprise and integrations.</p>
                    <a href="mailto:partners@blackout.dev" className="text-sm text-purple-400 hover:underline">partners@blackout.dev</a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-card/10 hover:border-border transition-colors">
                  <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Product Feedback</h4>
                    <p className="text-sm text-muted-foreground mb-1">Feature requests and ideas.</p>
                    <a href="mailto:feedback@blackout.dev" className="text-sm text-amber-400 hover:underline">feedback@blackout.dev</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-6">Developer Resources</h3>
              <ul className="space-y-3">
                <li><Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-between group"><span>Documentation</span> <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
                <li><Link href="/docs/api" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-between group"><span>API Reference</span> <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-6">Community</h3>
              <div className="flex items-center gap-4">
                <Link href="https://github.com/Adityarane012/Blackout" target="_blank" className="p-3 rounded-lg border border-border/50 bg-card/30 hover:bg-card hover:border-border transition-all text-muted-foreground hover:text-foreground">
                  <Github className="w-5 h-5" />
                </Link>
                <Link href="https://www.linkedin.com/in/aditya-rane-" target="_blank" className="p-3 rounded-lg border border-border/50 bg-card/30 hover:bg-card hover:border-border transition-all text-muted-foreground hover:text-foreground">
                  <Linkedin className="w-5 h-5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
