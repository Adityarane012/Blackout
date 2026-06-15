---
title: "Root Cause Analysis"
description: "How BLACKOUT's AI traces failures back to their source."
---

When a complex distributed system fails, finding the origin of the failure is often harder than fixing it. Engineering teams can spend hours digging through logs and traces trying to figure out *why* the API Gateway crashed, only to discover a completely unrelated caching layer was the true culprit.

BLACKOUT's **Root Cause Analysis** (RCA) engine automates this forensic investigation.

## The AI Analysis Workflow

While the Simulation Engine predicts *how* a failure will spread (moving upstream from the injected node), the RCA engine works in reverse. It analyzes the resulting Blast Radius and reconstructs the dependency chain to pinpoint the absolute origin of the cascade.

The workflow operates as follows:

1. **Cascade Completion:** The simulation finishes calculating the deterministic spread of the outage.
2. **Path Tracing:** The RCA engine analyzes the graph, tracing every `FAILED` or `DEGRADED` node back down its outbound edges.
3. **Source Identification:** The engine identifies the node (or cluster of nodes) where the failure injection originally breached the system's resilience thresholds.
4. **Report Generation:** The Analysis API returns a structured RCA report, complete with a timeline of the propagation.

## Dependency Chain Reconstruction

To prove its findings, the RCA engine reconstructs the critical path that led to the outage. 

For example, if your `Frontend` threw 500 errors, the RCA report won't just say "The Database is down." It will output the exact sequence of events:

> **RCA Finding:** 
> "The failure originated at `postgres-primary` due to a simulated `COMPLETE_OUTAGE`. This caused `user-service` to experience a connection timeout. Because `user-service` lacked a fallback cache, it failed. This triggered a retry storm from `api-gateway`, which exhausted its thread pool and crashed, ultimately taking down `web-frontend`."

By providing this reconstructed chain, BLACKOUT enables teams to see not just the root cause, but the exact points where the architecture failed to contain the blast.

## Real-World RCA Examples

### Example 1: The Hidden Single Point of Failure
A team models an architecture with two identical API clusters behind a load balancer. They assume they are highly available. They run a simulation injecting a failure into a seemingly minor `auth-token-validator` microservice. 

The simulation shows a massive 90% system outage. 

The RCA engine identifies that *both* API clusters had an indirect dependency on the `auth-token-validator` via a shared middleware queue. The team had inadvertently created a single point of failure. The RCA engine flags this specific edge as the architectural flaw.

### Example 2: The Cascading Timeout
A simulation targets a third-party `stripe-api` node with a `LATENCY_SPIKE`. The entire application crashes.

The RCA engine traces the failure and discovers that while the `billing-service` had a timeout of 5 seconds, the upstream `api-gateway` had a timeout of 2 seconds. The `api-gateway` was timing out and dropping connections *before* the `billing-service` had a chance to gracefully handle the Stripe latency. 

The RCA recommendation: "Align upstream timeout policies to be strictly greater than downstream timeout policies."
