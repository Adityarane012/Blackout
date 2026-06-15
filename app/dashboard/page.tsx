import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { LandingHeader } from "@/components/landing/landing-header"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"
import { Activity, Database, FileText, Zap, ChevronRight, LayoutDashboard, History, Settings } from "lucide-react"

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  // Fetch from FastAPI: /v1/users/{userId}/architectures
  let architectures: any[] = []
  try {
    const archRes = await fetch(`http://127.0.0.1:8000/v1/users/${userId}/architectures`, { cache: 'no-store' })
    if (archRes.ok) architectures = await archRes.json()
  } catch (e) {
    console.error("Failed to fetch architectures", e)
  }
  
  // Fetch from FastAPI: /v1/users/{userId}/simulations
  let simulations: any[] = []
  try {
    const simRes = await fetch(`http://127.0.0.1:8000/v1/users/${userId}/simulations`, { cache: 'no-store' })
    if (simRes.ok) simulations = await simRes.json()
  } catch (e) {
    console.error("Failed to fetch simulations", e)
  }

  const avgResilience = simulations.length > 0 
    ? Math.round(simulations.reduce((acc, curr) => acc + curr.score, 0) / simulations.length)
    : "--"

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col selection:bg-cyan-500/30">
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_transparent_0%,_rgba(8,8,18,1)_100%)]" />

      <LandingHeader />

      <main className="relative z-10 flex-grow pt-32 pb-32 px-6 max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Command Center</h1>
          <p className="text-muted-foreground">Manage your architectures, review simulations, and analyze system resilience.</p>
        </div>

        <div className="grid lg:grid-cols-[250px_1fr] gap-12">
          
          {/* Sidebar */}
          <aside className="space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary/50 text-foreground font-medium transition-colors border border-border/50">
              <LayoutDashboard className="w-5 h-5 text-cyan-400" />
              Overview
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary/30 hover:text-foreground transition-colors">
              <Database className="w-5 h-5" />
              Architectures
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary/30 hover:text-foreground transition-colors">
              <History className="w-5 h-5" />
              Simulation History
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary/30 hover:text-foreground transition-colors">
              <FileText className="w-5 h-5" />
              AI Reports
            </Link>
            <Link href="/account" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary/30 hover:text-foreground transition-colors mt-8">
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </aside>

          {/* Main Content */}
          <div className="space-y-8">
            
            {/* Quick Stats */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-card/10 backdrop-blur-md border border-border/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <Database className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="font-semibold text-muted-foreground">Architectures</h3>
                </div>
                <div className="text-3xl font-bold">{architectures.length}</div>
              </div>

              <div className="bg-card/10 backdrop-blur-md border border-border/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-muted-foreground">Simulations Run</h3>
                </div>
                <div className="text-3xl font-bold">{simulations.length}</div>
              </div>

              <div className="bg-card/10 backdrop-blur-md border border-border/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="font-semibold text-muted-foreground">Avg Resilience</h3>
                </div>
                <div className="text-3xl font-bold">{avgResilience}{avgResilience !== "--" && "%"}</div>
              </div>
            </div>

            {/* Saved Architectures */}
            <div className="bg-card/10 backdrop-blur-md border border-border/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Architectures</h2>
                <Link href="/simulator" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                  New Architecture <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              {architectures.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border/50 rounded-lg bg-secondary/10">
                  <Database className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-sm font-semibold mb-1">No architectures saved</h3>
                  <p className="text-xs text-muted-foreground mb-4">Launch the simulator and save your first system architecture.</p>
                  <Link href="/simulator" className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium bg-cyan-500 hover:bg-cyan-400 text-background rounded-md transition-colors">
                    Launch Simulator
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {architectures.slice(0,3).map((arch, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-secondary/20">
                      <div>
                        <h4 className="font-medium text-sm">{arch.name}</h4>
                        <p className="text-xs text-muted-foreground">{arch.nodes} nodes &bull; {arch.environment}</p>
                      </div>
                      <Link href={`/simulator?arch=${arch.id}`} className="px-3 py-1.5 text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors">
                        Load
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Simulation History */}
            <div className="bg-card/10 backdrop-blur-md border border-border/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Simulations</h2>
                <Link href="#" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              {simulations.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border/50 rounded-lg bg-secondary/10">
                  <History className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-sm font-semibold mb-1">No simulations run</h3>
                  <p className="text-xs text-muted-foreground">Simulations you run on your architectures will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {simulations.slice(0,5).map((sim, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-secondary/20">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{sim.scenario}</h4>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${sim.score > 80 ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {sim.score}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(sim.date).toLocaleDateString()} &bull; {sim.archName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/reports/${sim.id}`} className="px-3 py-1.5 text-xs text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-md transition-colors">
                          View Report
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
