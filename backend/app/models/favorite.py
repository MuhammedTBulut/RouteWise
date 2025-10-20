from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class Favorite(Base):
    __tablename__ = "favorites"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    poi_id = Column(Integer, ForeignKey('pois.id'))
    user = relationship("User", back_populates="favorites")
    poi = relationship("POI", back_populates="favorites")
