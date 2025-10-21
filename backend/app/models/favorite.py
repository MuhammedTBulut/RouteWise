"""
Favorite Model
Stores user's favorite POIs
Kullanıcıların favori mekanlarını saklar
"""

from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from .base import Base


class Favorite(Base):
    """
    Favorite model for user's saved POIs
    Favori modeli - kullanıcının kaydettiği mekanlar
    """
    __tablename__ = "favorites"

    # Primary Key
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Foreign Keys
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    poi_id = Column(String(36), ForeignKey("pois.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # User Notes
    notes = Column(Text, nullable=True)  # Personal notes about the POI
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="favorites")
    poi = relationship("POI", back_populates="favorites")
    
    def __repr__(self):
        return f"<Favorite(id={self.id}, user_id={self.user_id}, poi_id={self.poi_id})>"
    
    def to_dict(self, include_poi=False):
        """Convert favorite to dictionary"""
        data = {
            "id": self.id,
            "user_id": self.user_id,
            "poi_id": self.poi_id,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        
        if include_poi and self.poi:
            data["poi"] = self.poi.to_dict()
        
        return data
