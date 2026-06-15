# BLACKOUT — Presentation Reference Document

---

# PART 1: PROJECT DETAILS & CONTEXT

---

## 1.1 What Is BLACKOUT?

BLACKOUT is an **AI-native cascading failure simulation engine** that predicts how modern software infrastructures collapse under real-world chaotic conditions — before a single user ever experiences downtime. Think of it as a **digital twin for your backend architecture**, but instead of monitoring what already broke, BLACKOUT lets you *watch it break on purpose* in a safe, sandboxed environment.

Built for the **OSC AI Hackathon**, the platform combines a **cyberpunk CRT-scanline aesthetic** with serious SRE (Site Reliability Engineering) simulation logic. It runs entirely client-side in the browser — no destructive commands, no real cloud infrastructure, no production risk. It is a pure interactive sandbox built to educate, impress, and demonstrate how cascading outages propagate through interconnected microservice architectures.

---

## 1.2 The Problem We Solve

Modern engineering teams build massively interconnected systems: frontend apps talk to API gateways, which route to microservices, which read from caches, write to databases, and push messages through queues. When one service fails, the failure doesn't stay contained — it **cascades**. A slow database causes retry storms, which flood queues, which choke API gateways, which crash the user-facing edge. This phenomenon is called a **cascading failure**, and it's responsible for some of the largest outages in tech history (AWS us-east-1, Cloudflare, Facebook's 2021 BGP outage).

Traditional testing approaches fundamentally cannot catch these failures because they validate **expected behavior** with **predefined test cases**. They don't model the unpredictable, compounding chaos that causes cascading meltdowns. BLACKOUT exists to fill this gap. It creates **AI-generated synthetic outage scenarios** and simulates how failures propagate across dependency chains in real time — so engineers can find the weak links *before* they break in production.

---

## 1.3 Core Features

### Infrastructure Graph Engine
BLACKOUT renders a **15-node regional infrastructure topology** as an interactive SVG-based dependency map. The network spans four regions (`GLOBAL`, `US-EAST`, `US-WEST`, `EU-WEST`) and includes seven infrastructure types: CDN edge nodes, load balancers, API gateways, compute services (Auth, User, Order, Payment), Redis caches, a Kafka message queue, and primary/replica databases. Every node displays a **load arc** (a circular progress indicator showing current capacity utilization), glowing status colors, and animated state transitions.

### Deterministic State Machine & Cascade Engine
Each node operates on a deterministic state machine with four states:
- **Healthy** → load below 65%
- **Stressed** → load ≥ 75%
- **Degraded** → load ≥ 92%
- **Failed** → degraded nodes face compounding collapse probability (8% base + 5% per failed dependency per tick)

The cascade propagation engine (`lib/propagation.ts`) implements three key mechanics: **(1) upstream stress propagation** — failed dependencies push a severe load penalty onto upstream consumers; **(2) same-tier failover redistribution** — when a node fails, its healthy peers absorb extra load; and **(3) compounding collapse** — degraded nodes face an increasing random chance of total failure each tick. This creates realistic, emergent domino-effect cascades without scripted sequences.

### Chaos Scenario Injection
Users can trigger three preset chaos scenarios from the operator terminal:
- **Traffic Surge** — 2× traffic multiplier saturating CDN edges and routing pipelines.
- **Database Failure** — Catastrophically kills the Primary Database, initiating upstream cascade chains.
- **Domino Outage** — Continuous compounding outages across interconnected dependencies.

Additionally, users can **manually fail** individual nodes, inject **random fault stress** into healthy nodes, or **import custom architectures** via a JSON schema parser.

### AI SRE Intelligence (ORION-9)
BLACKOUT integrates a multi-provider AI layer with graceful degradation:
1. **Local Ollama** (Gemma2 / Phi4) — zero-cost local AI inference.
2. **Google Gemini** (gemini-1.5-flash) — cloud-based AI via API key.
3. **OpenAI** (gpt-4o-mini) — premium cloud AI option.
4. **Procedural Fallback** — an atmospheric offline template generator that produces full post-mortem reports even without any AI credentials.

The AI powers two features: **live commentary** (the `/api/commentary` endpoint is polled every 5 simulation ticks for real-time SRE narration) and a **full post-mortem incident report** (generated automatically when 100% of nodes leave the healthy state, or triggered manually).

### Reliability Dashboard
A real-time metrics overlay displays network health percentage, node state counts (healthy/stressed/failed), throughput in requests per second, and average latency across all connections. Color-coded progress bars shift from cyan → orange → red as conditions deteriorate.

### Blast Radius Visualization
When a node is selected, BLACKOUT queries the `/api/blast-radius` endpoint to compute a recursive upstream dependency graph. All nodes in the blast radius are highlighted with animated dashed rings and `IMPACT_RISK` labels, and all connections along the cascade path are rendered in rose-red with flowing dash animations.

---

## 1.4 Technical Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript | UI rendering, simulation page, landing page |
| **Styling** | Tailwind CSS 4, custom CSS keyframes | CRT scanlines, glowing animations, cyberpunk theme |
| **Graph Engine** | Custom SVG (no third-party lib) | Node rendering, bezier-curve connections, load arcs |
| **Simulation Engine** | `lib/propagation.ts`, `hooks/use-simulation.ts` | Tick-based state machine, cascade logic, scenario injection |
| **AI Layer** | Next.js API Routes (`/api/analyze`, `/api/commentary`) | Multi-provider AI orchestration with fallback chain |
| **Backend** | FastAPI (Python), Neo4j 5.20 graph database | Persistent topology storage, Cypher-based blast radius queries |
| **Infrastructure** | Docker Compose | Neo4j container with APOC plugin preloaded |
| **UI Components** | Radix UI, Lucide React, Framer Motion, Recharts | Accessible primitives, icons, animations, charts |

---

## 1.5 Key Design Decisions

- **Custom SVG over React Flow** — We built a bespoke SVG graph renderer instead of using React Flow. This eliminated a heavy dependency, gave us full control over animations (arc progress, status glows, bezier connections), and ensured the layout remained perfectly centered without zoom/pan complexity.
- **Client-side simulation** — The cascade engine runs entirely in the browser via React hooks and interval timers. This ensures zero backend dependency for the core demo, making it deployable as a simple static site.
- **Multi-provider AI fallback chain** — Rather than locking to a single provider, every AI endpoint cascades: Ollama → Gemini → OpenAI → procedural. This guarantees the app works in any environment — from an offline laptop to a fully credentialed cloud deployment.
- **Cinematic design philosophy** — The CRT scanline overlay, holographic grid, glow effects, and cyberpunk terminal aesthetics are *intentional product decisions*, not decoration. The design was built to feel like operating a mission-critical infrastructure control console, aligning the visual experience with the SRE domain.

---

## 1.6 Project Status

**Overall Completion: ~95%**. All MVP features (graph visualization, cascade simulation, AI analysis, scenario injection, reliability dashboard, playback controls, custom architecture import, and cinematic polish) are fully implemented and functional. The optional Neo4j backend bridge (connecting the live frontend simulation to the persistent graph database) is the only remaining integration point.

---
---

# PART 2: PRESENTATION GENERATION PROMPTS

> **How to use**: Copy-paste any single prompt below into **Gamma** or **Google Gemini**. Each prompt is self-contained with exact slide text, visual layout instructions, color specifications, and speaker notes. Pick the one that fits your presentation slot.

---

## PROMPT A — Primary Hackathon Pitch Deck for Gamma (⭐ Recommended)

> Best for: **Gamma.app** — paste the entire block below as a single prompt.

```
Create a 13-slide premium hackathon pitch deck presentation.

═══════════════════════════════════════════
GLOBAL DESIGN SYSTEM — apply to ALL slides
═══════════════════════════════════════════

THEME: Dark cyberpunk operations console.
BACKGROUNDS: Deep navy-black gradient (#080812 → #0c1220). Every slide should have a very faint grid-line overlay pattern (thin cyan lines at ~8% opacity) to give a "holographic HUD" feeling.
PRIMARY ACCENT: Electric cyan (#22d3ee)
SECONDARY ACCENT: Hot pink / rose (#f43f5e)
TERTIARY ACCENT: Vivid purple (#a855f7)
WARNING COLOR: Amber (#eab308)
DANGER COLOR: Red (#f87171)
SUCCESS COLOR: Emerald (#10b981)

TYPOGRAPHY:
- Headings: Bold, uppercase, wide letter-spacing (use Inter, Space Grotesk, or Outfit)
- Body text: Clean sans-serif (Inter or DM Sans), light/medium weight, high contrast white (#e2e8f0) on dark
- Code / data / metrics: Monospace font (JetBrains Mono, Fira Code, or Source Code Pro) in cyan (#22d3ee) or amber (#eab308)
- Small labels: 10px uppercase, wide tracking, muted gray (#94a3b8)

VISUAL STYLE:
- Cards and content blocks use glassmorphism: semi-transparent dark backgrounds (rgba(15,23,42,0.8)) with subtle border glow (1px solid rgba(34,211,238,0.2)) and backdrop-blur
- Use thin glowing line separators instead of solid dividers
- Icons should be minimal line-art style (Lucide/Feather style), colored cyan or rose
- Avoid stock photos entirely. Use abstract tech visuals, network diagrams, or solid-color icon compositions
- Add subtle glow/bloom effects around key visuals and headings
- Every slide should feel like a screen on a high-tech mission control console

SLIDE TRANSITIONS: Smooth fade or subtle slide-in. No flashy transitions.

═══════════════════════
SLIDE-BY-SLIDE CONTENT
═══════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SLIDE 1 — TITLE / HERO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT: Centered, dramatic. Full-bleed dark background.
VISUAL: Faint abstract network graph lines floating behind the title (like a constellation map of infrastructure nodes connected by thin glowing cyan lines). Subtle animated pulse feel.

CONTENT:
- Tiny label at top: "OSC AI HACKATHON 2025" (10px, uppercase, tracking-widest, muted gray)
- Main title: "BLACKOUT" (72px+, bold, uppercase, cyan #22d3ee, with a subtle outer glow effect)
- Subtitle: "Predict the outage before the world sees it." (20px, italic, white #e2e8f0)
- Tagline pill below: "AI-Native Cascading Failure Simulation Engine" (12px, monospace, inside a rounded pill/badge with cyan border and dark fill)
- Bottom: Small text — "Next.js · React · Neo4j · AI-Powered" (muted, 10px)

SPEAKER NOTE: "BLACKOUT is an AI-powered simulation engine that models how entire software infrastructures collapse — before your users ever see it happen. Built for the OSC AI Hackathon."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SLIDE 2 — THE PROBLEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT: Two-column. Left = text content (60%), Right = visual (40%).
VISUAL (right): A vertical chain of 5 connected nodes/circles, each progressively turning from cyan to red (top-to-bottom), with glowing connection lines — representing a cascading domino failure. Label them: "Edge CDN" → "API Gateway" → "Auth Service" → "Database" → "💀 TOTAL OUTAGE". Use red glow on the bottom nodes.

CONTENT (left):
- Section label: "THE PROBLEM" (10px, uppercase, cyan, tracking-widest)
- Heading: "Software doesn't just fail. It cascades." (28px, bold, white)
- Bullet points (16px, light gray #cbd5e1, with colored icons):
  • 🔴 A single slow database can take down an entire platform
  • 🔴 Cascading failures compound — one crashed service triggers retry storms that flood every upstream dependency
  • 🔴 Teams discover these meltdowns only AFTER deployment — when millions of users are already impacted
- Highlighted stat callout box (glassmorphism card):
  "71% of major cloud outages involve cascading failures across 3+ services"
  — (small text: "Source: Google SRE Handbook / Uptime Institute")

SPEAKER NOTE: "The core problem is that modern systems are deeply interconnected. When a database slows down, it doesn't just affect one service — it creates retry storms that flood queues, overload caches, choke API gateways, and eventually crash the entire user-facing stack. This is called a cascading failure, and it's behind most of the biggest outages in tech history — AWS, Cloudflare, Facebook's 2021 BGP incident."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SLIDE 3 — WHY TRADITIONAL TESTING FAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT: Comparison — two side-by-side glassmorphism cards.

LEFT CARD (dim, with red-tinted border):
- Header: "Traditional Testing" (with ✕ icon in red)
- Bullets:
  • Validates expected behavior only
  • Uses static, predefined test cases
  • Catches bugs, not emergent meltdowns
  • Tests services in isolation
  • Reactive — debug after the outage

RIGHT CARD (bright, with cyan-tinted border and glow):
- Header: "What's Actually Needed" (with ✓ icon in cyan)
- Bullets:
  • Model unpredictable, compounding chaos
  • Simulate cascading dependency chains
  • Generate unknown failure scenarios with AI
  • Visualize propagation across the entire stack
  • Predict the outage before deployment

BOTTOM: Callout text — "Traditional tools test if code works. BLACKOUT tests if your infrastructure survives." (italic, medium gray)

SPEAKER NOTE: "Unit tests and integration tests validate expected behavior. They can't model the emergent chaos that happens when multiple services interact under stress. You need a fundamentally different approach — you need to simulate the failure before it happens."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SLIDE 4 — OUR SOLUTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT: Centered hero content with a horizontal process flow below.
VISUAL: A horizontal 4-step process flow with arrow connectors, each step inside a glassmorphism card with an icon on top:

Step 1: 🏗️ "Define Architecture" — Upload or configure your infrastructure topology
Step 2: 🤖 "AI Generates Chaos" — AI creates synthetic outage scenarios targeting weak points
Step 3: 💥 "Watch It Cascade" — Real-time simulation of cascading failure propagation
Step 4: 📋 "AI Post-Mortem" — Automated incident report with root cause analysis and remediation

CONTENT (above the flow):
- Section label: "THE SOLUTION" (cyan, uppercase)
- Heading: "BLACKOUT: A Digital Twin for Failure Prediction" (28px, bold, white)
- Subtext: "An AI-native simulation engine that creates synthetic outage environments to predict how your infrastructure collapses — before a single user is impacted." (16px, light gray)

SPEAKER NOTE: "BLACKOUT works in four steps. You define your system architecture — or use our built-in 15-node topology. The AI generates chaos scenarios. You watch the cascading failure propagate through your entire stack in real time. And when everything goes dark, BLACKOUT's AI operator — called ORION-9 — automatically generates a full post-mortem incident report with root cause analysis and remediation recommendations."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SLIDE 5 — INFRASTRUCTURE TOPOLOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT: Full-width visual with small labels.
VISUAL: A network graph diagram showing the 15-node infrastructure topology. Arrange nodes in 5 horizontal tiers:

Tier 1 (top): CDN Edge 1, CDN Edge 2 — cyan circles labeled "GLOBAL" and "EU-WEST"
Tier 2: Core Load Balancer — green hexagon labeled "US-EAST"
Tier 3: API Gateway 1, API Gateway 2, API Gateway 3 — yellow diamonds
Tier 4: Auth Service, User Service, Redis Cache 1, Order Service, Payment Service, Redis Cache 2 — orange hexagons (services) and magenta diamonds (caches)
Tier 5 (bottom): Kafka Message Queue (purple square), Primary Database (red circle, "US-EAST"), Replica Database (red circle, "US-WEST")

Draw directed lines (arrows) between tiers showing dependencies. Color all nodes cyan to show "healthy" state. Use thin glowing connection lines.

Label the whole diagram: "15 Nodes · 4 Regions · 7 Service Types"
Region labels: GLOBAL, US-EAST, US-WEST, EU-WEST

RIGHT SIDEBAR (small stats panel):
- Node Types: CDN, Load Balancer, API Gateway, Microservice, Cache, Queue, Database
- Regions: GLOBAL, US-EAST, US-WEST, EU-WEST
- Connections: 23 directed dependency edges

SPEAKER NOTE: "This is BLACKOUT's default infrastructure topology — a 15-node enterprise-grade high-availability network. It spans 4 geographic regions and includes every layer of a modern backend: CDN edges at the top, load balancer, API gateways, four microservices, Redis caches, a Kafka queue, and primary plus replica databases at the bottom. Every node has defined dependencies, base load, and capacity thresholds."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SLIDE 6 — CASCADE ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT: Left = state machine diagram (55%), Right = mechanics list (45%).

LEFT VISUAL: A horizontal state-transition diagram with 4 circles connected by arrows:
🟢 HEALTHY (cyan, "Load < 65%") → 🟡 STRESSED (yellow, "Load ≥ 75%") → 🟠 DEGRADED (orange, "Load ≥ 92%") → 🔴 FAILED (red, "Collapse Probability")
Arrow labels: "Load rises", "Threshold crossed", "8% + 5% per dead dependency"
A dashed return arrow from STRESSED back to HEALTHY labeled "Load drops < 65%"

RIGHT CONTENT:
- Heading: "Three Propagation Mechanics" (20px, bold)
- Card 1 (cyan border): "⬆ Upstream Stress" — When a dependency fails, all upstream consumers absorb a severe load penalty: +45% load proportional to failed dependencies.
- Card 2 (amber border): "↔ Failover Redistribution" — When a peer node fails, surviving nodes of the same type absorb its traffic: +25% load per failed peer.
- Card 3 (rose border): "💀 Compounding Collapse" — Degraded nodes face increasing random failure probability each tick: 8% base + 5% per dead dependency.

BOTTOM: Monospace formula in a dark code block:
`collapse_chance = 0.08 + (failed_dependencies × 0.05)`

SPEAKER NOTE: "The cascade engine is the heart of BLACKOUT. Every node runs on a deterministic state machine with four states. The key insight is three propagation mechanics working simultaneously: failed dependencies push upstream stress, peer failover redistributes load, and degraded nodes face compounding collapse probability. This creates realistic, emergent domino-effect cascades without any scripted sequences."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SLIDE 7 — CHAOS SCENARIOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT: Three equal-width cards in a row + a bottom bar.

CARD 1 (cyan accent):
- Icon: 📈 (or traffic/wave icon)
- Title: "TRAFFIC SURGE"
- Description: "2× traffic multiplier saturates CDN edges and routing pipelines. Simulates Black Friday spikes or viral load events."
- Tag: "Severity: HIGH"

CARD 2 (red accent):
- Icon: 💾 (or database/cylinder icon)
- Title: "DATABASE FAILURE"
- Description: "Catastrophically kills the Primary Database. Triggers upstream cascade chains through services, caches, and queues."
- Tag: "Severity: CRITICAL"

CARD 3 (purple accent):
- Icon: 🎲 (or domino/chain icon)
- Title: "DOMINO OUTAGE"
- Description: "Initiates continuous compounding outages across randomly connected adjacent dependencies. Maximum chaos."
- Tag: "Severity: CATASTROPHIC"

BOTTOM BAR (subtle, full width):
"Plus: Manual node kill injection · Random fault stress · Custom architecture import via JSON"

SPEAKER NOTE: "Users can trigger three preset chaos scenarios. Traffic Surge floods the network with double the normal traffic. Database Failure kills the primary database and lets you watch the cascade climb upward. Domino Outage is pure chaos — continuous compounding failures across the entire grid. You can also manually kill individual nodes, inject random stress, or import your own custom architecture."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SLIDE 8 — AI INTELLIGENCE: ORION-9
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT: Left content (55%) + Right visual (45%).

LEFT CONTENT:
- Section label: "AI SRE OPERATOR" (purple, uppercase)
- Heading: "Meet ORION-9" (28px, bold, purple #a855f7 glow)
- Subtitle: "Your cynical, veteran cyberpunk SRE analyst." (italic, gray)

Feature 1 (with purple ◆ bullet):
"Live Commentary" — Every 5 simulation ticks, ORION-9 delivers real-time SRE narration analyzing the current system state and active cascades.

Feature 2 (with purple ◆ bullet):
"Auto Post-Mortem" — When total blackout is detected (0 healthy nodes), ORION-9 auto-generates a formal incident report: Executive Summary, Root Cause Analysis, Impact Assessment, and Remediation Tasks.

- Fallback chain diagram (horizontal): four small icons/badges connected by arrows:
🖥️ Ollama (Local, Free) → ♊ Google Gemini → 🤖 OpenAI → 📝 Procedural Template
Label: "Multi-Provider AI Fallback — works even with zero API keys"

RIGHT VISUAL: A mock terminal/console window (dark background, green/cyan monospace text) showing a sample AI commentary output:
```
[ORION-9] >> Thread pool exhaustion 
detected on API Gateway 2. Retry storm 
amplification in progress. Recommend 
immediate circuit breaker activation on 
upstream Auth Service endpoints. 
Cascade probability: 73%.
```

SPEAKER NOTE: "ORION-9 is BLACKOUT's AI SRE operator. It uses a multi-provider fallback chain — first trying local Ollama for zero-cost inference, then Gemini, then OpenAI, and finally a procedural template. This means BLACKOUT works perfectly even on an airplane with no internet. The AI powers two features: live narration that comments on the simulation every 5 ticks, and automatic post-mortem reports when the system reaches total blackout."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SLIDE 9 — TECH STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT: Three-column architecture view with a horizontal layer diagram.

TOP SECTION — three glassmorphism cards side by side:

CARD 1 — "FRONTEND" (cyan border):
- Next.js 16 (App Router)
- React 19 + TypeScript
- Custom SVG Graph Engine (no third-party libs)
- Tailwind CSS 4 + Custom CRT Animations
- Radix UI + Framer Motion
- Recharts for metrics visualization

CARD 2 — "BACKEND" (green border):
- FastAPI (Python)
- Neo4j 5.20 Graph Database
- Pydantic Data Schemas
- Cypher Recursive Queries
- Docker Compose
- APOC Plugin

CARD 3 — "AI LAYER" (purple border):
- Ollama (Gemma2 / Phi4) — Local
- Google Gemini (gemini-1.5-flash)
- OpenAI (gpt-4o-mini)
- Procedural Fallback Engine
- Multi-Provider Orchestration

BOTTOM — horizontal architecture flow diagram:
Browser → Next.js Frontend → [SVG Engine + Simulation Hooks] → API Routes → [Ollama | Gemini | OpenAI] → AI Response
                                                                    ↓
                                                              FastAPI Backend → Neo4j Graph DB

SPEAKER NOTE: "The tech stack is split into three layers. The frontend is Next.js 16 with React 19 and a completely custom SVG graph engine — we didn't use React Flow or any third-party graph library. The backend is FastAPI with Neo4j for persistent graph storage and recursive Cypher blast-radius queries. And the AI layer is a multi-provider orchestration system that gracefully degrades from Ollama to Gemini to OpenAI to a procedural fallback."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SLIDE 10 — LIVE DEMO / SCREENSHOTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT: 2×2 grid of screenshot placeholders with captions.

TOP-LEFT: [Screenshot/mockup: Landing page with cyberpunk hero section, animated graph background, CRT scanlines]
Caption: "Cinematic Landing Page"

TOP-RIGHT: [Screenshot/mockup: The infrastructure dependency map with all nodes glowing cyan, bezier connections, load arcs]
Caption: "Infrastructure Topology — Healthy State"

BOTTOM-LEFT: [Screenshot/mockup: Cascading failure in progress — some nodes red/orange, connections dashed, event log filling with CRITICAL alerts]
Caption: "Cascade in Progress — Systems Failing"

BOTTOM-RIGHT: [Screenshot/mockup: AI post-mortem modal open showing the generated incident report with markdown formatting]
Caption: "ORION-9 Post-Mortem Report"

CENTER OVERLAY TEXT: "LIVE DEMO" (large, cyan, glowing)

SPEAKER NOTE: "This is where we transition to a live demo. I'll show the landing page, start a simulation, trigger a Database Failure scenario, and watch the cascade propagate. When the system reaches total blackout, you'll see ORION-9 auto-generate a post-mortem incident report in real time. [SWITCH TO LIVE DEMO]"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SLIDE 11 — WHAT MAKES BLACKOUT UNIQUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT: Large heading + 5 feature callouts with icons in a vertical list or staggered grid.

HEADING: "Not a chatbot. Not a dashboard. A simulation engine." (28px, bold, center)

CALLOUT 1 (🧠 icon): "AI Generates the Chaos" — The AI doesn't just analyze results — it creates the failure scenarios that break your system.
CALLOUT 2 (🎬 icon): "Cinematic Visualization" — CRT scanlines, glowing nodes, and terminal aesthetics make infrastructure failure viscerally understandable.
CALLOUT 3 (✈️ icon): "Works Fully Offline" — Zero API keys needed. The entire simulation and AI fallback works without internet.
CALLOUT 4 (📐 icon): "Custom Architecture Import" — Import your own system topology via JSON and test YOUR infrastructure.
CALLOUT 5 (🔗 icon): "Graph-Native Backend" — Neo4j-powered recursive blast radius computation traces cascading impact through any depth of dependencies.

SPEAKER NOTE: "Five things set BLACKOUT apart. First, the AI generates chaos — it's not just analyzing, it's attacking. Second, the visualization is cinematic — you viscerally feel the infrastructure dying. Third, it works fully offline. Fourth, you can import your own architecture. Fifth, the Neo4j graph backend enables recursive blast radius analysis through any depth of dependencies."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SLIDE 12 — FUTURE ROADMAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT: Timeline or vertical roadmap with 5 milestones.

MILESTONE 1 — "Neo4j Bridge" (NOW):
Connect live frontend simulation to persistent Neo4j graph for blast-radius overlay and historical persistence.

MILESTONE 2 — "Kubernetes Import" (NEXT):
Auto-discover and import infrastructure topology from live Kubernetes clusters via kubectl.

MILESTONE 3 — "Collaborative Sessions":
Real-time multiplayer simulation — multiple SRE operators watching and injecting faults simultaneously.

MILESTONE 4 — "Historical Replay":
Record, replay, and compare past simulation runs to track resilience improvements over time.

MILESTONE 5 — "CI/CD Integration":
Pre-deploy resilience gate — BLACKOUT runs as a CI pipeline step and blocks deployment if resilience score drops below threshold.

SPEAKER NOTE: "The immediate next step is connecting the frontend simulation to the Neo4j backend for persistent blast radius analysis. Longer term, we want Kubernetes auto-import, collaborative multiplayer sessions, simulation replay, and CI/CD pipeline integration as a pre-deploy resilience gate."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SLIDE 13 — THANK YOU / CLOSING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT: Centered, dramatic. Mirror the title slide's design.

CONTENT:
- Quote: "Predict the outage before the world sees it." (24px, italic, white, with subtle cyan glow)
- Title: "BLACKOUT" (48px, bold, cyan)
- Subtitle: "AI-Native Cascading Failure Simulation Engine"
- Team section: [Add your team member names and roles here]
- Bottom: "Built with ❤️ for the OSC AI Hackathon 2025"
- Small text: "github.com/[your-repo] · Try it live at [your-deployment-url]"

SPEAKER NOTE: "Thank you for watching. BLACKOUT is live and ready to demo. We're happy to answer any questions about the simulation engine, the AI integration, or the cascade propagation mathematics."
```

---

## PROMPT B — Optimized for Google Gemini

> Best for: **Google Gemini** (Workspace / Slides generation). Paste the block below.

```
Generate a Google Slides presentation for my hackathon project "BLACKOUT: AI-Powered Cascading Failure Simulation Engine". Use 13 slides.

DESIGN REQUIREMENTS:
- Color scheme: Dark backgrounds (#080812 navy-black), cyan accent (#22d3ee), rose/pink accent (#f43f5e), purple accent (#a855f7), amber warning (#eab308), red danger (#f87171)
- Typography: Clean modern sans-serif for headings (Inter or similar), monospace for any code/data/metrics
- Style: Futuristic cyberpunk operations console. Glassmorphism cards. Glowing neon accents. Subtle grid overlay pattern on backgrounds. No stock photos.
- Every slide must feel like a screen in a sci-fi command center

SLIDE DETAILS:

SLIDE 1: TITLE
- Title: "BLACKOUT" (large, cyan, glowing)
- Subtitle: "Predict the outage before the world sees it."
- Badge: "AI-Native Cascading Failure Simulation Engine"
- Footer: "OSC AI Hackathon 2025"
- Background visual: Abstract constellation network of connected nodes
Speaker notes: BLACKOUT is an AI-powered engine that simulates how software infrastructures collapse before deployment.

SLIDE 2: THE PROBLEM
- Heading: "Software doesn't just fail. It cascades."
- 3 bullet points: (1) A single slow database can crash an entire platform, (2) Cascading failures compound — retry storms flood every upstream service, (3) Teams discover these meltdowns only AFTER deployment
- Visual: Chain of 5 nodes going from green to red (domino cascade)
- Stat box: "71% of major outages involve cascading failures across 3+ services"
Speaker notes: Modern systems are deeply interconnected. A failure in one service creates retry storms that propagate upward through the entire stack.

SLIDE 3: WHY TRADITIONAL TESTING FAILS
- Two-column comparison:
  LEFT (red-tinted, dim): "Traditional Testing" — validates expected behavior, static test cases, catches bugs not meltdowns, tests in isolation, reactive debugging
  RIGHT (cyan-tinted, bright): "What's Needed" — model compounding chaos, simulate dependency chains, AI-generated scenarios, visualize propagation, predict before deployment
- Bottom quote: "Traditional tools test if code works. BLACKOUT tests if your infrastructure survives."
Speaker notes: Unit and integration tests validate expected behavior but cannot model emergent cascading chaos across interconnected microservices.

SLIDE 4: OUR SOLUTION
- Heading: "BLACKOUT: A Digital Twin for Failure Prediction"
- Description: An AI-native simulation engine that creates synthetic outage environments to predict infrastructure failures before users experience them.
- 4-step horizontal flow: (1) Define Architecture → (2) AI Generates Chaos → (3) Watch It Cascade → (4) AI Post-Mortem
Speaker notes: Users define their system architecture, the AI generates chaos scenarios, BLACKOUT simulates cascading failures in real time, and then auto-generates a post-mortem incident report.

SLIDE 5: INFRASTRUCTURE TOPOLOGY
- Full visual: Network diagram showing 15 nodes in 5 tiers:
  Tier 1: CDN Edge 1 (GLOBAL), CDN Edge 2 (EU-WEST)
  Tier 2: Core Load Balancer (US-EAST)
  Tier 3: API Gateway 1, 2, 3
  Tier 4: Auth Service, User Service, Redis Cache 1, Order Service, Payment Service, Redis Cache 2
  Tier 5: Kafka Queue, Primary Database (US-EAST), Replica Database (US-WEST)
- Stats: "15 Nodes · 4 Regions · 7 Types · 23 Dependencies"
Speaker notes: This is the default topology — a 15-node enterprise-grade network spanning 4 regions with CDN edges, load balancer, API gateways, microservices, caches, queue, and databases.

SLIDE 6: CASCADE ENGINE
- Left: State machine diagram: HEALTHY (cyan, <65%) → STRESSED (yellow, ≥75%) → DEGRADED (orange, ≥92%) → FAILED (red, probability-based)
- Right: Three propagation mechanics:
  (1) Upstream Stress — failed dependencies add +45% load to consumers
  (2) Failover Redistribution — peer failure adds +25% load to survivors
  (3) Compounding Collapse — degraded nodes face 8% + 5%×(failed deps) chance per tick
- Code block: collapse_chance = 0.08 + (failed_dependencies × 0.05)
Speaker notes: The engine uses three simultaneous propagation mechanics creating realistic emergent cascading failures without scripted sequences.

SLIDE 7: CHAOS SCENARIOS
- Three cards side by side:
  (1) TRAFFIC SURGE — 2× traffic multiplier flooding edge nodes (High severity)
  (2) DATABASE FAILURE — Primary DB killed, cascade climbs upward (Critical severity)
  (3) DOMINO OUTAGE — Continuous compounding random failures (Catastrophic severity)
- Bottom: "Plus: Manual node kill · Random fault injection · Custom architecture import"
Speaker notes: Three preset scenarios plus manual controls and custom topology import via JSON.

SLIDE 8: AI INTELLIGENCE — ORION-9
- Heading: "Meet ORION-9 — Your AI SRE Operator"
- Feature 1: Live Commentary — real-time narration every 5 ticks
- Feature 2: Auto Post-Mortem — full incident report on total blackout (Executive Summary, Root Cause Analysis, Impact Assessment, Remediation)
- Fallback chain: Ollama (free/local) → Gemini → OpenAI → Procedural template
- Right visual: Mock terminal showing sample ORION-9 output
Speaker notes: Multi-provider AI fallback chain ensures BLACKOUT works offline with zero API keys. ORION-9 has a cynical, veteran SRE personality.

SLIDE 9: TECH STACK
- Three columns:
  FRONTEND: Next.js 16, React 19, TypeScript, Custom SVG Engine, Tailwind CSS 4, Radix UI, Framer Motion
  BACKEND: FastAPI (Python), Neo4j 5.20, Pydantic, Cypher Queries, Docker Compose
  AI LAYER: Ollama (Gemma2/Phi4), Google Gemini, OpenAI, Procedural Fallback
- Bottom: Architecture flow diagram showing data flow between layers
Speaker notes: Fully custom SVG graph engine with no third-party graph dependencies. Neo4j powers recursive blast-radius computation.

SLIDE 10: LIVE DEMO
- 2×2 grid of screenshot placeholders:
  (1) "Cinematic Landing Page" (2) "Infrastructure Map — Healthy"
  (3) "Cascade In Progress" (4) "ORION-9 Post-Mortem"
- Center overlay: "LIVE DEMO" (large, glowing cyan)
Speaker notes: Transition to live demo — show landing page, start simulation, trigger Database Failure, watch cascade, show AI post-mortem.

SLIDE 11: WHAT MAKES BLACKOUT UNIQUE
- Heading: "Not a chatbot. Not a dashboard. A simulation engine."
- 5 callouts:
  (1) AI generates the chaos, not just the analysis
  (2) Cinematic visualization makes failure viscerally understandable
  (3) Works fully offline — zero API keys needed
  (4) Custom architecture import — test YOUR system
  (5) Neo4j graph-native recursive blast radius computation
Speaker notes: Five differentiators that set BLACKOUT apart from any existing SRE or testing tool.

SLIDE 12: FUTURE ROADMAP
- Timeline with 5 milestones:
  (1) NOW: Neo4j frontend bridge for persistent blast radius
  (2) NEXT: Kubernetes topology auto-import
  (3) PLANNED: Real-time collaborative multiplayer sessions
  (4) PLANNED: Historical simulation replay and comparison
  (5) FUTURE: CI/CD pipeline integration as pre-deploy resilience gate
Speaker notes: Immediate next step is Neo4j bridge. Long-term vision is CI/CD integration where BLACKOUT blocks deploys that fail resilience thresholds.

SLIDE 13: THANK YOU
- Quote: "Predict the outage before the world sees it." (glowing)
- Title: "BLACKOUT"
- Subtitle: "AI-Native Cascading Failure Simulation Engine"
- Team: [Add member names and roles]
- Footer: "Built with ❤️ for the OSC AI Hackathon 2025"
Speaker notes: Thank the audience. Offer live demo and Q&A.
```

---

## PROMPT C — Quick 6-Slide Pitch (for short presentation slots)

```
Create a 6-slide hackathon pitch for "BLACKOUT". Dark cyberpunk theme, cyan and rose accents on #080812 backgrounds, modern monospace typography, glassmorphism cards, no stock photos.

SLIDE 1 — TITLE:
"BLACKOUT" (large, glowing cyan). "Predict the outage before the world sees it." AI-Native Cascading Failure Simulation Engine. OSC AI Hackathon 2025.

SLIDE 2 — PROBLEM + SOLUTION:
Problem: Modern software fails in cascading chains. Traditional testing catches expected bugs, not emergent meltdowns that cascade across dependency chains. Teams discover catastrophic infrastructure collapses only after deployment.
Solution: BLACKOUT is an AI-powered simulation engine that models how software ecosystems collapse BEFORE deployment. Define your architecture → AI generates chaos → watch cascading failures in real time → get an AI post-mortem report.

SLIDE 3 — HOW IT WORKS:
15-node infrastructure topology across 4 regions with 7 service types (CDN, Load Balancer, API Gateway, Microservice, Cache, Queue, Database). Deterministic state machine: Healthy → Stressed → Degraded → Failed. Three chaos scenarios: Traffic Surge (2× load), Database Failure (upstream cascade), Domino Outage (compounding random failures). AI commentary + auto post-mortem via ORION-9 (Ollama / Gemini / OpenAI with offline fallback).

SLIDE 4 — AI INTELLIGENCE:
ORION-9 — a cynical, veteran AI SRE operator. Live narration every 5 simulation ticks. Automatic post-mortem generation on total blackout: Executive Summary, Root Cause Analysis, Impact Assessment, Remediation Tasks. Multi-provider fallback: Ollama (free, local) → Google Gemini → OpenAI → Procedural template. Works with zero API keys.

SLIDE 5 — TECH STACK + WHAT'S UNIQUE:
Frontend: Next.js 16, React 19, Custom SVG Engine (no React Flow), Tailwind CSS 4 cyberpunk theme.
Backend: FastAPI + Neo4j 5.20 graph database + Docker.
AI: Multi-provider (Ollama/Gemini/OpenAI) with procedural fallback.
What's unique: AI generates the chaos (not just analysis). Cinematic visualization. Fully offline. Custom architecture import. Graph-native blast radius.

SLIDE 6 — THANK YOU:
"Not a chatbot. Not a dashboard. A simulation engine."
"BLACKOUT — Predict the outage before the world sees it."
Team: [Your names]
OSC AI Hackathon 2025
```
