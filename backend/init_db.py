import asyncio
from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import text
from app.db.session import engine
from app.models.base import Base
from app.models import user, poi, route, favorite, interaction

async def init_db():
    async with engine.begin() as conn:
        # PostGIS extension'ını aktifleştir
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))
        
        # Tabloları oluştur
        await conn.run_sync(Base.metadata.create_all)
    
    print("✅ Database initialized successfully!")

if __name__ == "__main__":
    asyncio.run(init_db())
