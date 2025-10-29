from pydantic import BaseModel

class POIRead(BaseModel):
    id: int
    name: str
    description: str | None
    latitude: float
    longitude: float

    class Config:
        orm_mode = True
