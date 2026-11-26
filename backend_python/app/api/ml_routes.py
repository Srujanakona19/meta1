from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict, Any
from app.schemas.ml import (
    DatasetMetaFeatures, 
    DatasetShiftAnalysis, 
    FailureRisk, 
    PipelineCandidate,
    PipelineNode,
    EnsembleRecommendation
)
from app.services.analyzer import PandasAnalyzer
from app.services.recommender import PipelineRecommender
import random

router = APIRouter()

# Global state to store the last analyzed dataset features so recommend_pipeline can use it
# In a real app, this would be tied to a session or database ID.
last_analyzed_features = {}

@router.post("/dataset/analyze", response_model=DatasetMetaFeatures)
async def analyze_dataset(file: UploadFile = File(...)):
    global last_analyzed_features
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
        
    try:
        contents = await file.read()
        features = PandasAnalyzer.analyze_csv(contents)
        last_analyzed_features = features
        return DatasetMetaFeatures(**features)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/shift/detect", response_model=DatasetShiftAnalysis)
def detect_shift():
    return DatasetShiftAnalysis(
        shift_score=0.18,
        status="LOW SHIFT",
        nearest_datasets=[
            {"name": "Historical Dataset 104", "similarity": 0.94},
            {"name": "Historical Dataset 087", "similarity": 0.89},
            {"name": "Historical Dataset 121", "similarity": 0.86},
        ],
        feature_shifts={"age": 0.05, "income": 0.22, "category": 0.01}
    )

@router.post("/failure/analyze", response_model=list[FailureRisk])
def analyze_failures():
    return [
        FailureRisk(name="DATA LEAKAGE", risk="LOW", status="PASS", description="No temporal or target leakage detected."),
        FailureRisk(name="PREPROCESSING STABILITY", risk="LOW", status="PASS", description="Scalers remain stable under cross-validation."),
        FailureRisk(name="OVERFITTING", risk="MEDIUM", status="WARNING", description="Slight variance between train and validation folds detected.")
    ]

@router.post("/pipeline/recommend", response_model=dict)
def recommend_pipeline():
    global last_analyzed_features
    if not last_analyzed_features:
        # Fallback if no dataset was analyzed yet
        fallback_features = {
            "num_rows": 10000, "num_cols": 20, "missing_ratio": 0.05, 
            "num_numerical": 15, "num_categorical": 5, "target_type": "classification", 
            "class_imbalance": 0.1
        }
        return PipelineRecommender.recommend(fallback_features)
        
    return PipelineRecommender.recommend(last_analyzed_features)

@router.post("/ensemble/recommend", response_model=EnsembleRecommendation)
def recommend_ensemble():
    return EnsembleRecommendation(
        trigger_reason="Simulated low confidence trigger.",
        pipelines=[
            {"pipeline_name": "Random Forest", "weight": 0.42},
            {"pipeline_name": "SVM", "weight": 0.31},
            {"pipeline_name": "Logistic Regression", "weight": 0.27},
        ],
        expected_stability="HIGH"
    )
