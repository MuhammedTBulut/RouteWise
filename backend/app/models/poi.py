"""
Point of Interest (POI) Model
Stores information about places/locations
"""

from sqlalchemy import Column, String, Float, JSON, DateTime, Integer, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from .base import Base


class POI(Base):
    """
    Point of Interest model
    İlgi Noktası modeli - mekan bilgilerini saklar
    """
    __tablename__ = "pois"

    # Primary Key
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # External IDs (Google Places, Foursquare, etc.)
    google_place_id = Column(String(255), unique=True, nullable=True, index=True)
    foursquare_id = Column(String(255), unique=True, nullable=True, index=True)
    
    # Basic Information
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    address = Column(String(512), nullable=True)
    city = Column(String(100), nullable=True, index=True)
    country = Column(String(100), nullable=True, index=True)
    postal_code = Column(String(20), nullable=True)
    
    # Geographic Location (using lat/long for now, PostGIS can be added later)
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    
    # Category & Type
    category = Column(String(50), nullable=False, index=True)  # culture, nightlife, shopping, etc.
    types = Column(JSON, nullable=True)  # Google Places types array
    
    # Rating & Popularity
    rating = Column(Float, default=0.0)  # 0.0 - 5.0
    rating_count = Column(Integer, default=0)
    popularity_score = Column(Float, default=0.0)  # Calculated from various factors
    
    # Contact & Web
    phone_number = Column(String(20), nullable=True)
    website = Column(String(512), nullable=True)
    
    # Business Hours (JSON: {monday: {open: "09:00", close: "18:00"}, ...})
    opening_hours = Column(JSON, nullable=True)
    
    # Pricing & Budget
    price_level = Column(Integer, nullable=True)  # 0-4 (Google Places scale)
    estimated_cost_per_person = Column(Float, nullable=True)  # In local currency
    
    # Visit Information
    average_visit_duration_minutes = Column(Integer, nullable=True)
    best_visit_time = Column(JSON, nullable=True)  # ["morning", "afternoon", "evening"]
    
    # Features & Amenities
    features = Column(JSON, nullable=True)  # ["wifi", "parking", "accessible", "outdoor_seating"]
    tags = Column(JSON, nullable=True)  # ["romantic", "family-friendly", "pet-friendly"]
    
    # Images
    photos = Column(JSON, nullable=True)  # Array of photo URLs
    cover_photo_url = Column(String(512), nullable=True)
    
    # Status
    is_active = Column(Integer, default=1)  # 0: inactive, 1: active
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    favorites = relationship("Favorite", back_populates="poi", cascade="all, delete-orphan")
    interactions = relationship("Interaction", back_populates="poi", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<POI(id={self.id}, name={self.name}, category={self.category})>"
    
    def to_dict(self, include_location=True):
        """Convert POI to dictionary"""
        data = {
            "id": self.id,
            "google_place_id": self.google_place_id,
            "foursquare_id": self.foursquare_id,
            "name": self.name,
            "description": self.description,
            "address": self.address,
            "city": self.city,
            "country": self.country,
            "postal_code": self.postal_code,
            "category": self.category,
            "subcategory": self.subcategory,
            "types": self.types,
            "rating": self.rating,
            "rating_count": self.rating_count,
            "popularity_score": self.popularity_score,
            "phone_number": self.phone_number,
            "website": self.website,
            "opening_hours": self.opening_hours,
            "price_level": self.price_level,
            "estimated_cost_per_person": self.estimated_cost_per_person,
            "average_visit_duration_minutes": self.average_visit_duration_minutes,
            "best_visit_time": self.best_visit_time,
            "features": self.features,
            "tags": self.tags,
            "photos": self.photos,
            "cover_photo_url": self.cover_photo_url,
            "is_active": bool(self.is_active),
            "is_verified": bool(self.is_verified),
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        
        if include_location:
            data["location"] = {
                "latitude": self.latitude,
                "longitude": self.longitude
            }
        
        return data
