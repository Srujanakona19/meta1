from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.ml_routes import router as ml_router

app = FastAPI(
    title="Meta-Learned Pipeline Recommender API",
    description="API for Capstone Project KLCAP-2026-00161",
    version="1.0.0"
)

# CORS config
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ml_router, prefix="/api", tags=["ml"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Meta-Learned Pipeline Recommender API"}

@app.get("/api/system/status")
def system_status():
    return {
        "status": "online",
        "version": "1.0.0",
        "mode": "demo", 
    }
