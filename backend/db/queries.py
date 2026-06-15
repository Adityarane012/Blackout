# Parameterized Cypher query templates for the BLACKOUT SRE Graph Ingestion Engine.
# Fully parameterized to prevent Cypher injection vectors and maximize query cache hits.

# 1. Dynamic Node Creation & Merging using Type Labels
# This uses APOC or dynamic node labels to add specific SRE classifications (e.g. :Database, :Service) alongside a generic :InfraNode base.
CREATE_INFRA_NODE_CYPHER = """
MERGE (n:InfraNode {id: $id, arch_id: $arch_id})
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
MERGE (n:InfraNode {id: $id, arch_id: $arch_id})
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
MATCH (from:InfraNode {id: $from_id, arch_id: $arch_id})
MATCH (to:InfraNode {id: $to_id, arch_id: $arch_id})
MERGE (from)-[r:DEPENDS_ON]->(to)
SET r.status = $status,
    r.traffic = toFloat($traffic),
    r.latency = toFloat($latency),
    r.updated_at = timestamp()
RETURN from.id AS from_id, to.id AS to_id, type(r) AS rel_type, r.status AS status
"""

# 3. Targeted Node Telemetry Update Mutation
UPDATE_NODE_TELEMETRY_CYPHER = """
MATCH (n:InfraNode {id: $id, arch_id: $arch_id})
SET n.status = $status,
    n.load = toFloat($load),
    n.latency = toFloat($latency),
    n.error_rate = toFloat($error_rate),
    n.updated_at = timestamp()
RETURN n { .id, .label, .type, .status, .load, .capacity, .latency, .error_rate } AS node
"""

# 4. Read Operations
GET_ALL_NODES_CYPHER = """
MATCH (n:InfraNode {arch_id: $arch_id})
RETURN n { .id, .label, .type, .status, .load, .capacity, .latency, .error_rate } AS node
"""

GET_ALL_DEPENDENCIES_CYPHER = """
MATCH (from:InfraNode {arch_id: $arch_id})-[r:DEPENDS_ON]->(to:InfraNode {arch_id: $arch_id})
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
MATCH path = (dependent:InfraNode {arch_id: $arch_id})-[:DEPENDS_ON*]->(root:InfraNode {id: $root_id, arch_id: $arch_id})
UNWIND nodes(path) as n
WITH DISTINCT n
WHERE n.id <> $root_id
RETURN n { .id, .label, .type, .status, .load, .capacity, .latency, .error_rate } AS affected_node
"""

# 6. Bottleneck Analysis
# Identifies nodes with high in-degree dependencies (Critical dependency hubs)
GET_BOTTLENECK_ANALYSIS_CYPHER = """
MATCH (n:InfraNode {arch_id: $arch_id})<-[r:DEPENDS_ON]-(dependent:InfraNode {arch_id: $arch_id})
WITH n, count(r) AS in_degree, collect(dependent.id) as dependent_ids
WHERE in_degree > 0
RETURN n { .id, .label, .type } AS node, in_degree, dependent_ids
ORDER BY in_degree DESC
LIMIT 10
"""

# 6b. V2 Intelligence Scans
GET_SPOF_CYPHER = """
MATCH (n:InfraNode {arch_id: $arch_id})<-[:DEPENDS_ON]-(d:InfraNode {arch_id: $arch_id})
WITH n, count(d) as deps
WHERE deps > 0
MATCH (peers:InfraNode {arch_id: $arch_id, type: n.type})
WITH n, deps, count(peers) as peer_count
WHERE peer_count = 1
RETURN n.id as node_id, n.label as label, n.type as type, deps as dependents_count
"""

GET_DEPTH_RISK_CYPHER = """
MATCH path = (n:InfraNode {arch_id: $arch_id})-[:DEPENDS_ON*3..]->(target:InfraNode {arch_id: $arch_id})
RETURN n.id as start_node, target.id as end_node, length(path) as depth
ORDER BY depth DESC LIMIT 1
"""

# 7. User Persistence & History
MERGE_USER_CYPHER = """
MERGE (u:User {clerk_id: $clerk_id})
SET u.updated_at = timestamp()
RETURN u
"""

LINK_USER_TO_ARCH_CYPHER = """
MATCH (u:User {clerk_id: $clerk_id})
MERGE (a:Architecture {id: $arch_id})
SET a.name = $name, a.environment = $environment, a.nodes_count = toInteger($nodes_count), a.updated_at = timestamp()
MERGE (u)-[:OWNS]->(a)
RETURN a
"""

SAVE_SIMULATION_HISTORY_CYPHER = """
MATCH (u:User {clerk_id: $clerk_id})
MATCH (a:Architecture {id: $arch_id})
CREATE (s:Simulation {
    id: $sim_id,
    scenario: $scenario,
    score: toInteger($score),
    created_at: timestamp()
})
MERGE (a)-[:RAN]->(s)
MERGE (u)-[:PERFORMED]->(s)
RETURN s
"""

GET_USER_ARCHITECTURES_CYPHER = """
MATCH (u:User {clerk_id: $clerk_id})-[:OWNS]->(a:Architecture)
RETURN a { .id, .name, .environment, .nodes_count, .updated_at } AS architecture
ORDER BY a.updated_at DESC
"""

GET_USER_SIMULATIONS_CYPHER = """
MATCH (u:User {clerk_id: $clerk_id})-[:PERFORMED]->(s:Simulation)<-[:RAN]-(a:Architecture)
RETURN s { .id, .scenario, .score, .created_at, archName: a.name } AS simulation
ORDER BY s.created_at DESC
"""
