from typing import Generator
from fastapi import Depends
from neo4j import Session
from backend.db.neo4j import neo4j_manager, Neo4jManager
from backend.graph_service import GraphService

def get_neo4j_manager() -> Neo4jManager:
    """
    Dependency to retrieve the global Neo4j connection pool manager.
    """
    return neo4j_manager

def get_neo4j_session(
    manager: Neo4jManager = Depends(get_neo4j_manager)
) -> Generator[Session, None, None]:
    """
    Request-scoped dependency that yields a database session 
    and guarantees automatic transaction closure upon request termination.
    """
    yield from manager.get_session()

def get_graph_service(
    session: Session = Depends(get_neo4j_session)
) -> GraphService:
    """
    Injectable dependency that instantiates the SRE GraphService layer 
    with the request's active connection session.
    """
    return GraphService(session)
