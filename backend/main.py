import uuid
import logging
from fastapi import FastAPI, Depends, HTTPException
from typing import Dict, Any, List, Optional

from backend.db.neo4j import neo4j_manager
from backend.dependencies import get_graph_service
from backend.services.graph_service import GraphService
from backend.models.architecture import ArchitectureUploadModel
from backend.services.validation_service import validate_architecture
from backend.services.scenario_service import ScenarioService
from backend.services.simulation_engine import SimulationEngine
from backend.services.reliability_service import ReliabilityService
from backend.services.analysis_service import AnalysisService
from backend.services.intelligence_service import IntelligenceService

logger = logging.getLogger("blackout.api")

app = FastAPI(
    title="BLACKOUT - Simulation Engine API",
    description="Deterministic Graph Simulation API",
    version="2.0.0"
)

# In-memory stores (work with or without Neo4j)
simulations_db: Dict[str, Any] = {}
architectures_db: Dict[str, Any] = {}  # arch_id -> { nodes, connections }

# Track whether Neo4j is available
_neo4j_available = False

@app.on_event("startup")
def startup_event():
    global _neo4j_available
    try:
        neo4j_manager.connect()
        _neo4j_available = True
        logger.info("Neo4j connected successfully.")
    except Exception as e:
        _neo4j_available = False
        logger.warning(f"Neo4j unavailable — running in offline/demo mode: {e}")

@app.on_event("shutdown")
def shutdown_event():
    neo4j_manager.close()


def _get_optional_graph_service() -> Optional[GraphService]:
    """Returns a GraphService if Neo4j is available, else None."""
    if not _neo4j_available:
        return None
    try:
        session = next(neo4j_manager.get_session())
        return GraphService(session)
    except Exception:
        return None


@app.post("/v1/architectures", tags=["Architecture"])
def upload_architecture(upload: ArchitectureUploadModel):
    nodes = upload.graph.get("nodes", [])
    edges = upload.graph.get("edges", [])
    
    # Phase 0: Validate
    validation = validate_architecture(nodes, edges)
    if not validation.valid:
        raise HTTPException(status_code=400, detail={"errors": validation.warnings})
        
    arch_id = str(uuid.uuid4())
    
    # Build in-memory topology (always works)
    connections = []
    for e in edges:
        connections.append({
            "from": e.get("source"),
            "to": e.get("target"),
            "status": "active",
            "traffic": 50.0,
            "latency": 20.0
        })
    
    architectures_db[arch_id] = {
        "nodes": nodes,
        "connections": connections
    }
    
    # Try to persist to Neo4j if available (non-blocking)
    gs = _get_optional_graph_service()
    if gs:
        try:
            gs.load_architecture(nodes, edges, arch_id)
            if upload.user_id:
                gs.link_architecture_to_user(
                    clerk_id=upload.user_id,
                    arch_id=arch_id,
                    name=upload.name or "Unnamed Architecture",
                    environment=upload.environment or "production",
                    nodes_count=len(nodes)
                )
        except Exception as e:
            logger.warning(f"Neo4j persistence failed (continuing in-memory): {e}")
    
    return {
        "id": arch_id,
        "valid": True,
        "warnings": validation.warnings,
        "graph_health_score": validation.graph_health_score
    }

@app.get("/v1/architectures/{arch_id}", tags=["Architecture"])
def get_architecture(arch_id: str):
    # Try in-memory first
    if arch_id in architectures_db:
        return architectures_db[arch_id]
    
    # Fallback to Neo4j
    gs = _get_optional_graph_service()
    if gs:
        topology = gs.get_topology(arch_id)
        if topology.get("nodes"):
            return topology
    
    raise HTTPException(status_code=404, detail="Architecture not found")

@app.delete("/v1/architectures/{arch_id}", tags=["Architecture"])
def delete_architecture(arch_id: str):
    architectures_db.pop(arch_id, None)
    gs = _get_optional_graph_service()
    if gs:
        try:
            gs.session.run("MATCH (n:InfraNode {arch_id: $arch_id}) DETACH DELETE n", {"arch_id": arch_id})
        except Exception:
            pass
    return {"status": "deleted", "id": arch_id}

