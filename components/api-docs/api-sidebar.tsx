"use client"

import Link from "next/link"

const apiGroups = [
  {
    title: "Architectures",
    links: [
      { method: "POST", title: "Upload Graph", href: "#", active: false },
      { method: "GET", title: "Get Topology", href: "#", active: false },
    ]
  },
  {
    title: "Simulations",
    links: [
      { method: "POST", title: "Trigger Simulation", href: "#", active: true },
      { method: "GET", title: "Get Results", href: "#", active: false },
    ]
  },
  {
    title: "Analysis",
    links: [
      { method: "GET", title: "Get Reliability Score", href: "#", active: false },
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
    <aside className="fixed top-14 z-30 hidden w-[280px] shrink-0 overflow-y-auto border-r border-border/50 bg-background/50 backdrop-blur-sm lg:block pb-10 h-[calc(100vh-3.5rem)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
