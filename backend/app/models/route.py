"""
Route Model - Stores user's saved routes
"""
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Float, Integer, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from .base import Base

class Route(Base):
    __tablename__ = "routes"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    pois = Column(JSON, nullable=False)
    total_distance_km = Column(Float, nullable=True)
    estimated_duration_minutes = Column(Integer, nullable=True)
    transport_mode = Column(String(20), default='walking')
    optimize_route = Column(Integer, default=1)
    is_completed = Column(Integer, default=0)
    completion_date = Column(DateTime, nullable=True)
    is_public = Column(Integer, default=0)
    share_url = Column(String(255), nullable=True, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    user = relationship("User", back_populates="routes")
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "description": self.description,
            "pois": self.pois,
            "total_distance_km": self.total_distance_km,
            "estimated_duration_minutes": self.estimated_duration_minutes,
            "transport_mode": self.transport_mode,
            "optimize_route": bool(self.optimize_route),
            "is_completed": bool(self.is_completed),
            "is_public": bool(self.is_public),
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
