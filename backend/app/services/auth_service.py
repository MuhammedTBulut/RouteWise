from app.db.session import async_session
from app.models.user import User
from passlib.context import CryptContext
from jose import jwt
import os

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = "HS256"

async def register_user(user_in):
    async with async_session() as session:
        hashed = pwd_context.hash(user_in.password)
        user = User(email=user_in.email, hashed_password=hashed, full_name=user_in.full_name)
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user

async def authenticate_user(form_data: dict):
    async with async_session() as session:
        result = await session.execute("SELECT * FROM users WHERE email = :email", {"email": form_data.get("email")})
        row = result.first()
        if not row:
            return None
        user = row[0]
        if not pwd_context.verify(form_data.get("password"), user.hashed_password):
            return None
        token = jwt.encode({"sub": str(user.id)}, SECRET_KEY, algorithm=ALGORITHM)
        return token
