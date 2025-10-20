from fastapi import APIRouter, Depends
from app.schemas.user import UserRead

router = APIRouter()

@router.get("/me", response_model=UserRead)
async def read_current_user():
    # Placeholder - should return authenticated user
    return {"id": 1, "email": "test@example.com", "full_name": "Test User", "is_active": True}
