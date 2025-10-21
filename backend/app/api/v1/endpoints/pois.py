from fastapi import APIRouter, Depends, HTTPException, Query
from math import radians, cos, sin, asin, sqrt
from typing import List, Optional

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.poi import POI
from app.models.user_preferences import UserPreference
from app.models.favorite import Favorite

router = APIRouter()


def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate distance between two points using Haversine formula
    İki nokta arası mesafe hesaplama (km)
    """
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    km = 6371 * c  # Earth radius in km
    return km


@router.get("/city/{city}", response_model=List[dict])
async def get_pois_by_city(
    city: str,
    category: Optional[str] = None,
    min_rating: Optional[float] = 0.0,
    limit: int = Query(default=50, le=200),
    offset: int = Query(default=0, ge=0),
    user_id: Optional[str] = Query(default="test-user-1"),  # Şimdilik test için
    db: Session = Depends(get_db)
):
    """
    Get POIs in a specific city
    Belirli bir şehirdeki POI'leri getir
    
    Parameters:
    - city: Şehir adı (örn: "Istanbul", "Ankara")
    - category: Kategori filtresi (örn: "culture", "nightlife", "shopping")
    - min_rating: Minimum rating (0.0-5.0)
    - limit: Maksimum sonuç sayısı
    - offset: Sayfalama için offset
    - user_id: Kullanıcı ID (favori kontrolü için)
    """
    query = db.query(POI).filter(
        POI.city.ilike(f"%{city}%"),  # Case-insensitive search
        POI.is_active == 1
    )
    
    if category:
        query = query.filter(POI.category == category)
    
    if min_rating > 0:
        query = query.filter(POI.rating >= min_rating)
    
    # Order by rating and popularity
    query = query.order_by(POI.rating.desc(), POI.popularity_score.desc())
    
    pois = query.offset(offset).limit(limit).all()
    
    # Get user's favorites
    favorite_poi_ids = set()
    if user_id:
        favorites = db.query(Favorite).filter(Favorite.user_id == user_id).all()
        favorite_poi_ids = {fav.poi_id for fav in favorites}
    
    # Add is_favorite field
    result = []
    for poi in pois:
        poi_dict = poi.to_dict()
        poi_dict['is_favorite'] = poi.id in favorite_poi_ids
        result.append(poi_dict)
    
    return result


@router.get("/search", response_model=List[dict])
async def search_pois(
    q: str = Query(..., min_length=2, description="Free text query for POI name or description"),
    lat: Optional[float] = Query(None, description="User latitude"),
    lon: Optional[float] = Query(None, description="User longitude"),
    radius_km: float = Query(10.0, ge=0.1, le=100.0, description="Optional radius filter (km)"),
    limit: int = Query(default=50, le=200),
    db: Session = Depends(get_db),
):
    """
    Search POIs by keyword and optionally filter by proximity.
    Kullanıcı sorgusuna göre POI araması yapar.
    """
    search_term = f"%{q}%"
    query = db.query(POI).filter(
        POI.is_active == 1,
        or_(
            POI.name.ilike(search_term),
            POI.description.ilike(search_term),
            POI.city.ilike(search_term),
        ),
    ).order_by(POI.rating.desc(), POI.popularity_score.desc())

    results = query.limit(limit).all()
    pois: List[dict] = []

    include_distance = lat is not None and lon is not None

    for poi in results:
        poi_dict = poi.to_dict()
        if include_distance:
            distance = calculate_distance(lat, lon, poi.latitude, poi.longitude)
            poi_dict["distance_km"] = round(distance, 2)
            if distance > radius_km:
                continue
        pois.append(poi_dict)

    return pois


@router.get("/nearby", response_model=List[dict])
async def get_nearby_pois(
    lat: float = Query(..., description="User latitude"),
    lon: float = Query(..., description="User longitude"),
    radius_km: float = Query(default=5.0, ge=0.1, le=50.0, description="Search radius in km"),
    category: Optional[str] = None,
    user_id: Optional[str] = None,
    limit: int = Query(default=50, le=200),
    db: Session = Depends(get_db)
):
    """
    Get nearby POIs within a radius
    Belirli bir yarıçap içindeki yakın POI'leri getir
    
    Parameters:
    - lat: Kullanıcının enlem koordinatı
    - lon: Kullanıcının boylam koordinatı
    - radius_km: Arama yarıçapı (km)
    - category: Kategori filtresi (opsiyonel)
    - user_id: Kullanıcı ID (tercih bazlı sıralama için)
    - limit: Maksimum sonuç sayısı
    """
    # Calculate bounding box
    lat_range = radius_km / 111.0  # 1 degree ≈ 111km
    lon_range = radius_km / (111.0 * cos(radians(lat)))
    
    query = db.query(POI).filter(
        POI.latitude.between(lat - lat_range, lat + lat_range),
        POI.longitude.between(lon - lon_range, lon + lon_range),
        POI.is_active == 1
    )
    
    if category:
        query = query.filter(POI.category == category)
    
    pois = query.all()
    
    # Calculate exact distance and filter
    nearby_pois = []
    for poi in pois:
        distance = calculate_distance(lat, lon, poi.latitude, poi.longitude)
        if distance <= radius_km:
            poi_dict = poi.to_dict()
            poi_dict['distance_km'] = round(distance, 2)
            nearby_pois.append(poi_dict)
    
    # Sort by distance or user preference
    if user_id:
        # Get user preferences
        user_prefs = db.query(UserPreference).filter_by(user_id=user_id).first()
        if user_prefs:
            top_categories = user_prefs.get_top_categories(limit=3)
            # Score POIs based on category preference and distance
            for poi_dict in nearby_pois:
                category_score = 0
                if poi_dict['category'] in top_categories:
                    category_score = (3 - top_categories.index(poi_dict['category'])) * 10
                poi_dict['score'] = category_score - poi_dict['distance_km']
            nearby_pois.sort(key=lambda x: x.get('score', 0), reverse=True)
        else:
            nearby_pois.sort(key=lambda x: x['distance_km'])
    else:
        nearby_pois.sort(key=lambda x: x['distance_km'])
    
    return nearby_pois[:limit]


@router.get("/{poi_id}", response_model=dict)
async def get_poi(
    poi_id: str,
    user_id: Optional[str] = Query(default="test-user-1"),
    db: Session = Depends(get_db)
):
    """
    Get a specific POI by ID
    ID'ye göre POI detaylarını getir
    """
    poi = db.query(POI).filter(POI.id == poi_id).first()
    if not poi:
        raise HTTPException(status_code=404, detail="POI not found")
    
    poi_dict = poi.to_dict()
    
    # Check if favorited
    if user_id:
        favorite = db.query(Favorite).filter(
            Favorite.user_id == user_id,
            Favorite.poi_id == poi_id
        ).first()
        poi_dict['is_favorite'] = favorite is not None
    else:
        poi_dict['is_favorite'] = False
    
    return poi_dict
