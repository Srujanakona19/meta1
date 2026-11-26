import pandas as pd
import io

class PandasAnalyzer:
    @staticmethod
    def analyze_csv(file_bytes: bytes) -> dict:
        try:
            # Read CSV from bytes
            df = pd.read_csv(io.BytesIO(file_bytes))
            
            num_rows = int(df.shape[0])
            num_cols = int(df.shape[1])
            
            # Determine numerical vs categorical columns
            numerical_cols = df.select_dtypes(include=['int64', 'float64']).columns.tolist()
            categorical_cols = df.select_dtypes(include=['object', 'category', 'bool']).columns.tolist()
            
            # Missing data calculation
            total_cells = num_rows * num_cols
            total_missing = int(df.isnull().sum().sum())
            missing_ratio = float(total_missing / total_cells) if total_cells > 0 else 0.0
            
            # Target inference (assume the last column is the target for this demo)
            target_col = df.columns[-1] if num_cols > 0 else None
            class_imbalance = 0.0
            target_type = "unknown"
            
            if target_col:
                unique_vals = df[target_col].nunique()
                if unique_vals <= 10 or df[target_col].dtype == 'object':
                    target_type = "classification"
                    # Simple imbalance metric: 1.0 - (min_class_count / max_class_count)
                    class_counts = df[target_col].value_counts()
                    if len(class_counts) > 1:
                        class_imbalance = 1.0 - float(class_counts.min() / class_counts.max())
                else:
                    target_type = "regression"
                    
            dimensionality_ratio = float(num_cols / num_rows) if num_rows > 0 else 0.0
            
            return {
                "num_rows": num_rows,
                "num_cols": num_cols,
                "num_numerical": len(numerical_cols),
                "num_categorical": len(categorical_cols),
                "missing_ratio": missing_ratio,
                "class_imbalance": class_imbalance,
                "target_type": target_type,
                "dimensionality_ratio": dimensionality_ratio
            }
        except Exception as e:
            raise ValueError(f"Failed to analyze CSV: {str(e)}")
