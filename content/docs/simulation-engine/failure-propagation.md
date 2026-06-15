---
title: "Failure Propagation"
description: "The flagship engine driving BLACKOUT's predictive cascade simulations."
---

The **Failure Propagation Engine** is the core technological differentiator of the BLACKOUT platform. While traditional monitoring tools tell you when a node has failed, and chaos engineering tools physically break nodes to see what happens, BLACKOUT mathematically *predicts* how a localized failure will spread across your entire architecture graph.

Understanding how this engine traverses dependencies and calculates cascading degradation is essential for mastering the platform.

## How Failures Spread

In distributed systems, failures rarely occur in isolation. Because services rely on each other via network calls, a failure in one component almost always impacts the components that depend on it.

The Propagation Engine operates on a fundamental principle: **Failures travel upstream.**

When a database crashes, the database itself is the root cause. But the *impact* of that crash immediately travels upstream to the API that was trying to query it. If the API cannot handle the database timeout gracefully, the API crashes. The failure then travels upstream again, hitting the frontend application that was waiting on the API. 

## Dependency Traversal Mechanics

When a simulation is triggered via the API (e.g., injecting a `COMPLETE_OUTAGE` into `database-primary`), the engine initializes the traversal algorithm:

1. **State Injection:** The engine marks `database-primary` as `FAILED` at `T=0`.
2. **Inbound Edge Discovery:** The engine queries the Architecture Graph for all directed edges where `target == "database-primary"`.
3. **Probability Calculation:** For each source node discovered (e.g., `auth-service`, `billing-service`), the engine calculates the probability of state degradation. 
4. **State Mutation:** Based on the calculation, the upstream nodes are transitioned to `STRESSED`, `DEGRADED`, or `FAILED`.
5. **Recursive Traversal:** The engine repeats the process, treating the newly degraded nodes as the new targets, discovering their upstream dependents, and calculating further spread.

The simulation halts when no further upstream nodes can be degraded, or when the failure reaches a `frontend` node (the top of the stack).

## Cascading Degradation & Timeline Example

Let's walk through a full simulation timeline to visualize how the engine models a cascade.

**The Graph:**
`Mobile App` → `API Gateway` → `Auth Service` → `User Database`

**The Scenario:** 
A `LATENCY_SPIKE` (5000ms delay) is injected into the `User Database`.

### T = 0ms (Injection)
The engine flags the `User Database` as `STRESSED`. The database is not offline, but it is incredibly slow.

### T = 500ms (Propagation Step 1)
The engine discovers the `Auth Service` depends on the database. Because the scenario is a severe latency spike, the AI predicts that the `Auth Service` will begin holding open HTTP connections while waiting for the database to respond. 
- `Auth Service` transitions to `STRESSED`.

### T = 2000ms (Propagation Step 2)
As the `Auth Service` holds connections open, its thread pool begins to saturate. It stops accepting new requests from the `API Gateway`. The engine evaluates the `API Gateway`.
- `API Gateway` transitions to `DEGRADED`. It is now throwing HTTP 504 Gateway Timeouts to clients.

### T = 5000ms (Propagation Step 3)
The `Mobile App` receives the 504 errors. Unlike backend services, frontends rarely crash entirely from API errors. The engine calculates a high probability that the app remains open but unusable.
- `Mobile App` transitions to `DEGRADED`. 

### T = 10000ms (The Retry Storm)
The engine simulates client behavior. The `Mobile App`, experiencing errors, begins aggressively retrying the login request. This floods the `API Gateway` with 10x the normal traffic. The `API Gateway`, already degraded, passes this traffic to the `Auth Service`. The `Auth Service` completely exhausts its memory and crashes.
- `Auth Service` transitions to `FAILED`.
- `API Gateway` transitions to `FAILED` (due to total upstream loss).

## Visualizing Graph Propagation

During a simulation, the BLACKOUT dashboard provides a visual timeline of this exact propagation chain. You can scrub back and forth through the timeline to see exactly *when* and *why* a node transitioned from `STRESSED` to `FAILED`.

By analyzing these propagation chains *before* they happen in real life, your engineering team can implement circuit breakers, fallback caches, and strict timeout policies at the exact points in the graph where the cascade is most vulnerable to being stopped.
