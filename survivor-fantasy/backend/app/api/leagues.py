from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.league import League
from app.schemas.league import LeagueCreate, LeagueUpdate, LeagueOut
from app.core.database import get_db
from app.core.security import get_current_user

router = APIRouter()

@router.post("/", response_model=LeagueOut)
async def create_league(league: LeagueCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_league = League(**league.dict(), owner_id=current_user.id)
    db.add(new_league)
    await db.commit()
    await db.refresh(new_league)
    return new_league

@router.get("/", response_model=List[LeagueOut])
async def read_leagues(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db)):
    leagues = await db.execute(select(League).offset(skip).limit(limit))
    return leagues.scalars().all()

@router.get("/{league_id}", response_model=LeagueOut)
async def read_league(league_id: int, db: AsyncSession = Depends(get_db)):
    league = await db.get(League, league_id)
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
    return league

@router.put("/{league_id}", response_model=LeagueOut)
async def update_league(league_id: int, league: LeagueUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_league = await db.get(League, league_id)
    if not db_league or db_league.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="League not found or not authorized")
    for key, value in league.dict(exclude_unset=True).items():
        setattr(db_league, key, value)
    await db.commit()
    await db.refresh(db_league)
    return db_league

@router.delete("/{league_id}", response_model=LeagueOut)
async def delete_league(league_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_league = await db.get(League, league_id)
    if not db_league or db_league.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="League not found or not authorized")
    await db.delete(db_league)
    await db.commit()
    return db_league