@app.get("/v1/intelligence/{arch_id}", tags=["Intelligence"])
def get_intelligence_scan(arch_id: str):
    # Try real Neo4j intelligence if available
    gs = _get_optional_graph_service()
    if gs:
        try:
            svc = IntelligenceService()
            return svc.generate_risk_scan(arch_id)
        except Exception as e:
            logger.warning(f"Intelligence scan via Neo4j failed: {e}")
    
    # Fallback: generate intelligence from in-memory topology
    topo = architectures_db.get(arch_id)
    if not topo:
        return {
            "riskLevel": "UNKNOWN",
            "riskScore": 0,
            "reasons": ["Topology not found."],
            "recommendations": ["Upload a valid architecture."],
            "metrics": {
                "spofCount": 0,
                "criticalHubs": 0,
                "maxDependencyDepth": 0
            }
        }
    
    return _generate_offline_intelligence(topo)

def _generate_offline_intelligence(topo: Dict[str, Any]) -> Dict[str, Any]:
    """Generates a basic risk scan from in-memory topology without Neo4j."""
    nodes = topo.get("nodes", [])
    connections = topo.get("connections", [])
    
    # Count in-degree for each node
    in_degree: Dict[str, int] = {n.get("id", ""): 0 for n in nodes}
    out_degree: Dict[str, int] = {n.get("id", ""): 0 for n in nodes}
    for c in connections:
        target = c.get("to", "")
        source = c.get("from", "")
        if target in in_degree:
            in_degree[target] += 1
        if source in out_degree:
            out_degree[source] += 1
    
    node_map = {n.get("id", ""): n for n in nodes}
    
    # Find SPOFs: nodes with high in-degree but no redundancy peers of same type
    spofs = []
    critical_hubs = []
    for nid, deg in sorted(in_degree.items(), key=lambda x: -x[1]):
        node = node_map.get(nid, {})
        n_type = node.get("type", "")
        same_type_peers = [n for n in nodes if n.get("type") == n_type and n.get("id") != nid]
        
        if deg >= 3:
            critical_hubs.append({
                "nodeId": nid,
                "label": node.get("label", nid),
                "type": n_type,
                "inDegree": deg,
                "risk": "HIGH" if len(same_type_peers) == 0 else "MEDIUM"
            })
        
        if deg >= 2 and len(same_type_peers) == 0:
            spofs.append({
                "nodeId": nid,
                "label": node.get("label", nid),
                "type": n_type,
                "dependents": deg,
                "recommendation": f"Introduce redundancy for {node.get('label', nid)} — it has {deg} dependents and no peers."
            })
    
    risk_score = 0
    reasons = []
    recommendations = []

    if spofs:
        risk_score += len(spofs) * 30
        for sp in spofs:
            reasons.append(f"'{sp['label']}' ({sp['type']}) supports {sp['dependents']} dependents and lacks any redundancy peers in its cluster.")
            if sp['type'].lower() == "database":
                recommendations.append(f"Introduce read replicas and automated failover for {sp['label']}.")
            else:
                recommendations.append(f"Deploy additional redundant instances of {sp['label']} behind a Load Balancer.")
                
    if critical_hubs:
        top_hub = critical_hubs[0]
        if top_hub["inDegree"] > 3:
            risk_score += 20
            reasons.append(f"'{top_hub['label']}' is a massive Critical Hub (in-degree: {top_hub['inDegree']}). A failure here will instantly trigger a massive blast radius.")
            recommendations.append(f"Implement circuit breakers on all services calling {top_hub['label']} to isolate cascading faults.")
            
    if max_depth >= 4:
        risk_score += 20
        reasons.append(f"Architecture contains dangerously deep synchronous dependency chains (Depth: {max_depth}). High latency amplification risk.")
        recommendations.append(f"Break up synchronous chains by introducing async message queues (Kafka/SQS) where appropriate.")
        
    risk_level = "LOW"
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
            "criticalHubs": len(critical_hubs),
            "maxDependencyDepth": max_depth
        }
    }

def _bfs_depth(start_id: str, connections: List[Dict], direction: str) -> int:
    """Simple BFS to measure dependency depth."""
    from collections import deque
    visited = set()
    queue = deque([(start_id, 0)])
    max_depth = 0
    while queue:
        nid, depth = queue.popleft()
        if nid in visited:
            continue
        visited.add(nid)
        max_depth = max(max_depth, depth)
        for c in connections:
            if direction == "backward" and c.get("to") == nid and c.get("from") not in visited:
                queue.append((c["from"], depth + 1))
            elif direction == "forward" and c.get("from") == nid and c.get("to") not in visited:
                queue.append((c["to"], depth + 1))
    return max_depth


@app.get("/v1/scenarios", tags=["Scenarios"])
def get_scenarios():
    svc = ScenarioService()
    return svc.get_all_scenarios()

