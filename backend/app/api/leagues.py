from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from app.core.database import get_async_session
from app.models.league import League, LeagueMembership, LeagueSettings, GameType, MemberRole
from app.models.user import User
from app.schemas.league import LeagueCreate, LeagueOut, LeagueMembershipOut
from app.api.auth import get_current_user  # fixed import

router = APIRouter(prefix="/leagues", tags=["leagues"])

@router.post("/", response_model=LeagueOut)
async def create_league(league: LeagueCreate, db: AsyncSession = Depends(get_async_session), current_user: User = Depends(get_current_user)):
    settings = None
    if league.settings:
        settings = LeagueSettings(**league.settings.dict())
        db.add(settings)
        await db.flush()
    new_league = League(
        name=league.name,
        game_type=league.game_type,
        owner_id=current_user.id,
        settings_id=settings.id if settings else None
    )
    db.add(new_league)
    await db.flush()
    membership = LeagueMembership(
        league_id=new_league.id,
        user_id=current_user.id,
        role=MemberRole.owner
    )
    db.add(membership)
    await db.commit()
    await db.refresh(new_league)
    return new_league

@router.get("/", response_model=List[LeagueOut])
async def list_leagues(game_type: Optional[GameType] = None, db: AsyncSession = Depends(get_async_session)):
    stmt = select(League)
    if game_type:
        stmt = stmt.where(League.game_type == game_type)
    result = await db.execute(stmt)
    leagues = result.scalars().all()
    return leagues

@router.get("/{league_id}", response_model=LeagueOut)
async def get_league(league_id: int, db: AsyncSession = Depends(get_async_session)):
    league = await db.get(League, league_id)
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
    return league

@router.post("/{league_id}/join", response_model=LeagueMembershipOut)
async def join_league(league_id: int, db: AsyncSession = Depends(get_async_session), current_user: User = Depends(get_current_user)):
    existing = await db.execute(
        LeagueMembership.__table__.select().where(
            LeagueMembership.league_id == league_id,
            LeagueMembership.user_id == current_user.id
        )
    )
    if existing.scalars().first():
        raise HTTPException(status_code=400, detail="Already a member")
    membership = LeagueMembership(league_id=league_id, user_id=current_user.id, role=MemberRole.member)
    db.add(membership)
    await db.commit()
    await db.refresh(membership)
    return membership

@router.post("/{league_id}/transfer_owner")
async def transfer_owner(league_id: int, new_owner_id: int, db: AsyncSession = Depends(get_async_session), current_user: User = Depends(get_current_user)):
    league = await db.get(League, league_id)
    if not league or league.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the owner can transfer ownership")
    new_owner = await db.execute(
        LeagueMembership.__table__.select().where(
            LeagueMembership.league_id == league_id,
            LeagueMembership.user_id == new_owner_id
        )
    )
    if not new_owner.scalars().first():
        raise HTTPException(status_code=404, detail="New owner must be a member")
    # Update roles
    old_owner = await db.execute(
        LeagueMembership.__table__.select().where(
            LeagueMembership.league_id == league_id,
            LeagueMembership.user_id == current_user.id
        )
    )
    old_owner = old_owner.scalars().first()
    new_owner = new_owner.scalars().first()
    old_owner.role = MemberRole.admin
    new_owner.role = MemberRole.owner
    league.owner_id = new_owner_id
    await db.commit()
    return {"detail": "Ownership transferred"}

@router.patch("/{league_id}/members/{user_id}")
async def change_member_role(league_id: int, user_id: int, new_role: MemberRole, db: AsyncSession = Depends(get_async_session), current_user: User = Depends(get_current_user)):
    league = await db.get(League, league_id)
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
    # Only owner or admin can change roles
    requester = await db.execute(
        LeagueMembership.__table__.select().where(
            LeagueMembership.league_id == league_id,
            LeagueMembership.user_id == current_user.id
        )
    )
    requester = requester.scalars().first()
    if not requester or requester.role not in [MemberRole.owner, MemberRole.admin]:
        raise HTTPException(status_code=403, detail="Not authorized")
    member = await db.execute(
        LeagueMembership.__table__.select().where(
            LeagueMembership.league_id == league_id,
            LeagueMembership.user_id == user_id
        )
    )
    member = member.scalars().first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    member.role = new_role
    await db.commit()
    return {"detail": "Role updated"}

@router.delete("/{league_id}/members/{user_id}")
async def remove_member(league_id: int, user_id: int, db: AsyncSession = Depends(get_async_session), current_user: User = Depends(get_current_user)):
    membership = await db.execute(
        LeagueMembership.__table__.select().where(
            LeagueMembership.league_id == league_id,
            LeagueMembership.user_id == user_id
        )
    )
    membership = membership.scalars().first()
    if not membership:
        raise HTTPException(status_code=404, detail="Member not found")
    await db.delete(membership)
    await db.commit()
    return {"detail": "Member removed"}

@router.get("/{league_id}/members", response_model=List[LeagueMembershipOut])
async def list_members(league_id: int, db: AsyncSession = Depends(get_async_session)):
    stmt = select(LeagueMembership).where(LeagueMembership.league_id == league_id)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.delete("/{league_id}", status_code=204)
async def delete_league(league_id: int, db: AsyncSession = Depends(get_async_session), current_user: User = Depends(get_current_user)):
    league = await db.get(League, league_id)
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
    # Only owner or admin can delete
    membership = await db.execute(
        LeagueMembership.__table__.select().where(
            LeagueMembership.league_id == league_id,
            LeagueMembership.user_id == current_user.id
        )
    )
    membership = membership.scalars().first()
    if not membership or membership.role not in [MemberRole.owner, MemberRole.admin]:
        raise HTTPException(status_code=403, detail="Not authorized")
    await db.delete(league)
    await db.commit()
    return