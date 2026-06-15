"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Clock, DollarSign, Users } from "lucide-react"

const problems = [
  {
    icon: Clock,
    title: "Reactive, not predictive",
    description: "Traditional monitoring tells you what broke. By then, users already know.",
    stat: "47 min",
    statLabel: "avg. detection time",
  },
  {
    icon: DollarSign,
    title: "Catastrophic costs",
    description: "A single hour of downtime costs enterprise companies millions in lost revenue and trust.",
    stat: "$5.6M",
    statLabel: "avg. outage cost",
  },
  {
    icon: AlertTriangle,
    title: "Cascade blindness",
    description: "Small failures snowball into system-wide outages. Dependencies are invisible until they break.",
    stat: "73%",
    statLabel: "failures cascade",
  },
  {
    icon: Users,
    title: "User-reported incidents",
    description: "Your customers become your monitoring system. Brand damage is already done.",
    stat: "62%",
    statLabel: "found by users",
  },
]

export function ProblemSection() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-red-400 font-mono text-sm tracking-wider mb-4 block">THE PROBLEM</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Infrastructure fails.</span>
            <br />
            <span className="text-red-400">You find out last.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every major outage started as a minor anomaly. The difference between a blip and a disaster is prediction.
          </p>
        </motion.div>

        {/* Problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((problem, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative p-8 rounded-xl border border-red-500/10 bg-red-500/5 hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-500"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <problem.icon className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-400 font-mono">{problem.stat}</div>
                    <div className="text-xs text-muted-foreground">{problem.statLabel}</div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-2">{problem.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
