"use client"

import { useState, useEffect } from "react"
import { LandingHeader } from "@/components/landing/landing-header"
import { Footer } from "@/components/landing/footer"
import { Link as LinkIcon, Search, Printer } from "lucide-react"

export interface LegalSection {
  id: string
  title: string
}

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  description: string
  sections: LegalSection[]
  children: React.ReactNode
}

export function LegalLayout({ title, lastUpdated, description, sections, children }: LegalLayoutProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the visible section that takes up the most space or the first visible one
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)
        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id)
        }
      },
      { rootMargin: "-15% 0px -80% 0px" }
    )

    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  const copyLink = (e: React.MouseEvent) => {
    e.preventDefault()
    navigator.clipboard.writeText(window.location.href)
  }

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault()
    window.print()
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col selection:bg-cyan-500/30">
      {/* Hide header on print */}
      <div className="print:hidden">
        <LandingHeader />
      </div>

      <main className="relative z-10 flex-grow pt-32 pb-32 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Sidebar TOC */}
          <aside className="hidden lg:block w-64 shrink-0 print:hidden">
            <div className="sticky top-32">
              <h4 className="text-xs font-mono font-bold text-foreground uppercase tracking-widest mb-6">Contents</h4>
              <nav className="flex flex-col space-y-1 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setActiveSection(section.id)}
                    className={`text-sm py-1.5 px-3 rounded-md transition-colors ${
                      activeSection === section.id 
                        ? "bg-cyan-500/10 text-cyan-400 font-medium" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Center Content */}
          <div className="flex-1 max-w-3xl print:max-w-none print:w-full">
            <div className="mb-16 border-b border-border/50 pb-8">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{title}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-muted-foreground">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border/50 text-xs font-mono">
                  Last Updated: {lastUpdated}
                </div>
                <p className="text-sm">{description}</p>
              </div>
            </div>

            <div className="prose prose-invert prose-p:leading-relaxed prose-p:text-muted-foreground prose-a:text-cyan-400 max-w-none print:text-black">
              {children}
            </div>
          </div>

          {/* Right Sidebar Actions */}
          <aside className="hidden xl:block w-64 shrink-0 print:hidden">
            <div className="sticky top-32 space-y-8">
              
              {/* Mock Search Box */}
              <div>
                <h4 className="text-xs font-mono font-bold text-foreground uppercase tracking-widest mb-4">Search</h4>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search document..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-card/50 border border-border/50 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              {/* Actions */}
              <div>
                <h4 className="text-xs font-mono font-bold text-foreground uppercase tracking-widest mb-4">Actions</h4>
                <div className="flex flex-col space-y-2">
                  <button onClick={copyLink} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted/50 text-left">
                    <LinkIcon className="w-4 h-4" />
                    Copy Link to Page
                  </button>
                  <button onClick={handlePrint} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted/50 text-left">
                    <Printer className="w-4 h-4" />
                    Print Document
                  </button>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  )
}
