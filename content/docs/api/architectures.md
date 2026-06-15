---
title: "Architectures API"
description: "Endpoints for managing your infrastructure graph definitions."
---

The Architectures API allows you to programmatically upload and manage the dependency graphs that act as the foundation for BLACKOUT's predictive simulations.

## The Architecture Object

An Architecture object represents a mathematical graph of your system, consisting of `nodes` and `edges`.

### Attributes

`id` **string**
Unique identifier for the object.

`name` **string**
A human-readable label for the architecture (e.g., "Production Microservices").

`environment` **string**
The environment this graph represents (e.g., `production`, `staging`).

`created_at` **timestamp**
Time at which the object was created.

---

## Create an Architecture

<div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
  <span className="font-mono text-xs font-bold px-2 py-1 rounded border text-green-400 bg-green-500/10 border-green-500/20">POST</span>
  <span className="font-mono text-sm text-foreground">/v1/architectures</span>
</div>

Uploads a new JSON graph definition to the BLACKOUT engine. This graph will be validated and prepared for simulation ingestion.

### Request Body

`name` **string** *Required*
A label for this specific graph upload.

`graph` **object** *Required*
The mathematical representation of your system.
- `nodes` **array** *Required*: List of node objects (`id`, `name`, `type`).
- `edges` **array** *Required*: List of directional dependencies (`source`, `target`).

```json language-bash
curl -X POST https://api.blackout.dev/v1/architectures \
  -H "Authorization: Bearer sk_test_123" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "E-Commerce Prod",
    "graph": {
      "nodes": [
        {"id": "api", "type": "service"},
        {"id": "db", "type": "database"}
      ],
      "edges": [
        {"source": "api", "target": "db"}
      ]
    }
  }'
```

---

## Retrieve an Architecture

<div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
  <span className="font-mono text-xs font-bold px-2 py-1 rounded border text-blue-400 bg-blue-500/10 border-blue-500/20">GET</span>
  <span className="font-mono text-sm text-foreground">/v1/architectures/{id}</span>
</div>

Retrieves the details of an existing Architecture object. You can use this to verify the graph structure before triggering a simulation.

### Parameters

`id` **string** *Required*
The unique identifier of the architecture to retrieve.

### Response Example

```json
{
  "id": "arch_9x8y7z",
  "object": "architecture",
  "name": "E-Commerce Prod",
  "node_count": 2,
  "edge_count": 1,
  "status": "validated",
  "created_at": 1672531200
}
```
