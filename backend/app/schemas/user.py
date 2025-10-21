from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    username: Optional[str] = None
    full_name: Optional[str] = None

class UserRead(BaseModel):
    id: int
    email: EmailStr
    username: Optional[str]
    full_name: Optional[str]
    is_active: bool

    class Config:
        orm_mode = True
