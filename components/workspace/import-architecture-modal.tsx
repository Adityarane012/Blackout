"use client"

import { useState, useRef, useEffect } from "react"
import type { InfraNode } from "../network-graph"

interface ImportArchitectureModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (nodes: InfraNode[]) => void
}

const TEMPLATE_JSON = `[
  {
    "id": "my-cdn",
    "label": "Global CDN",
    "type": "cdn",
    "status": "healthy",
    "region": "GLOBAL",
    "baseLoad": 25,
    "connections": ["auth-lb"],
    "x": 50,
    "y": 15
  },
  {
    "id": "auth-lb",
    "label": "Auth Gateway LB",
    "type": "loadbalancer",
    "status": "healthy",
    "region": "US-EAST",
    "baseLoad": 40,
    "connections": ["auth-api"],
    "x": 50,
    "y": 35
  },
  {
    "id": "auth-api",
    "label": "Auth API Node",
    "type": "api",
    "status": "healthy",
    "region": "US-EAST",
    "baseLoad": 50,
    "connections": ["redis-store", "auth-db"],
    "x": 50,
    "y": 55
  },
  {
    "id": "redis-store",
    "label": "Session Cache",
    "type": "cache",
    "status": "healthy",
    "region": "US-EAST",
    "baseLoad": 60,
    "connections": ["auth-db"],
    "x": 25,
    "y": 70
  },
  {
    "id": "auth-db",
    "label": "Sovereign Users DB",
    "type": "database",
    "status": "healthy",
    "region": "US-EAST",
    "baseLoad": 65,
    "connections": [],
    "x": 50,
    "y": 85
  }
]`

