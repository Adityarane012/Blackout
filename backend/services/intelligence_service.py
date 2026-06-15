from typing import Dict, Any
from backend.db.neo4j import neo4j_manager
from backend.db.queries import GET_BOTTLENECK_ANALYSIS_CYPHER, GET_SPOF_CYPHER, GET_DEPTH_RISK_CYPHER

class IntelligenceService:
    """
    Analyzes an architecture in Neo4j to generate a Pre-Simulation Risk Scan.
    Detects SPOFs, Bottlenecks, and Depth complexity.
    """
    
    def __init__(self):
        self.session = neo4j_manager.get_session()
        
    def __del__(self):
        if hasattr(self, 'session') and self.session:
            self.session.close()

    def generate_risk_scan(self, arch_id: str) -> Dict[str, Any]:
        """Runs Cypher queries to compile the risk report."""
        
        # 1. Critical Hubs (Bottlenecks)
        hubs_result = self.session.run(GET_BOTTLENECK_ANALYSIS_CYPHER, {"arch_id": arch_id})
        hubs = [record.data() for record in hubs_result]
        
        # 2. Single Points of Failure
        spof_result = self.session.run(GET_SPOF_CYPHER, {"arch_id": arch_id})
        spofs = [record.data() for record in spof_result]
        
        # 3. Depth Risk
        depth_result = self.session.run(GET_DEPTH_RISK_CYPHER, {"arch_id": arch_id})
        depths = [record.data() for record in depth_result]
        max_depth = depths[0]["depth"] if depths else 0
        
        # Analyze overall risk level
        risk_level = "LOW"
        risk_score = 0
        
        reasons = []
        recommendations = []
        
        if spofs:
            risk_score += len(spofs) * 30
            for sp in spofs:
                reasons.append(f"'{sp['label']}' ({sp['type']}) supports {sp['dependents_count']} dependents and lacks any redundancy peers in its cluster.")
                if sp['type'].lower() == "database":
                    recommendations.append(f"Introduce read replicas and automated failover for {sp['label']}.")
                else:
                    recommendations.append(f"Deploy additional redundant instances of {sp['label']} behind a Load Balancer.")
                    
        if hubs:
            top_hub = hubs[0]
            if top_hub["in_degree"] > 3:
                risk_score += 20
                reasons.append(f"'{top_hub['node']['label']}' is a massive Critical Hub (in-degree: {top_hub['in_degree']}). A failure here will instantly trigger a massive blast radius.")
                recommendations.append(f"Implement circuit breakers on all services calling {top_hub['node']['label']} to isolate cascading faults.")
                
        if max_depth >= 4:
            risk_score += 20
            reasons.append(f"Architecture contains dangerously deep synchronous dependency chains (Depth: {max_depth}). High latency amplification risk.")
            recommendations.append(f"Break up synchronous chains by introducing async message queues (Kafka/SQS) where appropriate.")
            
        if risk_score > 60:
            risk_level = "HIGH"
        elif risk_score > 30:
            risk_level = "MEDIUM"
            
        if not reasons:
            reasons.append("Architecture exhibits excellent redundancy and isolated dependency paths.")
            recommendations.append("Continue current SRE best practices.")

        return {
            "riskLevel": risk_level,
            "riskScore": risk_score,
            "reasons": reasons,
            "recommendations": list(set(recommendations)),
            "metrics": {
                "spofCount": len(spofs),
                "criticalHubs": len(hubs),
                "maxDependencyDepth": max_depth
            }
        }
