/**
 * POI (Point of Interest) Types
 * Type definitions for POI data structures
 */

export interface POI {
  id: string;
  google_place_id?: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  latitude: number;
  longitude: number;
  category: string;
  types?: string[];
  rating: number;
  rating_count: number;
  phone_number?: string;
  website?: string;
  opening_hours?: any;
  price_level?: number;
  photos?: string[];
  amenities?: string[];
  accessibility_features?: any;
  average_visit_duration_minutes?: number;
  best_time_to_visit?: string;
  metadata?: any;
  created_at?: string;
  updated_at?: string;
  is_favorite?: boolean;
}

export interface POISearchParams {
  query: string;
  lat: number;
  lng: number;
  radius?: number;
}

export interface POINearbyParams {
  lat: number;
  lon: number;
  radius_km?: number;
  user_id?: string;
  category?: string;
  limit?: number;
}

export interface POICityParams {
  city: string;
  category?: string;
  min_rating?: number;
  limit?: number;
}
