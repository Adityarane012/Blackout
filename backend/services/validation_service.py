from typing import Dict, Any, List, Set
from backend.models.architecture import ValidationResultModel

def validate_architecture(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> ValidationResultModel:
    """
    Validates a graph structure before Neo4j ingestion.
    """
    warnings = []
    health_score = 100
    valid = True

    # 1. Malformed structure
    if not nodes:
        return ValidationResultModel(valid=False, warnings=["Graph contains no nodes."], graph_health_score=0)
    if not edges and len(nodes) > 1:
        warnings.append("Graph contains multiple nodes but zero edges.")
        health_score -= 20

    # 2. Duplicate node IDs
    node_ids = set()
    for n in nodes:
        node_id = n.get("id")
        if not node_id:
            valid = False
            warnings.append("A node is missing an 'id' attribute.")
            continue
        if node_id in node_ids:
            valid = False
            warnings.append(f"Duplicate node ID detected: {node_id}")
        node_ids.add(node_id)

    # 3. Invalid node types
    valid_types = {"frontend", "service", "database", "queue", "cache", "external", "cdn", "loadbalancer", "api", "server"}
    for n in nodes:
        n_type = n.get("type", "").lower()
        if n_type not in valid_types:
            warnings.append(f"Node '{n.get('id')}' has an unknown type '{n_type}'. Supported types: {list(valid_types)}.")
            health_score -= 5

    # 4. Missing dependencies (edges targeting non-existent nodes)
    sources = set()
    targets = set()
    for e in edges:
        source = e.get("source")
        target = e.get("target")
        if not source or not target:
            valid = False
            warnings.append("An edge is missing 'source' or 'target'.")
            continue
        
        if source not in node_ids:
            valid = False
            warnings.append(f"Edge source '{source}' does not exist in nodes.")
        if target not in node_ids:
            valid = False
            warnings.append(f"Edge target '{target}' does not exist in nodes.")
            
        sources.add(source)
        targets.add(target)

    # 5. Orphan nodes (no inbound or outbound edges)
    # Exclude if graph only has 1 node
    if len(nodes) > 1:
        connected_nodes = sources.union(targets)
        orphans = node_ids - connected_nodes
        if orphans:
            warnings.append(f"Orphan nodes detected (no edges): {list(orphans)}")
            health_score -= (len(orphans) * 5)

    # 6. Circular dependencies (A -> B -> A)
    # Using simple DFS cycle detection
    adj: Dict[str, List[str]] = {nid: [] for nid in node_ids}
    for e in edges:
        src = e.get("source")
        tgt = e.get("target")
        if src in adj:
            adj[src].append(tgt)

    visited = set()
    rec_stack = set()

    def detect_cycle(curr: str) -> bool:
        visited.add(curr)
        rec_stack.add(curr)
        for neighbor in adj.get(curr, []):
            if neighbor not in visited:
                if detect_cycle(neighbor):
                    return True
            elif neighbor in rec_stack:
                return True
        rec_stack.remove(curr)
        return False

    for node in node_ids:
        if node not in visited:
            if detect_cycle(node):
                warnings.append("Circular dependency detected. While permitted, it caps cascade depth to prevent infinite loops.")
                health_score -= 15
                break

    # Floor score at 0
    health_score = max(0, health_score)
    if not valid:
        health_score = 0

    return ValidationResultModel(
        valid=valid,
        warnings=warnings,
        graph_health_score=health_score
    )
