from typing import List, Dict, Any, Set
from collections import deque
import random

class SimulationEngine:
    """
    Deterministic Digital Twin Infrastructure Simulator.
    Evaluates real operational metrics per tick and organically transitions node states.
    """
    
    def __init__(self, topology: Dict[str, Any]):
        self.nodes = {n["id"]: self._initialize_metrics(n) for n in topology["nodes"]}
        self.edges = topology["connections"]
        
        self.upstream_map: Dict[str, List[str]] = {nid: [] for nid in self.nodes}
        self.downstream_map: Dict[str, List[str]] = {nid: [] for nid in self.nodes}
        for e in self.edges:
            if e["to"] in self.upstream_map and e["from"] in self.downstream_map:
                self.upstream_map[e["to"]].append(e["from"])
                self.downstream_map[e["from"]].append(e["to"])

    def _initialize_metrics(self, node: Dict[str, Any]) -> Dict[str, Any]:
        """Sets up baseline digital twin metrics for a node."""
        node["cpu"] = 10.0
        node["memory"] = 30.0
        node["queue_depth"] = 0.0
        node["latency"] = 15.0
        node["request_rate"] = 100.0
        node["error_rate"] = 0.0
        node["status"] = "HEALTHY"
        return node

    def run_simulation(self, trigger: Dict[str, Any], max_ticks: int = 15) -> Dict[str, Any]:
        scenario = trigger.get("scenario", "custom_node_failure")
        target_id = trigger.get("target")
        
        timeline = []
        affected_nodes = set()
        blast_radius_dict = {}
        failure_chains = []
        
        # Apply Scenario Baseline Faults at T=0
        self._apply_scenario_trigger(scenario, target_id)
        
        # Main Simulation Loop (Discrete Ticks)
        for t in range(max_ticks):
            tick_events = []
            state_changed = False
            
            # Phase 1: Metric Propagation & Calculation
            # Calculate new metrics for all nodes based on the current state of their neighbors
            new_metrics = {}
            for nid, node in self.nodes.items():
                new_metrics[nid] = self._calculate_node_metrics(node, nid)
                
            # Phase 2: State Evaluation
            for nid, node in self.nodes.items():
                old_state = node["status"]
                metrics = new_metrics[nid]
                
                # Check for critical thresholds to organic state transition
                new_state, reason, trigger_metric = self._evaluate_state_thresholds(node, metrics)
                
                if new_state != old_state:
                    state_changed = True
                    metrics["status"] = new_state
                    blast_radius_dict[nid] = new_state
                    affected_nodes.add(nid)
                    
                    # Generate Failure Chain Event
                    cause_node = self._identify_cause(nid, metrics)
                    chain_record = {
                        "cause_node_id": cause_node,
                        "trigger_metric": trigger_metric,
                        "impact_node_id": nid,
                        "reason": reason,
                        "timestamp": f"T+{t}"
                    }
                    failure_chains.append(chain_record)
                    
                    tick_events.append({
                        "tick": f"T+{t}",
                        "nodeId": nid,
                        "state": new_state,
                        "message": f"[{trigger_metric.upper()}] {reason}",
                        "chain": chain_record
                    })
                
                # Apply new metrics to the main node state
                for k, v in metrics.items():
                    self.nodes[nid][k] = v
                    
            if tick_events:
                timeline.extend(tick_events)
                
            # Early exit if the system has stabilized
            if not state_changed and t > 2:
                break
                
        return {
            "timeline": timeline,
            "failureChains": failure_chains,
            "affectedNodes": list(affected_nodes),
            "blastRadius": blast_radius_dict
        }

    def _apply_scenario_trigger(self, scenario: str, target_id: str):
        """Injects base metric anomalies based on the scenario type."""
        if scenario == "black_friday_traffic":
            for n in self.nodes.values():
                if n.get("type", "").lower() in ["frontend", "cdn"]:
                    n["request_rate"] = 15000.0  # Massive spike
                    n["cpu"] = 98.0
        elif scenario == "retry_storm":
            for n in self.nodes.values():
                if n.get("type", "").lower() == "api":
                    n["request_rate"] = 5000.0
        elif scenario == "database_saturation":
            for n in self.nodes.values():
                if n.get("type", "").lower() == "database":
                    n["cpu"] = 100.0
                    n["latency"] = 8000.0
        elif scenario == "queue_congestion":
            for n in self.nodes.values():
                if n.get("type", "").lower() == "queue":
                    n["queue_depth"] = 500000.0
        elif scenario == "api_failure":
            api_nodes = [n for n in self.nodes.values() if n.get("type", "").lower() == "api"]
            if api_nodes:
                api_nodes[0]["error_rate"] = 1.0
                api_nodes[0]["status"] = "FAILED"
        else:
            if target_id and target_id in self.nodes:
                fault_type = "Failure"
                # Target specific fault
                self.nodes[target_id]["cpu"] = 100.0
                self.nodes[target_id]["latency"] = 10000.0

    def _calculate_node_metrics(self, node: Dict[str, Any], nid: str) -> Dict[str, Any]:
        """Calculates T+1 metrics for a node based on its downstream dependencies."""
        new_m = {
            "cpu": node["cpu"],
            "memory": node["memory"],
            "queue_depth": node["queue_depth"],
            "latency": node["latency"],
            "request_rate": node["request_rate"],
            "error_rate": node["error_rate"],
            "status": node["status"]
        }
        
        node_type = node.get("type", "").lower()
        downstreams = self.downstream_map.get(nid, [])
        
        if node["status"] == "FAILED":
            # Hardcoded failed metrics
            new_m["cpu"] = 0.0
            new_m["latency"] = 99999.0
            new_m["error_rate"] = 1.0
            new_m["request_rate"] = 0.0
            return new_m

        # Aggregate downstream pressure
        downstream_latency = 0.0
        downstream_errors = 0.0
        downstream_queue = 0.0
        
        for d_id in downstreams:
            d_node = self.nodes[d_id]
            if d_node["status"] == "FAILED":
                downstream_errors += 1.0
            downstream_latency += max(0, d_node["latency"] - 15.0)
            if d_node.get("type", "").lower() == "queue":
                downstream_queue += d_node["queue_depth"]
                
        # Metric Propagation Rules
        if node_type == "api":
            # Retries affect downstream
            if downstream_latency > 500:
                new_m["request_rate"] *= 1.5 # Retry amplification
            new_m["latency"] = 15.0 + downstream_latency
            new_m["error_rate"] = min(1.0, downstream_errors / max(1, len(downstreams)))
            new_m["cpu"] = min(100.0, node["cpu"] + (new_m["request_rate"] * 0.01))
            
        elif node_type == "database":
            # Latency affects services
            new_m["cpu"] = min(100.0, node["cpu"] + (node["request_rate"] * 0.05))
            if new_m["cpu"] > 90.0:
                new_m["latency"] += 1000.0 # Saturation spike
            
        elif node_type == "queue":
            # Backlog growth affects consumers
            if downstream_errors > 0 or downstream_latency > 1000:
                new_m["queue_depth"] += 10000.0 # Consumers blocked
            new_m["latency"] = 15.0 + (new_m["queue_depth"] * 0.005)
            new_m["memory"] = min(100.0, node["memory"] + (new_m["queue_depth"] * 0.0001))
            
        else: # Generic Service
            new_m["latency"] = 15.0 + downstream_latency
            if downstream_queue > 50000:
                new_m["cpu"] = min(100.0, node["cpu"] + 20.0) # Polling waste
            new_m["error_rate"] = min(1.0, downstream_errors / max(1, len(downstreams)))
            
        return new_m

    def _evaluate_state_thresholds(self, node: Dict[str, Any], metrics: Dict[str, Any]) -> tuple[str, str, str]:
        """Returns (NewState, Reason, TriggerMetric) if a threshold is breached."""
        old_state = node["status"]
        if old_state == "FAILED":
            return "FAILED", "Node is completely offline", "status"
            
        # Rules for deterioration
        if metrics["error_rate"] >= 0.8:
            return "FAILED", "Error rate exceeded 80% (Connection refused)", "error_rate"
        
        if metrics["latency"] > 5000.0 and old_state != "FAILED":
            return "FAILED", "Latency exceeded 5000ms timeout threshold", "latency"
            
        if metrics["queue_depth"] > 100000 and old_state != "DEGRADED":
            return "DEGRADED", "Queue backlog exceeded memory capacity", "queue_depth"
            
        if metrics["cpu"] > 95.0 and old_state != "DEGRADED":
            return "DEGRADED", "CPU Saturation > 95% causing lock contention", "cpu"
            
        if metrics["latency"] > 1000.0 and old_state == "HEALTHY":
            return "STRESSED", "Elevated latency causing upstream backpressure", "latency"
            
        if metrics["cpu"] > 80.0 and old_state == "HEALTHY":
            return "STRESSED", "CPU > 80% elevated processing load", "cpu"
            
        return old_state, "Operating normally", "none"
        
    def _identify_cause(self, target_id: str, target_metrics: Dict[str, Any]) -> str:
        """Finds the most likely downstream node that caused this node's metrics to spike."""
        downstreams = self.downstream_map.get(target_id, [])
        if not downstreams:
            return target_id # Self-caused
            
        # Find the downstream with the worst state or highest latency
        worst_d_id = target_id
        highest_latency = 0
        for d_id in downstreams:
            d_node = self.nodes[d_id]
            if d_node["status"] == "FAILED":
                return d_id
            if d_node["latency"] > highest_latency:
                highest_latency = d_node["latency"]
                worst_d_id = d_id
                
        return worst_d_id
