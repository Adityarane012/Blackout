# Product Flow Overview

BLACKOUT is designed around a single core experience:

> Upload architecture → simulate outage → visualize collapse → analyze failure.

The app flow should feel:

- fast
    
- cinematic
    
- interactive
    
- easy to understand instantly
    

The user journey must prioritize:

- visual storytelling
    
- simulation immersion
    
- AI-powered reasoning
    

NOT enterprise complexity.

---

# 1. High-Level App Flow

```text
Landing Page
      ↓
Architecture Setup
      ↓
Scenario Selection
      ↓
Simulation Initialization
      ↓
Live Cascade Simulation
      ↓
AI Failure Analysis
      ↓
Reliability Dashboard
      ↓
Replay / New Simulation
```

---

# 2. Detailed User Flow

---

# SCREEN 1 — Landing Page

## Purpose

Introduce BLACKOUT and immediately communicate:

> “AI predicts software collapse before deployment.”

---

## UI Components

### Hero Section

- animated infrastructure graph background
    
- moving traffic pulses
    
- subtle outage effects
    

---

### Main CTA

```text
[ Start Simulation ]
```

---

### Supporting Copy

- Predict cascading failures
    
- AI-generated outage scenarios
    
- Visualize infrastructure collapse
    

---

## User Actions

|Action|Result|
|---|---|
|Start Simulation|opens architecture setup|

---

# SCREEN 2 — Architecture Setup

## Purpose

User defines the software system to simulate.

---

# Option A — Upload Architecture

User uploads:

- JSON architecture file
    

---

# Option B — Use Template

Prebuilt templates:

- ecommerce app
    
- SaaS platform
    
- streaming system
    
- fintech system
    

---

## UI Layout

```text
┌────────────────────┐
│ Architecture Input │
├────────────────────┤
│ Upload JSON        │
│ OR                 │
│ Select Template    │
└────────────────────┘
```

---

## Backend Actions

- validate architecture
    
- generate graph structure
    
- initialize nodes/edges
    

---

## Success Result

User proceeds to scenario selection.

---

# SCREEN 3 — Infrastructure Graph Preview

## Purpose

Show uploaded system before simulation begins.

---

## UI Components

- interactive graph canvas
    
- services
    
- APIs
    
- DBs
    
- queues
    
- dependencies
    

---

## Graph Features

- zoom/pan
    
- hover node info
    
- dependency highlighting
    

---

## User Actions

|Action|Result|
|---|---|
|Continue|opens scenario selection|

---

# SCREEN 4 — Scenario Selection

## Purpose

User selects outage type.

---

## Scenario Options

### Predefined

- Black Friday Traffic
    
- Retry Storm
    
- Database Saturation
    
- API Dependency Failure
    
- Cache Collapse
    

---

### AI Generated

```text
[ Generate Random Chaos ]
```

---

## Scenario Card Example

```text
┌──────────────────────────┐
│ Black Friday Traffic     │
│ Massive frontend spikes  │
│ Queue congestion risks   │
└──────────────────────────┘
```

---

## Backend Actions

- generate simulation config
    
- initialize propagation logic
    
- prepare event timeline
    

---

# SCREEN 5 — Simulation Initialization

## Purpose

Build anticipation before collapse begins.

---

## UI

- graph pulses
    
- loading effects
    
- “Analyzing dependencies...”
    
- “Generating synthetic chaos...”
    

---

## AI Actions

- create outage narrative
    
- identify likely weak points
    
- prepare analysis prompts
    

---

# SCREEN 6 — LIVE CASCADE SIMULATION

# MOST IMPORTANT SCREEN

This is the product.

---

# Purpose

Visualize real-time infrastructure collapse.

---

# Main Layout

```text
┌──────────────────────────────────────┐
│ Infrastructure Graph                 │
│                                      │
│   LIVE FAILURE PROPAGATION           │
│                                      │
├──────────────────────────────────────┤
│ AI Analysis Panel                    │
├──────────────────────────────────────┤
│ Reliability Metrics                  │
└──────────────────────────────────────┘
```

---

# Graph Behaviors

