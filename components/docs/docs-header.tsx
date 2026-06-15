"use client"

import Link from "next/link"
import { Search, Github, Twitter, TerminalSquare } from "lucide-react"

export function DocsHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-[12px]">
      <div className="flex h-14 items-center px-4 md:px-8 max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-6 mr-4">
          <Link href="/" className="flex items-center gap-2">
            <TerminalSquare className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-sm tracking-widest font-mono">BLACKOUT</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/docs" className="text-foreground transition-colors">Documentation</Link>
            <Link href="/docs/api" className="hover:text-foreground transition-colors">API Reference</Link>
            <Link href="/docs/guides" className="hover:text-foreground transition-colors">Guides</Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full max-w-sm lg:max-w-md hidden md:flex items-center relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search documentation..." 
              className="w-full h-9 bg-card border border-border rounded-md pl-10 pr-12 text-sm text-foreground focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                Ctrl K
              </kbd>
            </div>
          </div>
          
          <nav className="flex items-center gap-4">
            <Link href="https://github.com/Adityarane012/Blackout" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
