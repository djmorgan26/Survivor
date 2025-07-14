from pydantic import BaseModel
from typing import Optional, List
from enum import Enum
from datetime import datetime

class GameType(str, Enum):
    survivor = "survivor"
    love_island = "love_island"
    big_brother = "big_brother"
    traitors = "traitors"

class MemberRole(str, Enum):
    owner = "owner"
    admin = "admin"
    member = "member"

class LeagueSettingsBase(BaseModel):
    max_members: int = 20
    is_private: bool = True

class LeagueSettingsOut(LeagueSettingsBase):
    id: int

    class Config:
        orm_mode = True

class LeagueBase(BaseModel):
    name: str
    game_type: GameType

class LeagueCreate(LeagueBase):
    settings: Optional[LeagueSettingsBase] = None

class LeagueOut(LeagueBase):
    id: int
    created_at: datetime  # changed from str to datetime
    owner_id: int
    join_code: str  # add join_code to schema
    settings: Optional[LeagueSettingsOut]

    class Config:
        orm_mode = True
        from_attributes = True  # for Pydantic v2 compatibility

class LeagueMembershipOut(BaseModel):
    id: int
    league_id: int
    user_id: int
    role: MemberRole
    joined_at: datetime  # changed from str to datetime

    class Config:
        orm_mode = True
        from_attributes = True  # for Pydantic v2 compatibility