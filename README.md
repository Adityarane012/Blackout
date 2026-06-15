<div align="center">
  <img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" alt="BLACKOUT System" width="220"/>
  <h1>🪐 BLACKOUT</h1>
  <p><strong>Cyberpunk Cascading Failure Simulator & SRE Playground</strong></p>
  <p><i>Predict the cascade before the world sees it.</i></p>
</div>

---

## 📖 Project Overview
**BLACKOUT** is an immersive, high-tension Site Reliability Engineering (SRE) playground and interactive microservice outage simulator. Built with a premium, CRT-scanline cyberpunk aesthetic, it allows developers to mathematically model, visualize, and inject chaos into regional system-dependency graphs in **real-time**, entirely safely.

Unlike traditional chaos engineering that requires dangerously breaking staging environments, BLACKOUT operates purely on mathematical architecture Digraphs. It features a deterministic simulation engine and an advanced **Neo4j Graph Heuristics Scanner** to calculate cascading blast radii instantly.

## 🚨 Problem Statement
Modern microservice architectures are incredibly fragile. A single saturated database or a congested Kafka queue can trigger a massive cascading failure that takes down an entire regional grid. 

However, predicting how a failure in Service A affects Service D requires more than just load testing—it requires deep architectural modeling. Currently, there is no safe, visually intuitive sandbox for developers to rapidly model custom architectures, inject stress, and witness organic failure cascades without actually breaking their systems.

## ✨ Features
* 🗺️ **Visual Infrastructure Map**: Watch a regional system grid spanning `GLOBAL`, `US-EAST`, and `EU-WEST` react to live traffic organically using a custom SVG engine.
* 🧠 **Deterministic Graph Intelligence**: Before running a simulation, our Neo4j backend runs deep Cypher queries to scan your architecture. It mathematically identifies Single Points of Failure (SPOFs), Bottlenecks, and dangerously deep dependency chains—**zero LLM hallucinations, just pure graph heuristics.**
* 💥 **Cascading State-Machine**: Systems organically shift state based on live queue load:
  $$\text{Healthy} \xrightarrow{\text{Load } \ge 75\%} \text{Stress} \xrightarrow{\text{Load } \ge 92\%} \text{Degraded} \xrightarrow{\text{Compounding Chance}} \text{Failure}$$
* 🔧 **Custom Architecture Ingestion**: Instantly drop in a custom JSON microservice map and inject it into the simulator to test your *actual* infrastructure.
* 🤖 **AI-Agent Optimized (Graphify)**: The codebase is continuously mapped into an AST knowledge graph (`graphify-out/`), allowing any AI coding assistant to instantly understand the full-stack architecture.
* 😈 **Chaos Scenario Injection**: Trigger catastrophic events from the operator terminal:
  * *Traffic Surge*: Saturate CDN edges and routing pipelines like it's Black Friday.
  * *Database Failure*: Catastrophically drop core replicas and watch the cascade.
  * *Targeted Faults*: Inject latency spikes or packet loss onto specific nodes.

## 💻 Tech Stack
* **Frontend**: Next.js 14, React, Tailwind CSS, Lucide Icons, Framer Motion
* **Backend**: Python 3.12, FastAPI, Uvicorn, Pydantic 2.7+
* **Database**: Neo4j (Mathematical Graph Modeling for topology and heuristics)
* **Authentication**: Clerk (Multi-tenant architecture scoping)

## 🛠️ Setup Instructions

### 1. Requirements
* Node.js (version 18+)
* Python (version 3.11/3.12)
* Neo4j Database (Local Desktop or free AuraDB cloud instance)

### 2. Configure Environment Keys
Create a `.env.local` file at the root of the project:
```env
# 1. Clerk User Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# 2. Neo4j Graph Database
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
```

### 3. Start the Backend Simulation Engine
**For Windows Users:**
We built an automated script that creates your `.venv`, installs the prebuilt dependencies, and boots the FastAPI server:
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
* **Aditya Rane** (Solo)
  * Full-Stack Engineering, Graph Database Architecture, SRE Modeling, UI/UX Design.

## 🔗 Demo Link
* **Live Deployment:** `[I will provide later]`
* **Video Presentation:** `[I will provide later]`

---
<div align="center">
  <br/>
  <i>"May your uptimes be high and your blast radii small."</i>
</div>
