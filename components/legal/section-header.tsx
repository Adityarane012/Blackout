"use client"

import { Link as LinkIcon } from "lucide-react"

export function SectionHeader({ id, title }: { id: string, title: string }) {
  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`
    navigator.clipboard.writeText(url)
  }

  return (
    <h2 id={id} className="text-2xl font-bold text-foreground mt-16 mb-6 group flex items-center gap-3 scroll-mt-24">
      {title}
      <button 
        onClick={copyLink}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
        title="Copy Link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
    </h2>
  )
}
