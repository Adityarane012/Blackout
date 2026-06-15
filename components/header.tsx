"use client"

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* Logo icon */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L21 7.2v9.6L12 22L3 16.8V7.2L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                  <circle cx="12" cy="5" r="1" fill="currentColor" />
                  <circle cx="6" cy="15.5" r="1" fill="currentColor" />
                  <circle cx="18" cy="15.5" r="1" fill="currentColor" />
                  <path d="M12 5v5M12 14v6M6 15.5L10.5 13M18 15.5L13.5 13" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
                </svg>
              </div>
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-lg border border-cyan-400/30 animate-ping opacity-20" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-[0.2em] text-foreground">BLACKOUT</h1>
              <p className="text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                Infrastructure Failure Simulator
              </p>
            </div>
          </div>
        </div>

        {/* Tagline - Center */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <p className="text-xs font-mono text-muted-foreground/70 italic tracking-wide">
            &quot;Predict the outage before the world sees it.&quot;
          </p>
        </div>

        {/* Status indicators - Right */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Live</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400">AI Active</span>
          </div>
        </div>
      </div>
    </header>
  )
}
