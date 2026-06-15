---
title: "Architecture Upload"
description: "Define your infrastructure graph for simulation ingestion."
---

Before BLACKOUT can simulate failure cascades, it needs a mathematical representation of your system. This representation is called an **Architecture Graph**, and it is ingested via the Architectures API using a standard JSON format.

## Graph Requirements

The graph is composed of two primary arrays:
1. `nodes`: The individual services, databases, or third-party APIs in your system.
2. `edges`: The dependency relationships between those nodes.

Every graph must have at least one node and one edge to be valid. The graph must be Directed and Acyclic (DAG) at the macro-level, although specific retry loops within a microservice cluster can be modeled using edge weighting.

## Supported Node Types

When defining a node, you must classify its `type`. This allows BLACKOUT's AI to apply context-aware failure probabilities (e.g., a database behaves differently under stress than a stateless frontend).

| Type | Description | Failure Behavior |
|------|-------------|------------------|
| `frontend` | Client-side applications or mobile apps. | Drops connections immediately upon API failure. |
| `service` | Internal microservices or backend APIs. | Susceptible to retry storms and thread pool exhaustion. |
| `database` | Stateful data stores (Postgres, MySQL). | Exhibits latency degradation before complete failure. |
| `cache` | In-memory data stores (Redis, Memcached). | Fast-fails on eviction spikes. |
| `queue` | Message brokers (Kafka, RabbitMQ). | Builds backlog pressure until congestion thresholds are met. |
| `external` | Third-party APIs (Stripe, Twilio). | Completely unpredictable latency and hard timeouts. |

## Dependency Structure (Edges)

Edges define the "depends on" relationship. 

If `Service A` queries `Database B` to fulfill a request, `Service A` depends on `Database B`.
In your JSON, the `source` is `Service A` and the `target` is `Database B`.

```json
{
  "source": "service-a",
  "target": "database-b"
}
```

> **Important**: Edges are directional. The flow of dependency is opposite to the flow of data. If the Database goes down, the Service fails. Therefore, the failure propagates *upstream* from Target to Source.

## JSON Format Example

Below is a complete, valid JSON payload for an Architecture Upload. It models a standard web application where a Frontend talks to an API Gateway, which in turn orchestrates requests between an Auth Service and an Order Service.

```json
{
  "name": "Production E-Commerce Cluster",
  "environment": "production",
  "graph": {
    "nodes": [
      {
        "id": "web-frontend",
        "name": "React SPA",
        "type": "frontend"
      },
      {
        "id": "api-gateway",
        "name": "NGINX Gateway",
        "type": "service"
      },
      {
        "id": "auth-service",
        "name": "Authentication",
        "type": "service"
      },
      {
        "id": "order-service",
        "name": "Order Processing",
        "type": "service"
      },
      {
        "id": "primary-db",
        "name": "Postgres Cluster",
        "type": "database"
      },
      {
        "id": "stripe-api",
        "name": "Stripe Payments",
        "type": "external"
      }
    ],
    "edges": [
      {
        "source": "web-frontend",
        "target": "api-gateway"
      },
      {
        "source": "api-gateway",
        "target": "auth-service"
      },
      {
        "source": "api-gateway",
        "target": "order-service"
      },
      {
        "source": "auth-service",
        "target": "primary-db"
      },
      {
        "source": "order-service",
        "target": "primary-db"
      },
      {
        "source": "order-service",
        "target": "stripe-api"
      }
    ]
  }
}
```

## Validation Rules & Best Practices

When you submit your JSON payload to the `/v1/architectures` endpoint, it undergoes strict validation:

1. **Orphaned Nodes**: Nodes with no inbound or outbound edges will trigger a warning. While valid, they cannot participate in a failure cascade.
2. **Missing Targets**: If an edge references a `target` ID that does not exist in the `nodes` array, the API will return a `400 Bad Request`.
3. **Circular Dependencies**: While rare, circular dependencies (A -> B -> A) are permitted but will cap cascade calculations at 3 traversals to prevent infinite simulation loops.

### Best Practice: Granularity
Do not attempt to model every individual function or class. BLACKOUT is most effective when nodes represent **deployable units** (e.g., a Docker container, a Lambda function, a managed Database). Modeling at too low a level introduces noise into the AI analysis.
