"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"

export function DocsTOC() {
  return (
    <aside className="fixed top-14 right-0 z-30 hidden w-64 shrink-0 overflow-y-auto border-l border-border/50 bg-background/50 backdrop-blur-sm xl:block pb-10 h-[calc(100vh-3.5rem)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="px-6 py-8">
        <div className="space-y-6">
          
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">On this page</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="#" className="text-cyan-400 font-medium transition-colors">Overview</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">How it works</Link></li>
              <li>
                <ul className="pl-4 mt-2.5 space-y-2.5 border-l border-border/50">
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">1. State Injection</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">2. Deterministic Propagation</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">3. Halting Condition</Link></li>
                </ul>
              </li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Triggering a simulation</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Configuration</Link></li>
            </ul>
          </div>

          <div className="pt-6 border-t border-border/50">
            <h4 className="text-sm font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" /> API Reference
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" /> Simulation Sandbox
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
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
