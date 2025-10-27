from app.db.session import async_session
from app.models.user import User
import bcrypt
from jose import jwt
import os

SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

async def register_user(user_in):
    async with async_session() as session:
        hashed = hash_password(user_in.password)
        user = User(
            email=user_in.email,
            username=user_in.username,
            hashed_password=hashed,
            full_name=user_in.full_name
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user

async def authenticate_user(form_data: dict):
    from sqlalchemy import select
    async with async_session() as session:
        stmt = select(User).where(User.email == form_data.get("email"))
        result = await session.execute(stmt)
        user = result.scalar_one_or_none()
        if not user:
            return None
        if not verify_password(form_data.get("password"), user.hashed_password):
            return None
        token = jwt.encode({"sub": str(user.id)}, SECRET_KEY, algorithm=ALGORITHM)
        return token
