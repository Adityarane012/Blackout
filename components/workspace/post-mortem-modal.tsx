"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface PostMortemModalProps {
  isOpen: boolean
  onClose: () => void
  reportText: string
  isAnalyzing: boolean
}

export function PostMortemModal({ isOpen, onClose, reportText, isAnalyzing }: PostMortemModalProps) {
  const [renderedReport, setRenderedReport] = useState("")

  // Typwriter effect for the report title/header to feel like a terminal output
  useEffect(() => {
    if (isOpen && reportText) {
      setRenderedReport(reportText)
    }
  }, [isOpen, reportText])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-slate-950/95 border border-red-500/30 text-slate-100 shadow-[0_0_50px_rgba(239,68,68,0.15)] backdrop-blur-xl">
        <DialogHeader className="border-b border-red-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <DialogTitle className="text-xl font-mono font-bold uppercase tracking-[0.15em] text-red-400">
              Emergency Incident Report
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs font-mono text-slate-400 mt-1">
            Secure connection established. Decrypting telemetry incident post-mortem analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 max-h-[450px] overflow-y-auto pr-2 font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-red-500/20 scrollbar-track-transparent">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin" />
                <div className="absolute inset-2 rounded-full border border-purple-500/20 border-b-purple-500 animate-spin animate-duration-1000" />
              </div>
              <div className="text-center">
                <p className="text-xs font-mono text-red-400 uppercase tracking-widest animate-pulse">
                  Reconstructing Dependency Graph...
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  Synthesizing SRE Remediation vectors.
                </p>
              </div>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none prose-h1:text-red-400 prose-h2:text-orange-400 prose-p:text-slate-300 prose-strong:text-red-300 prose-li:text-slate-300 prose-headings:font-mono text-xs md:text-sm space-y-4">
              {renderedReport ? (
                // Simple markdown renderer for key headers and sections
                renderedReport.split("\n").map((line, idx) => {
                  if (line.startsWith("# ")) {
                    return (
                      <h1 key={idx} className="text-lg font-bold border-b border-red-500/20 pb-2 text-red-400 tracking-wider">
                        {line.replace("# ", "")}
                      </h1>
                    )
                  }
                  if (line.startsWith("## ")) {
                    return (
                      <h2 key={idx} className="text-sm font-bold text-orange-400 uppercase mt-4 tracking-wide">
                        {line.replace("## ", "")}
                      </h2>
                    )
                  }
                  if (line.startsWith("- ") || line.startsWith("* ")) {
                    return (
                      <li key={idx} className="ml-4 list-disc text-slate-300">
                        {line.replace(/^[-*]\s+/, "")}
                      </li>
                    )
                  }
                  if (line.trim().startsWith("1.") || line.trim().startsWith("2.") || line.trim().startsWith("3.") || line.trim().startsWith("4.")) {
                    return (
                      <div key={idx} className="ml-2 font-mono pl-2 border-l border-slate-700 text-slate-300 py-0.5">
                        {line}
                      </div>
                    )
                  }
                  if (line.trim() === "") {
                    return <div key={idx} className="h-2" />
                  }
                  return (
                    <p key={idx} className="text-slate-300 leading-relaxed">
                      {line}
                    </p>
                  )
                })
              ) : (
                <p className="text-slate-500 italic">No telemetry data parsed.</p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-red-500/20 pt-4">
          <div className="flex items-center gap-2 text-[10px] font-mono text-red-500/70">
            <span>SECURE LINK: SEC-403</span>
            <span>|</span>
            <span>ORION-9 ENGINE</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 font-mono text-xs uppercase tracking-wider rounded transition-all duration-200 shadow-lg shadow-red-500/5"
          >
            Acknowledge & Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
