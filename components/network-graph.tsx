"use client"

import { memo, useMemo, useState, useEffect, useCallback, useRef } from "react"

export interface InfraNode {
  id: string
  label: string
  type: "server" | "database" | "api" | "cache" | "loadbalancer" | "cdn" | "queue"
  status: "healthy" | "stress" | "degraded" | "failure"
  x: number
  y: number
  load: number
  connections: string[]
  region?: string
}

export interface Connection {
  from: string
  to: string
  traffic: number
  latency: number
  status: "active" | "degraded" | "down"
}

interface NetworkGraphProps {
  nodes: InfraNode[]
  connections: Connection[]
  onNodeClick?: (node: InfraNode) => void
  selectedNode?: string | null
  blastRadiusNodeIds?: string[]
}

const NODE_ICONS: Record<InfraNode["type"], string> = {
  server: "⬡",
  database: "◈",
  api: "◇",
  cache: "◆",
  loadbalancer: "⬢",
  cdn: "◉",
  queue: "▣",
}

function NetworkGraphInner({ nodes, connections, onNodeClick, selectedNode, blastRadiusNodeIds = [] }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes])

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const { clientWidth, clientHeight } = svgRef.current.parentElement
        setDimensions({ width: clientWidth, height: clientHeight })
      }
    }
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  const getStatusColor = useCallback((status: InfraNode["status"]) => {
    switch (status) {
      case "healthy":
        return { fill: "#22d3ee", stroke: "#06b6d4" }
      case "stress":
        return { fill: "#eab308", stroke: "#ca8a04" }
      case "degraded":
        return { fill: "#fb923c", stroke: "#f97316" }
      case "failure":
        return { fill: "#f87171", stroke: "#ef4444" }
      default:
        return { fill: "#22d3ee", stroke: "#06b6d4" } // Fallback to healthy
    }
  }, [])

  const getConnectionColor = useCallback((status: Connection["status"]) => {
    switch (status) {
      case "active":
        return "#22d3ee"
      case "degraded":
        return "#fb923c"
      case "down":
        return "#f87171"
    }
  }, [])

  const scaleX = (x: number) => (x / 100) * dimensions.width
  const scaleY = (y: number) => (y / 100) * dimensions.height

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(100, 116, 139, 0.15)" strokeWidth="0.5" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#grid)" />

      <g className="connections">
        {connections.map((conn, idx) => {
          const fromNode = nodeById.get(conn.from)
          const toNode = nodeById.get(conn.to)
          if (!fromNode || !toNode) return null

          const x1 = scaleX(fromNode.x)
          const y1 = scaleY(fromNode.y)
          const x2 = scaleX(toNode.x)
          const y2 = scaleY(toNode.y)
          const midX = (x1 + x2) / 2
          const midY = (y1 + y2) / 2 - 30

          const isHighlighted =
            hoveredNode === conn.from ||
            hoveredNode === conn.to ||
            selectedNode === conn.from ||
            selectedNode === conn.to

          // Highlight connection if it forms a direct link along the recursive cascade path
          const isBlastRadiusPath =
            selectedNode !== null &&
            (conn.from === selectedNode || blastRadiusNodeIds.includes(conn.from)) &&
            (conn.to === selectedNode || blastRadiusNodeIds.includes(conn.to))

          const color = isBlastRadiusPath ? "#f43f5e" : getConnectionColor(conn.status)

          return (
            <path
              key={`${conn.from}-${conn.to}-${idx}`}
              d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
              fill="none"
              stroke={color}
              strokeWidth={isBlastRadiusPath ? 3.5 : isHighlighted ? 2.5 : 1.5}
              strokeOpacity={conn.status === "down" ? 0.3 : isHighlighted || isBlastRadiusPath ? 1 : 0.5}
              strokeDasharray={isBlastRadiusPath ? "5,5" : conn.status === "down" ? "5,5" : undefined}
              className={isBlastRadiusPath ? "animate-data-flow" : undefined}
            />
          )
        })}
      </g>

      <g className="nodes">
        {nodes.map((node) => {
          const colors = getStatusColor(node.status)
          const x = scaleX(node.x)
          const y = scaleY(node.y)
          const isHovered = hoveredNode === node.id
          const isSelected = selectedNode === node.id
          const isInBlastRadius = blastRadiusNodeIds.includes(node.id)
          const nodeSize = isHovered || isSelected ? 28 : 24

          return (
            <g
              key={node.id}
              transform={`translate(${x}, ${y})`}
              onClick={() => onNodeClick?.(node)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
            >
              {/* Rotating outer dashboard rings for SRE diagnostics */}
              {isSelected && (
                <circle
                  r={nodeSize + 12}
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                  strokeOpacity="0.85"
                  className="animate-spin"
                  style={{ animationDuration: "8s", transformOrigin: "center" }}
                />
              )}

              {isInBlastRadius && (
                <circle
                  r={nodeSize + 12}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                  strokeOpacity="0.85"
                  className="animate-spin"
                  style={{ animationDuration: "12s", transformOrigin: "center" }}
                />
              )}

              {isInBlastRadius && (
                <text
                  y={-nodeSize - 18}
                  textAnchor="middle"
                  fill="#f43f5e"
                  fontSize="8"
                  fontFamily="var(--font-mono)"
                  fontWeight="bold"
                  className="select-none tracking-widest animate-pulse"
                >
                  IMPACT_RISK
                </text>
              )}

              <circle
                r={nodeSize + 8}
                fill="none"
                stroke={colors.fill}
                strokeWidth="1"
                strokeOpacity={node.status === "failure" ? 0.7 : node.status === "degraded" ? 0.5 : 0.25}
                className={
                  node.status === "failure" ? "animate-flash-red" :
                  node.status === "degraded" ? "animate-flicker-orange" :
                  node.status === "stress" ? "animate-pulse" : undefined
                }
              />

              <circle
                r={nodeSize}
                fill="rgba(15, 23, 42, 0.9)"
                stroke={colors.stroke}
                strokeWidth={isSelected ? 3 : 2}
              />

              <circle r={nodeSize - 4} fill={colors.fill} fillOpacity={0.15} />

              <path
                d={describeArc(0, 0, nodeSize - 2, 0, (node.load / 100) * 360)}
                fill="none"
                stroke={colors.fill}
                strokeWidth="3"
                strokeLinecap="round"
              />

              <text
                textAnchor="middle"
                dominantBaseline="central"
                fill={colors.fill}
                fontSize="16"
                fontWeight="bold"
                className="select-none"
              >
                {NODE_ICONS[node.type]}
              </text>

              <text
                y={nodeSize + 20}
                textAnchor="middle"
                fill="rgba(226, 232, 240, 0.9)"
                fontSize="11"
                fontFamily="var(--font-mono)"
                fontWeight="500"
                className="select-none uppercase tracking-wider"
              >
                {node.label}
              </text>

              {node.status !== "healthy" && (
                <circle cx={nodeSize - 5} cy={-nodeSize + 5} r="4" fill={colors.fill} className="animate-pulse motion-reduce:animate-none" />
              )}
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export const NetworkGraph = memo(NetworkGraphInner)

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(x, y, radius, endAngle)
  const end = polarToCartesian(x, y, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
  return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ")
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}
