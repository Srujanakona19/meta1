from typing import Dict, Any

class PipelineRecommender:
    @staticmethod
    def recommend(meta_features: Dict[str, Any]) -> dict:
        nodes = []
        evidence = []
        confidence = 0.85
        
        # 1. Preprocessing heuristics
        if meta_features.get("missing_ratio", 0) > 0:
            nodes.append({"id": "n_impute", "name": "SimpleImputer", "type": "preprocessing"})
            evidence.append(f"Missing data detected ({(meta_features.get('missing_ratio', 0)*100):.1f}%). Imputer added.")
        
        if meta_features.get("num_numerical", 0) > 0:
            nodes.append({"id": "n_scale", "name": "StandardScaler", "type": "preprocessing"})
            evidence.append("Numerical features detected. Scaling added.")
            
        if meta_features.get("num_categorical", 0) > 0:
            nodes.append({"id": "n_encode", "name": "OneHotEncoder", "type": "preprocessing"})
            evidence.append("Categorical features detected. Encoder added.")
            
        # 2. Imbalance handling
        imbalance = meta_features.get("class_imbalance", 0)
        if meta_features.get("target_type") == "classification" and imbalance > 0.4:
            nodes.append({"id": "n_smote", "name": "SMOTE", "type": "preprocessing"})
            evidence.append(f"High class imbalance ({imbalance*100:.1f}%). Oversampling added.")
            confidence -= 0.05
            
        # 3. Model selection
        is_classification = meta_features.get("target_type") == "classification"
        num_rows = meta_features.get("num_rows", 0)
        
        if num_rows > 50000:
            model_name = "XGBClassifier" if is_classification else "XGBRegressor"
            nodes.append({"id": "n_model", "name": model_name, "type": "model"})
            evidence.append("Large dataset detected (>50k rows). Selected XGBoost for performance and scalability.")
            confidence += 0.05
        elif num_rows < 1000:
            model_name = "LogisticRegression" if is_classification else "LinearRegression"
            nodes.append({"id": "n_model", "name": model_name, "type": "model"})
            evidence.append("Small dataset detected (<1k rows). Selected linear model to prevent overfitting.")
            confidence -= 0.1
        else:
            model_name = "RandomForestClassifier" if is_classification else "RandomForestRegressor"
            nodes.append({"id": "n_model", "name": model_name, "type": "model"})
            evidence.append("Medium-sized dataset. Selected Random Forest for robustness.")
            confidence += 0.02
            
        return {
            "recommended": {
                "id": "dynamic_pipe_1",
                "name": f"{model_name} Pipeline",
                "nodes": nodes,
                "confidence": round(min(confidence, 0.99), 3),
                "expected_performance": round(min(confidence + 0.02, 0.99), 3),
                "stability": 0.88,
                "shift_sensitivity": 0.2,
                "failure_risk": "LOW" if confidence > 0.8 else "MEDIUM"
            },
            "candidates": [],
            "recommendation_reliability": "HIGH" if confidence > 0.8 else "MEDIUM",
            "evidence": evidence
        }
