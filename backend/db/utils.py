import logging
from typing import List, Dict, Any
from neo4j import Session
from backend.models.graph import NodeModel, DependencyModel
from backend.db.queries import (
    UPSERT_NODE_CYPHER, 
    CREATE_DEPENDENCY_CYPHER,
    CREATE_INFRA_NODE_CYPHER
)

logger = logging.getLogger("neo4j_utils")

def create_graph_node(session: Session, node: NodeModel, arch_id: str) -> Dict[str, Any]:
    """
    Production-safe node insertion utility. 
    Applies the specific Neo4j category label based on Node type (e.g. :Database).
    """
    type_label = node.get_neo4j_label()
    params = {
        "id": node.id,
        "arch_id": arch_id,
        "label": node.label,
        "type": node.type,
        "status": node.status,
        "load": node.load,
        "capacity": node.capacity,
        "latency": node.latency,
        "error_rate": node.error_rate,
        "type_label": type_label
    }
    
    try:
        # Attempt to run APOC dynamic multi-labeling for premium Neo4j deployments
        result = session.run(CREATE_INFRA_NODE_CYPHER, params)
        record = result.single()
        if record:
            logger.info(f"Node successfully registered with APOC dynamic multi-label: {node.id} (:{type_label})")
            return dict(record["node"])
    except Exception as apoc_err:
        # Fall back gracefully to clean standard merging if APOC is absent
        logger.warning(f"APOC dynamics not found. Executing standard merge: {apoc_err}")
        
    try:
        result = session.run(UPSERT_NODE_CYPHER, {k: v for k, v in params.items() if k != "type_label"})
        record = result.single()
        return dict(record["n"]) if record else {}
    except Exception as err:
        logger.error(f"Failed to upsert node {node.id}: {err}")
        raise err

def create_graph_relationship(session: Session, dep: DependencyModel, arch_id: str) -> Dict[str, Any]:
    """
    Production-safe connection builder that establishes directed DEPENDS_ON links.
    """
    params = {
        "from_id": dep.from_id,
        "to_id": dep.to_id,
        "arch_id": arch_id,
        "status": dep.status,
        "traffic": dep.traffic,
        "latency": dep.latency
    }
    
    try:
        result = session.run(CREATE_DEPENDENCY_CYPHER, params)
        record = result.single()
        if record:
            logger.info(f"Connected dependency path established: {dep.from_id} -[:DEPENDS_ON]-> {dep.to_id}")
            return dict(record)
        else:
            logger.warning(f"Failed to establish link; target nodes not found in graph database: {dep.from_id} -> {dep.to_id}")
            return {}
    except Exception as err:
        logger.error(f"Exception raised linking dependencies: {err}")
        raise err

def bulk_import_topology(session: Session, nodes: List[NodeModel], dependencies: List[DependencyModel], arch_id: str) -> Dict[str, Any]:
    """
    Transactional bulk-loader that builds an entire cybernetic network topology map in one atomic pass.
    """
    imported_nodes = []
    imported_rels = []
    
    try:
        # Execute atomic import inside a transaction context
        with session.begin_transaction() as tx:
            for node in nodes:
                # Merge the Node Node
                type_label = node.get_neo4j_label()
                tx.run(UPSERT_NODE_CYPHER, {
                    "id": node.id,
                    "arch_id": arch_id,
                    "label": node.label,
                    "type": node.type,
                    "status": node.status,
                    "load": node.load,
                    "capacity": node.capacity,
                    "latency": node.latency,
                    "error_rate": node.error_rate
                })
                # Add specific SRE type tag dynamically (e.g. :Service)
                tx.run(f"MATCH (n:InfraNode {{id: $id}}) SET n:{type_label}", {"id": node.id})
                imported_nodes.append(node.id)
                
            for dep in dependencies:
                # Merge directed relationship
                tx.run(CREATE_DEPENDENCY_CYPHER, {
                    "from_id": dep.from_id,
                    "to_id": dep.to_id,
                    "arch_id": arch_id,
                    "status": dep.status,
                    "traffic": dep.traffic,
                    "latency": dep.latency
                })
                imported_rels.append(f"{dep.from_id}->{dep.to_id}")
                
        logger.info(f"Bulk transaction succeeded: Ingested {len(imported_nodes)} nodes, linked {len(imported_rels)} relationships.")
        return {
            "success": True,
            "nodes_ingested": imported_nodes,
            "connections_linked": imported_rels
        }
    except Exception as err:
        logger.error(f"Bulk topology transaction rolled back due to error: {err}")
        raise err
