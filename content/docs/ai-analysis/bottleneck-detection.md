---
title: "Bottleneck Detection"
description: "Identify structural weaknesses in your architecture graph."
---

Not all nodes in your infrastructure are created equal. Some nodes process far more traffic, manage more critical states, or hold more dependencies than others. 

BLACKOUT's **Bottleneck Detection** feature analyzes your Architecture Graph *before* you even run a simulation, highlighting structural weaknesses that are mathematically guaranteed to act as failure amplifiers.

## Identifying Critical Nodes

A "Critical Node" is any service, database, or queue that possesses a disproportionately high risk to the overall stability of the system. 

The Bottleneck Detection algorithm evaluates critical nodes based on three metrics:

### 1. Dependency Hubs
A Dependency Hub is a node with a massive number of inbound edges. 
* **Example:** A centralized `user-authentication` service. If 50 different microservices all depend on this single node to validate JWTs, it is a massive hub. If it goes down, 50 services go down with it.

### 2. Propagation Amplifiers
An amplifier is a node that sits in the middle of a critical path and lacks resilience configurations (like circuit breakers or decoupled queues). 
* **Example:** An `api-gateway` that uses synchronous HTTP calls to talk to backend services. If a backend service slows down, the gateway amplifies the failure by holding open connections and eventually blocking traffic for *all* services, not just the slow one.

### 3. Failure Hotspots
By running dozens of automated background simulations, BLACKOUT's AI identifies "Hotspots." These are nodes that transition to a `FAILED` state most frequently during random chaos events. If an architecture has a hotspot, it means that almost regardless of *where* a failure starts, it eventually cascades and takes down that specific hotspot.

## Mitigating Bottlenecks

Once the AI identifies a bottleneck, it is up to the engineering team to restructure the graph.

If BLACKOUT flags a centralized database as a massive Dependency Hub, the team might decide to implement the Database-per-Service pattern. They can then upload the *new* Architecture Graph (with multiple databases) and run the Bottleneck Detection algorithm again to mathematically prove that the hub has been decentralized and the risk mitigated.
