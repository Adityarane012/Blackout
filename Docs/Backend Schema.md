## Recommended Stack

- FastAPI
    
- Pydantic
    
- Python
    
- In-memory state / Redis optional
    

For hackathon:

> Keep DB minimal.

You honestly may not even need PostgreSQL.

JSON + in-memory simulation state is enough.

---

# 1. Core Architecture

Backend revolves around:

```text
Architecture
    ↓
Scenario
    ↓
Simulation Engine
    ↓
Node State Updates
    ↓
AI Analysis
    ↓
Metrics Output
```

---

# 2. Main Backend Entities

You only really need:

|Entity|Purpose|
|---|---|
|Architecture|uploaded system graph|
|Node|services/components|
|Edge|dependencies|
|Scenario|outage simulation config|
|Simulation|active run|
|Event|propagation step|
|Metrics|reliability scoring|
|AIAnalysis|generated reasoning|

That’s it.

---

# 3. Folder Structure

```text
backend/
│
├── app/
│   ├── main.py
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── simulation/
│   ├── ai/
│   ├── metrics/
│   └── utils/
│
├── requirements.txt
└── .env
```

---

# 4. Core Pydantic Schemas

---

# 4.1 Node Schema

```python
from pydantic import BaseModel
from typing import Optional

class Node(BaseModel):
    id: str
    label: str
    type: str
    status: str = "healthy"

    capacity: int = 100
    load: int = 0

    critical: bool = False

    latency_ms: Optional[int] = 0
    error_rate: Optional[float] = 0.0
```

---

# Supported Node Types

```python
NODE_TYPES = [
    "frontend",
    "service",
    "database",
    "queue",
    "cache",
    "external_api"
]
```

---

# Supported Status Types

```python
STATUS_TYPES = [
    "healthy",
    "stressed",
    "degraded",
    "failed"
]
```

---

# 4.2 Edge Schema

```python
class Edge(BaseModel):
    source: str
    target: str

    dependency_weight: float = 1.0

    traffic_flow: int = 0
```

---

# 4.3 Architecture Schema

```python
from typing import List

class Architecture(BaseModel):
    architecture_id: str
    name: str

    nodes: List[Node]
    edges: List[Edge]
```

---

# Example Architecture

```json
{
  "architecture_id": "arch_001",
  "name": "Ecommerce Platform",
  "nodes": [
    {
      "id": "frontend",
      "label": "Frontend",
      "type": "frontend"
    },
    {
      "id": "auth",
      "label": "Auth Service",
      "type": "service"
    }
  ],
  "edges": [
    {
      "source": "frontend",
      "target": "auth"
    }
  ]
}
```

---

# 5. Scenario Schema

This is IMPORTANT.

Scenarios drive everything.

---

# Scenario Model

```python
from typing import List

class Scenario(BaseModel):
    scenario_id: str

    name: str
    description: str

    trigger_node: str

    traffic_multiplier: float = 1.0

    propagation_speed: int = 1

    chaos_events: List[str]

    duration_seconds: int = 30
```

---

# Example Scenario

```json
{
  "scenario_id": "scn_001",
  "name": "Black Friday Traffic",
  "trigger_node": "frontend",
  "traffic_multiplier": 5.0,
  "chaos_events": [
    "retry_storm",
    "queue_congestion"
  ]
}
```

---

# 6. Simulation Schema

Tracks active simulations.

---

# Simulation Model

```python
from datetime import datetime
from typing import Optional

class Simulation(BaseModel):
    simulation_id: str

    architecture_id: str
    scenario_id: str

    state: str = "running"

    started_at: datetime
    ended_at: Optional[datetime] = None

    current_tick: int = 0
```

---

# Simulation States

```python
SIMULATION_STATES = [
    "running",
    "paused",
    "completed",
    "failed"
]
```

---

# 7. Event Schema

This powers cascading failures.

---

# Event Model

```python
class SimulationEvent(BaseModel):
    tick: int

    node_id: str

    previous_status: str
    new_status: str

    load_change: int

    reason: str
```

---

# Example Event

```json
{
  "tick": 3,
  "node_id": "auth_service",
  "previous_status": "healthy",
  "new_status": "degraded",
  "load_change": 80,
  "reason": "Retry storm amplification"
}
```

---

# 8. AI Analysis Schema

---

# AI Analysis Model

```python
class AIAnalysis(BaseModel):
    simulation_id: str

    root_cause: str

    failure_chain: List[str]

    bottlenecks: List[str]

    recommendations: List[str]

    severity: str
```

---

# Example AI Output

```json
{
  "root_cause": "Authentication retries amplified database congestion.",
  "failure_chain": [
    "Frontend overload",
    "Auth slowdown",
    "Retry amplification",
    "DB saturation"
  ],
  "bottlenecks": [
    "Auth Service",
    "Primary Database"
  ]
}
```

---

# 9. Metrics Schema

---

# Metrics Model

```python
class Metrics(BaseModel):
    simulation_id: str

    resilience_score: int

    outage_severity: int

    failed_services: int

    degraded_services: int

    bottleneck_index: float
```

---

# Reliability Formula

R = 100 - (F \times 10 + D \times 5 + C \times 15)

---

# 10. API Response Schemas

---

# Simulation Start Response

```python
class SimulationStartResponse(BaseModel):
    simulation_id: str

    status: str

    message: str
```

---

# Live Simulation State Response

```python
class SimulationStateResponse(BaseModel):
    simulation_id: str

    current_tick: int

    nodes: List[Node]

    events: List[SimulationEvent]

    metrics: Metrics
```

---

# 11. Backend Simulation Logic

You do NOT need real infra simulation.

Just believable propagation.

---

# Simple Propagation Logic

```python
for edge in architecture.edges:

    source = get_node(edge.source)
    target = get_node(edge.target)

    if source.status == "failed":
        target.load += 40

    if target.load > target.capacity:
        target.status = "degraded"
```

---

# 12. Suggested Storage Strategy

For hackathon:

|Data|Storage|
|---|---|
|architectures|JSON|
|simulations|in-memory|
|events|in-memory|
|AI analysis|temporary|
|metrics|calculated live|

You probably do NOT need:

- PostgreSQL
    
- MongoDB
    
- Redis clusters
    

Unless:

- you have extra time
    

---

# 13. WebSocket Support (IMPORTANT)

You SHOULD use WebSockets.

Because:

- live graph updates
    
- smoother simulation
    
- real-time propagation
    

---

# WebSocket Event Payload

```json
{
  "tick": 4,
  "node_id": "payment_service",
  "status": "failed",
  "load": 180
}
```

---

# Recommended Backend Flow

```text
Upload Architecture
        ↓
Generate Scenario
        ↓
Start Simulation
        ↓
Run Tick Engine
        ↓
Propagate Failures
        ↓
Push WebSocket Updates
        ↓
Generate AI Analysis
        ↓
Return Metrics
```

---

# 14. Minimal Database Tables (IF USING DB)

Honestly:  
You only need 3.

---

# architectures

|field|type|
|---|---|
|id|string|
|name|string|
|graph_json|json|

---

# simulations

|field|type|
|---|---|
|id|string|
|architecture_id|string|
|scenario_name|string|
|state|string|

---

# analyses

|field|type|
|---|---|
|simulation_id|string|
|analysis_json|json|

---

# 15. Final Honest Recommendation

Your backend should stay:

- lightweight
    
- event-driven
    
- simulation-focused
    

Do NOT:

- overengineer infra
    
- build real chaos systems
    
- waste time on databases
    

Your backend exists ONLY to support:

> the visual simulation experience.