export function ImportArchitectureModal({ isOpen, onClose, onImport }: ImportArchitectureModalProps) {
  const [activeTab, setActiveTab] = useState<"json" | "image">("json")
  const [jsonText, setJsonText] = useState(TEMPLATE_JSON)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progressLogs, setProgressLogs] = useState<string[]>([])
  const [analysisReport, setAnalysisReport] = useState<string>("")
  const [parsedNodes, setParsedNodes] = useState<InfraNode[] | null>(null)
  
  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-scrolling logs
  const logContainerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [progressLogs])

  if (!isOpen) return null

  // Process logs animation helper
  const addProgressLogs = async (logs: string[]) => {
    for (const log of logs) {
      setProgressLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`])
      await new Promise((r) => setTimeout(r, 600))
    }
  }

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      processSelectedImage(files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processSelectedImage(files[0])
    }
  }

  const processSelectedImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Invalid format: Please drop or upload an image file.")
      return
    }
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async () => {
    setIsProcessing(true)
    setProgressLogs([])
    setAnalysisReport("")
    setParsedNodes(null)

    try {
      if (activeTab === "json") {
        await addProgressLogs([
          "UPLINK: Establishing system routing tunnels...",
          "PARSER: Validating custom JSON structured elements...",
          "DIAGNOSTICS: Engaging AI operator SRE core...",
        ])

        const res = await fetch("/api/parse-architecture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jsonContent: jsonText }),
        })

        if (!res.ok) throw new Error("JSON parsing payload degraded.")
        const data = await res.json()
        
        await addProgressLogs([
          "COMPILER: Custom topology validated successfully.",
          "REPORT: Diagnostics report streams fully compiled."
        ])

        setParsedNodes(data.nodes)
        setAnalysisReport(data.analysis || "")
      } else {
        if (!imagePreview) {
          alert("Uplink error: No image uploaded. Drop a system diagram diagram to initiate vision-scan.")
          setIsProcessing(false)
          return
        }

        await addProgressLogs([
          "UPLINK: Direct visual telemetry feed established...",
          "VISION: Compiling neural matrices for node extraction...",
          "ORION-9: Analysing flow channels, connection tiers, and regional nodes...",
          "PARSER: Translating vector nodes into JSON structures...",
          "DIAGNOSTICS: Synthesizing reliability report streams...",
        ])

        const res = await fetch("/api/parse-architecture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: imagePreview,
            imageMimeType: imageFile?.type
          }),
        })

        if (!res.ok) throw new Error("Multimodal parsing failed.")
        const data = await res.json()

        await addProgressLogs([
          "VISION-DECODER: Mapped custom nodes successfully.",
          "REPORT: SRE diagnostics completed. Telemetry pipeline synchronized."
        ])

        setParsedNodes(data.nodes)
        setAnalysisReport(data.analysis || "")
      }
    } catch (err: any) {
      console.error(err)
      setProgressLogs((prev) => [...prev, `[ERROR] Neural transmission degraded: ${err.message || err}`])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleInject = () => {
    if (parsedNodes) {
      onImport(parsedNodes)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      {/* Modal Card container */}
      <div className="relative w-full max-w-4xl bg-card border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/5 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Glow corner elements */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-cyan-400/40 rounded-tl-xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-cyan-400/40 rounded-tr-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-cyan-400/40 rounded-bl-xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-cyan-400/40 rounded-br-xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-secondary/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <h2 className="text-md font-mono font-bold tracking-tight text-foreground uppercase">Neural Architecture Ingestion</h2>
              <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">Feed JSON configurations or microservice diagrams to AI-SRE analysis</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Left panel - User Inputs */}
          <div className="w-full md:w-1/2 p-4 flex flex-col border-r border-border/50 overflow-y-auto">
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-4 bg-secondary/40 p-1 border border-border/30 rounded-lg">
              <button
                onClick={() => {
                  setActiveTab("json")
                  setAnalysisReport("")
                  setParsedNodes(null)
                }}
                className={`flex-1 py-1.5 rounded text-xs font-mono transition-all duration-200 ${
                  activeTab === "json" ? "bg-cyan-500/20 text-cyan-400 font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                [ ] JSON TOPOLOGY
              </button>
              <button
                onClick={() => {
                  setActiveTab("image")
                  setAnalysisReport("")
                  setParsedNodes(null)
                }}
                className={`flex-1 py-1.5 rounded text-xs font-mono transition-all duration-200 ${
                  activeTab === "image" ? "bg-cyan-500/20 text-cyan-400 font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                [ ] VISION DIAGRAM
              </button>
            </div>

            {/* Tab: JSON */}
            {activeTab === "json" && (
              <div className="flex-1 flex flex-col min-h-[250px]">
                <span className="text-[9px] font-mono uppercase text-muted-foreground mb-1 tracking-wider">Paste Custom Infrastructure Topology JSON</span>
                <textarea
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  className="flex-1 w-full bg-black/60 border border-border/40 focus:border-cyan-500/50 rounded-lg p-3 text-xs font-mono text-cyan-300 outline-none resize-none overflow-y-auto"
                  placeholder="Paste JSON topology definition here..."
                />
              </div>
            )}

            {/* Tab: Image Upload */}
            {activeTab === "image" && (
              <div className="flex-1 flex flex-col min-h-[250px]">
                <span className="text-[9px] font-mono uppercase text-muted-foreground mb-1 tracking-wider">Drop or Upload Architecture Diagram (Multimodal Scan)</span>
                
                {!imagePreview ? (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 border border-dashed border-border/40 hover:border-cyan-500/40 bg-secondary/5 rounded-lg flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-cyan-500/2 transition-all group"
                  >
                    <svg className="w-10 h-10 text-muted-foreground group-hover:text-cyan-400/80 mb-3 transition-colors animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors">[CLICK TO SELECT OR DRAG & DROP DIAGRAM]</span>
                    <span className="text-[10px] font-mono text-muted-foreground/60 mt-1 uppercase">Supports PNG, JPG, WEBP, SVG</span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="flex-1 relative border border-border/40 rounded-lg overflow-hidden bg-black/30 flex items-center justify-center p-2 group">
                    <img src={imagePreview} alt="System Architecture Preview" className="max-h-[220px] max-w-full rounded object-contain border border-border/30" />
                    <button
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview(null)
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Action triggering */}
            <button
              onClick={handleAnalyze}
              disabled={isProcessing}
              className={`mt-4 py-2.5 w-full flex items-center justify-center gap-2 border font-mono text-xs uppercase tracking-wider rounded-lg transition-all duration-200 ${
                isProcessing
                  ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400/50 cursor-not-allowed"
                  : "bg-cyan-500/15 hover:bg-cyan-500/20 border-cyan-500/40 hover:border-cyan-500/60 text-cyan-400 glow-cyan"
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                  <span>Scanning Operations...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>Analyze System Architecture</span>
                </>
              )}
            </button>
          </div>

          {/* Right panel - AI Diagnostics Output */}
          <div className="w-full md:w-1/2 p-4 bg-secondary/10 flex flex-col overflow-y-auto">
            {/* Progression terminal logs when processing */}
            {progressLogs.length > 0 && !analysisReport && (
              <div className="flex-1 bg-black/80 border border-border/40 rounded-lg p-3 flex flex-col font-mono text-xs text-green-400 min-h-[220px]">
                <span className="text-[10px] text-green-500/60 uppercase tracking-widest border-b border-green-500/20 pb-1.5 mb-2 flex items-center justify-between">
                  <span>SYSTEM UPLINK TELEMETRY</span>
                  <span className="animate-pulse">ONLINE</span>
                </span>
                <div ref={logContainerRef} className="flex-1 overflow-y-auto space-y-1.5 flex flex-col min-h-0">
                  {progressLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {log}
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="animate-ping text-cyan-400 font-bold">▶</span>
                      <span className="animate-pulse text-muted-foreground">Synthesizing telemetry data streams...</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Standard Empty Panel before scanning */}
            {progressLogs.length === 0 && !analysisReport && (
              <div className="flex-1 border border-border/20 rounded-lg bg-black/10 flex flex-col items-center justify-center p-6 text-center text-muted-foreground min-h-[220px]">
                <svg className="w-8 h-8 text-muted-foreground/30 mb-2 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-mono uppercase tracking-wide">Ready for Architecture Diagnosis</span>
                <span className="text-[10px] font-mono text-muted-foreground/50 mt-1 uppercase">Diagnostics and extracted layout will appear here after scanning.</span>
              </div>
            )}

            {/* Output markdown report pane */}
            {analysisReport && (
              <div className="flex-1 flex flex-col min-h-0">
                <span className="text-[9px] font-mono uppercase text-purple-400 tracking-wider mb-1">AI SRE Diagnostics Report (ORION-9)</span>
                <div className="flex-1 bg-black/60 border border-purple-500/20 rounded-lg p-3 text-xs font-mono text-purple-300 leading-relaxed overflow-y-auto space-y-3 prose prose-invert select-text max-h-[400px]">
                  {/* Clean Markdown parsing blocks */}
                  {analysisReport.split("\n").map((line, idx) => {
                    if (line.startsWith("# ")) {
                      return <h3 key={idx} className="text-purple-400 text-sm font-bold border-b border-purple-500/25 pb-1 mt-3 mb-1 uppercase tracking-wider">{line.replace("# ", "")}</h3>
                    }
                    if (line.startsWith("## ")) {
                      return <h4 key={idx} className="text-purple-400 text-xs font-bold mt-3 mb-1 uppercase">{line.replace("## ", "")}</h4>
                    }
                    if (line.startsWith("* ") || line.startsWith("- ")) {
                      return <div key={idx} className="pl-4 relative before:content-['*'] before:absolute before:left-0 before:text-purple-400">{line.substring(2)}</div>
                    }
                    if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ") || line.startsWith("4. ")) {
                      return <div key={idx} className="pl-4 relative before:content-[attr(data-num)] before:absolute before:left-0 before:text-purple-400" data-num={line.split(".")[0] + "."}>{line.substring(line.indexOf(".") + 1)}</div>
                    }
                    return <p key={idx} className={line.trim() === "" ? "h-2" : ""}>{line}</p>
                  })}
                </div>

                {/* Inject button */}
                {parsedNodes && (
                  <button
                    onClick={handleInject}
                    className="mt-4 py-2.5 w-full flex items-center justify-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 hover:border-purple-500/60 rounded-lg text-purple-400 font-mono text-xs uppercase tracking-wider transition-all duration-200 glow-purple"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Load & Inject Topology to Grid</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
