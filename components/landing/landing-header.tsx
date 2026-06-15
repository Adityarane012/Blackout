"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserButton, useAuth } from "@clerk/nextjs"

export function LandingHeader() {
  const pathname = usePathname()
  const { userId } = useAuth()

  const navLinks = [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Changelog", href: "/changelog" },
    { name: "Documentation", href: "/docs" }
  ]

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md border-b border-border/50" />

      <div className="relative max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <svg className="w-5.5 h-5.5 text-cyan-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L21 7.2v9.6L12 22L3 16.8V7.2L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <circle cx="12" cy="5" r="1" fill="currentColor" />
                <circle cx="6" cy="15.5" r="1" fill="currentColor" />
                <circle cx="18" cy="15.5" r="1" fill="currentColor" />
                <path d="M12 5v5M12 14v6M6 15.5L10.5 13M18 15.5L13.5 13" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-xl border border-cyan-400/20 animate-ping opacity-30 pointer-events-none scale-105" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            BLACK<span className="text-cyan-400">OUT</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`)
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`text-sm transition-colors ${isActive ? "text-cyan-400 font-medium" : "text-muted-foreground hover:text-foreground"}`}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          {!userId ? (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
                  Sign In
                </Button>
              </Link>
              <Link href="/simulator">
                <Button
                  size="sm"
                  className="bg-cyan-500 hover:bg-cyan-400 text-background font-semibold glow-cyan"
                >
                  Launch Simulator
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
                  Dashboard
                </Button>
              </Link>
              <Link href="/simulator">
                <Button
                  size="sm"
                  className="bg-cyan-500 hover:bg-cyan-400 text-background font-semibold glow-cyan mr-2"
                >
                  Simulator
                </Button>
              </Link>
              <UserButton />
            </>
          )}
        </div>
      </div>
    </motion.header>
  )
}
