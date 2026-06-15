from fastapi import FastAPI, Depends, HTTPException
from typing import Dict, Any, List
from backend.db.neo4j import neo4j_manager
from backend.dependencies import get_graph_service
from backend.graph_service import GraphService
from backend.models.graph import NodeModel, DependencyModel

app = FastAPI(
    title="BLACKOUT - Neo4j SRE Graph Backend",
    description="FastAPI ingestion and cascade propagation analysis engine powered by Neo4j.",
    version="1.0.0"
)

@app.on_event("startup")
def startup_event():
    """
    Establish Neo4j connection pool on service initialization.
    """
    try:
        neo4j_manager.connect()
    except Exception as e:
        print(f"Error during backend startup connection pool initialize: {e}")

@app.on_event("shutdown")
def shutdown_event():
    """
    Safely release and dispose of Neo4j driver pools on service shutdown.
    """
    neo4j_manager.close()

@app.get("/health", tags=["Telemetry"])
def health_check():
    """
    Returns connection status verification for SRE monitor gates.
    """
    try:
        driver = neo4j_manager.get_driver()
        driver.verify_connectivity()
        return {"status": "healthy", "neo4j": "connected"}
    except Exception as e:
        raise HTTPException(
            status_code=503, 
            detail=f"Neo4j link connection unhealthy: {str(e)}"
        )

@app.get("/topology", response_model=Dict[str, Any], tags=["Grid Operations"])
def get_grid_topology(service: GraphService = Depends(get_graph_service)):
    """
    Fetches the complete dynamic grid network mapping nodes and connections from Neo4j.
    """
    return service.get_topology()

@app.post("/nodes", response_model=Dict[str, Any], tags=["Grid Operations"])
def upsert_node(
    node: NodeModel,
    service: GraphService = Depends(get_graph_service)
):
    """
    Registers or updates an active SRE node entity (Service, Database, Queue, Cache, API, Frontend).
    """
    try:
        return service.create_infra_node(node)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/dependencies", response_model=Dict[str, Any], tags=["Grid Operations"])
def link_dependency(
    dep: DependencyModel,
    service: GraphService = Depends(get_graph_service)
):
    """
    Creates or registers an active directed traffic flow dependency link between two nodes.
    """
    try:
        return service.create_dependency(dep)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/topology/bulk", response_model=Dict[str, Any], tags=["Grid Operations"])
def bulk_import_topologies(
    nodes: List[NodeModel],
    dependencies: List[DependencyModel],
    service: GraphService = Depends(get_graph_service)
):
    """
    Atomically imports an entire SRE network grid with multiple nodes and dependencies.
    """
    try:
        return service.bulk_import(nodes, dependencies)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/nodes/{node_id}/telemetry", response_model=Dict[str, Any], tags=["Telemetry"])
def update_node_telemetry(
    node_id: str,
    status: str,
    load: float,
    latency: float = 0.0,
    error_rate: float = 0.0,
    service: GraphService = Depends(get_graph_service)
):
    """
    Pipes real-time load, status, and latency fluctuations directly to the Graph database.
    """
    try:
        updated = service.update_node_status(node_id, status, load, latency, error_rate)
        if not updated:
            raise HTTPException(status_code=404, detail=f"Node {node_id} not found in grid topology.")
        return updated
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/nodes/{node_id}/blast-radius", response_model=List[Dict[str, Any]], tags=["Failover Analysis"])
def trace_cascade_blast_radius(
    node_id: str,
    service: GraphService = Depends(get_graph_service)
):
    """
    Queries Neo4j database to trace the full recursive upstream crash impact radius
    in the event that the target node undergoes complete critical failure.
    """
    try:
        return service.trace_cascade_blast_radius(node_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/topology", tags=["Grid Operations"])
def purge_grid(service: GraphService = Depends(get_graph_service)):
    """
    Wipes the entire network topology from the graph database (Emergency Action).
    """
    try:
        return {"success": service.reset_grid()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
