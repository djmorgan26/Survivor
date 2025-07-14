from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Union
from datetime import datetime, timedelta
from jose import JWTError, jwt
import logging

from app.models.user import User
from app.core.database import get_async_session
from app.core.config import settings
from sqlalchemy import select

router = APIRouter()

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# JWT Settings
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Pydantic models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

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

# JWT Utility Functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

async def get_user_by_email(session: AsyncSession, email: str) -> Optional[User]:
    """Get user by email"""
    result = await session.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()

async def get_user_by_username(session: AsyncSession, username: str) -> Optional[User]:
    """Get user by username"""
    result = await session.execute(select(User).where(User.username == username))
    return result.scalar_one_or_none()

async def authenticate_user(session: AsyncSession, email: str, password: str) -> Union[User, bool]:
    """Authenticate user with email and password"""
    user = await get_user_by_email(session, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: AsyncSession = Depends(get_async_session)
) -> User:
    """Get current user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    user = await get_user_by_username(session, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current active user"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_current_admin_user(current_user: User = Depends(get_current_active_user)) -> User:
    """Get current admin user"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user

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

# Authentication Endpoints
@router.post("/register", response_model=dict)
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
        hashed_password = get_password_hash(request.password)
        
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
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        
        logging.info(f"User registered: {user.username} ({user.email})")
        
        return {
            "message": "User created successfully",
            "user": user_to_response(user),
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60  # seconds
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

@router.post("/login", response_model=Token)
async def login(
    request: LoginRequest,
    session: AsyncSession = Depends(get_async_session)
):
    """Login user and return JWT token"""
    user = await authenticate_user(session, request.email, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated"
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    logging.info(f"User logged in: {user.username}")
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/refresh")
async def refresh_token(current_user: User = Depends(get_current_active_user)):
    """Refresh JWT token"""
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": current_user.username}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/logout")
async def logout():
    """Logout user (JWT tokens are stateless, so this is mainly for frontend)"""
    return {"message": "Successfully logged out"}

# Protected User Endpoints
@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """Get current user information"""
    return user_to_response(current_user)

@router.put("/me", response_model=UserResponse)
async def update_current_user(
    first_name: Optional[str] = None,
    last_name: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_async_session)
):
    """Update current user information"""
    try:
        if first_name is not None:
            current_user.first_name = first_name
        if last_name is not None:
            current_user.last_name = last_name
        
        await session.commit()
        await session.refresh(current_user)
        
        return user_to_response(current_user)
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update user: {str(e)}")

# Admin-only User Management Endpoints
@router.get("/users", response_model=UsersListResponse)
async def list_users(
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_active_user)  # Any authenticated user can view
):
    """List all users"""
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
async def get_user_by_username_endpoint(
    username: str,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific user by username"""
    try:
        user = await get_user_by_username(session, username)
        
        if not user:
            raise HTTPException(
                status_code=404, 
                detail=f"User '{username}' not found"
            )
        
        # Users can only view their own profile unless admin
        if current_user.username != username and not current_user.is_admin:
            raise HTTPException(
                status_code=403,
                detail="Not authorized to view this user"
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
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_admin_user)  # Admin only
):
    """Delete a user by username (admin only)"""
    try:
        user = await get_user_by_username(session, username)
        
        if not user:
            raise HTTPException(
                status_code=404, 
                detail=f"User '{username}' not found"
            )
        
        # Prevent admin from deleting themselves
        if user.id == current_user.id:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete your own account"
            )
        
        deleted_info = {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
        
        await session.delete(user)
        await session.commit()
        
        logging.info(f"User deleted by admin {current_user.username}: {username}")
        
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

@router.delete("/users/all")
async def delete_all_users(
    confirm: bool = False,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_admin_user)  # Admin only
):
    """Delete all users except current admin (admin only)"""
    if not confirm:
        raise HTTPException(
            status_code=400,
            detail="Must set confirm=true to delete all users"
        )
    
    try:
        # Get all users except current admin
        result = await session.execute(
            select(User).where(User.id != current_user.id)
        )
        users = result.scalars().all()
        user_count = len(users)
        
        for user in users:
            await session.delete(user)
        
        await session.commit()
        
        logging.warning(f"All users deleted by admin {current_user.username}: {user_count} users removed")
        
        return {
            "message": f"All {user_count} users deleted successfully (excluding current admin)",
            "deleted_count": user_count
        }
        
    except Exception as e:
        await session.rollback()
        logging.error(f"Failed to delete all users: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to delete users: {str(e)}"
        )

@router.post("/users/{username}/make-admin")
async def make_user_admin(
    username: str,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_admin_user)  # Admin only
):
    """Make a user an admin (admin only)"""
    try:
        user = await get_user_by_username(session, username)
        
        if not user:
            raise HTTPException(
                status_code=404,
                detail=f"User '{username}' not found"
            )
        
        if user.is_admin:
            raise HTTPException(
                status_code=400,
                detail=f"User '{username}' is already an admin"
            )
        
        user.is_admin = True
        await session.commit()
        
        logging.info(f"User {username} made admin by {current_user.username}")
        
        return {
            "message": f"User '{username}' is now an admin",
            "user": user_to_response(user)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        logging.error(f"Failed to make user admin: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to update user permissions"
        )