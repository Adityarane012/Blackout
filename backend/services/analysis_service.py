from typing import Dict, Any, List

class AnalysisService:
    """
    Generates intelligent-sounding but purely deterministic textual analysis 
    based on the simulation timeline and bottleneck data.
    """
    
    def generate_report(self, timeline: List[Dict[str, Any]], bottlenecks: Dict[str, Any], scenario: str) -> str:
        if not timeline:
            return "No failure events detected."
            
        root_event = timeline[0]
        root_node = root_event.get("nodeId", "Unknown")
        
        # Determine Primary Impact
        primary_impact = "None"
        secondary_impact = "None"
        if len(timeline) > 1:
            primary_impact = timeline[1].get("nodeId", "Unknown")
        if len(timeline) > 2:
            secondary_impact = timeline[2].get("nodeId", "Unknown")
            
        # Determine Bottleneck Explanation
        critical_nodes = bottlenecks.get("criticalNodes", [])
        bottleneck_text = "No critical bottlenecks identified."
        if critical_nodes:
            top_hub = critical_nodes[0]
            bottleneck_text = f"The node '{top_hub['node'].get('id')}' acts as a critical dependency hub with {top_hub['inDegree']} incoming edges, amplifying the blast radius."
            
        # Generate Recommended Action
        action = "Review system architecture."
        if "database" in root_node.lower() or "db" in root_node.lower():
            action = "Introduce caching layers (e.g., Redis) to absorb latency spikes, and implement strict connection pooling."
        elif "queue" in root_node.lower():
            action = "Implement Dead Letter Queues (DLQ) and horizontal auto-scaling for consumer workers."
        elif "api" in root_node.lower():
            action = "Add Circuit Breakers to prevent retry storms from overwhelming external APIs."
        else:
            action = "Implement bulkheads and rate limiting to isolate component failures."

        report = f"""**Root Cause Analysis:**
The simulated {scenario} scenario triggered a critical threshold breach on node '{root_node}'.

**Primary Impact:**
Failure propagated immediately to '{primary_impact}', causing severe degradation.

**Secondary Impact:**
Cascading stress eventually compromised '{secondary_impact}', leading to widespread architectural instability.

**Bottleneck Explanation:**
{bottleneck_text}

**Recommended Action:**
{action}
"""
        return report
