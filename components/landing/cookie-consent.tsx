"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if the user has already consented
    const hasConsented = localStorage.getItem("blackout_cookie_consent")
    if (!hasConsented) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("blackout_cookie_consent", "true")
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50, transition: { duration: 0.2 } }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-[calc(100%-3rem)] bg-card/80 backdrop-blur-xl border border-border/50 p-4 rounded-2xl shadow-2xl"
        >
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              We use essential cookies to secure the platform and analytics to improve your experience. 
              <Link href="/privacy" className="text-cyan-400 hover:underline ml-1">
                Learn more.
              </Link>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={acceptCookies}
                className="text-sm font-semibold bg-foreground text-background hover:bg-foreground/90 px-4 py-2 rounded-lg transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
