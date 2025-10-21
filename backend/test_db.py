"""
Test script to check if API works
"""

import sys
sys.path.insert(0, '/Users/muhammedbulut/Desktop/RouteWise/backend')

from app.db.session import SessionLocal
from app.models.poi import POI

# Test database connection
print("Testing database connection...")
db = SessionLocal()

# Count POIs
count = db.query(POI).count()
print(f"✅ Database connected! Found {count} POIs")

# Test city query
istanbul_pois = db.query(POI).filter(POI.city.ilike("%istanbul%")).limit(5).all()
print(f"\n📍 Found {len(istanbul_pois)} POIs in Istanbul")

db.close()
print("\n✅ All tests passed!")
