import os
import logging
from typing import Generator
from neo4j import GraphDatabase, Driver, Session

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("neo4j_manager")

class Neo4jManager:
    """
    Reusable connection manager for Neo4j database instances.
    Maintains an active connection pool and verifies connection integrity.
    """
    def __init__(self):
        self._driver: Driver | None = None
        self.uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        self.username = os.getenv("NEO4J_USER", "neo4j")
        self.password = os.getenv("NEO4J_PASSWORD", "password")

    def connect(self) -> None:
        """
        Initializes the Neo4j Driver pool and verifies authentication and connectivity.
        """
        try:
            logger.info(f"Initializing Neo4j Driver Pool connecting to: {self.uri}")
            self._driver = GraphDatabase.driver(
                self.uri, 
                auth=(self.username, self.password)
            )
            # Verify connectivity immediately
            self._driver.verify_connectivity()
            logger.info("Successfully connected to Neo4j graph cluster and verified connectivity.")
        except Exception as e:
            logger.error(f"Failed to establish connection to Neo4j database: {e}")
            self.close()
            raise e

    def get_driver(self) -> Driver:
        """
        Retrieves the active Neo4j driver. Instantiates it if not already connected.
        """
        if not self._driver:
            self.connect()
        assert self._driver is not None
        return self._driver

    def get_session(self) -> Generator[Session, None, None]:
        """
        Generates a contextual transaction session from the connection pool.
        Designed to be used natively as a dependency or context manager.
        """
        driver = self.get_driver()
        session = driver.session()
        try:
            yield session
        finally:
            session.close()

    def close(self) -> None:
        """
        Gracefully closes the driver connection pool and releases resources.
        """
        if self._driver:
            logger.info("Closing Neo4j connection pool and disposing of driver instances.")
            try:
                self._driver.close()
            except Exception as e:
                logger.error(f"Error occurred during Neo4j driver shutdown: {e}")
            finally:
                self._driver = None

# Global Singleton Manager instance
neo4j_manager = Neo4jManager()
