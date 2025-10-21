import os
import requests
import logging

logger = logging.getLogger(__name__)
GOOGLE_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

async def search_places(query, lat=None, lng=None):
    params = {"key": GOOGLE_API_KEY, "query": query}
    if lat and lng:
        params["location"] = f"{lat},{lng}"
        params["radius"] = 5000
    
    logger.info(f"Searching places with params: {params}")
    resp = requests.get("https://maps.googleapis.com/maps/api/place/textsearch/json", params=params)
    data = resp.json()
    logger.info(f"Google API Response status: {data.get('status')}")
    
    if data.get("status") != "OK":
        logger.error(f"Google API Error: {data}")
        return []
    
    results = []
    for item in data.get("results", []):
        poi = {
            "id": item.get("place_id"),
            "name": item.get("name"),
            "description": item.get("formatted_address"),
            "latitude": item.get("geometry", {}).get("location", {}).get("lat"),
            "longitude": item.get("geometry", {}).get("location", {}).get("lng"),
        }
        results.append(poi)
    logger.info(f"Found {len(results)} places")
    return results