@app.post("/v1/simulations", tags=["Simulation"])
def run_simulation(trigger: Dict[str, Any]):
    arch_id = trigger.get("archId")
    if not arch_id:
        raise HTTPException(status_code=400, detail="archId is required for simulation")
    
    # Try in-memory first, then Neo4j
    topology = architectures_db.get(arch_id)
    if not topology:
        gs = _get_optional_graph_service()
        if gs:
            topology = gs.get_topology(arch_id)
    
    if not topology or not topology.get("nodes"):
        raise HTTPException(status_code=404, detail="Architecture not found. Upload it first.")
    
    # Run deterministic traversal
    engine = SimulationEngine(topology)
    result = engine.run_simulation(trigger)
    
    sim_id = str(uuid.uuid4())
    simulations_db[sim_id] = result
    
    return {
        "id": sim_id,
        "timeline": result["timeline"],
        "failureChains": result.get("failureChains", []),
        "affectedNodes": result["affectedNodes"],
        "blastRadius": result["blastRadius"]
    }

@app.post("/v1/analysis", tags=["Analysis"])
def analyze_simulation(payload: Dict[str, Any]):
    sim_id = payload.get("simulationId")
    scenario = payload.get("scenario", "unknown_scenario")
    arch_id = payload.get("archId")
    
    sim_data = simulations_db.get(sim_id)
    if not sim_data:
        sim_data = {"timeline": [], "affectedNodes": [], "blastRadius": {}}
    
    # Try Neo4j bottleneck analysis, fallback to in-memory
    bottlenecks = {"criticalNodes": [], "riskScore": 0}
    total_nodes = 0
    
    gs = _get_optional_graph_service()
    if gs and arch_id:
        try:
            bottlenecks = gs.analyze_bottlenecks(arch_id)
            topology = gs.get_topology(arch_id)
            total_nodes = len(topology.get("nodes", []))
        except Exception:
            pass
    
    if total_nodes == 0 and arch_id and arch_id in architectures_db:
        topo = architectures_db[arch_id]
        total_nodes = len(topo.get("nodes", []))
        # Simple in-memory bottleneck calculation
        in_degree: Dict[str, int] = {}
        for c in topo.get("connections", []):
            tid = c.get("to", "")
            in_degree[tid] = in_degree.get(tid, 0) + 1
        
        node_map = {n.get("id"): n for n in topo.get("nodes", [])}
        for nid, deg in sorted(in_degree.items(), key=lambda x: -x[1])[:3]:
            bottlenecks["criticalNodes"].append({
                "node": node_map.get(nid, {"id": nid}),
                "inDegree": deg,
                "dependents": []
            })
        if bottlenecks["criticalNodes"]:
            max_deg = bottlenecks["criticalNodes"][0]["inDegree"]
            total_in = sum(in_degree.values())
            bottlenecks["riskScore"] = min(100, int((max_deg / max(1, total_in)) * 100) + 20)
    
    # Reliability Scoring
    rel_svc = ReliabilityService()
    max_depth = len(sim_data["timeline"])
    score_data = rel_svc.calculate_score(
        total_nodes=max(1, total_nodes),
        affected_nodes=len(sim_data["affectedNodes"]),
        max_depth=max_depth,
        risk_score=bottlenecks["riskScore"]
    )
    
    # AI Report Generation
    ai_svc = AnalysisService()
    report = ai_svc.generate_report(sim_data["timeline"], bottlenecks, scenario)
    
    # Save to history if possible
    user_id = payload.get("userId")
    if user_id and arch_id and sim_id and gs:
        try:
            gs.save_simulation_history(
                clerk_id=user_id,
                arch_id=arch_id,
                sim_id=sim_id,
                scenario=scenario,
                score=score_data["reliabilityScore"]
            )
        except Exception:
            pass
    
    return {
        "reliabilityScore": score_data["reliabilityScore"],
        "severity": score_data["severity"],
        "criticalNodes": bottlenecks["criticalNodes"],
        "report": report
    }

@app.get("/v1/users/{user_id}/architectures", tags=["User Dashboard"])
def get_user_architectures(user_id: str):
    gs = _get_optional_graph_service()
    if gs:
        try:
            return gs.get_user_architectures(user_id)
        except Exception:
            pass
    return []

@app.get("/v1/users/{user_id}/simulations", tags=["User Dashboard"])
def get_user_simulations(user_id: str):
    gs = _get_optional_graph_service()
    if gs:
        try:
            return gs.get_user_simulations(user_id)
        except Exception:
            pass
    return []
