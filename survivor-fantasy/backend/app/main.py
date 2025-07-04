from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.auth import router as auth_router

app = FastAPI(
    title="Survivor Fantasy League API",
    description="Fantasy sports platform for CBS Survivor fans",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["auth"])

# Root endpoints
@app.get("/", tags=["root"])
async def root():
    return {
        "message": "Survivor Fantasy League API is running!",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "healthy"
    }

@app.get("/health", tags=["health"])
async def health():
    return {
        "status": "healthy",
        "service": "survivor-fantasy-api"
    }