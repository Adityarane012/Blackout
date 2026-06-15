"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navGroups = [
  {
    title: "Getting Started",
    links: [
      { title: "Introduction", href: "/docs/getting-started/introduction" },
      { title: "Quick Start", href: "/docs/getting-started/quick-start" },
      { title: "Architecture Upload", href: "/docs/getting-started/architecture-upload" },
    ]
  },
  {
    title: "Core Concepts",
    links: [
      { title: "Infrastructure Graphs", href: "/docs/core-concepts/infrastructure-graphs" },
      { title: "Dependencies", href: "/docs/core-concepts/dependencies" },
      { title: "Simulation States", href: "/docs/core-concepts/simulation-states" },
    ]
  },
  {
    title: "Simulation Engine",
    links: [
      { title: "Scenario Generation", href: "/docs/simulation-engine/scenario-generation" },
      { title: "Failure Propagation", href: "/docs/simulation-engine/failure-propagation" },
      { title: "Reliability Scoring", href: "/docs/simulation-engine/reliability-scoring" },
    ]
  },
  {
    title: "AI Analysis",
    links: [
      { title: "Root Cause Analysis", href: "/docs/ai-analysis/root-cause-analysis" },
      { title: "Bottleneck Detection", href: "/docs/ai-analysis/bottleneck-detection" },
      { title: "Resilience Insights", href: "/docs/ai-analysis/resilience-insights" },
    ]
  },
  {
    title: "API Reference",
    links: [
      { title: "Architectures", href: "/docs/api/architectures" },
      { title: "Simulations", href: "/docs/api/simulations" },
      { title: "Analysis", href: "/docs/api/analysis" },
    ]
  }
]

export function DocsSidebar({ currentSlug }: { currentSlug?: string[] }) {
  const pathname = usePathname()
  
  // Flatten links to find prev/next
  const allLinks = navGroups.flatMap(group => group.links)
  
  return (
    <aside className="fixed top-14 z-30 hidden w-64 shrink-0 overflow-y-auto border-r border-border/50 bg-background/50 backdrop-blur-sm lg:block pb-10 h-[calc(100vh-3.5rem)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="px-6 py-8">
        <div className="space-y-8">
          {navGroups.map((group, index) => (
            <div key={index} className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group.title}</h4>
              <ul className="space-y-1">
                {group.links.map((link, linkIndex) => {
                  const isActive = pathname === link.href || (pathname === '/docs' && link.href === '/docs/getting-started/introduction')
                  return (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className={`block py-1.5 text-sm transition-colors ${
                          isActive 
                            ? "font-medium text-cyan-400" 
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {link.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
