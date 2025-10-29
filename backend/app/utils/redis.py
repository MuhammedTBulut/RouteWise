import redis.asyncio as redis
from app.config import get_settings
import secrets
import string

settings = get_settings()


class RedisClient:
    def __init__(self):
        self.redis = None
    
    async def connect(self):
        """Connect to Redis"""
        self.redis = await redis.from_url(
            f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}",
            encoding="utf-8",
            decode_responses=True
        )
    
    async def close(self):
        """Close Redis connection"""
        if self.redis:
            await self.redis.close()
    
    async def set_verification_code(self, email: str, code: str, expire_seconds: int = 600):
        """Store verification code in Redis (expires in 10 minutes by default)"""
        key = f"verification:{email}"
        await self.redis.setex(key, expire_seconds, code)
    
    async def get_verification_code(self, email: str) -> str:
        """Get verification code from Redis"""
        key = f"verification:{email}"
        return await self.redis.get(key)
    
    async def delete_verification_code(self, email: str):
        """Delete verification code from Redis"""
        key = f"verification:{email}"
        await self.redis.delete(key)


# Global Redis client instance
redis_client = RedisClient()


def generate_verification_code(length: int = 6) -> str:
    """Generate a random verification code"""
    return ''.join(secrets.choice(string.digits) for _ in range(length))
