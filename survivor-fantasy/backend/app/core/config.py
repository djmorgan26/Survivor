from pydantic_settings import BaseSettings
from pydantic import Field, PostgresDsn
from typing import Optional
import os

class Settings(BaseSettings):
    """Application settings"""
    
    # App Info
    APP_NAME: str = "Survivor Fantasy League API"
    VERSION: str = "1.0.0"
    DEBUG: bool = Field(default=True, env="DEBUG")
    
    # Database
    DATABASE_URL: str = Field(
        default="postgresql://localhost/survivor_fantasy",
        env="DATABASE_URL",
        description="Database connection URL"
    )
    
    # Security
    SECRET_KEY: str = Field(
        default="your-super-secret-key-change-this-in-production",
        env="SECRET_KEY",
        description="Secret key for JWT tokens"
    )
    
    # JWT Settings
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # CORS Settings
    CORS_ORIGINS: list[str] = Field(
        default=["http://localhost:3000", "http://localhost:5173"],
        env="CORS_ORIGINS",
        description="Allowed CORS origins"
    )
    
    # External APIs
    SURVIVOR_API_BASE_URL: str = "https://github.com/doehm/survivoR/raw/master/dev/json/"
    
    # Environment
    ENVIRONMENT: str = Field(default="development", env="ENVIRONMENT")
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"

# Global settings instance
settings = Settings()

# Helper function for database URL
def get_database_url() -> str:
    """Get the database URL for SQLAlchemy"""
    return settings.DATABASE_URL