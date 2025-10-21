"""
Simple FastAPI test server
"""
import sys
sys.path.insert(0, '/Users/muhammedbulut/Desktop/RouteWise/backend')

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="RouteWise API - Test", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "RouteWise API is running!", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting RouteWise API on http://localhost:8000")
    print("📚 Swagger UI: http://localhost:8000/docs")
    print("📊 ReDoc: http://localhost:8000/redoc")
    uvicorn.run(app, host="0.0.0.0", port=8000)
