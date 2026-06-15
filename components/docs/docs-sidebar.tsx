"use client"

import Link from "next/link"

const navGroups = [
  {
    title: "Getting Started",
    links: [
      { title: "Introduction", href: "/docs", active: false },
      { title: "Quickstart", href: "#", active: false },
      { title: "Architecture Upload", href: "#", active: false },
    ]
  },
  {
    title: "Core Concepts",
    links: [
      { title: "Node Topologies", href: "#", active: false },
      { title: "Dependency Graphs", href: "#", active: false },
      { title: "State Machines", href: "#", active: false },
    ]
  },
  {
    title: "Simulation Engine",
    links: [
      { title: "Overview", href: "#", active: false },
      { title: "Scenario Generation", href: "#", active: false },
      { title: "Cascade Failure", href: "/docs", active: true },
      { title: "Network Partitioning", href: "#", active: false },
    ]
  },
  {
    title: "AI Analysis",
    links: [
      { title: "Blast Radius Detection", href: "#", active: false },
      { title: "Root Cause Prediction", href: "#", active: false },
      { title: "Reliability Scoring", href: "#", active: false },
    ]
  },
  {
    title: "API Reference",
    links: [
      { title: "Authentication", href: "#", active: false },
      { title: "Simulations API", href: "#", active: false },
      { title: "Graph Export API", href: "#", active: false },
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
