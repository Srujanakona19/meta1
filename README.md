# Meta-Learned Pipeline Recommender

> **Project ID**: KLCAP-2026-00161
> **Domain**: Artificial Intelligence / Machine Learning

An intelligent machine-learning decision engine that learns from previous datasets, detects distribution shift, identifies pipeline failures, and recommends reliable ML pipelines with evidence-backed confidence.

## Features

1. **Meta-Feature Extraction**: Automatically profiles incoming datasets.
2. **Shift Detection**: Computes distribution shift against historical datasets in a latent Meta-Learning Space.
3. **Failure-Awareness**: Analyzes potential data leakage and preprocessing instability.
4. **Pipeline Recommendation**: AI suggests the most robust preprocessing and modeling pipeline.
5. **Fallback Ensembling**: Automatically suggests an ensemble model if recommendation confidence drops below safety thresholds.

## Architecture

This project is structured as a monorepo:
- `/frontend`: Vite + React + Three.js application delivering a premium 3D cinematic experience.
- `/backend`: FastAPI + Python modular backend exposing robust API endpoints.

## Local Setup Instructions

Since this is a full-stack application, you need to run both the frontend and backend services.

### 1. Start the Backend

Open a terminal and navigate to the backend directory:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Start the Frontend

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

## Technologies Used
- **Frontend**: React, Three.js, React Three Fiber, Framer Motion, Tailwind CSS, Recharts
- **Backend**: FastAPI, Pydantic, SQLAlchemy
- **Machine Learning**: Scikit-Learn, PyTorch (stubbed for demo logic)
"# meta1" 
