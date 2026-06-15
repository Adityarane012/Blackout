"use client"

import { useEffect, useRef, useCallback } from "react"

interface Node {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  status: "healthy" | "stress" | "failure"
  pulsePhase: number
  connections: number[]
}

interface Particle {
  x: number
  y: number
  progress: number
  speed: number
  fromNode: number
  toNode: number
}

export function AnimatedGraphBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Node[]>([])
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const timeRef = useRef(0)

  const initNodes = useCallback((width: number, height: number) => {
    const nodeCount = 35
    const nodes: Node[] = []

    for (let i = 0; i < nodeCount; i++) {
      const statuses: Node["status"][] = ["healthy", "healthy", "healthy", "healthy", "stress", "failure"]
      nodes.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 4 + 3,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        pulsePhase: Math.random() * Math.PI * 2,
        connections: [],
      })
    }

    // Create connections based on proximity
    nodes.forEach((node, i) => {
      nodes.forEach((other, j) => {
        if (i !== j) {
          const dx = node.x - other.x
          const dy = node.y - other.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 200 && node.connections.length < 4) {
            node.connections.push(j)
          }
        }
      })
    })

    return nodes
  }, [])

  const initParticles = useCallback((nodes: Node[]) => {
    const particles: Particle[] = []
    nodes.forEach((node) => {
      node.connections.forEach((targetIdx) => {
        if (Math.random() > 0.6) {
          particles.push({
            x: node.x,
            y: node.y,
            progress: Math.random(),
            speed: 0.003 + Math.random() * 0.004,
            fromNode: node.id,
            toNode: targetIdx,
          })
        }
      })
    })
    return particles
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      nodesRef.current = initNodes(canvas.width, canvas.height)
      particlesRef.current = initParticles(nodesRef.current)
    }

    resize()
    window.addEventListener("resize", resize)

    const getStatusColor = (status: Node["status"], alpha: number = 1) => {
      switch (status) {
        case "healthy":
          return `rgba(34, 211, 238, ${alpha})`
        case "stress":
          return `rgba(251, 191, 36, ${alpha})`
        case "failure":
          return `rgba(239, 68, 68, ${alpha})`
      }
    }

    const animate = () => {
      timeRef.current += 0.016
      ctx.fillStyle = "rgba(8, 8, 18, 0.15)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const nodes = nodesRef.current
      const particles = particlesRef.current

      // Update and draw connections
      ctx.lineWidth = 1
      nodes.forEach((node) => {
        node.connections.forEach((targetIdx) => {
          const target = nodes[targetIdx]
          if (!target) return

          const gradient = ctx.createLinearGradient(node.x, node.y, target.x, target.y)
          gradient.addColorStop(0, getStatusColor(node.status, 0.15))
          gradient.addColorStop(1, getStatusColor(target.status, 0.15))

          ctx.strokeStyle = gradient
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(target.x, target.y)
          ctx.stroke()
        })
      })

      // Update and draw particles (data flow)
      particles.forEach((particle) => {
        const fromNode = nodes[particle.fromNode]
        const toNode = nodes[particle.toNode]
        if (!fromNode || !toNode) return

        particle.progress += particle.speed
        if (particle.progress >= 1) {
          particle.progress = 0
        }

        particle.x = fromNode.x + (toNode.x - fromNode.x) * particle.progress
        particle.y = fromNode.y + (toNode.y - fromNode.y) * particle.progress

        const particleColor = getStatusColor(fromNode.status, 0.8)
        ctx.fillStyle = particleColor
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2)
        ctx.fill()

        // Particle trail
        ctx.fillStyle = getStatusColor(fromNode.status, 0.3)
        ctx.beginPath()
        ctx.arc(
          particle.x - (toNode.x - fromNode.x) * 0.02,
          particle.y - (toNode.y - fromNode.y) * 0.02,
          1.5,
          0,
          Math.PI * 2
        )
        ctx.fill()
      })

      // Update and draw nodes
      nodes.forEach((node) => {
        // Move nodes slowly
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Keep in bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x))
        node.y = Math.max(0, Math.min(canvas.height, node.y))

        // Pulse effect
        const pulse = Math.sin(timeRef.current * 2 + node.pulsePhase) * 0.3 + 1
        const currentRadius = node.radius * pulse

        // Glow effect
        const glowGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, currentRadius * 4)
        glowGradient.addColorStop(0, getStatusColor(node.status, 0.4))
        glowGradient.addColorStop(0.5, getStatusColor(node.status, 0.1))
        glowGradient.addColorStop(1, "transparent")

        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, currentRadius * 4, 0, Math.PI * 2)
        ctx.fill()

        // Node core
        ctx.fillStyle = getStatusColor(node.status, 0.9)
        ctx.beginPath()
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2)
        ctx.fill()

        // Inner highlight
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
        ctx.beginPath()
        ctx.arc(node.x - currentRadius * 0.3, node.y - currentRadius * 0.3, currentRadius * 0.4, 0, Math.PI * 2)
        ctx.fill()
      })

      // Randomly change node statuses for visual interest
      if (Math.random() < 0.002) {
        const randomNode = nodes[Math.floor(Math.random() * nodes.length)]
        const statuses: Node["status"][] = ["healthy", "healthy", "healthy", "stress", "failure"]
        randomNode.status = statuses[Math.floor(Math.random() * statuses.length)]
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [initNodes, initParticles])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "linear-gradient(180deg, #080812 0%, #0a0a1a 50%, #080812 100%)" }}
    />
  )
}
