"""
Simple test to check API endpoints work
"""

import sys
sys.path.insert(0, '/Users/muhammedbulut/Desktop/RouteWise/backend')

from app.db.session import SessionLocal
from app.models.user import User
from app.models.user_preferences import UserPreference  
from app.models.poi import POI
import uuid

print("🔧 Creating test data...")

# Create database session
db = SessionLocal()

# 1. Create test user
user_id = str(uuid.uuid4())
test_user = User(
    id=user_id,
    firebase_uid="test_firebase_123",
    email="test@routewise.com",
    display_name="Test User",
    city="Istanbul",
    country="Turkey"
)
db.add(test_user)
db.commit()
print(f"✅ Created test user: {test_user.email}")

# 2. Create user preferences
prefs = UserPreference(
    user_id=user_id,
    culture=9,  # En yüksek
    nightlife=8,
    shopping=6,
    nature=7,
    food=10,  # En yüksek
    sports=4,
    history=8,
    entertainment=7,
    budget_level="medium",
    pace="moderate",
    group_size="small"
)
db.add(prefs)
db.commit()
print("✅ Created user preferences")
print(f"   Top categories: {prefs.get_top_categories()}")

# 3. Create test POIs in Istanbul
pois_data = [
    {
        "name": "Hagia Sophia",
        "category": "culture",
        "city": "Istanbul",
        "latitude": 41.0086,
        "longitude": 28.9802,
        "rating": 4.7
    },
    {
        "name": "Kadıköy Moda",
        "category": "nightlife",
        "city": "Istanbul",
        "latitude": 40.9895,
        "longitude": 29.0255,
        "rating": 4.5
    },
    {
        "name": "Istiklal Street",
        "category": "shopping",
        "city": "Istanbul",
        "latitude": 41.0369,
        "longitude": 28.9784,
        "rating": 4.6
    },
    {
        "name": "Çamlıca Hill",
        "category": "nature",
        "city": "Istanbul",
        "latitude": 41.0408,
        "longitude": 29.0664,
        "rating": 4.4
    },
    {
        "name": "Karaköy Lokantası",
        "category": "food",
        "city": "Istanbul",
        "latitude": 41.0228,
        "longitude": 28.9745,
        "rating": 4.8
    }
]

for poi_data in pois_data:
    poi = POI(
        id=str(uuid.uuid4()),
        name=poi_data["name"],
        category=poi_data["category"],
        city=poi_data["city"],
        country="Turkey",
        latitude=poi_data["latitude"],
        longitude=poi_data["longitude"],
        rating=poi_data["rating"],
        is_active=1
    )
    db.add(poi)
    
db.commit()
print(f"✅ Created {len(pois_data)} test POIs in Istanbul")

# 4. Test city query
istanbul_pois = db.query(POI).filter(POI.city == "Istanbul").all()
print(f"\n📍 Query test: Found {len(istanbul_pois)} POIs in Istanbul:")
for poi in istanbul_pois:
    print(f"   - {poi.name} ({poi.category}) - Rating: {poi.rating}")

db.close()
print("\n✅ Test data created successfully!")
print(f"\n📝 Test user ID: {user_id}")
print("You can now test the API endpoints!")
