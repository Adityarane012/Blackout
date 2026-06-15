"use client"

import { motion } from "framer-motion"
import { Brain, Network, Shield, Sparkles } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Cascade Prediction",
    description: "AI analyzes your infrastructure topology to predict which services will fail next and why.",
    highlight: "97.3% accuracy",
  },
  {
    icon: Network,
    title: "Dependency Analysis",
    description: "Automatically maps hidden dependencies and identifies single points of failure in your system.",
    highlight: "Deep graph analysis",
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "Real-time scoring of infrastructure health with actionable recommendations to prevent outages.",
    highlight: "Proactive alerts",
  },
  {
    icon: Sparkles,
    title: "Blast Radius Prediction",
    description: "Understand the full impact of any failure before it happens. Know which users and services are at risk.",
    highlight: "Impact modeling",
  },
]

export function AIAnalysisSection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Purple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-purple-400 font-mono text-sm tracking-wider mb-4 block">AI INTELLIGENCE</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Powered by</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
              predictive AI
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our AI engine learns your infrastructure patterns and predicts failures before any monitoring system could
            detect them.
          </p>
        </motion.div>

        {/* AI visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mb-20"
        >
          <div className="relative max-w-3xl mx-auto p-8 rounded-2xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm">
            {/* Animated glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 animate-pulse" />

            <div className="relative">
              {/* AI Analysis header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                  <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-mono text-purple-400">AI CASCADE ANALYSIS</div>
                  <div className="text-xs text-muted-foreground">Real-time prediction engine</div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-xs font-mono text-purple-400">ACTIVE</span>
                </div>
              </div>

              {/* Analysis content */}
              <div className="space-y-4 font-mono text-sm">
                <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="text-purple-400 mb-2">Cascade Risk Assessment</div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "23%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                      />
                    </div>
                    <span className="text-cyan-400">23% LOW</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                    <div className="text-muted-foreground mb-1">Critical Path</div>
                    <div className="text-foreground">DB-1 → Cache → API-1</div>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                    <div className="text-muted-foreground mb-1">Predicted Impact</div>
                    <div className="text-foreground">4 services, ~12k users</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <div className="text-purple-400 mb-2">AI Recommendation</div>
                  <div className="text-muted-foreground">
                    Consider adding a secondary cache layer between API-1 and DB-1 to reduce cascade risk by 67%.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group p-6 rounded-xl border border-purple-500/10 bg-purple-500/5 hover:border-purple-500/30 hover:bg-purple-500/10 transition-all duration-500"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                    <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                      {feature.highlight}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
