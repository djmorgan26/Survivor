from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_async_session
from app.models.user import User
from app.models.league import League, LeagueMembership
from app.schemas.user import UserProfile
from app.schemas.league import LeagueOut
from app.api.auth import get_current_user
from pydantic import BaseModel
import os
from uuid import uuid4
from typing import List

router = APIRouter()

PROFILE_PIC_DIR = os.path.join(os.path.dirname(__file__), "..", "static", "profile_pics")
PROFILE_PIC_URL_PREFIX = "/static/profile_pics/"

class BioUpdate(BaseModel):
    bio: str

@router.get("/users/{user_id}/public", response_model=UserProfile)
async def get_public_user_profile(user_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        User.__table__.select().where(User.id == user_id)
    )
    user = result.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user = user._mapping  # SQLAlchemy Row to dict
    profile_picture_url = None
    if user['profile_picture']:
        profile_picture_url = PROFILE_PIC_URL_PREFIX + user['profile_picture']
    return UserProfile(
        id=user['id'],
        username=user['username'],
        first_name=user['first_name'],
        last_name=user['last_name'],
        email=user['email'],
        is_admin=user['is_admin'],
        created_at=user['created_at'],
        profile_picture_url=profile_picture_url,
        bio=user['bio'],
        # Add more metadata fields for richer public profiles
        is_active=user.get('is_active'),
        is_verified=user.get('is_verified'),
        # You can add more fields as needed
    )

@router.post("/users/{user_id}/bio", response_model=UserProfile)
async def update_user_bio(
    user_id: int, 
    bio_update: BioUpdate, 
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """Update a user's bio - only the user themselves can update their bio"""
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Can only update your own bio")
    
    result = await db.execute(
        User.__table__.select().where(User.id == user_id)
    )
    user = result.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update the bio
    await db.execute(
        User.__table__.update().where(User.id == user_id).values(bio=bio_update.bio)
    )
    await db.commit()
    
    # Return updated user profile
    updated_result = await db.execute(
        User.__table__.select().where(User.id == user_id)
    )
    updated_user = updated_result.fetchone()._mapping
    
    profile_picture_url = None
    if updated_user['profile_picture']:
        profile_picture_url = PROFILE_PIC_URL_PREFIX + updated_user['profile_picture']
    
    return UserProfile(
        id=updated_user['id'],
        username=updated_user['username'],
        first_name=updated_user['first_name'],
        last_name=updated_user['last_name'],
        email=updated_user['email'],
        is_admin=updated_user['is_admin'],
        created_at=updated_user['created_at'],
        profile_picture_url=profile_picture_url,
        bio=updated_user['bio'],
        is_active=updated_user.get('is_active'),
        is_verified=updated_user.get('is_verified'),
    )

@router.get("/users/{user_id}/leagues", response_model=List[LeagueOut])
async def get_user_leagues(user_id: int, db: AsyncSession = Depends(get_async_session)):
    """Get all leagues that a user is a member of"""
    # First check if user exists
    user_result = await db.execute(
        User.__table__.select().where(User.id == user_id)
    )
    if not user_result.fetchone():
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user's league memberships with league details
    stmt = select(League).join(LeagueMembership).where(LeagueMembership.user_id == user_id)
    result = await db.execute(stmt)
    leagues = result.scalars().all()
    
    return leagues

@router.post("/users/{user_id}/profile_picture", status_code=status.HTTP_200_OK)
async def upload_profile_picture(
    user_id: int, 
    file: UploadFile = File(...), 
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """Upload a profile picture - only the user themselves can upload"""
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Can only upload your own profile picture")
    
    result = await db.execute(
        User.__table__.select().where(User.id == user_id)
    )
    user = result.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Validate file type
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload JPG, PNG, or WebP")
    
    # Validate file size (max 5MB)
    file_content = await file.read()
    if len(file_content) > 5 * 1024 * 1024:  # 5MB
        raise HTTPException(status_code=400, detail="File too large. Please upload an image smaller than 5MB")
    
    # Generate unique filename
    filename = f"{user_id}_{uuid4().hex}{ext}"
    os.makedirs(PROFILE_PIC_DIR, exist_ok=True)
    file_path = os.path.join(PROFILE_PIC_DIR, filename)
    
    # Save the file
    with open(file_path, "wb") as f:
        f.write(file_content)
    
    # Update user record
    await db.execute(
        User.__table__.update().where(User.id == user_id).values(profile_picture=filename)
    )
    await db.commit()
    
    return {"profile_picture_url": PROFILE_PIC_URL_PREFIX + filename}
