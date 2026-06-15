"use client"

import { LandingHeader } from "@/components/landing/landing-header"
import { HeroSection } from "@/components/landing/hero-section"
import { FeatureShowcase } from "@/components/landing/feature-showcase"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background selection:bg-cyan-500/30">
      
      {/* Base Grid Pattern */}
      <div
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <LandingHeader />
        <main>
          <HeroSection />
          <FeatureShowcase />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  )
}
