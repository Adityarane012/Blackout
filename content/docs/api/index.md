---
title: "API Reference"
description: "Overview of the BLACKOUT REST API"
---

# API Reference

Welcome to the BLACKOUT REST API. The API is designed around RESTful principles and is powered by FastAPI and Neo4j.

Our API allows you to programmatically build infrastructure graphs, trigger chaotic failure simulations, and analyze resilience via AI post-mortems.

## Core Services

- **[Architectures](/docs/api/architectures):** Ingest and persist node/edge dependency graphs into Neo4j.
- **[Simulations](/docs/api/simulations):** Trigger deterministic failure cascades and retrieve step-by-step state changes.
- **[Analysis](/docs/api/analysis):** Pass simulation histories to our AI neural uplink for automated bottleneck detection and resilience scoring.

## Authentication

If you are running the platform locally or for a hackathon, all endpoints remain public and will not persist to a user profile unless a `userId` is explicitly provided. For production usage, API keys will be required via the `Authorization` header.

## Base URL

In development, all requests proxy through the Next.js frontend to avoid CORS configuration issues.

```bash
http://localhost:3000/v1
```

For example, to check the health of the backend:

```bash
curl http://localhost:3000/v1/health
```
