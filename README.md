# 🪐 BLACKOUT: Cyberpunk Cascading Failure SRE Simulator

<p align="center">
  <img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" alt="BLACKOUT System" width="220"/>
</p>

**BLACKOUT** is an immersive, high-tension Site Reliability Engineering (SRE) playground and interactive microservice outage simulator. Built with a premium, CRT-scanline cyberpunk aesthetic, it allows developers to model, visualize, and inject chaos into a regional system-dependency map in real time. 

> [!NOTE]
> This is a **pure frontend sandbox simulation**. It runs entirely client-side inside the browser. It executes **no** destructive terminal commands or system-level scripts that could impact your physical computer or hardware.

---

## ⚡ Key Features

* **Visual Infrastructure Map**: A 15-node regional system grid spanning `GLOBAL`, `US-EAST`, `US-WEST`, and `EU-WEST` regions, mapping edges, load balancers, api-gateways, compute servers, cache servers, Kafka queues, and databases.
* **Deterministic State-Machine**: Systems organically shift state based on live queue load:
  $$\text{Healthy} \xrightarrow{\text{Load } \ge 75\%} \text{Stress} \xrightarrow{\text{Load } \ge 92\%} \text{Degraded} \xrightarrow{\text{Compounding Chance}} \text{Failure}$$
* **Stress Propagation Engine**: Simulates realistic upstream database outage pressure on servers, cache-miss storms, and automatic load redistribution/failover across active redundant compute clusters.
* **AI Telemetry & operator logs (ORION-9)**: Live telemetry commentary `/api/commentary` and full post-mortem generator `/api/analyze` leveraging **Ollama (local Gemma2/Phi4)**, **Google Gemini**, or **OpenAI** API endpoints with a robust, offline procedural fallback script.
* **Chaos Scenario Injection**: Trigger system events from the operator terminal:
  * *Traffic Surge*: Satures CDN edges and routing pipelines.
  * *Database Failure*: Catastrophically drops core replicas, starting cascade chains.
  * *Domino Outage*: Initiates continuous, compounding outages across randomly connected adjacent dependencies.

---

## 🏗 System Topology Architecture

The simulation simulates an enterprise-grade high-availability network topology:

```mermaid
graph TD
    classDef cdn fill:#00ffff,stroke:#00cccc,stroke-width:2px,color:#000
    classDef lb fill:#00ff00,stroke:#00cc00,stroke-width:2px,color:#000
    classDef api fill:#ffff00,stroke:#cccc00,stroke-width:2px,color:#000
    classDef srv fill:#ff9900,stroke:#cc7700,stroke-width:2px,color:#000
    classDef cache fill:#ff00ff,stroke:#cc00cc,stroke-width:2px,color:#000
    classDef queue fill:#9900ff,stroke:#7700cc,stroke-width:2px,color:#000
    classDef db fill:#ff0000,stroke:#cc0000,stroke-width:2px,color:#fff

    cdn-1["Edge 1 (CDN)"]:::cdn
    cdn-2["Edge 2 (CDN)"]:::cdn
    lb-1["Core Load Balancer"]:::lb
    api-1["API Gateway 1"]:::api
    api-2["API Gateway 2"]:::api
    api-3["API Gateway 3"]:::api
    srv-1["Auth Service"]:::srv
    srv-2["User Service"]:::srv
    srv-3["Order Service"]:::srv
    srv-4["Payment Service"]:::srv
    cache-1["Redis Cache 1"]:::cache
    cache-2["Redis Cache 2"]:::cache
    queue-1["Kafka Queue"]:::queue
    db-1["Primary Database"]:::db
    db-2["Replica Database"]:::db

    cdn-1 --> lb-1
    cdn-2 --> lb-1
    lb-1 --> api-1
    lb-1 --> api-2
    lb-1 --> api-3
    api-1 --> srv-1
    api-1 --> srv-2
    api-1 --> cache-1
    api-2 --> srv-2
    api-2 --> srv-3
    api-2 --> cache-1
    api-3 --> srv-3
    api-3 --> srv-4
    api-3 --> cache-2
    srv-1 --> db-1
    srv-1 --> queue-1
    srv-2 --> db-1
    srv-2 --> cache-1
    srv-3 --> db-2
    srv-3 --> queue-1
    srv-4 --> db-2
    srv-4 --> queue-1
    cache-1 --> db-1
    cache-2 --> db-2
    queue-1 --> db-1
    queue-1 --> db-2
```

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies
Ensure you have Node.js (version 18+) installed:
```bash
npm install
```

### 2. Configure Environment Keys (Optional)
Create a `.env.local` file at the root of the project to enable advanced AI SRE operator intelligence:
```env
# Cloud AI Credentials
GEMINI_API_KEY=your_google_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```
*(If no API keys are provided, the simulator seamlessly uses your local **Ollama** engine at `http://localhost:11434` or falls back to an atmospheric offline procedural generation script!)*

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** or **[http://localhost:3000/simulator](http://localhost:3000/simulator)** to operate the grid.

---

## 🛠 Developer Tuning: Mitigating Windows CPU/Disk Spikes

When running Next.js development servers on Windows, local antivirus tools (such as **Windows Defender**) can conflict with the compiler's rapid file caching, causing `100% CPU/Disk` spikes. To resolve this:

1. **Add a Defender Exclusion**:
   * Open **Windows Security** > **Virus & threat protection settings** > **Exclusions** (Add or remove exclusions).
   * Click **Add an exclusion** > **Folder**, and select this project directory.
2. **Exclude Build Artifiacts**:
   * In `tsconfig.json`, the generated graphify folders and next caches are excluded to avoid background type-scanning routines:
     ```json
     "exclude": [
       "node_modules",
       "graphify-out",
       ".next"
     ]
     ```

---

## 📂 Codebase Navigation & Architecture

For a deep dive into the simulation architecture, check out the documentation:
* 📄 **[Technical Requirements Document](Docs/Technical%20Requirements%20Document%20(TRD).md)**
* 📄 **[Backend Schema](Docs/Backend%20Schema.md)**
