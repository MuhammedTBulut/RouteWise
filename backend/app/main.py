"""
RouteWise Backend API
Main FastAPI application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.endpoints import pois, preferences, favorites

# Create FastAPI app
app = FastAPI(
    title="RouteWise API",
    description="Smart city tour guide API with personalized recommendations",
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
app.include_router(preferences.router, prefix="/api/v1/preferences", tags=["Preferences"])
app.include_router(pois.router, prefix="/api/v1/pois", tags=["POIs"])
app.include_router(favorites.router, prefix="/api/v1/favorites", tags=["Favorites"])


@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "Welcome to RouteWise API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
