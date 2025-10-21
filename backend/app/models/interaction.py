"""
Interaction Model
Stores user interactions with POIs (views, visits, ratings, etc.)
Kullanıcı-POI etkileşimlerini saklar
"""

from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from .base import Base


class Interaction(Base):
    """
    Interaction model for tracking user-POI interactions
    Etkileşim modeli - kullanıcı-POI etkileşimlerini takip eder
    """
    __tablename__ = "interactions"

    # Primary Key
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Foreign Keys
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    poi_id = Column(String(36), ForeignKey("pois.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Interaction Type
    interaction_type = Column(String(20), nullable=False, index=True)
    # Types: 'view', 'click', 'visit', 'rating', 'review', 'share', 'route_added'
    
    # Rating (if interaction_type is 'rating')
    rating = Column(Float, nullable=True)  # 1.0 - 5.0
    
    # Review (if interaction_type is 'review')
    review_text = Column(Text, nullable=True)
    
    # Visit Duration (if interaction_type is 'visit')
    visit_duration_minutes = Column(Integer, nullable=True)
    
    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    # Relationships
    user = relationship("User", back_populates="interactions")
    poi = relationship("POI", back_populates="interactions")
    
    def __repr__(self):
        return f"<Interaction(id={self.id}, type={self.interaction_type}, user_id={self.user_id}, poi_id={self.poi_id})>"
    
    def to_dict(self):
        """Convert interaction to dictionary"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "poi_id": self.poi_id,
            "interaction_type": self.interaction_type,
            "rating": self.rating,
            "review_text": self.review_text,
            "visit_duration_minutes": self.visit_duration_minutes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
