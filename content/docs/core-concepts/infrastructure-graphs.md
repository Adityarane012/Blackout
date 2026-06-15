---
title: "Infrastructure Graphs"
description: "How BLACKOUT models your infrastructure mathematically."
---

At the heart of the BLACKOUT simulation engine lies the **Infrastructure Graph**. To predict how outages spread, BLACKOUT translates your physical architecture (servers, databases, load balancers) into a mathematical graph model.

## Graph Representation

In mathematics, a graph is a structure amounting to a set of objects in which some pairs of the objects are in some sense "related." 

BLACKOUT uses a **Directed Graph** (or Digraph). This means the relationships between objects have a specific direction. In the context of software architecture, this direction represents a *dependency*.

### Nodes (Vertices)

Nodes represent the individual components of your architecture. In a microservices environment, a node typically corresponds to a specific service boundary.

Examples of Nodes:
- An instance of a Node.js Express application.
- A managed AWS RDS PostgreSQL database.
- A Redis cluster used for session caching.
- A third-party API like Twilio or Stripe.

### Edges (Links)

Edges are the connections between your nodes. An edge is created whenever one node requires another node to function properly. 

> If the Frontend requires the Auth Service to log a user in, there is an edge pointing from Frontend to Auth Service.

## Dependency Modeling

Modeling dependencies accurately is the most crucial step in achieving realistic simulations. BLACKOUT evaluates edges to determine the "Upstream" and "Downstream" flow of failures.

### The Flow of Failure

In a typical web request, data flows *down* the stack (Frontend -> API -> Database). However, failures propagate *up* the stack. 

If the Database fails, the API cannot fulfill its request, causing the API to fail (or timeout). The Frontend then receives an error from the API, causing the Frontend to degrade.

**Data Flow:**
`Frontend` ↓ `Auth` ↓ `Queue` ↓ `Database`

**Failure Propagation:**
`Database` ↑ `Queue` ↑ `Auth` ↑ `Frontend`

## Graph Traversal

When you trigger a simulation, BLACKOUT executes a traversal algorithm across your Infrastructure Graph. 

Starting at the "Target Node" (the node you selected to fail), the engine performs a Breadth-First Search (BFS) going backward along the directional edges. 

For every upstream node it encounters, it calculates the probability that the failure will successfully propagate. This calculation is handled by the **Cascade Engine**, which takes into account the node types and the severity of the initial failure.

### Example Traversal

Consider the following graph:

1. `web-client` depends on `api-gateway`
2. `api-gateway` depends on `user-service` and `product-service`
3. `user-service` depends on `postgres-db`
4. `product-service` depends on `postgres-db`

If `postgres-db` experiences a `COMPLETE_OUTAGE`:

- **Step 1:** The engine starts at `postgres-db`. It looks for all nodes that point to it.
- **Step 2:** It finds `user-service` and `product-service`. The engine evaluates them and transitions both to `FAILED` because they cannot operate without the database.
- **Step 3:** The engine then looks for nodes depending on `user-service` and `product-service`. It finds `api-gateway`.
- **Step 4:** The `api-gateway` transitions to `FAILED`.
- **Step 5:** Finally, the engine finds `web-client`, transitioning it to `DEGRADED` (as clients typically show error screens rather than crashing entirely).

By relying on strict mathematical graph modeling, BLACKOUT removes the guesswork from disaster recovery planning.
