import uuid
from fastapi import FastAPI, Depends, HTTPException
from typing import Dict, Any, List

from backend.db.neo4j import neo4j_manager
from backend.dependencies import get_graph_service
from backend.services.graph_service import GraphService
from backend.models.architecture import ArchitectureUploadModel
from backend.services.validation_service import validate_architecture
from backend.services.scenario_service import ScenarioService
from backend.services.simulation_engine import SimulationEngine
from backend.services.reliability_service import ReliabilityService
from backend.services.analysis_service import AnalysisService

app = FastAPI(
    title="BLACKOUT - Simulation Engine API",
    description="Deterministic Graph Simulation API",
    version="1.0.0"
)

# In-memory store for simulation results (for prototype)
simulations_db = {}

@app.on_event("startup")
def startup_event():
    try:
        neo4j_manager.connect()
    except Exception as e:
        print(f"Error connecting to Neo4j: {e}")

@app.on_event("shutdown")
def shutdown_event():
    neo4j_manager.close()

@app.post("/v1/architectures", tags=["Architecture"])
def upload_architecture(
    upload: ArchitectureUploadModel,
    graph_service: GraphService = Depends(get_graph_service)
):
    nodes = upload.graph.get("nodes", [])
    edges = upload.graph.get("edges", [])
    
    # Phase 0: Validate
    validation = validate_architecture(nodes, edges)
    if not validation.valid:
        raise HTTPException(status_code=400, detail={"errors": validation.warnings})
        
    # Phase 1/2: Persist to Neo4j
    graph_service.load_architecture(nodes, edges)
    
    arch_id = str(uuid.uuid4())
    
    if upload.user_id:
        graph_service.link_architecture_to_user(
            clerk_id=upload.user_id,
            arch_id=arch_id,
            name=upload.name or "Unnamed Architecture",
            environment=upload.environment or "production",
            nodes_count=len(nodes)
        )
    
    return {
        "id": arch_id,
        "valid": True,
        "warnings": validation.warnings,
        "graph_health_score": validation.graph_health_score
    }

@app.get("/v1/architectures", tags=["Architecture"])
def get_architectures(graph_service: GraphService = Depends(get_graph_service)):
    # Returns current topology
    return graph_service.get_topology()

@app.get("/v1/scenarios", tags=["Scenarios"])
def get_scenarios():
    svc = ScenarioService()
    return svc.get_all_scenarios()

@app.post("/v1/simulations", tags=["Simulation"])
def run_simulation(
    trigger: Dict[str, Any],
    graph_service: GraphService = Depends(get_graph_service)
):
    # Fetch latest topology from Neo4j
    topology = graph_service.get_topology()
    
    # Run deterministic traversal
    engine = SimulationEngine(topology)
    result = engine.run_simulation(trigger)
    
    sim_id = str(uuid.uuid4())
    simulations_db[sim_id] = result
    
    return {
        "id": sim_id,
        "timeline": result["timeline"],
        "affectedNodes": result["affectedNodes"],
        "blastRadius": result["blastRadius"]
    }

@app.post("/v1/analysis", tags=["Analysis"])
def analyze_simulation(
    payload: Dict[str, Any],
    graph_service: GraphService = Depends(get_graph_service)
):
    sim_id = payload.get("simulationId")
    scenario = payload.get("scenario", "unknown_scenario")
    
    sim_data = simulations_db.get(sim_id)
    if not sim_data:
        # Fallback if no sim_id is provided or found
        sim_data = {"timeline": [], "affectedNodes": [], "blastRadius": {}}
        
    # Bottleneck Analysis
    bottlenecks = graph_service.analyze_bottlenecks()
    
    # Reliability Scoring
    topology = graph_service.get_topology()
    total_nodes = len(topology.get("nodes", []))
    
    rel_svc = ReliabilityService()
    max_depth = len(sim_data["timeline"]) # Rough proxy for depth
    score_data = rel_svc.calculate_score(
        total_nodes=total_nodes,
        affected_nodes=len(sim_data["affectedNodes"]),
        max_depth=max_depth,
        risk_score=bottlenecks["riskScore"]
    )
    
    # AI Report Generation
    ai_svc = AnalysisService()
    report = ai_svc.generate_report(sim_data["timeline"], bottlenecks, scenario)
    
    # Save to history if user_id and arch_id are provided
    user_id = payload.get("userId")
    arch_id = payload.get("archId")
    if user_id and arch_id and sim_id:
        graph_service.save_simulation_history(
            clerk_id=user_id,
            arch_id=arch_id,
            sim_id=sim_id,
            scenario=scenario,
            score=score_data["reliabilityScore"]
        )
    
    return {
        "reliabilityScore": score_data["reliabilityScore"],
        "severity": score_data["severity"],
        "criticalNodes": bottlenecks["criticalNodes"],
        "report": report
    }

@app.get("/v1/users/{user_id}/architectures", tags=["User Dashboard"])
def get_user_architectures(user_id: str, graph_service: GraphService = Depends(get_graph_service)):
    return graph_service.get_user_architectures(user_id)

@app.get("/v1/users/{user_id}/simulations", tags=["User Dashboard"])
def get_user_simulations(user_id: str, graph_service: GraphService = Depends(get_graph_service)):
    return graph_service.get_user_simulations(user_id)
