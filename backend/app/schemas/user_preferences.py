"""
Pydantic schemas for user preferences endpoints.
"""

from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, Field, validator


class PreferenceScores(BaseModel):
    """Preference scores for each category on a 0-10 scale."""

    culture: int = Field(default=5, ge=0, le=10)
    nightlife: int = Field(default=5, ge=0, le=10)
    shopping: int = Field(default=5, ge=0, le=10)
    nature: int = Field(default=5, ge=0, le=10)
    food: int = Field(default=5, ge=0, le=10)
    sports: int = Field(default=5, ge=0, le=10)
    history: int = Field(default=5, ge=0, le=10)
    entertainment: int = Field(default=5, ge=0, le=10)


class TravelStyle(BaseModel):
    """Travel style preferences."""

    budget_level: str = Field(default="medium")
    pace: str = Field(default="moderate")
    group_size: str = Field(default="small")


class DistanceTimePreferences(BaseModel):
    """Preferences about distance and duration."""

    max_travel_distance_km: float = Field(default=50.0, ge=0)
    preferred_visit_duration_minutes: int = Field(default=120, ge=0)


class AccessibilityPreferences(BaseModel):
    """Accessibility related preferences."""

    public_transport_preference: int = Field(default=5, ge=0, le=10)


class UserPreferenceCreateOrUpdate(BaseModel):
    """
    Request body schema for creating or updating user preferences.
    """

    culture: int = Field(default=5, ge=0, le=10)
    nightlife: int = Field(default=5, ge=0, le=10)
    shopping: int = Field(default=5, ge=0, le=10)
    nature: int = Field(default=5, ge=0, le=10)
    food: int = Field(default=5, ge=0, le=10)
    sports: int = Field(default=5, ge=0, le=10)
    history: int = Field(default=5, ge=0, le=10)
    entertainment: int = Field(default=5, ge=0, le=10)
    budget_level: Optional[str] = Field(default="medium")
    pace: Optional[str] = Field(default="moderate")
    group_size: Optional[str] = Field(default="small")
    max_travel_distance_km: Optional[float] = Field(default=50.0, ge=0)
    preferred_visit_duration_minutes: Optional[int] = Field(default=120, ge=0)
    public_transport_preference: Optional[int] = Field(default=5, ge=0, le=10)
    available_times: Optional[Dict[str, Dict[str, bool]]] = None
    tags: Optional[List[str]] = None
    avoid_categories: Optional[List[str]] = None

    @validator("budget_level")
    def validate_budget_level(cls, value: Optional[str]) -> Optional[str]:
        if value and value not in {"low", "medium", "high"}:
            raise ValueError("budget_level must be one of: low, medium, high")
        return value

    @validator("pace")
    def validate_pace(cls, value: Optional[str]) -> Optional[str]:
        if value and value not in {"slow", "moderate", "fast"}:
            raise ValueError("pace must be one of: slow, moderate, fast")
        return value

    @validator("group_size")
    def validate_group_size(cls, value: Optional[str]) -> Optional[str]:
        if value and value not in {"solo", "small", "large"}:
            raise ValueError("group_size must be one of: solo, small, large")
        return value


class UserPreferenceResponse(BaseModel):
    """Response schema for user preferences."""

    user_id: str
    categories: PreferenceScores
    travel_style: TravelStyle
    distance_time: DistanceTimePreferences
    accessibility: AccessibilityPreferences
    available_times: Optional[Dict[str, Dict[str, bool]]] = None
    tags: Optional[List[str]] = None
    avoid_categories: Optional[List[str]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class UserPreferenceSaveResponse(BaseModel):
    """Response schema when preferences are saved."""

    message: str
    preferences: UserPreferenceResponse
