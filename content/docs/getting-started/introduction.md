---
title: "Introduction to BLACKOUT"
description: "Understand the core concepts of predictive failure simulation."
---

# What is BLACKOUT?

BLACKOUT is an AI-powered infrastructure failure simulation platform designed to predict cascading software outages *before* they hit production. 

Unlike traditional chaos engineering tools that randomly terminate instances or drop network packets in live environments, BLACKOUT operates safely on imported architecture graphs. It uses deterministic graph traversal and AI models trained on historical post-mortems to predict how a localized failure (like a database timeout) will propagate through your microservices.

## Why BLACKOUT Exists

Modern cloud architectures are deeply interconnected. A minor latency spike in an authentication service can trigger a retry storm in an API gateway, eventually bringing down a payment processing queue. 

Testing for these cascading failures in a live production environment is extremely risky and often causes the exact outages engineers are trying to prevent. Staging environments, on the other hand, rarely replicate the complex traffic patterns and scale of production.

BLACKOUT bridges this gap. By operating on a digital twin of your infrastructure (an **Architecture Graph**), it allows engineering teams to safely, repeatedly, and programmatically simulate catastrophic failures.

> BLACKOUT answers the question: "If Service A fails during Black Friday traffic, what happens to Service B, C, and D?"

## Core Workflow

Using BLACKOUT involves three primary steps:

### 1. Architecture Upload
You begin by uploading a definition of your infrastructure. This is represented as a JSON-based Dependency Graph, where nodes represent services (databases, queues, APIs) and edges represent dependencies and network paths.

### 2. Scenario Simulation
Once your graph is ingested, you select a node and inject a failure state (e.g., `LATENCY_SPIKE`, `COMPLETE_OUTAGE`). The **Simulation Engine** immediately calculates the deterministic propagation of that failure across your architecture.

### 3. AI Analysis
After the simulation runs, BLACKOUT's AI engine analyzes the cascade path. It identifies critical bottlenecks, generates a **Reliability Score**, and provides actionable resilience patterns (like adding circuit breakers or decoupling specific queues) to mitigate the predicted blast radius.

## Key Concepts

To effectively use BLACKOUT, you should familiarize yourself with these core concepts:

- **Nodes:** Individual components of your architecture (e.g., a Postgres database, a Redis cache, an Express API).
- **Edges:** The dependency links between nodes. If Service A makes a network call to Service B, there is a directional edge from A to B.
- **Simulation State:** The health status of a node during a simulation run (`HEALTHY`, `STRESSED`, `DEGRADED`, `FAILED`).
- **Blast Radius:** The total collection of nodes that ultimately transition to a `FAILED` or `DEGRADED` state as a result of the initial injected failure.

## Typical Use Cases

Engineering teams use BLACKOUT to:

1. **Validate Resilience Patterns:** Prove that a newly implemented circuit breaker actually stops a retry storm before deploying it.
2. **Disaster Recovery Planning:** Simulate entire region outages to ensure failover logic routes traffic correctly.
3. **CI/CD Integration:** Automatically fail builds if a new architecture change reduces the overall system Reliability Score.
4. **Post-Mortem Reconstruction:** Model a previous production outage to understand how it spread and ensure mitigations are effective.

---

Ready to get started? Head over to the [Quick Start](/docs/getting-started/quick-start) guide to run your first simulation.
