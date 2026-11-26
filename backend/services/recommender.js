class PipelineRecommender {
  static recommend(meta) {
    const nodes = [];
    const evidence = [];
    let confidence = 0.85;
    
    // 1. Preprocessing heuristics
    if (meta.missing_ratio > 0) {
        nodes.push({ id: "n_impute", name: "SimpleImputer", type: "preprocessing" });
        evidence.push(`Missing data detected (${(meta.missing_ratio*100).toFixed(1)}%). Imputer added.`);
    }
    
    if (meta.num_numerical > 0) {
        nodes.push({ id: "n_scale", name: "StandardScaler", type: "preprocessing" });
        evidence.push("Numerical features detected. Scaling added.");
    }
        
    if (meta.num_categorical > 0) {
        nodes.push({ id: "n_encode", name: "OneHotEncoder", type: "preprocessing" });
        evidence.push("Categorical features detected. Encoder added.");
    }
        
    // 2. Imbalance handling
    if (meta.target_type === "classification" && meta.class_imbalance > 0.4) {
        nodes.push({ id: "n_smote", name: "SMOTE", type: "preprocessing" });
        evidence.push(`High class imbalance (${(meta.class_imbalance*100).toFixed(1)}%). Oversampling added.`);
        confidence -= 0.05;
    }
        
    // 3. Model selection
    const is_classification = meta.target_type === "classification";
    let model_name = "";
    
    if (meta.num_rows > 50000) {
        model_name = is_classification ? "XGBClassifier" : "XGBRegressor";
        evidence.push("Large dataset detected (>50k rows). Selected XGBoost for performance and scalability.");
        confidence += 0.05;
    } else if (meta.num_rows < 1000) {
        model_name = is_classification ? "LogisticRegression" : "LinearRegression";
        evidence.push("Small dataset detected (<1k rows). Selected linear model to prevent overfitting.");
        confidence -= 0.1;
    } else {
        model_name = is_classification ? "RandomForestClassifier" : "RandomForestRegressor";
        evidence.push("Medium-sized dataset. Selected Random Forest for robustness.");
        confidence += 0.02;
    }
    nodes.push({ id: "n_model", name: model_name, type: "model" });
        
    return {
        recommended: {
            id: "dynamic_pipe_1",
            name: `${model_name} Pipeline`,
            nodes: nodes,
            confidence: Math.min(confidence, 0.99),
            expected_performance: Math.min(confidence + 0.02, 0.99),
            stability: 0.88,
            shift_sensitivity: 0.2,
            failure_risk: confidence > 0.8 ? "LOW" : "MEDIUM"
        },
        candidates: [],
        recommendation_reliability: confidence > 0.8 ? "HIGH" : "MEDIUM",
        evidence: evidence
    };
  }
}

module.exports = PipelineRecommender;
