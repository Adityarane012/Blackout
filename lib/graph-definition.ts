export interface NodeDefinition {
  id: string;
  label: string;
  type: "cdn" | "loadbalancer" | "api" | "server" | "cache" | "queue" | "database";
  region: "GLOBAL" | "US-EAST" | "US-WEST" | "EU-WEST";
  baseLoad: number;
  capacity: number; // Max RPS or request capacity before degradation
  dependencies: string[]; // Node IDs that this node depends on
  x: number;
  y: number;
}

export const INFRASTRUCTURE_TOPOLOGY: NodeDefinition[] = [
  { id: "cdn-1", label: "CDN Edge 1", type: "cdn", region: "GLOBAL", baseLoad: 30, capacity: 500, dependencies: ["lb-1"], x: 20, y: 18 },
  { id: "cdn-2", label: "CDN Edge 2", type: "cdn", region: "EU-WEST", baseLoad: 35, capacity: 500, dependencies: ["lb-1"], x: 80, y: 18 },
  { id: "lb-1", label: "Core Load Balancer", type: "loadbalancer", region: "US-EAST", baseLoad: 45, capacity: 1000, dependencies: ["api-1", "api-2", "api-3"], x: 50, y: 8 },
  { id: "api-1", label: "API Gateway 1", type: "api", region: "US-EAST", baseLoad: 55, capacity: 400, dependencies: ["srv-1", "srv-2", "cache-1"], x: 30, y: 32 },
  { id: "api-2", label: "API Gateway 2", type: "api", region: "US-EAST", baseLoad: 40, capacity: 400, dependencies: ["srv-2", "srv-3", "cache-1"], x: 50, y: 32 },
  { id: "api-3", label: "API Gateway 3", type: "api", region: "US-WEST", baseLoad: 38, capacity: 400, dependencies: ["srv-3", "srv-4", "cache-2"], x: 70, y: 32 },
  { id: "cache-1", label: "Redis Cache 1", type: "cache", region: "US-EAST", baseLoad: 60, capacity: 800, dependencies: ["db-1"], x: 25, y: 50 },
  { id: "cache-2", label: "Redis Cache 2", type: "cache", region: "US-WEST", baseLoad: 55, capacity: 800, dependencies: ["db-2"], x: 75, y: 50 },
  { id: "srv-1", label: "Auth Service", type: "server", region: "US-EAST", baseLoad: 42, capacity: 300, dependencies: ["db-1", "queue-1"], x: 15, y: 50 },
  { id: "srv-2", label: "User Service", type: "server", region: "US-EAST", baseLoad: 58, capacity: 300, dependencies: ["db-1", "cache-1"], x: 40, y: 50 },
  { id: "srv-3", label: "Order Service", type: "server", region: "US-WEST", baseLoad: 65, capacity: 300, dependencies: ["db-2", "queue-1"], x: 60, y: 50 },
  { id: "srv-4", label: "Payment Service", type: "server", region: "US-WEST", baseLoad: 48, capacity: 250, dependencies: ["db-2", "queue-1"], x: 85, y: 50 },
  { id: "queue-1", label: "Kafka Message Queue", type: "queue", region: "US-EAST", baseLoad: 35, capacity: 1200, dependencies: ["db-1", "db-2"], x: 50, y: 68 },
  { id: "db-1", label: "Primary Database", type: "database", region: "US-EAST", baseLoad: 70, capacity: 600, dependencies: [], x: 35, y: 85 },
  { id: "db-2", label: "Replica Database", type: "database", region: "US-WEST", baseLoad: 45, capacity: 400, dependencies: [], x: 65, y: 85 },
];
