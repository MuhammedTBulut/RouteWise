"""
User Preferences Model
Stores user's travel and POI preferences
Kullanıcı Tercihleri Modeli - seyahat ve POI tercihlerini saklar
"""

from sqlalchemy import Column, String, Integer, Float, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base


class UserPreference(Base):
    """
    User Preference model for storing travel preferences
    Categories: culture, nightlife, shopping, nature, food, sports, history, entertainment
    Kategoriler: kültür, gece hayatı, alışveriş, doğa, yemek, spor, tarih, eğlence
    """
    __tablename__ = "user_preferences"

    # Primary Key - Foreign Key to User
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    
    # Category Preferences (0-10 scale)
    # Kategori Tercihleri (0-10 ölçeği)
    culture = Column(Integer, default=5, nullable=False)  # Müzeler, sanat galerileri, tiyatro
    nightlife = Column(Integer, default=5, nullable=False)  # Barlar, kulüpler, canlı müzik
    shopping = Column(Integer, default=5, nullable=False)  # Alışveriş merkezleri, çarşılar
    nature = Column(Integer, default=5, nullable=False)  # Parklar, botanik bahçeleri, plajlar
    food = Column(Integer, default=5, nullable=False)  # Restoranlar, kafeler, yerel yemekler
    sports = Column(Integer, default=5, nullable=False)  # Spor aktiviteleri, fitness
    history = Column(Integer, default=5, nullable=False)  # Tarihi yerler, anıtlar
    entertainment = Column(Integer, default=5, nullable=False)  # Sinema, konser, eğlence parkları
    
    # Travel Style Preferences
    # Seyahat Stili Tercihleri
    budget_level = Column(String(20), default='medium')  # low, medium, high
    pace = Column(String(20), default='moderate')  # relaxed, moderate, fast
    group_size = Column(String(20), default='solo')  # solo, couple, family, group
    
    # Distance & Time Preferences
    # Mesafe & Zaman Tercihleri
    max_travel_distance_km = Column(Float, default=50.0)  # Maximum travel distance in km
    preferred_visit_duration_minutes = Column(Integer, default=120)  # Average visit duration
    
    # Accessibility & Comfort
    # Erişilebilirlik & Konfor
    public_transport_preference = Column(Integer, default=5)  # 0-10 scale
    
    # Time Preferences (JSON: {monday: {morning: true, afternoon: true, evening: false}, ...})
    # Zaman Tercihleri
    available_times = Column(JSON, nullable=True)
    
    # Additional Preferences (JSON)
    # Ek Tercihler
    tags = Column(JSON, nullable=True)  # ["romantic", "family-friendly", "pet-friendly", etc.]
    avoid_categories = Column(JSON, nullable=True)  # Categories to avoid
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationship
    user = relationship("User", back_populates="preferences")
    
    def __repr__(self):
        return f"<UserPreference(user_id={self.user_id})>"
    
    def to_dict(self):
        """Convert preferences to dictionary"""
        return {
            "user_id": self.user_id,
            "categories": {
                "culture": self.culture,
                "nightlife": self.nightlife,
                "shopping": self.shopping,
                "nature": self.nature,
                "food": self.food,
                "sports": self.sports,
                "history": self.history,
                "entertainment": self.entertainment,
            },
            "travel_style": {
                "budget_level": self.budget_level,
                "pace": self.pace,
                "group_size": self.group_size,
            },
            "distance_time": {
                "max_travel_distance_km": self.max_travel_distance_km,
                "preferred_visit_duration_minutes": self.preferred_visit_duration_minutes,
            },
            "accessibility": {
                "accessibility_required": bool(self.accessibility_required),
                "public_transport_preference": self.public_transport_preference,
            },
            "available_times": self.available_times,
            "tags": self.tags,
            "avoid_categories": self.avoid_categories,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
    
    def get_top_categories(self, limit=3):
        """Get user's top preferred categories"""
        categories = {
            "culture": self.culture,
            "nightlife": self.nightlife,
            "shopping": self.shopping,
            "nature": self.nature,
            "food": self.food,
            "sports": self.sports,
            "history": self.history,
            "entertainment": self.entertainment,
        }
        sorted_categories = sorted(categories.items(), key=lambda x: x[1], reverse=True)
        return [cat[0] for cat in sorted_categories[:limit]]
