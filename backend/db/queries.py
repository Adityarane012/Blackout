# Parameterized Cypher query templates for the BLACKOUT SRE Graph Ingestion Engine.
# Fully parameterized to prevent Cypher injection vectors and maximize query cache hits.

# 1. Dynamic Node Creation & Merging using Type Labels
# This uses APOC or dynamic node labels to add specific SRE classifications (e.g. :Database, :Service) alongside a generic :InfraNode base.
CREATE_INFRA_NODE_CYPHER = """
MERGE (n:InfraNode {id: $id})
SET n.label = $label,
    n.type = $type,
    n.status = $status,
    n.load = toFloat($load),
    n.capacity = toFloat($capacity),
    n.latency = toFloat($latency),
    n.error_rate = toFloat($error_rate),
    n.updated_at = timestamp()
WITH n
CALL apoc.create.addLabels(n, [$type_label]) YIELD node
RETURN node
"""

# Production-safe fallback node merging query (when APOC is not loaded in local Neo4j plugins)
UPSERT_NODE_CYPHER = """
MERGE (n:InfraNode {id: $id})
SET n.label = $label,
    n.type = $type,
    n.status = $status,
    n.load = toFloat($load),
    n.capacity = toFloat($capacity),
    n.latency = toFloat($latency),
    n.error_rate = toFloat($error_rate),
    n.updated_at = timestamp()
RETURN n
"""

# 2. Directed Dependency Connection Merging
CREATE_DEPENDENCY_CYPHER = """
MATCH (from:InfraNode {id: $from_id})
MATCH (to:InfraNode {id: $to_id})
MERGE (from)-[r:DEPENDS_ON]->(to)
SET r.status = $status,
    r.traffic = toFloat($traffic),
    r.latency = toFloat($latency),
    r.updated_at = timestamp()
RETURN from.id AS from_id, to.id AS to_id, type(r) AS rel_type, r.status AS status
"""

# 3. Targeted Node Telemetry Update Mutation
UPDATE_NODE_TELEMETRY_CYPHER = """
MATCH (n:InfraNode {id: $id})
SET n.status = $status,
    n.load = toFloat($load),
    n.latency = toFloat($latency),
    n.error_rate = toFloat($error_rate),
    n.updated_at = timestamp()
RETURN n { .id, .label, .type, .status, .load, .capacity, .latency, .error_rate } AS node
"""

# 4. Read Operations
GET_ALL_NODES_CYPHER = """
MATCH (n:InfraNode)
RETURN n { .id, .label, .type, .status, .load, .capacity, .latency, .error_rate } AS node
"""

GET_ALL_DEPENDENCIES_CYPHER = """
MATCH (from:InfraNode)-[r:DEPENDS_ON]->(to:InfraNode)
RETURN { 
    from: from.id, 
    to: to.id, 
    status: r.status, 
    traffic: r.traffic, 
    latency: r.latency 
} AS connection
"""

# 5. Advanced Recursive Cascade Paths
# Traces all upstream nodes that recursively rely on the target crashed node.
TRACE_CASCADE_BLAST_RADIUS_CYPHER = """
MATCH path = (dependent:InfraNode)-[:DEPENDS_ON*]->(root:InfraNode {id: $root_id})
UNWIND nodes(path) as n
WITH DISTINCT n
WHERE n.id <> $root_id
RETURN n { .id, .label, .type, .status, .load, .capacity, .latency, .error_rate } AS affected_node
"""
