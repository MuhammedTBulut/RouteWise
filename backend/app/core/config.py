"""
Application Configuration
Loads environment variables and settings
"""

from pydantic import field_validator
from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Settings(BaseSettings):
    """Application settings"""
    
    # App Info
    APP_NAME: str = "RouteWise API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug(cls, value):
        """Handle non-boolean DEBUG environment values gracefully."""
        if isinstance(value, str):
            return value.strip().lower() in {"1", "true", "yes", "on"}
        return bool(value)
    
    # Database (using psycopg2 for sync operations)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./routewise.db"
    )
    
    # JWT Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:8081",
        "http://localhost:19006",
        "exp://localhost:8081",
        "exp://172.24.206.36:8081",
    ]
    
    # External APIs
    GOOGLE_MAPS_API_KEY: Optional[str] = os.getenv("GOOGLE_MAPS_API_KEY")
    FOURSQUARE_API_KEY: Optional[str] = os.getenv("FOURSQUARE_API_KEY")
    
    # Firebase (for user sync)
    FIREBASE_PROJECT_ID: Optional[str] = os.getenv("FIREBASE_PROJECT_ID")
    FIREBASE_CREDENTIALS_PATH: Optional[str] = os.getenv("FIREBASE_CREDENTIALS_PATH")
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()
