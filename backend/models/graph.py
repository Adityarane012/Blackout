from enum import Enum
from pydantic import BaseModel, Field

class NodeType(str, Enum):
    """
    Formal label mappings for Neo4j Graph Database entities.
    """
    SERVICE = "Service"
    DATABASE = "Database"
    QUEUE = "Queue"
    CACHE = "Cache"
    API = "API"
    FRONTEND = "FrontendSystem"

# Mapping utility to translate microservices type flags to standard Neo4j Node Label designations
TYPE_TO_LABEL_MAP = {
    "server": NodeType.SERVICE,
    "service": NodeType.SERVICE,
    "database": NodeType.DATABASE,
    "queue": NodeType.QUEUE,
    "cache": NodeType.CACHE,
    "api": NodeType.API,
    "cdn": NodeType.FRONTEND,
    "loadbalancer": NodeType.SERVICE,
    "frontend": NodeType.FRONTEND,
}

class NodeModel(BaseModel):
    """
    Structured Pydantic Model representing stateful nodes on the visual canvas.
    """
    id: str = Field(..., description="Unique alphanumeric identifier for the graph resource")
    label: str = Field(..., description="Human-readable title displayed in the SRE dashboard")
    type: str = Field(..., description="Classification category (e.g. server, database, cache, api)")
    status: str = Field("healthy", description="Current SRE status flag: healthy, stress, degraded, failure")
    
    # Digital Twin Metrics
    load: float = Field(0.0, ge=0.0, le=100.0, description="Active system CPU/memory load percentage")
    capacity: float = Field(1000.0, ge=0.0, description="Maximum throughput processing capacity limit")
    
    cpu_utilization: float = Field(0.0, ge=0.0, le=100.0, description="CPU Utilization %")
    memory_utilization: float = Field(0.0, ge=0.0, le=100.0, description="Memory Utilization %")
    network_throughput: float = Field(0.0, ge=0.0, description="Network throughput in MB/s")
    request_rate: float = Field(0.0, ge=0.0, description="Current incoming requests per second")
    queue_depth: float = Field(0.0, ge=0.0, description="Number of items currently queued")
    error_rate: float = Field(0.0, ge=0.0, le=1.0, description="Telemetry transaction error rate fraction (0.0 to 1.0)")
    latency: float = Field(0.0, ge=0.0, description="Active processing latency metric in milliseconds")

    class Config:
        from_attributes = True

    def get_neo4j_label(self) -> str:
        """
        Translates the internal type parameter into a formal Neo4j entity label.
        Defaults to 'Service' if the mapping is unidentified.
        """
        clean_type = self.type.lower().strip()
        label_enum = TYPE_TO_LABEL_MAP.get(clean_type, NodeType.SERVICE)
        return label_enum.value

class DependencyModel(BaseModel):
    """
    Structured Model representing directed DEPENDS_ON relationship vectors.
    """
    from_id: str = Field(..., description="ID of the upstream dependent node")
    to_id: str = Field(..., description="ID of the downstream target resource")
    status: str = Field("active", description="Relationship state: active, degraded, down")
    traffic: float = Field(50.0, ge=0.0, description="Network packet traffic flow volume throughput")
    latency: float = Field(20.0, ge=0.0, description="Network transmission overhead latency in milliseconds")

    class Config:
        from_attributes = True

class FailureChainModel(BaseModel):
    """
    Tracks the specific causal link explaining why a cascade occurred.
    """
    cause_node_id: str
    trigger_metric: str
    impact_node_id: str
    reason: str
    timestamp: str
