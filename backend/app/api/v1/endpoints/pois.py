from fastapi import APIRouter, Query
from typing import List
from app.schemas.poi import POIRead
from app.services.places_service import search_places

router = APIRouter()

@router.get("/search", response_model=List[POIRead])
async def search(q: str = Query(...), lat: float = Query(None), lng: float = Query(None)):
    results = await search_places(q, lat, lng)
    return results

@router.get("/{poi_id}", response_model=POIRead)
async def get_poi(poi_id: int):
    # placeholder
    return {"id": poi_id, "name": "Sample POI", "description": "Desc", "latitude": 0.0, "longitude": 0.0}
