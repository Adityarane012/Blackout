---
title: "Resilience Insights"
description: "Actionable recommendations to improve your Reliability Score."
---

Knowing *that* your system will fail is only half the battle. Knowing *how* to fix it is where BLACKOUT delivers true value. 

Every time you hit the `/v1/analysis` endpoint after a simulation, the AI engine generates **Resilience Insights**. These are actionable, architectural recommendations designed specifically to mitigate the cascading failures detected during your simulation.

## Identifying Architectural Weaknesses

BLACKOUT doesn't just look at the nodes that failed; it looks at *why* they failed. By evaluating the state transitions of your graph, the AI can detect anti-patterns.

Common weaknesses detected include:
- **Synchronous Dependency Chains:** Long chains of immediate REST/HTTP calls where a single timeout causes a ripple effect.
- **Missing Circuit Breakers:** Nodes that continue to send traffic to a `DEGRADED` downstream dependency, exacerbating the outage.
- **Unbounded Retry Loops:** Services that aggressively retry failed requests without exponential backoff, causing Retry Storms.

## AI-Driven Recommendations

For every weakness detected, BLACKOUT provides a mitigation strategy based on industry-standard resilience patterns.

### The Circuit Breaker Pattern
If BLACKOUT detects that an API Gateway crashed because a downstream Database experienced a `LATENCY_SPIKE`, the insight will recommend a Circuit Breaker.
> **Insight:** "Implement a Circuit Breaker on the edge between `api-gateway` and `database`. When the database latency exceeds 2000ms, the breaker should trip, immediately returning a 503 error to the gateway rather than exhausting thread pools."

### The Bulkhead Pattern
If a failure in the `image-processing-queue` cascaded and took down the `user-login-service` (because they shared the same API resources), BLACKOUT will recommend the Bulkhead pattern.
> **Insight:** "Isolate resources. Allocate dedicated thread pools or separate instances for `image-processing` and `user-login` to ensure a spike in image processing does not consume authentication resources."

### Decoupling with Asynchronous Queues
If a synchronous HTTP call between `checkout-service` and `email-service` fails, dropping the user's order entirely, BLACKOUT will recommend decoupling.
> **Insight:** "Introduce an Event Queue between `checkout-service` and `email-service`. The checkout service can publish the event and immediately return success to the user, allowing the email to process asynchronously when the downstream service recovers."

By following these insights, modifying your codebase, and re-uploading your Architecture Graph, you can measurably track your Reliability Score improving over time.
