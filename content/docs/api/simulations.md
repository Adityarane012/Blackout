---
title: "Simulations API"
description: "Endpoints for triggering and managing failure cascades."
---

The Simulations API is the core of the BLACKOUT platform. It allows you to inject synthetic failures into your uploaded architectures and calculates the deterministic propagation of that failure across your dependency graph.

---

## Trigger a Simulation

<div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
  <span className="font-mono text-xs font-bold px-2 py-1 rounded border text-green-400 bg-green-500/10 border-green-500/20">POST</span>
  <span className="font-mono text-sm text-foreground">/v1/simulations</span>
</div>

Initiates a predictive failure cascade on your specified infrastructure target. The engine evaluates the graph and returns the predicted blast radius.

### Request Body

`architecture_id` **string** *Required*
The ID of the Architecture Graph to simulate against.

`target_node_id` **string** *Required*
The unique identifier of the node where the initial failure should be injected (e.g., `primary-db`).

`severity` **enum** *Required*
The intensity of the injected failure. 
- `LATENCY_SPIKE`: Injects a random delay.
- `CONNECTION_DROP`: Refuses inbound connections.
- `COMPLETE_OUTAGE`: Total node unresponsiveness.

`duration_ms` **integer** *Optional*
The length of the simulation time-window. Defaults to `300000` (5 minutes).

### Example Request

```json language-bash
curl -X POST https://api.blackout.dev/v1/simulations \
  -H "Authorization: Bearer sk_test_123" \
  -H "Content-Type: application/json" \
  -d '{
    "architecture_id": "arch_9x8y7z",
    "target_node_id": "primary-db",
    "severity": "COMPLETE_OUTAGE",
    "duration_ms": 300000
  }'
```

### Response

The API immediately returns the result of the deterministic cascade algorithm.

```json
{
  "id": "sim_abc123",
  "object": "simulation",
  "status": "completed",
  "target_node_id": "primary-db",
  "predicted_blast_radius": {
    "affected_nodes": ["api-gateway", "frontend-app"],
    "severity_score": 92,
    "cascade_probability": 0.99
  }
}
```

---

## Retrieve a Simulation

<div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
  <span className="font-mono text-xs font-bold px-2 py-1 rounded border text-blue-400 bg-blue-500/10 border-blue-500/20">GET</span>
  <span className="font-mono text-sm text-foreground">/v1/simulations/{id}</span>
</div>

Retrieves the details of a past simulation run. This is useful for fetching historical Reliability Scores for CI/CD integration checks.

### Parameters

`id` **string** *Required*
The unique identifier of the simulation.
