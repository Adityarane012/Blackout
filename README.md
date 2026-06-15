<div align="center">
  <img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" alt="BLACKOUT System" width="220"/>
  <h1>🪐 BLACKOUT</h1>
  <p><strong>Cyberpunk Cascading Failure Simulator & SRE Playground</strong></p>
  <p><i>Chaos Engineering shouldn't mean breaking production.</i></p>
</div>

---

## 📖 Project Overview
**BLACKOUT** is an immersive, high-tension Site Reliability Engineering (SRE) playground and interactive microservice outage simulator. Built with a premium, CRT-scanline cyberpunk aesthetic, it allows developers to map, visualize, and inject chaos into regional system-dependency graphs in **real-time**, entirely safely.

It is a full-stack powerhouse featuring a deterministic simulation engine, an AI graph-analysis heuristic scanner, and dynamic node mapping.

## 🚨 Problem Statement
Modern microservice architectures are incredibly fragile. A single saturated database or a congested Kafka queue can trigger a massive cascading failure that takes down an entire regional grid. 

However, testing for these explosive blast-radius events usually means deploying to a staging environment and manually breaking things, which is expensive, difficult to track, and risky. There is currently no safe, visually intuitive sandbox for developers to rapidly model custom architectures, inject stress, and witness organic failure cascades.

## ✨ Features
* 🗺️ **Visual Infrastructure Map**: Watch a regional system grid spanning `GLOBAL`, `US-EAST`, and `EU-WEST` react to live traffic organically.
* 🧠 **Pre-Simulation AI Intelligence**: Before running a simulation, our Neo4j-backed heuristic engine scans your architecture to identify Single Points of Failure (SPOFs), Critical Hubs, and dangerously deep dependency chains.
* 💥 **Deterministic State-Machine**: Systems organically shift state based on live queue load:
  $$\text{Healthy} \xrightarrow{\text{Load } \ge 75\%} \text{Stress} \xrightarrow{\text{Load } \ge 92\%} \text{Degraded} \xrightarrow{\text{Compounding Chance}} \text{Failure}$$
* 🔧 **Custom Architecture Ingestion**: Instantly drop in a custom JSON microservice map and inject it into the simulator to test your *actual* infrastructure.
* 🤖 **AI-Agent Optimized (Graphify)**: The entire codebase is continuously mapped into an AST knowledge graph (`graphify-out/`), allowing any AI coding assistant to instantly understand the complex full-stack architecture without exceeding token limits!
* 😈 **Chaos Scenario Injection**: Trigger catastrophic events from the operator terminal:
  * *Traffic Surge*: Saturate CDN edges and routing pipelines like it's Black Friday.
  * *Database Failure*: Catastrophically drop core replicas and watch the cascade.
  * *Targeted Faults*: Inject latency spikes, packet loss, or DB saturation onto specific nodes.

## 💻 Tech Stack
* **Frontend**: Next.js 14, React, Tailwind CSS, Lucide Icons, Framer Motion
* **Backend**: Python 3.10+, FastAPI, Uvicorn
* **Database**: Neo4j (Graph Database for topology mapping and AI queries)
* **Authentication**: Clerk (Multi-tenant architecture scoping)

## 🛠️ Setup Instructions

### 1. Requirements
* Node.js (version 18+)
* Python (version 3.10+)
* Neo4j Database (Local desktop or AuraDB)

### 2. Configure Environment Keys
Create a `.env.local` file at the root of the project:
```env
# User Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Neo4j Graph Database (Required for AI Pre-Scan & Trace Logging)
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
```

### 3. Start the Backend Simulation Engine
**For Windows Users:**
We built an automated setup script that creates your `.venv`, installs dependencies, and boots the FastAPI server. Just run:
```cmd
start_backend.bat
```

**For Mac/Linux Users:**
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

### 4. Start the Frontend Operator Dashboard
In a new terminal window:
```bash
npm install
npm run dev
```
Open **[http://localhost:3000/simulator](http://localhost:3000/simulator)**, authenticate, and enter the grid.

## 👤 Team Details
* **Aditya Rane** - Solo Developer
  * Full-Stack Engineering, Graph Database Architecture, and UI/UX Design.

## 🔗 Demo Link
* **Live Deployment:** `[I will provide later]`
* **Video Presentation:** `[I will provide later]`

---
<div align="center">
  <br/>
  <i>"May your uptimes be high and your blast radii small."</i>
</div>
