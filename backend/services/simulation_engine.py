from typing import List, Dict, Any, Set
from collections import deque

class SimulationEngine:
    """
    Deterministic Graph Traversal and Propagation Engine.
    Generates time-series events (T+0, T+1) based on topology structure.
    """
    
    def __init__(self, topology: Dict[str, Any]):
        self.nodes = {n["id"]: n for n in topology["nodes"]}
        self.edges = topology["connections"]
        
        # Build adjacency lists for upstream traversal (Dependents that rely on a node)
        # If A depends on B, an edge is A -> B. If B fails, A is affected.
        # So we need B -> A mapping to propagate failures UPSTREAM.
        self.upstream_map: Dict[str, List[str]] = {nid: [] for nid in self.nodes}
        for e in self.edges:
            # from -> to means 'from' depends on 'to'
            # To propagate failure, if 'to' fails, it affects 'from'
            self.upstream_map[e["to"]].append(e["from"])

    def run_simulation(self, trigger: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes a BFS deterministic cascade.
        """
        scenario = trigger.get("scenario", "custom_node_failure")
        target_id = trigger.get("target")
        
        timeline = []
        affected_nodes = []
        blast_radius_dict = {}
        
        # Determine starting queue
        queue = deque()
        visited = set()
        
        if scenario == "black_friday_traffic":
            # Target all frontends
            for nid, n in self.nodes.items():
                if n.get("type", "").lower() in ["frontend", "cdn"]:
                    queue.append((nid, 0, "STRESSED"))
                    visited.add(nid)
        else:
            if target_id and target_id in self.nodes:
                initial_state = trigger.get("initial_state", "FAILED")
                queue.append((target_id, 0, initial_state))
                visited.add(target_id)
        
        # BFS Traversal
        while queue:
            current_id, t_step, state = queue.popleft()
            node = self.nodes[current_id]
            
            # Record state
            blast_radius_dict[current_id] = state
            affected_nodes.append(current_id)
            
            # Generate timeline event
            event_msg = self._generate_event_message(node, state)
            timeline.append({
                "tick": f"T+{t_step}",
                "nodeId": current_id,
                "state": state,
                "message": event_msg
            })
            
            # Propagate to dependents
            dependents = self.upstream_map.get(current_id, [])
            for dep_id in dependents:
                if dep_id not in visited:
                    visited.add(dep_id)
                    # Next state degradation logic
                    next_state = self._calculate_next_state(state, self.nodes[dep_id])
                    if next_state != "HEALTHY":
                        queue.append((dep_id, t_step + 1, next_state))
                        
        return {
            "timeline": timeline,
            "affectedNodes": list(set(affected_nodes)),
            "blastRadius": blast_radius_dict
        }
        
    def _calculate_next_state(self, cause_state: str, dependent_node: Dict[str, Any]) -> str:
        """
        Determines how a failure state cascades to upstream dependents.
        """
        node_type = dependent_node.get("type", "").lower()
        
        if cause_state == "FAILED":
            if node_type in ["frontend", "api"]:
                return "DEGRADED"
            return "FAILED"
            
        if cause_state == "DEGRADED":
            return "STRESSED"
            
        if cause_state == "STRESSED":
            if node_type == "database":
                return "DEGRADED"
            return "STRESSED"
            
        return "HEALTHY"

    def _generate_event_message(self, node: Dict[str, Any], state: str) -> str:
        label = node.get("label", node.get("id"))
        ntype = node.get("type", "Service")
        
        if state == "FAILED":
            return f"Critical Outage: {ntype} '{label}' has completely failed."
        if state == "DEGRADED":
            return f"Service Degraded: {ntype} '{label}' is experiencing severe latency and partial drops."
        if state == "STRESSED":
            return f"Elevated Stress: {ntype} '{label}' load is spiking near capacity limits."
            
        return f"{label} is stable."
