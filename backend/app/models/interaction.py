from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.base import Base

class Interaction(Base):
    __tablename__ = "interactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    poi_id = Column(Integer, ForeignKey('pois.id'))
    action = Column(String)  # view, save, visit, rate
    timestamp = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="interactions")
    poi = relationship("POI", back_populates="interactions")
