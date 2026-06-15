---
title: "Reliability Scoring"
description: "Understanding how BLACKOUT calculates your resilience score."
---

Every simulation run in BLACKOUT generates a **Reliability Score**. This score is a quantitative measure of how well your architecture handled the injected failure. It allows engineering teams to track resilience over time and set CI/CD thresholds.

## The Resilience Score (0 - 100)

The final score returned by the Analysis API is a number between 0 and 100. 

- **90 - 100:** Highly Resilient. The failure was contained to the immediate target node. Circuit breakers or fallbacks successfully prevented a cascade.
- **70 - 89:** Moderate Risk. The failure propagated to one or two upstream dependencies, causing localized degradation, but the core system remained operational.
- **0 - 69:** Critical Vulnerability. The injected failure caused a massive cascade, taking down critical paths and resulting in a total system outage.

## How the Score is Calculated

The Reliability Score is not a simple percentage of failed nodes. The AI engine calculates the score using a weighted algorithm that considers three primary metrics: Outage Severity, the Bottleneck Index, and the ratio of Affected Systems.

### 1. Outage Severity
The engine looks at the *types* of nodes that failed. If a background worker queue transitions to `FAILED`, the penalty is minor. If a `frontend` application or a core `api-gateway` transitions to `FAILED`, the penalty is severe. The closer the failure gets to the end-user, the harder the score is hit.

### 2. Affected Systems Ratio
This is the raw Blast Radius calculation. The engine compares the total number of nodes in your Architecture Graph against the number of nodes that transitioned to `DEGRADED` or `FAILED` during the simulation. If 1 node fails in a 100-node graph, the impact is minimal. If 10 nodes fail in a 20-node graph, the cascade was catastrophic.

### 3. The Bottleneck Index
The engine evaluates the speed at which the failure propagated. If it took 10 simulated minutes for a database latency spike to eventually crash the API (due to slow memory leaks), the score is penalized less than if the API crashed instantaneously (indicating a complete lack of timeouts or decoupling).

## Practical Example

**Scenario:** You inject a `COMPLETE_OUTAGE` into `redis-cache`.

**Outcome A:** The `product-api` realizes the cache is down and automatically falls back to querying the primary database. The database experiences slightly higher load (`STRESSED`) but survives. 
* **Score:** 95. The architecture proved highly resilient.

**Outcome B:** The `product-api` attempts to connect to the dead cache, hangs for 30 seconds due to a lack of timeouts, exhausts its connection pool, and crashes. The `frontend` goes down.
* **Score:** 24. A critical vulnerability allowed a non-critical cache failure to destroy the entire user experience.
