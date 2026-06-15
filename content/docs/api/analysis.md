---
title: "Analysis API"
description: "Endpoints for fetching AI-driven insights and root cause reports."
---

Once a simulation has completed and the Blast Radius has been calculated, you can use the Analysis API to request a deep-dive AI report. This API reconstructs the dependency chains, identifies bottlenecks, and provides actionable resilience recommendations.

---

## Generate Analysis Report

<div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
  <span className="font-mono text-xs font-bold px-2 py-1 rounded border text-green-400 bg-green-500/10 border-green-500/20">POST</span>
  <span className="font-mono text-sm text-foreground">/v1/analysis</span>
</div>

Triggers the AI engine to generate an RCA (Root Cause Analysis) and Resilience Insights report for a specific simulation run. 

> **Note:** Analysis generation is asynchronous. This endpoint returns an `analysis_id` that you must poll via the GET endpoint.

### Request Body

`simulation_id` **string** *Required*
The ID of the completed simulation you wish to analyze.

```json language-bash
curl -X POST https://api.blackout.dev/v1/analysis \
  -H "Authorization: Bearer sk_test_123" \
  -H "Content-Type: application/json" \
  -d '{
    "simulation_id": "sim_abc123"
  }'
```

---

## Retrieve Analysis Results

<div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
  <span className="font-mono text-xs font-bold px-2 py-1 rounded border text-blue-400 bg-blue-500/10 border-blue-500/20">GET</span>
  <span className="font-mono text-sm text-foreground">/v1/analysis/{id}</span>
</div>

Retrieves the final AI-generated insights report.

### Parameters

`id` **string** *Required*
The unique identifier of the analysis task.

### Complete Response Example

The response contains the Reliability Score, the reconstructed Root Cause chain, and the AI's Resilience Recommendations.

```json
{
  "id": "anl_777888",
  "object": "analysis",
  "status": "completed",
  "simulation_id": "sim_abc123",
  "metrics": {
    "reliability_score": 45,
    "bottleneck_index": 0.82
  },
  "root_cause_analysis": {
    "origin_node": "primary-db",
    "propagation_chain": [
      "primary-db transitioned to FAILED (Injected)",
      "auth-service transitioned to STRESSED (Timeout)",
      "auth-service transitioned to FAILED (Thread pool exhausted)",
      "api-gateway transitioned to DEGRADED (504 Gateway Timeout)"
    ],
    "critical_failure_point": "auth-service"
  },
  "resilience_insights": [
    {
      "type": "CIRCUIT_BREAKER",
      "target_edge": { "source": "api-gateway", "target": "auth-service" },
      "recommendation": "Implement a circuit breaker on the API Gateway to prevent it from holding open connections when the Auth Service is unresponsive."
    },
    {
      "type": "DECOUPLING",
      "target_node": "auth-service",
      "recommendation": "Implement a fallback cache (e.g., Redis) for JWT validation so the Auth Service can survive primary database outages."
    }
  ]
}
```

By programmatically asserting against the `metrics.reliability_score`, CI/CD pipelines can automatically block deployments of architectures that fail to meet resilience standards.
