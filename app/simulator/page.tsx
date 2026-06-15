"use client"

import { useCallback, useState } from "react"
import { NetworkGraph } from "@/components/network-graph"
import { WorkspaceHeader } from "@/components/workspace/workspace-header"
import { LeftSidebar } from "@/components/workspace/left-sidebar"
import { PlaybackTimeline } from "@/components/workspace/playback-timeline"
import { EventLog } from "@/components/event-log"
import { PostMortemModal } from "@/components/workspace/post-mortem-modal"
import { ImportArchitectureModal } from "@/components/workspace/import-architecture-modal"
import { useSimulation } from "@/hooks/use-simulation"

export default function SimulatorPage() {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isAborting, setIsAborting] = useState(false)

  const handleAbortSimulation = useCallback(() => {
    setIsAborting(true)
    setTimeout(() => {
      window.location.href = "/"
    }, 850)
  }, [])

  const {
    nodes,
    connections,
    selectedNode,
    setSelectedNodeId,
    events,
    isRunning,
    setIsRunning,
    speed,
    setSpeed,
    currentScenario,
    elapsedTime,
    triggerNodeFailure,
    injectRandomFailure,
    triggerCascadeMode,
    resetSimulation,
    handleScenarioChange,
    loadCustomTopology,
    
    // AI and post-mortem states
    isAnalyzingPostMortem,
    postMortemReport,
    isPostMortemOpen,
    setIsPostMortemOpen,
    blastRadiusNodeIds,
  } = useSimulation()

  const handleNodeClick = useCallback(
    (node: { id: string }) => setSelectedNodeId(node.id),
    [setSelectedNodeId]
  )

  return (
    <div className={`flex flex-col w-screen h-screen bg-background overflow-hidden transition-all duration-300 ${isAborting ? "animate-crt-shutdown" : "animate-fade-in"}`}>
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" aria-hidden />
      <div className="fixed inset-0 scanlines pointer-events-none motion-reduce:hidden" aria-hidden />

      <WorkspaceHeader
        isRunning={isRunning}
        speed={speed}
        onToggleSimulation={() => setIsRunning((r) => !r)}
        onSpeedChange={setSpeed}
        onReset={resetSimulation}
        onScenarioChange={handleScenarioChange}
        currentScenario={currentScenario}
        onOpenImport={() => setIsImportModalOpen(true)}
        onAbort={handleAbortSimulation}
      />

      <div className="flex flex-1 overflow-hidden min-h-0">
        <LeftSidebar
          nodes={nodes}
          selectedNode={selectedNode}
          onNodeSelect={(node) => setSelectedNodeId(node?.id ?? null)}
          onTriggerFailure={triggerNodeFailure}
          onInjectFault={injectRandomFailure}
          onCascadeMode={triggerCascadeMode}
        />

        <main className="flex-1 relative overflow-hidden min-h-0">
          <NetworkGraph
            nodes={nodes}
            connections={connections}
            onNodeClick={handleNodeClick}
            selectedNode={selectedNode?.id ?? null}
            blastRadiusNodeIds={blastRadiusNodeIds}
          />

          {/* Scrolling Terminal-style Event Log */}
          <EventLog events={events} />

          <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-cyan-500/20 pointer-events-none" />
          <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-cyan-500/20 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-cyan-500/20 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-cyan-500/20 pointer-events-none" />

          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-card/80 border border-border/30 rounded-full">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Infrastructure Dependency Map
            </span>
          </div>

          {!isRunning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="px-6 py-3 rounded-lg bg-card/90 border border-cyan-500/30 text-center shadow-2xl shadow-cyan-500/5">
                <p className="text-sm font-mono text-cyan-400 uppercase tracking-wider">Simulation Paused</p>
                <p className="text-xs text-muted-foreground mt-1">Press play in the header to start</p>
              </div>
            </div>
          )}
        </main>
      </div>

      <PlaybackTimeline events={events} isRunning={isRunning} elapsedTime={elapsedTime} />

      {/* AI Post-Mortem Terminal Analysis Dialog */}
      <PostMortemModal
        isOpen={isPostMortemOpen}
        onClose={() => setIsPostMortemOpen(false)}
        reportText={postMortemReport}
        isAnalyzing={isAnalyzingPostMortem}
      />

      {/* Custom System Architecture Ingestion Dialog */}
      <ImportArchitectureModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={(customNodes) => {
          loadCustomTopology(customNodes)
        }}
      />
    </div>
  )
}
