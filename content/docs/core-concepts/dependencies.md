---
title: "Dependencies"
description: "Understanding direct vs indirect dependencies and critical paths."
---

In BLACKOUT, dependencies are the arteries through which failure flows. Properly understanding and modeling dependencies is the key to extracting accurate predictive value from your simulations.

## Types of Dependencies

When evaluating a graph, the AI engine categorizes dependencies into two primary groups: Direct and Indirect.

### Direct Dependencies

A direct dependency occurs when Node A immediately relies on Node B to function. In the graph JSON, this is represented by a single edge connecting the two nodes.

**Example:**
`Service → Database`
If the user service queries a Postgres database to authenticate a session, the user service has a *direct* dependency on that database. If the database goes down, the user service fails immediately.

### Indirect Dependencies

An indirect dependency exists when Node A relies on Node B, but only through an intermediary Node C.

**Example:**
`Frontend → Auth API → Database`
Here, the Frontend does not talk directly to the Database. It talks to the Auth API. However, because the Auth API requires the Database, the Frontend has an *indirect* dependency on the Database. 

During a BLACKOUT simulation, if you inject a `COMPLETE_OUTAGE` into the Database, the engine will propagate the failure to the Auth API (Direct). The Auth API will transition to a `FAILED` state. The engine then evaluates the Frontend. Because the Frontend has a direct dependency on the now-failed Auth API, the Frontend transitions to a `DEGRADED` state. The failure has traveled across the indirect dependency chain.

## Critical Paths

A Critical Path is a specific chain of dependencies that are absolutely essential for a core business function (like logging in, or processing a payment).

When BLACKOUT's AI generates a Reliability Score, it weighs the length and resilience of your Critical Paths.

> **Why it matters:** A Critical Path with 5 sequential direct dependencies is statistically much more likely to fail than a path with 2 dependencies. Every node in the chain multiplies the probability of a cascading timeout.

## Dependency Chains & Retry Storms

Dependency Chains are notorious for creating "Retry Storms." 

Imagine a chain: `Frontend → API Gateway → Billing Service`.

If the Billing Service experiences a minor latency spike (taking 5 seconds to respond instead of 50ms), the API Gateway might timeout after 2 seconds. The API Gateway then retries the request. The Frontend, not getting a response, also retries the request to the Gateway. 

Suddenly, a minor latency issue at the bottom of the dependency chain has multiplied the network traffic at the top of the chain by 10x, causing a complete system crash. BLACKOUT's Simulation Engine is specifically tuned to detect and predict these exact retry storms based on your dependency models.
