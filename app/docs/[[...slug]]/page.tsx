import { DocsHeader } from "@/components/docs/docs-header"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { DocsTOC } from "@/components/docs/docs-toc"
import { DocsContent } from "@/components/docs/docs-content"
import { getDocBySlug } from "@/lib/docs"
import { notFound } from "next/navigation"

export default async function DocsPage({ params }: { params: { slug?: string[] } }) {
  const slug = params.slug || []
  const doc = getDocBySlug(slug)

  if (!doc) {
    notFound()
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col selection:bg-cyan-500/30">
      
      {/* Background patterns */}
      <div className="fixed inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_rgba(34,211,238,0.05)_0%,_transparent_50%)]" />

      {/* Sticky Header */}
      <DocsHeader />

      {/* Main Layout Container */}
      <div className="flex flex-1 w-full max-w-[1600px] mx-auto relative z-10">
        
        {/* Left Sidebar Navigation */}
        <DocsSidebar currentSlug={slug} />

        {/* Center Content Area */}
        <main className="flex-1 lg:pl-64 xl:pr-64 min-w-0">
          <DocsContent doc={doc} />
        </main>

        {/* Right Sidebar TOC */}
        <DocsTOC headings={doc.headings} />

      </div>
    </div>
  )
}
