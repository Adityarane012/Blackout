from typing import Dict, Any, List

class ReliabilityService:
    """
    Calculates overall architecture reliability and outage severity.
    """
    
    def calculate_score(self, total_nodes: int, affected_nodes: int, max_depth: int, risk_score: int) -> Dict[str, Any]:
        """
        Calculates a reliability score (0-100) based on multiple penalty factors.
        """
        score = 100
        
        # 1. Affected Node Ratio Penalty
        ratio = affected_nodes / max(1, total_nodes)
        score -= (ratio * 40)  # Up to 40 point penalty for full graph collapse
        
        # 2. Propagation Depth Penalty
        # Deep cascades indicate poor isolation / lack of circuit breakers
        score -= min(30, max_depth * 5)
        
        # 3. Bottleneck Risk Penalty
        # Incorporates the risk_score calculated by the Neo4j bottleneck analysis
        score -= (risk_score * 0.3)
        
        score = max(0, int(score))
        
        # Determine Severity Level
        severity = "LOW"
        if score < 50:
            severity = "CRITICAL"
        elif score < 70:
            severity = "HIGH"
        elif score < 85:
            severity = "MEDIUM"
            
        return {
            "reliabilityScore": score,
            "severity": severity
        }
