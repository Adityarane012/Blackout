---
title: "Scenario Generation"
description: "How to craft realistic outage scenarios for simulation."
---

A simulation is only as useful as the scenario it models. BLACKOUT allows you to generate a wide array of failure conditions, ranging from simple network drops to complex, AI-generated chaos events based on real-world traffic patterns.

## Predefined Scenarios

The easiest way to test your infrastructure's resilience is to use BLACKOUT's predefined scenario profiles. These are available via the Dashboard or by passing the `severity` enum to the Simulations API.

### 1. Latency Spike
Injects a sudden, variable delay (typically between 500ms and 5000ms) into the target node's response time.
* **Use Case:** Testing timeout configurations on API Gateways and ensuring circuit breakers trip correctly before thread pools are exhausted.

### 2. Connection Drop
Simulates an intermittent network partition where the node randomly refuses 50% to 80% of incoming TCP connections.
* **Use Case:** Validating client-side retry logic (e.g., ensuring exponential backoff is implemented instead of immediate aggressive retries).

### 3. Complete Outage
Models a total crash of the node (e.g., an OOM kill, a hardware failure, or a misconfigured DNS record). The node goes completely dark.
* **Use Case:** Disaster recovery testing. Validating that secondary regions or fallback caches can handle the load when the primary database vanishes.

## Custom Scenarios

For more advanced teams, BLACKOUT allows you to combine conditions to create Custom Scenarios. 

For example, you can model a **"Black Friday Traffic"** event. Instead of dropping connections, you define a custom scenario that gradually increases the "Load Weight" on a frontend node over 10 minutes. The Simulation Engine will calculate at what point the downstream databases begin to transition into a `STRESSED` and then `DEGRADED` state due to connection pool saturation.

### Retry Storms
A Retry Storm is a specific custom scenario template provided by BLACKOUT. It forcefully triggers aggressive, un-backoff'd retries from a set of source nodes aimed at a single target node. This is critical for testing rate limiting and load shedding capabilities on your API layer.

## AI-Generated Chaos

If you aren't sure what to test, BLACKOUT's AI can generate scenarios for you. 

By analyzing your uploaded Architecture Graph, the AI identifies your most vulnerable "Dependency Hubs" (nodes with the highest number of inbound edges). It will automatically generate and execute a suite of micro-simulations against these hubs, testing different latency and drop configurations to find the specific breaking point of your architecture.

This automated "Chaos Discovery" is the fastest way to improve your Reliability Score without needing to manually author dozens of API requests.
