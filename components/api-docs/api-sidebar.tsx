"use client"

import Link from "next/link"

const apiGroups = [
  {
    title: "Authentication",
    links: [
      { method: "POST", title: "Create API Key", href: "#", active: false },
      { method: "DELETE", title: "Revoke API Key", href: "#", active: false },
    ]
  },
  {
    title: "Architecture APIs",
    links: [
      { method: "POST", title: "Import Topology", href: "#", active: false },
      { method: "GET", title: "List Nodes", href: "#", active: false },
      { method: "GET", title: "Get Dependency Graph", href: "#", active: false },
    ]
  },
  {
    title: "Simulation APIs",
    links: [
      { method: "GET", title: "List Simulations", href: "#", active: false },
      { method: "POST", title: "Trigger Cascade", href: "#", active: true },
      { method: "POST", title: "Inject Latency", href: "#", active: false },
      { method: "DELETE", title: "Halt Simulation", href: "#", active: false },
    ]
  },
  {
    title: "Analysis APIs",
    links: [
      { method: "GET", title: "Get Blast Radius", href: "#", active: false },
      { method: "GET", title: "Root Cause Prediction", href: "#", active: false },
    ]
  },
  {
    title: "Metrics & Reporting",
    links: [
      { method: "GET", title: "Reliability Score", href: "#", active: false },
      { method: "GET", title: "Export PDF Report", href: "#", active: false },
    ]
  }
]

export function ApiSidebar() {
  const getMethodColor = (method: string) => {
    switch(method) {
      case "GET": return "text-blue-400 bg-blue-500/10 border-blue-500/20"
      case "POST": return "text-green-400 bg-green-500/10 border-green-500/20"
      case "DELETE": return "text-red-400 bg-red-500/10 border-red-500/20"
      case "PATCH": return "text-amber-400 bg-amber-500/10 border-amber-500/20"
      default: return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20"
    }
  }

  return (
    <aside className="fixed top-14 z-30 hidden w-[280px] shrink-0 overflow-y-auto border-r border-border/50 bg-background/50 backdrop-blur-sm lg:block pb-10 h-[calc(100vh-3.5rem)]">
      <div className="px-6 py-8">
        <div className="space-y-8">
          {apiGroups.map((group, index) => (
            <div key={index} className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">{group.title}</h4>
              <ul className="space-y-1">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-3 py-1.5 text-sm transition-colors rounded-md px-2 -mx-2 ${
                        link.active 
                          ? "bg-muted text-foreground" 
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border w-12 text-center ${getMethodColor(link.method)}`}>
                        {link.method}
                      </span>
                      <span className={link.active ? "font-medium text-cyan-400" : ""}>{link.title}</span>
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
