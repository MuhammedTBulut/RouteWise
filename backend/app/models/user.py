"""
User Model
Stores user authentication and profile information
"""

from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from .base import Base


class User(Base):
    """
    User model for authentication and profile
    Kullanıcı modeli - kimlik doğrulama ve profil için
    """
    __tablename__ = "users"

    # Primary Key
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Firebase Auth Integration
    firebase_uid = Column(String(128), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    display_name = Column(String(100), nullable=True)
    
    # Profile Information
    phone_number = Column(String(20), nullable=True)
    profile_picture_url = Column(String(512), nullable=True)
    
    # Location Information (will be used for recommendations)
    city = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    language = Column(String(10), default='tr')  # tr, en, etc.
    
    # Account Status
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    preferences = relationship("UserPreference", back_populates="user", uselist=False, cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    interactions = relationship("Interaction", back_populates="user", cascade="all, delete-orphan")
    routes = relationship("Route", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, display_name={self.display_name})>"
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            "id": self.id,
            "firebase_uid": self.firebase_uid,
            "email": self.email,
            "display_name": self.display_name,
            "phone_number": self.phone_number,
            "profile_picture_url": self.profile_picture_url,
            "city": self.city,
            "country": self.country,
            "language": self.language,
            "is_active": self.is_active,
            "is_premium": self.is_premium,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "last_login": self.last_login.isoformat() if self.last_login else None,
        }
