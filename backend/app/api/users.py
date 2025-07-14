from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_async_session
from app.models.user import User
from app.schemas.user import UserProfile
import os
from uuid import uuid4

router = APIRouter()

PROFILE_PIC_DIR = os.path.join(os.path.dirname(__file__), "..", "static", "profile_pics")
PROFILE_PIC_URL_PREFIX = "/static/profile_pics/"

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

@router.post("/users/{user_id}/profile_picture", status_code=status.HTTP_200_OK)
async def upload_profile_picture(user_id: int, file: UploadFile = File(...), db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        User.__table__.select().where(User.id == user_id)
    )
    user = result.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
        raise HTTPException(status_code=400, detail="Invalid file type")
    filename = f"{user_id}_{uuid4().hex}{ext}"
    os.makedirs(PROFILE_PIC_DIR, exist_ok=True)
    file_path = os.path.join(PROFILE_PIC_DIR, filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    # Update user row
    await db.execute(
        User.__table__.update().where(User.id == user_id).values(profile_picture=filename)
    )
    await db.commit()
    return {"profile_picture_url": PROFILE_PIC_URL_PREFIX + filename}
