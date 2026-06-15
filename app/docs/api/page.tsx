"use client"

import { DocsHeader } from "@/components/docs/docs-header"
import { ApiSidebar } from "@/components/api-docs/api-sidebar"
import { ApiContent } from "@/components/api-docs/api-content"
import { ApiPlayground } from "@/components/api-docs/api-playground"

export default function ApiDocsPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col selection:bg-cyan-500/30 overflow-hidden">
      
      {/* Sticky Header from Main Docs */}
      <DocsHeader />

      {/* 3-Column API Layout */}
      <div className="flex flex-1 w-full max-w-[1800px] mx-auto relative z-10">
        
        {/* Left Column: API Navigation */}
        <ApiSidebar />

        {/* Center Column: Endpoint Details */}
        <main className="flex-1 lg:pl-[280px] lg:pr-[45%] xl:pr-[50%] min-w-0 pb-32">
          <ApiContent />
        </main>

        {/* Right Column: Code Playground */}
        <ApiPlayground />

      </div>
    </div>
  )
}
