from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.player import SurvivorPlayer
from app.schemas.player import PlayerResponse
from app.core.database import get_db
from app.api.auth import get_current_user_or_bypass
from app.models.user import User
from typing import Optional

router = APIRouter()

@router.get("/players/", response_model=list[PlayerResponse])
async def get_players(
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_or_bypass)
):
    async with db.begin():
        result = await db.execute(select(SurvivorPlayer))
        players = result.scalars().all()
        return players

@router.get("/players/{player_id}", response_model=PlayerResponse)
async def get_player(
    player_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_or_bypass)
):
    async with db.begin():
        player = await db.get(SurvivorPlayer, player_id)
        if player is None:
            raise HTTPException(status_code=404, detail="Player not found")
        return player