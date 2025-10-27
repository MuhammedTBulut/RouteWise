"""
User Preferences Endpoints
Kullanıcı tercihleri için API endpoint'leri
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.user_preferences import UserPreference
from app.schemas.user_preferences import (
    AccessibilityPreferences,
    DistanceTimePreferences,
    PreferenceScores,
    TravelStyle,
    UserPreferenceCreateOrUpdate,
    UserPreferenceResponse,
    UserPreferenceSaveResponse,
)

router = APIRouter()


def _build_response_model(pref: UserPreference) -> UserPreferenceResponse:
    """Convert ORM model to response schema."""
    return UserPreferenceResponse(
        user_id=pref.user_id,
        categories=PreferenceScores(
            culture=pref.culture,
            nightlife=pref.nightlife,
            shopping=pref.shopping,
            nature=pref.nature,
            food=pref.food,
            sports=pref.sports,
            history=pref.history,
            entertainment=pref.entertainment,
        ),
        travel_style=TravelStyle(
            budget_level=pref.budget_level,
            pace=pref.pace,
            group_size=pref.group_size,
        ),
        distance_time=DistanceTimePreferences(
            max_travel_distance_km=pref.max_travel_distance_km,
            preferred_visit_duration_minutes=pref.preferred_visit_duration_minutes,
        ),
        accessibility=AccessibilityPreferences(
            accessibility_required=bool(pref.accessibility_required),
            public_transport_preference=pref.public_transport_preference,
        ),
        available_times=pref.available_times,
        tags=pref.tags,
        avoid_categories=pref.avoid_categories,
        created_at=pref.created_at,
        updated_at=pref.updated_at,
    )


@router.post("/{user_id}", response_model=UserPreferenceSaveResponse)
async def create_or_update_preferences(
    user_id: str,
    payload: UserPreferenceCreateOrUpdate,
    db: Session = Depends(get_db),
) -> UserPreferenceSaveResponse:
    """
    Create or update user preferences
    Kullanıcı tercihlerini oluştur veya güncelle
    
    Parameters:
    - culture, nightlife, shopping, nature, food, sports, history, entertainment: 0-10 arası değerler
    - budget_level: 'low', 'medium', 'high'
    - pace: 'slow', 'moderate', 'fast'
    - group_size: 'solo', 'small', 'large'
    """
    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    data = payload.dict()
    accessibility_required = int(bool(data.pop("accessibility_required", False)))
    
    # Check if preferences already exist
    prefs = db.query(UserPreference).filter(UserPreference.user_id == user_id).first()
    
    if prefs:
        # Update existing preferences
        for field in [
            "culture",
            "nightlife",
            "shopping",
            "nature",
            "food",
            "sports",
            "history",
            "entertainment",
            "budget_level",
            "pace",
            "group_size",
            "max_travel_distance_km",
            "preferred_visit_duration_minutes",
            "public_transport_preference",
            "available_times",
            "tags",
            "avoid_categories",
        ]:
            setattr(prefs, field, data.get(field))
        prefs.accessibility_required = accessibility_required
    else:
        # Create new preferences
        prefs = UserPreference(
            user_id=user_id,
            accessibility_required=accessibility_required,
            **{
                key: data.get(key)
                for key in [
                    "culture",
                    "nightlife",
                    "shopping",
                    "nature",
                    "food",
                    "sports",
                    "history",
                    "entertainment",
                    "budget_level",
                    "pace",
                    "group_size",
                    "max_travel_distance_km",
                    "preferred_visit_duration_minutes",
                    "public_transport_preference",
                    "available_times",
                    "tags",
                    "avoid_categories",
                ]
            },
        )
        db.add(prefs)
    
    db.commit()
    db.refresh(prefs)
    
    return UserPreferenceSaveResponse(
        message="Preferences saved successfully",
        preferences=_build_response_model(prefs),
    )


@router.get("/{user_id}", response_model=UserPreferenceResponse)
async def get_user_preferences(user_id: str, db: Session = Depends(get_db)) -> UserPreferenceResponse:
    """
    Get user preferences
    Kullanıcı tercihlerini getir
    """
    prefs = db.query(UserPreference).filter(UserPreference.user_id == user_id).first()
    if not prefs:
        raise HTTPException(status_code=404, detail="Preferences not found")
    
    return _build_response_model(prefs)


@router.get("/{user_id}/top-categories")
async def get_top_categories(
    user_id: str,
    limit: int = 3,
    db: Session = Depends(get_db)
):
    """
    Get user's top category preferences
    Kullanıcının en çok tercih ettiği kategorileri getir
    """
    prefs = db.query(UserPreference).filter(UserPreference.user_id == user_id).first()
    if not prefs:
        raise HTTPException(status_code=404, detail="Preferences not found")
    
    top_categories = prefs.get_top_categories(limit=limit)
    
    return {
        "user_id": user_id,
        "top_categories": top_categories
    }
