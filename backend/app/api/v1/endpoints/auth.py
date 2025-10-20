from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UserCreate
from app.services import auth_service

router = APIRouter()

@router.post("/register")
async def register(user_in: UserCreate):
    user = await auth_service.register_user(user_in)
    return {"id": user.id, "email": user.email}

@router.post("/login")
async def login(form_data: dict):
    token = await auth_service.authenticate_user(form_data)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return {"access_token": token}
