import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import settings
from app.core.database import Base

async def create_tables():
    print(f"Database URL: {settings.DATABASE_URL}")
    
    # Import all models to ensure they're registered
    print("Importing models...")
    from app.models.user import User
    print(f"User model imported: {User}")
    
    # Check what tables are in metadata
    print(f"Tables in metadata: {list(Base.metadata.tables.keys())}")
    
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    
    async with engine.begin() as conn:
        print("Dropping existing tables...")
        await conn.run_sync(Base.metadata.drop_all)
        
        print("Creating new tables...")
        await conn.run_sync(Base.metadata.create_all)
    
    await engine.dispose()
    print("✅ Database tables created successfully!")

if __name__ == "__main__":
    asyncio.run(create_tables())