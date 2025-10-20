from sqlalchemy import Column, Integer, String, Float, JSON
from geoalchemy2 import Geometry
from app.models.base import Base

class POI(Base):
    __tablename__ = "pois"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    geom = Column(Geometry(geometry_type='POINT', srid=4326))
    category = Column(String, index=True)
    rating = Column(Float, default=0.0)
    attributes = Column(JSON)
    visit_count = Column(Integer, default=0)
    reviews = relationship("Review", back_populates="poi")