## Healthy State

- blue/green nodes
    
- smooth traffic pulses
    

---

## Stress State

- yellow/orange glow
    
- increased pulse speed
    

---

## Failure State

- red flashing nodes
    
- broken edge animations
    
- overload indicators
    

---

# Failure Propagation Example

```text
Frontend Overload
      ↓
Auth Latency
      ↓
Retry Storm
      ↓
Queue Congestion
      ↓
Database Failure
```

---

# Simulation Events

|Event|Visual|
|---|---|
|load increase|node glow|
|latency spike|pulse distortion|
|queue congestion|edge buildup|
|service failure|red flash|
|dependency collapse|cascading spread|

---

# AI Analysis Panel (Live)

AI dynamically displays:

- root causes
    
- propagation explanations
    
- bottleneck observations
    

---

## Example

```text
"Retry amplification is increasing pressure
on the authentication service."
```

---

# Reliability Dashboard

Displays:

- resilience score
    
- outage severity
    
- affected systems
    
- critical bottlenecks
    

---

# SCREEN 7 — Final Analysis Report

## Purpose

Summarize collapse.

---

# Sections

## Root Cause

Why the outage happened.

---

## Failure Chain

Ordered propagation timeline.

---

## Bottlenecks

Weakest infrastructure points.

---

## Suggested Improvements

Optional recommendations:

- caching
    
- circuit breakers
    
- queue isolation
    

---

# Example Layout

```text
┌──────────────────────────────┐
│ Root Cause Analysis          │
├──────────────────────────────┤
│ Failure Timeline             │
├──────────────────────────────┤
│ Bottlenecks                  │
├──────────────────────────────┤
│ Resilience Score             │
└──────────────────────────────┘
```

---

# SCREEN 8 — Replay / New Simulation

## Purpose

Encourage repeated experimentation.

---

# Actions

|Action|Result|
|---|---|
|Replay Simulation|rerun animation|
|Generate New Chaos|create new scenario|
|Upload New Architecture|restart flow|

---

# 3. Backend Flow

```text
Upload Architecture
        ↓
Validate Graph
        ↓
Generate Scenario
        ↓
Initialize Simulation
        ↓
Run Tick Engine
        ↓
Propagate Failures
        ↓
Push Live Updates
        ↓
Generate AI Analysis
        ↓
Calculate Metrics
        ↓
Return Final Report
```

---

# 4. Frontend State Flow

```text
Idle
 ↓
Architecture Loaded
 ↓
Scenario Selected
 ↓
Simulation Running
 ↓
Failure Propagation
 ↓
Simulation Complete
 ↓
Analysis Generated
```

---

# 5. Core UX Priorities

---

# Highest Priority

|Feature|Importance|
|---|---|
|cascade visualization|critical|
|graph animations|critical|
|simulation smoothness|critical|
|AI explanations|high|

---

# Medium Priority

|Feature|Importance|
|---|---|
|dashboards|medium|
|architecture upload|medium|
|metrics|medium|

---

# Lowest Priority

|Feature|Importance|
|---|---|
|authentication|low|
|user accounts|low|
|persistence|low|

---

# 6. Critical Demo Flow

This is the EXACT flow judges should see.

---

# Demo Script

## Step 1

Open BLACKOUT.

Animated infrastructure visible.

---

## Step 2

Upload ecommerce architecture.

---

## Step 3

Select:

```text
Black Friday Traffic
```

---

## Step 4

Simulation starts.

Graph begins destabilizing.

---

## Step 5

Failures propagate live.

Nodes progressively collapse.

---

## Step 6

AI explains:

```text
"Authentication retries amplified
database congestion."
```

---

## Step 7

Dashboard displays:

- resilience score
    
- outage severity
    
- bottleneck systems
    

---

# 7. Final UX Philosophy

BLACKOUT should feel like:

- a futuristic infrastructure simulator
    
- an AI-powered digital twin
    
- a cinematic software collapse engine
    

NOT:

- a dashboard
    
- a monitoring tool
    
- an analytics portal
    

The user should feel:

> “I’m watching an entire software ecosystem collapse in real time.”