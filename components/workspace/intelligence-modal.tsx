import { X, ShieldAlert, Zap, Network } from "lucide-react"

interface IntelligenceModalProps {
  isOpen: boolean
  onClose: () => void
  report: {
    riskLevel: string
    riskScore: number
    reasons: string[]
    recommendations: string[]
    metrics: {
      spofCount: number
      criticalHubs: number
      maxDependencyDepth: number
    }
  } | null
}

export function IntelligenceModal({ isOpen, onClose, report }: IntelligenceModalProps) {
  if (!isOpen || !report) return null

  const getRiskColor = (level: string) => {
    switch (level) {
      case "HIGH": return "text-red-400 bg-red-400/10 border-red-400/30"
      case "MEDIUM": return "text-orange-400 bg-orange-400/10 border-orange-400/30"
      default: return "text-cyan-400 bg-cyan-400/10 border-cyan-400/30"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card w-full max-w-2xl border border-border/50 shadow-2xl rounded-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-secondary/30">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-purple-400" />
            <h2 className="text-sm font-mono font-bold tracking-wider uppercase text-purple-400">Pre-Simulation Risk Scan</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className={`px-4 py-3 rounded-lg border flex flex-col items-center justify-center ${getRiskColor(report.riskLevel)}`}>
              <span className="text-[10px] uppercase font-mono tracking-wider opacity-80 mb-1">Risk Level</span>
              <span className="text-2xl font-black tracking-widest">{report.riskLevel}</span>
            </div>
            
            <div className="flex-1 grid grid-cols-3 gap-3">
              <div className="bg-secondary/20 border border-border/50 rounded-lg p-3 text-center">
                <span className="text-lg font-bold text-red-400">{report.metrics.spofCount}</span>
                <span className="block text-[10px] text-muted-foreground font-mono uppercase mt-1">SPOFs</span>
              </div>
              <div className="bg-secondary/20 border border-border/50 rounded-lg p-3 text-center">
                <span className="text-lg font-bold text-orange-400">{report.metrics.criticalHubs}</span>
                <span className="block text-[10px] text-muted-foreground font-mono uppercase mt-1">Critical Hubs</span>
              </div>
              <div className="bg-secondary/20 border border-border/50 rounded-lg p-3 text-center">
                <span className="text-lg font-bold text-cyan-400">{report.metrics.maxDependencyDepth}</span>
                <span className="block text-[10px] text-muted-foreground font-mono uppercase mt-1">Max Depth</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                <Zap className="w-3 h-3" /> Risk Factors Detected
              </h3>
              <ul className="space-y-2">
                {report.reasons.map((reason, i) => (
                  <li key={i} className="text-sm text-foreground/90 bg-red-500/5 border border-red-500/10 px-3 py-2 rounded">
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                <Network className="w-3 h-3" /> Architectural Recommendations
              </h3>
              <ul className="space-y-2">
                {report.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-foreground/90 bg-cyan-500/5 border border-cyan-500/10 px-3 py-2 rounded">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
