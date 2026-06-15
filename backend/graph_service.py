from typing import List, Dict, Any
from neo4j import Session
from backend.models.graph import NodeModel, DependencyModel
from backend.db.queries import (
    GET_ALL_NODES_CYPHER,
    GET_ALL_DEPENDENCIES_CYPHER,
    UPDATE_NODE_TELEMETRY_CYPHER,
    TRACE_CASCADE_BLAST_RADIUS_CYPHER
)
from backend.db.utils import create_graph_node, create_graph_relationship, bulk_import_topology

class GraphService:
    """
    Service layer providing modular abstractions to manage graph models 
    and calculate cascading fault propagation through Neo4j databases.
    """
    def __init__(self, session: Session):
        self.session = session

    def create_infra_node(self, node: NodeModel) -> Dict[str, Any]:
        """
        Uses parameterized Cypher utilities to create or merge an active SRE Node Entity.
        """
        return create_graph_node(self.session, node)

    def create_dependency(self, dep: DependencyModel) -> Dict[str, Any]:
        """
        Uses parameterized Cypher utilities to forge directed DEPENDS_ON relationship edges.
        """
        return create_graph_relationship(self.session, dep)

    def update_node_status(self, node_id: str, status: str, load: float, latency: float = 0.0, error_rate: float = 0.0) -> Dict[str, Any]:
        """
        Mutates current node telemetry parameters (load, latency, error_rate) within a transaction.
        """
        result = self.session.run(UPDATE_NODE_TELEMETRY_CYPHER, {
            "id": node_id,
            "status": status,
            "load": load,
            "latency": latency,
            "error_rate": error_rate
        })
        record = result.single()
        return record["node"] if record else {}

    def get_topology(self) -> Dict[str, Any]:
        """
        Queries and matches all nodes and relationships to generate a clean topology map.
        """
        nodes_result = self.session.run(GET_ALL_NODES_CYPHER)
        nodes = [rec["node"] for rec in nodes_result]
        
        conn_result = self.session.run(GET_ALL_DEPENDENCIES_CYPHER)
        connections = [rec["connection"] for rec in conn_result]
        
        return {
            "nodes": nodes,
            "connections": connections
        }

    def trace_cascade_blast_radius(self, root_failure_id: str) -> List[Dict[str, Any]]:
        """
        Executes a recursive, deep-relationship search to determine all upstream
        elements in danger of cascading crashes if the root node fails.
        """
        result = self.session.run(TRACE_CASCADE_BLAST_RADIUS_CYPHER, {"root_id": root_failure_id})
        return [rec["affected_node"] for rec in result]

    def bulk_import(self, nodes: List[NodeModel], dependencies: List[DependencyModel]) -> Dict[str, Any]:
        """
        Transactionally batch-loads whole network grids in a single atomic pass.
        """
        return bulk_import_topology(self.session, nodes, dependencies)

    def reset_grid(self) -> bool:
        """
        Performs an emergency complete sweep of all nodes and relationships in the database.
        """
        query = "MATCH (n:InfraNode) DETACH DELETE n"
        self.session.run(query)
        return True
