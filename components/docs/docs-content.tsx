"use client"

import { Terminal, Copy, AlertTriangle, Info, CheckCircle2, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import ReactMarkdown from "react-markdown"
import type { DocContent } from "@/lib/docs"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { navGroups } from "@/components/docs/docs-sidebar"

export function DocsContent({ doc }: { doc?: DocContent }) {
  const pathname = usePathname()

  // Calculate prev and next links
  const allLinks = navGroups.flatMap(g => g.links)
  const currentIndex = allLinks.findIndex(l => l.href === pathname || (pathname === '/docs' && l.href === '/docs/getting-started/introduction'))
  const prevLink = currentIndex > 0 ? allLinks[currentIndex - 1] : null
  const nextLink = currentIndex < allLinks.length - 1 && currentIndex !== -1 ? allLinks[currentIndex + 1] : null

  if (!doc) {
    return (
      <div className="w-full max-w-3xl mx-auto py-12 px-6 lg:px-12 text-center text-muted-foreground">
        <h2>Document not found</h2>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-6 lg:px-12">
      
      {/* Header */}
      <div className="mb-10 space-y-4">
        <div className="flex items-center gap-4 text-sm font-mono text-cyan-400">
          <span className="capitalize">{doc.meta.slug[0]?.replace(/-/g, ' ') || "Getting Started"}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground capitalize">{doc.meta.slug[1]?.replace(/-/g, ' ') || "Introduction"}</span>
          <span className="text-muted-foreground flex items-center gap-1.5 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            {doc.meta.readingTime}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{doc.meta.title}</h1>
        {doc.meta.description && (
          <p className="text-xl text-muted-foreground leading-relaxed">
            {doc.meta.description}
          </p>
        )}
      </div>

      <div className="prose prose-invert prose-p:leading-loose prose-headings:font-semibold prose-a:text-cyan-400 max-w-none">
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-12 mb-6 text-foreground group" {...props} />,
            h2: ({node, ...props}) => {
              const id = props.children?.toString().toLowerCase().replace(/[^\w]+/g, '-')
              return (
                <h2 id={id} className="text-2xl font-bold mt-12 mb-6 text-foreground group flex items-center gap-2" {...props}>
                  {props.children}
                  <a href={`#${id}`} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-cyan-400 text-lg">#</a>
                </h2>
              )
            },
            h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-8 mb-4 text-foreground" {...props} />,
            pre: ({node, ...props}) => (
              <div className="my-6 rounded-xl border border-border bg-[#0d0d0d] overflow-hidden relative group">
                <button className="absolute top-3 right-3 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-border p-1.5 rounded-md">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <div className="p-4 overflow-x-auto">
                  <pre className="text-[13px] font-mono leading-loose text-zinc-300 !m-0" {...props} />
                </div>
              </div>
            ),
            code: ({node, className, children, ...props}) => {
              const match = /language-(\w+)/.exec(className || '')
              return !match ? (
                <code className="text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded text-[13px] font-mono" {...props}>
                  {children}
                </code>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
            blockquote: ({node, ...props}) => (
              <div className="my-8 p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 flex gap-4">
                <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-sm text-foreground/80 [&>p]:m-0" {...props} />
              </div>
            )
          }}
        >
          {doc.content}
        </ReactMarkdown>
      </div>

      {/* Prev / Next Footer */}
      {(prevLink || nextLink) && (
        <div className="mt-20 pt-8 border-t border-border/50 flex items-center justify-between">
          {prevLink ? (
            <Link href={prevLink.href} className="flex flex-col gap-2 group text-left">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Previous</span>
              <span className="text-sm font-medium text-foreground group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> {prevLink.title}
              </span>
            </Link>
          ) : <div />}
          
          {nextLink ? (
            <Link href={nextLink.href} className="flex flex-col gap-2 group text-right">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Next</span>
              <span className="text-sm font-medium text-foreground group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                {nextLink.title} <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          ) : <div />}
        </div>
      )}

    </div>
  )
}
