"""
Favorites API Endpoints
Handles user's favorite POIs
"""

from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from pydantic import BaseModel

from app.db.session import get_db
from app.models.favorite import Favorite
from app.models.poi import POI
from app.models.user import User

router = APIRouter()


class FavoriteToggleRequest(BaseModel):
    poi_id: str


@router.post("/toggle")
async def toggle_favorite(
    request: FavoriteToggleRequest,
    db: Session = Depends(get_db),
    # current_user: User = Depends(get_current_user)  # Auth eklendiğinde aktif olacak
):
    """
    Toggle a POI as favorite for the current user
    If it exists, remove it. If it doesn't exist, add it.
    """
    # Şimdilik test için sabit user_id kullanıyoruz
    # Gerçek uygulamada current_user.id kullanılacak
    user_id = "test-user-1"
    poi_id = request.poi_id
    
    # Check if POI exists
    poi = db.query(POI).filter(POI.id == poi_id).first()
    if not poi:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="POI not found"
        )
    
    # Check if already favorited
    existing_favorite = db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.poi_id == poi_id
    ).first()
    
    if existing_favorite:
        # Remove from favorites
        db.delete(existing_favorite)
        db.commit()
        return {
            "success": True,
            "is_favorite": False,
            "message": "Removed from favorites"
        }
    else:
        # Add to favorites
        new_favorite = Favorite(
            user_id=user_id,
            poi_id=poi_id
        )
        db.add(new_favorite)
        db.commit()
        db.refresh(new_favorite)
        return {
            "success": True,
            "is_favorite": True,
            "message": "Added to favorites",
            "favorite": new_favorite.to_dict()
        }


@router.get("/")
async def get_favorites(
    db: Session = Depends(get_db),
    # current_user: User = Depends(get_current_user)
):
    """
    Get all favorite POIs for the current user
    """
    # Şimdilik test için sabit user_id kullanıyoruz
    user_id = "test-user-1"
    
    favorites = db.query(Favorite).filter(
        Favorite.user_id == user_id
    ).all()
    
    # Get POI details for each favorite
    favorite_pois = []
    for favorite in favorites:
        poi = db.query(POI).filter(POI.id == favorite.poi_id).first()
        if poi:
            poi_dict = poi.to_dict()
            poi_dict['is_favorite'] = True
            poi_dict['favorited_at'] = favorite.created_at.isoformat() if favorite.created_at else None
            favorite_pois.append(poi_dict)
    
    return favorite_pois


@router.delete("/{poi_id}")
async def remove_favorite(
    poi_id: str,
    db: Session = Depends(get_db),
    # current_user: User = Depends(get_current_user)
):
    """
    Remove a POI from favorites
    """
    # Şimdilik test için sabit user_id kullanıyoruz
    user_id = "test-user-1"
    
    favorite = db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.poi_id == poi_id
    ).first()
    
    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite not found"
        )
    
    db.delete(favorite)
    db.commit()
    
    return {
        "success": True,
        "message": "Removed from favorites"
    }


@router.get("/check/{poi_id}")
async def check_favorite(
    poi_id: str,
    db: Session = Depends(get_db),
    # current_user: User = Depends(get_current_user)
):
    """
    Check if a POI is in user's favorites
    """
    # Şimdilik test için sabit user_id kullanıyoruz
    user_id = "test-user-1"
    
    favorite = db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.poi_id == poi_id
    ).first()
    
    return {
        "is_favorite": favorite is not None,
        "poi_id": poi_id
    }
