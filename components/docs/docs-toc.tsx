"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"

export function DocsTOC({ headings }: { headings?: { id: string, title: string, level: number }[] }) {
  return (
    <aside className="fixed top-14 right-0 z-30 hidden w-64 shrink-0 overflow-y-auto border-l border-border/50 bg-background/50 backdrop-blur-sm xl:block pb-10 h-[calc(100vh-3.5rem)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="px-6 py-8">
        <div className="space-y-6">
          
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">On this page</h4>
            {headings && headings.length > 0 ? (
              <ul className="space-y-2.5 text-sm">
                {headings.map((heading) => (
                  <li key={heading.id} style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}>
                    <a href={`#${heading.id}`} className="text-muted-foreground hover:text-foreground transition-colors hover:text-cyan-400">
                      {heading.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">No headings found.</p>
            )}
          </div>

          <div className="pt-6 border-t border-border/50">
            <h4 className="text-sm font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/docs/api/architectures" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 hover:text-cyan-400">
                  <ExternalLink className="w-3 h-3" /> API Reference
                </Link>
              </li>
              <li>
                <Link href="/simulator" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 hover:text-cyan-400">
                  <ExternalLink className="w-3 h-3" /> Simulation Sandbox
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 hover:text-cyan-400">
                  <ExternalLink className="w-3 h-3" /> Community Support
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </aside>
  )
}
