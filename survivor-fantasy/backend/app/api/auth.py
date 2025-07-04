from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from app.models.user import User
from app.core.database import get_async_session
from sqlalchemy import select
import logging

router = APIRouter()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Pydantic models for request/response
class RegisterRequest(BaseModel):
    email: EmailStr
    username: str
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: bool
    is_admin: bool
    created_at: str

    class Config:
        from_attributes = True

class UsersListResponse(BaseModel):
    total_users: int
    users: List[UserResponse]

# Helper function to convert user to response
def user_to_response(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        email=user.email,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        is_active=user.is_active,
        is_admin=user.is_admin,
        created_at=user.created_at.isoformat() if user.created_at else ""
    )

@router.post("/register")
async def register(
    request: RegisterRequest,
    session: AsyncSession = Depends(get_async_session)
):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_user = await session.execute(
            select(User).where(
                (User.email == request.email) | (User.username == request.username)
            )
        )
        if existing_user.scalar_one_or_none():
            raise HTTPException(
                status_code=400, 
                detail="Email or username already exists"
            )
        
        # Hash password
        hashed_password = pwd_context.hash(request.password)
        
        # Create user
        user = User(
            email=request.email,
            username=request.username,
            hashed_password=hashed_password,
            is_active=True,
            is_superuser=False,
            is_verified=False,
            is_admin=False
        )
        
        session.add(user)
        await session.commit()
        await session.refresh(user)
        
        logging.info(f"User registered: {user.username} ({user.email})")
        
        return {
            "message": "User created successfully",
            "user_id": user.id,
            "username": user.username,
            "email": user.email
        }
        
    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=400, 
            detail="Email or username already exists"
        )
    except Exception as e:
        await session.rollback()
        logging.error(f"Registration failed: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login")
async def login(
    request: LoginRequest,
    session: AsyncSession = Depends(get_async_session)
):
    """Login user (basic version - will add JWT later)"""
    try:
        # Find user by email
        result = await session.execute(
            select(User).where(User.email == request.email)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(
                status_code=401, 
                detail="Invalid email or password"
            )
        
        # Verify password
        if not pwd_context.verify(request.password, user.hashed_password):
            raise HTTPException(
                status_code=401, 
                detail="Invalid email or password"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=401, 
                detail="Account is deactivated"
            )
        
        logging.info(f"User logged in: {user.username}")
        
        return {
            "message": "Login successful",
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
            "access_token": f"fake-token-{user.id}",  # Will replace with real JWT
            "token_type": "bearer"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Login failed: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Login failed"
        )

@router.get("/users", response_model=UsersListResponse)
async def list_users(session: AsyncSession = Depends(get_async_session)):
    """List all users (for testing purposes)"""
    try:
        result = await session.execute(select(User).order_by(User.created_at.desc()))
        users = result.scalars().all()
        
        return UsersListResponse(
            total_users=len(users),
            users=[user_to_response(user) for user in users]
        )
    except Exception as e:
        logging.error(f"Failed to list users: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Failed to retrieve users"
        )

@router.get("/users/{username}", response_model=UserResponse)
async def get_user_by_username(
    username: str,
    session: AsyncSession = Depends(get_async_session)
):
    """Get a specific user by username"""
    try:
        result = await session.execute(
            select(User).where(User.username == username)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(
                status_code=404, 
                detail=f"User '{username}' not found"
            )
        
        return user_to_response(user)
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Failed to get user {username}: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Failed to retrieve user"
        )

@router.delete("/users/{username}")
async def delete_user_by_username(
    username: str,
    session: AsyncSession = Depends(get_async_session)
):
    """Delete a user by username (for testing purposes)"""
    try:
        # Find the user
        result = await session.execute(
            select(User).where(User.username == username)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(
                status_code=404, 
                detail=f"User '{username}' not found"
            )
        
        # Store user info before deletion
        deleted_info = {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
        
        # Delete the user
        await session.delete(user)
        await session.commit()
        
        logging.info(f"User deleted: {username}")
        
        return {
            "message": f"User '{username}' deleted successfully",
            "deleted_user": deleted_info
        }
        
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        logging.error(f"Failed to delete user {username}: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to delete user: {str(e)}"
        )

@router.delete("/users/email/{email}")
async def delete_user_by_email(
    email: str,
    session: AsyncSession = Depends(get_async_session)
):
    """Delete a user by email (for testing purposes)"""
    try:
        result = await session.execute(
            select(User).where(User.email == email)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(
                status_code=404, 
                detail=f"User with email '{email}' not found"
            )
        
        deleted_info = {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
        
        await session.delete(user)
        await session.commit()
        
        logging.info(f"User deleted by email: {email}")
        
        return {
            "message": f"User with email '{email}' deleted successfully",
            "deleted_user": deleted_info
        }
        
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        logging.error(f"Failed to delete user by email {email}: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to delete user: {str(e)}"
        )

@router.delete("/users/all")
async def delete_all_users(
    confirm: bool = False,
    session: AsyncSession = Depends(get_async_session)
):
    """Delete all users (dangerous - for testing only)"""
    if not confirm:
        raise HTTPException(
            status_code=400,
            detail="Must set confirm=true to delete all users"
        )
    
    try:
        result = await session.execute(select(User))
        users = result.scalars().all()
        user_count = len(users)
        
        for user in users:
            await session.delete(user)
        
        await session.commit()
        
        logging.warning(f"All users deleted: {user_count} users removed")
        
        return {
            "message": f"All {user_count} users deleted successfully",
            "deleted_count": user_count
        }
        
    except Exception as e:
        await session.rollback()
        logging.error(f"Failed to delete all users: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to delete users: {str(e)}"
        )

@router.get("/me")
async def get_current_user():
    """Get current user information (placeholder - will implement with JWT)"""
    return {
        "message": "Current user endpoint - will implement with JWT authentication",
        "status": "not_implemented"
    }

@router.post("/logout")
async def logout():
    """Logout user (placeholder - will implement with JWT)"""
    return {
        "message": "Logout successful",
        "status": "logged_out"
    }

# Create router aliases for main.py compatibility
auth_router = router
register_router = router
users_router = router
reset_password_router = router