from pydantic import BaseModel
from typing import List, Optional

class SurvivorPlayerBase(BaseModel):
    castaway_id: str
    name: str
    season: int
    age: int
    occupation: str
    tribe: str
    status: str
    total_score: float = 0.0
    immunity_wins: int = 0
    reward_wins: int = 0
    confessional_count: int = 0
    days_survived: int = 0

class SurvivorPlayerCreate(SurvivorPlayerBase):
    pass

class SurvivorPlayerUpdate(SurvivorPlayerBase):
    pass

class SurvivorPlayer(SurvivorPlayerBase):
    id: int

    class Config:
        orm_mode = True

class SurvivorPlayerList(BaseModel):
    players: List[SurvivorPlayer]