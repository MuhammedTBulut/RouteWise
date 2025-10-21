/**
 * API Client for FastAPI Backend
 * Handles all HTTP requests to the RouteWise backend
 */

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Backend URL - update this with your backend URL
const API_BASE_URL = __DEV__ 
  ? 'http://192.168.1.101:8000/api/v1'  // Development - Use your computer's IP
  : 'https://your-production-api.com/api/v1';  // Production

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 saniye timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear token
      await SecureStore.deleteItemAsync('authToken');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (email: string, username: string, password: string) => {
    const response = await apiClient.post('/auth/register', {
      email,
      username,
      password,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },
};

// POI (Points of Interest) API
export const poiAPI = {
  search: async (query: string, lat: number, lng: number, radius?: number) => {
    const response = await apiClient.get('/pois/search', {
      params: { q: query, lat, lng, radius },
    });
    return response.data;
  },

  getById: async (poiId: string) => {
    const response = await apiClient.get(`/pois/${poiId}`);
    return response.data;
  },
};

// Favorites API
export const favoritesAPI = {
  toggle: async (poiId: string) => {
    const response = await apiClient.post(`/favorites/toggle`, { poi_id: poiId });
    return response.data;
  },

  list: async () => {
    const response = await apiClient.get('/favorites');
    return response.data;
  },
};

// User Preferences API
export const preferencesAPI = {
  save: async (userId: string, preferences: {
    culture: number;
    nightlife: number;
    shopping: number;
    nature: number;
    food: number;
    sports: number;
    history: number;
    entertainment: number;
    budget_level?: string;
    pace?: string;
    group_size?: string;
    max_travel_distance_km?: number;
    preferred_visit_duration_minutes?: number;
    accessibility_required?: number;
    public_transport_preference?: number;
  }) => {
    const response = await apiClient.post(`/preferences/${userId}`, preferences);
    return response.data;
  },

  get: async (userId: string) => {
    const response = await apiClient.get(`/preferences/${userId}`);
    return response.data;
  },

  getTopCategories: async (userId: string, limit: number = 3) => {
    const response = await apiClient.get(`/preferences/${userId}/top-categories`, {
      params: { limit },
    });
    return response.data;
  },
};

// User API
export const userAPI = {
  create: async (userData: {
    firebase_uid: string;
    email: string;
    display_name: string;
    city?: string;
    country?: string;
  }) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  update: async (userId: string, updates: any) => {
    const response = await apiClient.put(`/users/${userId}`, updates);
    return response.data;
  },
};

// City POIs API
export const cityPOIAPI = {
  getByCity: async (city: string, category?: string, minRating?: number, limit: number = 50) => {
    const response = await apiClient.get(`/pois/city/${encodeURIComponent(city)}`, {
      params: { category, min_rating: minRating, limit },
    });
    return response.data;
  },

  getNearby: async (lat: number, lon: number, radiusKm: number = 5, userId?: string, category?: string, limit: number = 50) => {
    const response = await apiClient.get('/pois/nearby', {
      params: { lat, lon, radius_km: radiusKm, user_id: userId, category, limit },
    });
    return response.data;
  },
};

export default apiClient;
