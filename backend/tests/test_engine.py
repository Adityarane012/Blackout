import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.services.validation_service import validate_architecture
from backend.services.simulation_engine import SimulationEngine
from backend.services.reliability_service import ReliabilityService

client = TestClient(app)

def test_graph_validation():
    nodes = [{"id": "db1", "type": "database"}, {"id": "api1", "type": "service"}]
    edges = [{"source": "api1", "target": "db1"}]
    
    result = validate_architecture(nodes, edges)
    assert result.valid is True
    assert result.graph_health_score == 100

def test_graph_validation_orphan():
    nodes = [{"id": "db1", "type": "database"}, {"id": "orphan", "type": "service"}]
    edges = []
    
    result = validate_architecture(nodes, edges)
    assert result.valid is True
    assert len(result.warnings) > 0
    assert result.graph_health_score < 100

def test_simulation_engine_propagation():
    topology = {
        "nodes": [
            {"id": "db", "type": "database"},
            {"id": "api", "type": "service"}
        ],
        "connections": [
            {"from": "api", "to": "db"}
        ]
    }
    engine = SimulationEngine(topology)
    trigger = {"scenario": "custom_node_failure", "target": "db", "initial_state": "FAILED"}
    
    result = engine.run_simulation(trigger)
    assert "db" in result["affectedNodes"]
    assert "api" in result["affectedNodes"]
    assert result["blastRadius"]["db"] == "FAILED"
    assert result["blastRadius"]["api"] == "FAILED"

def test_reliability_scoring():
    svc = ReliabilityService()
    # 5 nodes total, 5 affected, depth 3, high risk bottleneck
    score = svc.calculate_score(total_nodes=5, affected_nodes=5, max_depth=3, risk_score=80)
    assert score["reliabilityScore"] < 50
    assert score["severity"] == "CRITICAL"
