"""
Quantum Voting System - Main Application
Privacy-Preserving Quantum Voting for Andhra Pradesh Elections

This is an academic simulation for research purposes only.
Not affiliated with the Election Commission of India.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Define allowed origins
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")
allow_origins = [FRONTEND_URL]

# Add Vercel preview URLs for development flexibility
if "vercel.app" in FRONTEND_URL:
    project_name = FRONTEND_URL.split("https://")[1].split(".vercel.app")[0]
    allow_origins.extend([
        f"https://{project_name}-*.vercel.app",
        f"https://{project_name}.vercel.app"
    ])

from models.database import init_db, seed_database
from routes import auth_router, voting_router, results_router
from routes.advanced import router as advanced_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("🚀 Starting Quantum Voting System...")
    init_db()
    await seed_database()
    print("✅ Database initialized and seeded")
    yield
    # Shutdown
    print("👋 Shutting down Quantum Voting System...")


# Create FastAPI application
app = FastAPI(
    title="Quantum Voting System",
    description="""
    ## Privacy-Preserving Quantum Voting Simulation
    
    A secure, anonymous voting system using quantum cryptography principles,
    tailored for Andhra Pradesh Assembly (MLA) and Parliamentary (MP) elections.
    
    ### Features
    - **Quantum Key Distribution (BB84)**: Secure key exchange
    - **Anonymous Voting**: No link between voter and vote
    - **One-Vote-Only**: Cryptographic enforcement
    - **Tamper Detection**: Eavesdropping alerts
    
    ### ⚠️ Disclaimer
    This is an academic simulation for research purposes only.
    Not affiliated with the Election Commission of India.
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(voting_router, prefix="/api")
app.include_router(results_router, prefix="/api")
app.include_router(advanced_router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint with system information"""
    return {
        "system": "Quantum Voting System",
        "version": "1.0.0",
        "description": "Privacy-Preserving Quantum Voting Simulation",
        "state": "Andhra Pradesh",
        "elections": ["MLA (175 constituencies)", "MP (25 constituencies)"],
        "disclaimer": "Academic simulation only. Not affiliated with ECI.",
        "api_docs": "/api/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "quantum_module": "active",
        "database": "connected"
    }



@app.get("/api/reset_db")
async def reset_db():
    """Force reset database"""
    print("♻️ Resetting database...")
    from models.database import Base, engine, seed_database
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    await seed_database()
    return {"status": "Database reset and seeded with real data"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
