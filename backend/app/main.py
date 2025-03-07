from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models, routers, org_routers
from .database import engine

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FlowForge API",
    description="API for FlowForge application",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(routers.router)
app.include_router(org_routers.org_router)

@app.get("/")
async def root():
    return {"message": "Welcome to FlowForge API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 