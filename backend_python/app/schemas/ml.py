from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class DatasetMetaFeatures(BaseModel):
    num_rows: int
    num_cols: int
    num_numerical: int
    num_categorical: int
    missing_ratio: float
    class_imbalance: Optional[float]
    target_type: str
    dimensionality_ratio: float
    
class DatasetShiftAnalysis(BaseModel):
    shift_score: float
    status: str # "LOW SHIFT", "MODERATE SHIFT", "HIGH SHIFT", "SEVERE SHIFT"
    nearest_datasets: List[Dict[str, Any]]
    feature_shifts: Dict[str, float]
    
class FailureRisk(BaseModel):
    name: str # e.g., "DATA LEAKAGE"
    risk: str # "LOW", "MEDIUM", "HIGH"
    status: str # "PASS", "WARNING", "FAIL"
    description: str

class PipelineNode(BaseModel):
    id: str
    name: str
    type: str # "preprocessing", "model"
    
class PipelineCandidate(BaseModel):
    id: str
    name: str
    nodes: List[PipelineNode]
    confidence: float
    expected_performance: float
    stability: float
    shift_sensitivity: float
    failure_risk: str
    
class EnsembleRecommendation(BaseModel):
    trigger_reason: str
    pipelines: List[Dict[str, Any]] # e.g., {"pipeline_id": "p1", "weight": 0.4}
    expected_stability: str
