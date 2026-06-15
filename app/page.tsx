"use client"

import { AnimatedGraphBackground } from "@/components/landing/animated-graph-background"
import { LandingHeader } from "@/components/landing/landing-header"
import { HeroSection } from "@/components/landing/hero-section"
import { ProblemSection } from "@/components/landing/problem-section"
import { SimulationPreview } from "@/components/landing/simulation-preview"
import { AIAnalysisSection } from "@/components/landing/ai-analysis-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <AnimatedGraphBackground />
      </div>

      {/* Grid overlay */}
      <div
        className="fixed inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Scanline overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-30"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        }}
      />

      {/* Vignette effect */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(8,8,18,0.6)_100%)]" />

      {/* Content */}
      <div className="relative z-10">
        <LandingHeader />
        <main>
          <HeroSection />
          <ProblemSection />
          <SimulationPreview />
          <AIAnalysisSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  )
}
