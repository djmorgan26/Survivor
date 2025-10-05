from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.player import SurvivorPlayer as SurvivorPlayerModel
from app.schemas.player import SurvivorPlayer
from app.core.database import get_async_session
from app.api.auth import get_current_user_or_bypass
from app.models.user import User
from typing import Optional, List

router = APIRouter()

@router.get("/players/", response_model=List[SurvivorPlayer])
async def get_players(
    db: AsyncSession = Depends(get_async_session),
    current_user: Optional[User] = Depends(get_current_user_or_bypass)
):
    result = await db.execute(select(SurvivorPlayerModel))
    players = result.scalars().all()
    return players

@router.get("/players/{player_id}", response_model=SurvivorPlayer)
async def get_player(
    player_id: int,
    db: AsyncSession = Depends(get_async_session),
    current_user: Optional[User] = Depends(get_current_user_or_bypass)
):
    player = await db.get(SurvivorPlayerModel, player_id)
    if player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    return player