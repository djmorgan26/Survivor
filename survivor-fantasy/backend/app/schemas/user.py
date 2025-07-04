from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str
    first_name: str
    last_name: str

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDB(UserBase):
    id: int
    is_admin: bool = False
    created_at: datetime

    class Config:
        orm_mode = True

class User(UserInDB):
    leagues_owned: List[int] = []
    teams: List[int] = []