from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from backend.models.graph import NodeModel, DependencyModel

class ArchitectureUploadModel(BaseModel):
    """
    Schema for POST /v1/architectures.
    Matches the documentation JSON specification.
    """
    name: Optional[str] = "Unnamed Architecture"
    environment: Optional[str] = "production"
    user_id: Optional[str] = None
    graph: Dict[str, Any] = Field(
        ..., 
        description="Must contain 'nodes' and 'edges' arrays."
    )

class EdgeModel(BaseModel):
    source: str
    target: str

class ValidationResultModel(BaseModel):
    valid: bool
    warnings: List[str]
    graph_health_score: int
