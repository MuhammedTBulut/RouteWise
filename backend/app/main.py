from fastapi import FastAPI
from app.api.v1.endpoints import users, pois, auth
from app.db.session import engine

app = FastAPI(title="RouteWise Backend")

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(pois.router, prefix="/api/v1/pois", tags=["pois"])

@app.get("/")
def read_root():
    return {"message": "RouteWise Backend"}
