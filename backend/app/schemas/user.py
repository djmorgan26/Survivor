from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from fastapi_users.schemas import BaseUser, BaseUserCreate, BaseUserUpdate

# FastAPI-Users compatible schemas
class UserRead(BaseUser[int]):
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_admin: bool = False
    created_at: Optional[datetime] = None

class UserCreate(BaseUserCreate):
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserUpdate(BaseUserUpdate):
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None

# Additional schemas for your app logic
class UserProfile(BaseModel):
    id: int
    username: str
    first_name: Optional[str]
    last_name: Optional[str]
    email: str
    is_admin: bool
    created_at: datetime
    profile_picture_url: Optional[str] = None
    bio: Optional[str] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None

    class Config:
        from_attributes = True  # Updated for Pydantic v2