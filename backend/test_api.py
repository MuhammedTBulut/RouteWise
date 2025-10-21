from fastapi import FastAPI

app = FastAPI(title="RouteWise API Test")

@app.get("/")
def root():
    return {"status": "ok", "message": "RouteWise API is running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
