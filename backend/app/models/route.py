from sqlalchemy import Column, Integer, String, JSON, Float
from geoalchemy2 import Geometry
from app.models.base import Base

class Route(Base):
    __tablename__ = "routes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    origin = Column(Geometry(geometry_type='POINT', srid=4326))
    destination = Column(Geometry(geometry_type='POINT', srid=4326))
    geometry = Column(Geometry(geometry_type='LINESTRING', srid=4326))
    distance = Column(Float)
    duration = Column(Float)
    preferences = Column(JSON)
