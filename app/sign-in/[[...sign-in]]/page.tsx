"use client"

import { SignIn } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { motion } from "framer-motion"
import Link from "next/link"
import { Check, Database, LayoutTemplate, Activity, BrainCircuit } from "lucide-react"

const CascadeAnimation = () => {
  return (
    <div className="mt-12 relative w-full h-[300px] border border-border/30 bg-card/5 rounded-2xl overflow-hidden backdrop-blur-sm p-8">
      {/* Nodes */}
      <motion.div 
        initial={{ borderColor: "rgba(34,211,238,0.3)", backgroundColor: "rgba(34,211,238,0.05)", boxShadow: "0 0 0 rgba(34,211,238,0)" }}
        animate={{ 
          borderColor: ["rgba(34,211,238,0.3)", "rgba(239,68,68,0.5)", "rgba(239,68,68,0.8)", "rgba(239,68,68,0.8)"],
          backgroundColor: ["rgba(34,211,238,0.05)", "rgba(239,68,68,0.1)", "rgba(239,68,68,0.2)", "rgba(239,68,68,0.2)"],
          boxShadow: ["0 0 0 rgba(239,68,68,0)", "0 0 20px rgba(239,68,68,0.3)", "0 0 30px rgba(239,68,68,0.6)", "0 0 30px rgba(239,68,68,0.6)"]
        }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-1/2 left-8 -translate-y-1/2 w-14 h-14 rounded-xl border flex items-center justify-center z-10"
      >
        <Database className="w-6 h-6 text-foreground/80" />
      </motion.div>

      <motion.div 
        initial={{ borderColor: "rgba(34,211,238,0.3)", backgroundColor: "rgba(34,211,238,0.05)", boxShadow: "0 0 0 rgba(34,211,238,0)" }}
        animate={{ 
          borderColor: ["rgba(34,211,238,0.3)", "rgba(34,211,238,0.3)", "rgba(245,158,11,0.5)", "rgba(245,158,11,0.8)"],
          backgroundColor: ["rgba(34,211,238,0.05)", "rgba(34,211,238,0.05)", "rgba(245,158,11,0.1)", "rgba(245,158,11,0.2)"],
          boxShadow: ["0 0 0 rgba(245,158,11,0)", "0 0 0 rgba(245,158,11,0)", "0 0 20px rgba(245,158,11,0.3)", "0 0 30px rgba(245,158,11,0.6)"]
        }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-14 h-14 rounded-xl border flex items-center justify-center z-10"
      >
        <Activity className="w-6 h-6 text-foreground/80" />
      </motion.div>

      <motion.div 
        initial={{ borderColor: "rgba(34,211,238,0.3)", backgroundColor: "rgba(34,211,238,0.05)", boxShadow: "0 0 0 rgba(34,211,238,0)" }}
        animate={{ 
          borderColor: ["rgba(34,211,238,0.3)", "rgba(34,211,238,0.3)", "rgba(34,211,238,0.3)", "rgba(245,158,11,0.8)"],
          backgroundColor: ["rgba(34,211,238,0.05)", "rgba(34,211,238,0.05)", "rgba(34,211,238,0.05)", "rgba(245,158,11,0.2)"],
          boxShadow: ["0 0 0 rgba(245,158,11,0)", "0 0 0 rgba(245,158,11,0)", "0 0 0 rgba(245,158,11,0)", "0 0 30px rgba(245,158,11,0.6)"]
        }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-14 h-14 rounded-xl border flex items-center justify-center z-10"
      >
        <BrainCircuit className="w-6 h-6 text-foreground/80" />
      </motion.div>

      <motion.div 
        initial={{ borderColor: "rgba(34,211,238,0.3)", backgroundColor: "rgba(34,211,238,0.05)", boxShadow: "0 0 0 rgba(34,211,238,0)" }}
        animate={{ 
          borderColor: ["rgba(34,211,238,0.3)", "rgba(34,211,238,0.3)", "rgba(34,211,238,0.3)", "rgba(239,68,68,0.8)"],
          backgroundColor: ["rgba(34,211,238,0.05)", "rgba(34,211,238,0.05)", "rgba(34,211,238,0.05)", "rgba(239,68,68,0.2)"],
          boxShadow: ["0 0 0 rgba(239,68,68,0)", "0 0 0 rgba(239,68,68,0)", "0 0 0 rgba(239,68,68,0)", "0 0 30px rgba(239,68,68,0.6)"]
        }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-1/2 right-8 -translate-y-1/2 w-14 h-14 rounded-xl border flex items-center justify-center z-10"
      >
        <LayoutTemplate className="w-6 h-6 text-foreground/80" />
      </motion.div>

      {/* SVG Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        
        {/* DB -> Top Node */}
        <motion.line 
          x1="88" y1="150" x2="50%" y2="75" 
          stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4,4"
          animate={{ strokeDashoffset: [20, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* DB -> Bottom Node */}
        <motion.line 
          x1="88" y1="150" x2="50%" y2="225" 
          stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4,4"
          animate={{ strokeDashoffset: [20, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />

        {/* Top Node -> Frontend */}
        <motion.line 
          x1="50%" y1="75" x2="calc(100% - 88px)" y2="150" 
          stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4,4"
          animate={{ strokeDashoffset: [20, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />

        {/* Bottom Node -> Frontend */}
        <motion.line 
          x1="50%" y1="225" x2="calc(100% - 88px)" y2="150" 
          stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4,4"
          animate={{ strokeDashoffset: [20, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  )
}

export default function SignInPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex overflow-hidden selection:bg-cyan-500/30">
      
      {/* Left side - Auth component */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-32 bg-background border-r border-border/40 shadow-[10px_0_50px_rgba(0,0,0,0.5)]">
        <div className="mx-auto w-full max-w-sm lg:w-[400px]">
          <div className="mb-10">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full group-hover:bg-cyan-500/30 transition-colors" />
                <div className="w-8 h-8 rounded-lg bg-card/50 border border-cyan-500/30 flex items-center justify-center shadow-lg backdrop-blur-md">
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
          </div>

          <SignIn 
            appearance={{
              baseTheme: dark,
              variables: {
                colorPrimary: '#06b6d4',
                colorBackground: 'transparent',
                colorInputText: '#ffffff',
              },
              layout: {
                socialButtonsPlacement: "bottom",
              },
              elements: {
                rootBox: "w-full",
                cardBox: "shadow-none",
                card: "!bg-transparent shadow-none p-0 w-full",
                headerTitle: "text-2xl font-bold tracking-tight text-foreground",
                headerSubtitle: "text-muted-foreground mt-2",
                socialButtonsBlockButton: "!bg-secondary/40 border border-border/50 hover:!bg-secondary/70 text-foreground transition-all duration-200 h-11",
                socialButtonsBlockButtonText: "text-foreground font-medium",
                dividerLine: "bg-border/50",
                dividerText: "text-muted-foreground !bg-transparent px-3",
                formFieldLabel: "text-foreground font-medium mb-1.5",
                formFieldInput: "!bg-secondary/30 border border-border/50 focus:border-cyan-500/50 text-foreground h-11 transition-all duration-200 rounded-lg focus:ring-1 focus:ring-cyan-500/50",
                formButtonPrimary: "!bg-cyan-500 hover:!bg-cyan-400 text-background font-semibold h-11 transition-all duration-200 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]",
                footerActionText: "text-muted-foreground",
                footerActionLink: "text-cyan-400 hover:text-cyan-300 font-medium",
                identityPreviewText: "text-foreground",
                identityPreviewEditButton: "text-cyan-400 hover:text-cyan-300",
                formFieldSuccessText: "text-cyan-400",
                formFieldErrorText: "text-red-400"
              }
            }}
          />
        </div>
      </div>

      {/* Right side - Visuals */}
      <div className="relative hidden w-0 flex-1 lg:flex flex-col justify-center bg-[#05050A] overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(34,211,238,0.08)_0%,_transparent_50%)] pointer-events-none z-0" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        
        <div className="relative z-10 px-16 xl:px-24 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-mono tracking-widest backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              SECURE UPLINK
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter mb-6 leading-[1.1] text-foreground">
              Infrastructure Intelligence Starts Here.
            </h1>
            
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8">
              Sign in to save architectures, replay simulations, and track your system's resilience over time. Unlock the full capabilities of the neural uplink.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm font-medium text-foreground/80 bg-card/20 border border-border/30 rounded-lg p-3 backdrop-blur-sm">
                <div className="w-6 h-6 rounded-md bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20"><Check className="w-3.5 h-3.5 text-cyan-400" /></div>
                Save Architectures
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-foreground/80 bg-card/20 border border-border/30 rounded-lg p-3 backdrop-blur-sm">
                <div className="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center border border-purple-500/20"><Check className="w-3.5 h-3.5 text-purple-400" /></div>
                Replay Simulations
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-foreground/80 bg-card/20 border border-border/30 rounded-lg p-3 backdrop-blur-sm">
                <div className="w-6 h-6 rounded-md bg-amber-500/10 flex items-center justify-center border border-amber-500/20"><Check className="w-3.5 h-3.5 text-amber-400" /></div>
                Track Reliability Trends
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-foreground/80 bg-card/20 border border-border/30 rounded-lg p-3 backdrop-blur-sm">
                <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20"><Check className="w-3.5 h-3.5 text-emerald-400" /></div>
                Access AI Insights
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          >
            <CascadeAnimation />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
