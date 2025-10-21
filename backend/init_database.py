"""
Database Initialization Script
Creates all tables and PostGIS extension
Veritabanını başlatır ve tabloları oluşturur
"""

import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from app.core.config import settings
from app.models import Base, User, UserPreference, POI, Favorite, Interaction, Route


def _create_engine(url: str):
    """Create SQLAlchemy engine with proper settings for the given URL."""
    if url.startswith("sqlite"):
        return create_engine(url, echo=True, connect_args={"check_same_thread": False})
    return create_engine(url, echo=True)


def init_database():
    """Initialize database with tables and extensions"""
    
    print("🔧 Connecting to database...")
    db_url = settings.DATABASE_URL
    engine = _create_engine(db_url)
    
    try:
        if not db_url.startswith("sqlite"):
            # PostGIS extension (skipped - not installed in this postgres image)
            # Can be added later if needed for advanced geospatial queries
            print("\n📍 PostGIS extension skipped (using lat/long fields instead)")
        
        # Create all tables
        print("\n🏗️  Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ All tables created successfully!")
        
        # Print created tables
        print("\n📋 Created tables:")
        print("  ✓ users - User accounts")
        print("  ✓ user_preferences - User travel preferences")
        print("  ✓ pois - Points of Interest")
        print("  ✓ favorites - User favorite POIs")
        print("  ✓ interactions - User-POI interactions")
        print("  ✓ routes - User saved routes")
        
        print("\n🎉 Database initialization completed!")
        
    except Exception as e:
        print(f"\n❌ Error initializing database: {e}")
        raise
    
    finally:
        engine.dispose()


def drop_all_tables():
    """Drop all tables (use with caution!)"""
    print("⚠️  WARNING: Dropping all tables...")
    response = input("Are you sure? Type 'yes' to confirm: ")
    
    if response.lower() != 'yes':
        print("❌ Aborted")
        return
    
    db_url = settings.DATABASE_URL
    engine = _create_engine(db_url)
    
    try:
        Base.metadata.drop_all(bind=engine)
        print("✅ All tables dropped")
    except Exception as e:
        print(f"❌ Error dropping tables: {e}")
        raise
    finally:
        engine.dispose()


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Database initialization")
    parser.add_argument("--drop", action="store_true", help="Drop all tables before creating")
    
    args = parser.parse_args()
    
    if args.drop:
        drop_all_tables()
    
    init_database()
