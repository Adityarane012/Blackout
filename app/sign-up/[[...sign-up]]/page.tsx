"use client"

import { SignUp } from "@clerk/nextjs"
import { motion } from "framer-motion"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Left side - Auth component */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                  <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L21 7.2v9.6L12 22L3 16.8V7.2L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                  </svg>
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight">
                BLACK<span className="text-cyan-400">OUT</span>
              </span>
            </Link>
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-foreground">
              Create your account
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Start simulating infrastructure failures.
            </p>
          </div>

          <div className="mt-10">
            <SignUp 
              appearance={{
                elements: {
                  formButtonPrimary: "bg-cyan-500 hover:bg-cyan-400 text-background font-semibold glow-cyan",
                  card: "bg-transparent shadow-none p-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "border-border/50 bg-secondary/50 hover:bg-secondary/80 text-foreground",
                  socialButtonsBlockButtonText: "text-foreground font-medium",
                  dividerLine: "bg-border/50",
                  dividerText: "text-muted-foreground",
                  formFieldLabel: "text-foreground",
                  formFieldInput: "bg-secondary/30 border-border/50 focus:border-cyan-500/50 text-foreground",
                  footerActionText: "text-muted-foreground",
                  footerActionLink: "text-cyan-400 hover:text-cyan-300"
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Right side - Visuals */}
      <div className="relative hidden w-0 flex-1 lg:block bg-secondary/10 border-l border-border/50 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_0%,_rgba(8,8,18,1)_100%)] pointer-events-none z-0" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        
        <div className="absolute inset-0 flex flex-col justify-center px-16 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-border/50 bg-card/50 text-muted-foreground text-xs font-mono tracking-widest backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              AUTHENTICATION UPLINK
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter mb-6 leading-[1.1]">
              Predict the outage before users experience it.
            </h1>
            <p className="text-lg text-muted-foreground font-light border-l-2 border-cyan-500/50 pl-4">
              Save architectures, simulations, and resilience reports.
            </p>
          </motion.div>

          {/* Minimal graph animation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="mt-16 relative w-full h-64 border border-border/30 bg-card/5 rounded-2xl overflow-hidden backdrop-blur-sm"
          >
            <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-ping" />
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse" style={{ animationDelay: "0.5s" }} />
            <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-pulse" style={{ animationDelay: "1s" }} />
            
            <svg className="absolute inset-0 w-full h-full">
              <line x1="25%" y1="33%" x2="50%" y2="50%" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4" className="animate-[dash_20s_linear_infinite]" />
              <line x1="50%" y1="50%" x2="75%" y2="66%" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" className="animate-[dash_20s_linear_infinite]" />
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
