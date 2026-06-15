"use client"

import Link from "next/link"

const navGroups = [
  {
    title: "Getting Started",
    links: [
      { title: "Introduction", href: "/docs", active: false },
      { title: "Quick Start", href: "#", active: false },
      { title: "Architecture Upload", href: "#", active: false },
    ]
  },
  {
    title: "Core Concepts",
    links: [
      { title: "Infrastructure Graphs", href: "#", active: false },
      { title: "Dependencies", href: "#", active: false },
      { title: "Simulation States", href: "#", active: false },
    ]
  },
  {
    title: "Simulation Engine",
    links: [
      { title: "Scenario Generation", href: "#", active: false },
      { title: "Failure Propagation", href: "/docs", active: true },
      { title: "Reliability Scoring", href: "#", active: false },
    ]
  },
  {
    title: "AI Analysis",
    links: [
      { title: "Root Cause Analysis", href: "#", active: false },
      { title: "Bottleneck Detection", href: "#", active: false },
      { title: "Resilience Insights", href: "#", active: false },
    ]
  },
  {
    title: "API Reference",
    links: [
      { title: "Architectures", href: "/docs/api", active: false },
      { title: "Simulations", href: "#", active: false },
      { title: "Analysis", href: "#", active: false },
    ]
  }
]

export function DocsSidebar() {
  return (
    <aside className="fixed top-14 z-30 hidden w-64 shrink-0 overflow-y-auto border-r border-border/50 bg-background/50 backdrop-blur-sm lg:block pb-10">
      <div className="px-6 py-8">
        <div className="space-y-8">
          {navGroups.map((group, index) => (
            <div key={index} className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group.title}</h4>
              <ul className="space-y-1">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className={`block py-1.5 text-sm transition-colors ${
                        link.active 
                          ? "font-medium text-cyan-400" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
