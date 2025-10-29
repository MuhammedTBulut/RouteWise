from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import (
    UserCreate, UserLogin, UserResponse, AuthResponse,
    EmailVerificationRequest, SendVerificationRequest,
    RefreshTokenRequest, SocialAuthRequest
)
from app.utils.security import (
    verify_password, get_password_hash,
    create_access_token, create_refresh_token, verify_token
)
from app.utils.email import send_verification_email
from app.utils.redis import redis_client, generate_verification_code
import httpx
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=dict)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    
    # Check if email already exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already exists
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user
    db_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=get_password_hash(user_data.password),
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        auth_provider="local"
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Generate and send verification code
    verification_code = generate_verification_code()
    await redis_client.set_verification_code(user_data.email, verification_code)
    await send_verification_email(user_data.email, verification_code)
    
    return {
        "success": True,
        "message": "User registered successfully. Please check your email for verification code."
    }


@router.post("/login", response_model=dict)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login with username and password"""
    
    # Find user by username
    user = db.query(User).filter(User.username == credentials.username).first()
    
    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled"
        )
    
    # Create tokens
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return {
        "success": True,
        "data": {
            "user": UserResponse.model_validate(user),
            "accessToken": access_token,
            "refreshToken": refresh_token
        }
    }


@router.post("/send-verification", response_model=dict)
async def send_verification(data: SendVerificationRequest):
    """Send verification code to email"""
    
    verification_code = generate_verification_code()
    await redis_client.set_verification_code(data.email, verification_code)
    
    email_sent = await send_verification_email(data.email, verification_code)
    
    if not email_sent:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send verification email"
        )
    
    return {
        "success": True,
        "message": "Verification code sent to your email"
    }


@router.post("/verify-email", response_model=dict)
async def verify_email(data: EmailVerificationRequest, db: Session = Depends(get_db)):
    """Verify email with code"""
    
    stored_code = await redis_client.get_verification_code(data.email)
    
    if not stored_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification code expired or not found"
        )
    
    if stored_code != data.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code"
        )
    
    # Update user verification status
    user = db.query(User).filter(User.email == data.email).first()
    if user:
        user.is_verified = True
        db.commit()
    
    # Delete verification code
    await redis_client.delete_verification_code(data.email)
    
    return {
        "success": True,
        "message": "Email verified successfully"
    }


@router.post("/refresh", response_model=dict)
async def refresh_token(data: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Refresh access token"""
    
    payload = verify_token(data.refresh_token, token_type="refresh")
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    # Create new tokens
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    new_refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return {
        "success": True,
        "data": {
            "user": UserResponse.model_validate(user),
            "accessToken": access_token,
            "refreshToken": new_refresh_token
        }
    }


@router.post("/social", response_model=dict)
async def social_auth(data: SocialAuthRequest, db: Session = Depends(get_db)):
    """Authenticate with Google or Facebook"""
    
    user_info = None
    provider_id = None
    
    if data.provider == "google":
        # Verify Google token
        try:
            idinfo = id_token.verify_oauth2_token(
                data.access_token,
                google_requests.Request()
            )
            user_info = {
                "email": idinfo.get("email"),
                "first_name": idinfo.get("given_name"),
                "last_name": idinfo.get("family_name"),
            }
            provider_id = idinfo.get("sub")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google token"
            )
    
    elif data.provider == "facebook":
        # Verify Facebook token
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"https://graph.facebook.com/me?fields=id,email,first_name,last_name&access_token={data.access_token}"
                )
                if response.status_code == 200:
                    fb_data = response.json()
                    user_info = {
                        "email": fb_data.get("email"),
                        "first_name": fb_data.get("first_name"),
                        "last_name": fb_data.get("last_name"),
                    }
                    provider_id = fb_data.get("id")
                else:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid Facebook token"
                    )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Facebook token"
            )
    
    if not user_info or not user_info.get("email"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not retrieve user information"
        )
    
    # Check if user exists
    user = db.query(User).filter(User.email == user_info["email"]).first()
    
    if not user:
        # Create new user
        username = user_info["email"].split("@")[0] + "_" + data.provider
        # Ensure username is unique
        base_username = username
        counter = 1
        while db.query(User).filter(User.username == username).first():
            username = f"{base_username}{counter}"
            counter += 1
        
        user = User(
            email=user_info["email"],
            username=username,
            first_name=user_info.get("first_name"),
            last_name=user_info.get("last_name"),
            is_verified=True,  # Social auth users are automatically verified
            auth_provider=data.provider,
            provider_id=provider_id
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Create tokens
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return {
        "success": True,
        "data": {
            "user": UserResponse.model_validate(user),
            "accessToken": access_token,
            "refreshToken": refresh_token
        }
    }


@router.post("/logout", response_model=dict)
async def logout():
    """Logout (client should clear tokens)"""
    return {
        "success": True,
        "message": "Logged out successfully"
    }
