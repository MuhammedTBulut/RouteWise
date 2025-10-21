from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UserCreate
from app.services import auth_service
import traceback

router = APIRouter()

@router.post("/register")
async def register(user_in: UserCreate):
    try:
        user = await auth_service.register_user(user_in)
        return {"id": user.id, "email": user.email, "username": user.username}
    except Exception as e:
        print(f"Registration error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/login")
async def login(form_data: dict):
    token = await auth_service.authenticate_user(form_data)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return {"access_token": token}
