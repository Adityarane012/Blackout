---
title: "Quick Start"
description: "Run your first failure simulation in under 5 minutes."
---

Welcome to BLACKOUT. This guide will walk you through the end-to-end process of uploading an architecture graph, triggering a simulation, and interpreting the AI-generated analysis.

## Prerequisites

Before beginning, ensure you have your API key. If you are using the Dashboard, you can find this in your Project Settings. For CLI or programmatic access, export it to your environment:

```bash
export BLACKOUT_API_KEY="sk_test_123456789"
```

## Step 1: Upload Architecture

BLACKOUT requires a model of your infrastructure to simulate against. We call this the Architecture Graph. 

Create a file named `graph.json` representing a simple 3-tier architecture:

```json
{
  "nodes": [
    { "id": "frontend", "type": "web" },
    { "id": "api-gateway", "type": "service" },
    { "id": "primary-db", "type": "database" }
  ],
  "edges": [
    { "source": "frontend", "target": "api-gateway" },
    { "source": "api-gateway", "target": "primary-db" }
  ]
}
```

Upload this graph using the Architectures API:

```bash
curl -X POST https://api.blackout.dev/v1/architectures \
  -H "Authorization: Bearer $BLACKOUT_API_KEY" \
  -H "Content-Type: application/json" \
  -d @graph.json
```

## Step 2: Select a Scenario

With your architecture ingested, you can now inject a synthetic failure. Let's simulate a total outage of the `primary-db`.

We will use the `COMPLETE_OUTAGE` severity, which instructs the engine to mark the target node as entirely unresponsive.

## Step 3: Run the Simulation

Trigger the simulation using the Simulations API. We will target the `primary-db` node.

```bash
curl -X POST https://api.blackout.dev/v1/simulations \
  -H "Authorization: Bearer $BLACKOUT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "target_node_id": "primary-db",
    "severity": "COMPLETE_OUTAGE",
    "duration_ms": 300000
  }'
```

The engine will immediately evaluate the graph. Because `api-gateway` depends on `primary-db`, and `frontend` depends on `api-gateway`, the engine will calculate the probability of the failure propagating upstream.

## Step 4: Observe Propagation

The API response will return the predicted Blast Radius. In our simple graph, the failure of the database causes a cascading outage that takes down the entire system.

```json
{
  "id": "sim_0987654321",
  "status": "completed",
  "target_node_id": "primary-db",
  "predicted_blast_radius": {
    "affected_nodes": ["api-gateway", "frontend"],
    "severity_score": 98,
    "cascade_probability": 0.99
  }
}
```

## Step 5: Review AI Analysis

For a deeper understanding of *why* the failure propagated, you can query the Analysis API. BLACKOUT's AI will reconstruct the dependency chain and provide context.

> The AI identifies that `api-gateway` lacks a circuit breaker. When `primary-db` goes down, `api-gateway` hangs while waiting for timeouts, exhausting its connection pool and subsequently causing `frontend` requests to fail.

## Step 6: Check Reliability Score

Every simulation generates a **Reliability Score** (from 0 to 100). A score of 98 (as seen above in the `severity_score` field) indicates a highly critical architectural weakness.

To improve this score, BLACKOUT's AI will recommend specific Resilience Insights, such as:
1. Implementing a Fallback Cache between the API and Database.
2. Adding strict Timeout Policies on the API Gateway.

---

Congratulations! You've successfully run your first predictive failure simulation. Next, learn more about defining complex [Architecture Uploads](/docs/getting-started/architecture-upload).
