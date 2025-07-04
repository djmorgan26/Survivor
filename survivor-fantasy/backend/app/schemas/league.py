from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class LeagueBase(BaseModel):
    name: str
    description: Optional[str] = None
    max_teams: int = 10
    draft_date: datetime
    season: int
    status: str
    is_public: bool = False
    entry_fee: float = 0.0

class LeagueCreate(LeagueBase):
    pass

class LeagueUpdate(LeagueBase):
    pass

class League(LeagueBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class LeagueList(BaseModel):
    leagues: List[League]