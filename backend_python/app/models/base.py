from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Boolean, ForeignKey
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()

class Experiment(Base):
    __tablename__ = "experiments"
    
    id = Column(Integer, primary_key=True, index=True)
    dataset_name = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    recommended_pipeline = Column(String)
    confidence = Column(Float)
    shift_score = Column(Float)
    failure_risk = Column(String)
    performance = Column(Float)
    meta_features = Column(JSON) # Store extracted features
    shift_analysis = Column(JSON) # Store shift details
    failure_analysis = Column(JSON) # Store failure details
    ensemble_triggered = Column(Boolean, default=False)
