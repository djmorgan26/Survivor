from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum
import secrets

class GameType(enum.Enum):
    survivor = "survivor"
    love_island = "love_island"
    big_brother = "big_brother"
    traitors = "traitors"

class MemberRole(enum.Enum):
    owner = "owner"
    admin = "admin"
    member = "member"

class LeagueSettings(Base):
    __tablename__ = "league_settings"
    id = Column(Integer, primary_key=True, index=True)
    max_members = Column(Integer, default=20)
    is_private = Column(Boolean, default=True)
    league = relationship("League", back_populates="settings", uselist=False)

class League(Base):
    __tablename__ = "leagues"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    game_type = Column(Enum(GameType), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    settings_id = Column(Integer, ForeignKey("league_settings.id"))
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    join_code = Column(String, unique=True, nullable=False, default=lambda: secrets.token_urlsafe(8))

    settings = relationship("LeagueSettings", back_populates="league", uselist=False)
    memberships = relationship("LeagueMembership", back_populates="league")

class LeagueMembership(Base):
    __tablename__ = "league_memberships"
    id = Column(Integer, primary_key=True, index=True)
    league_id = Column(Integer, ForeignKey("leagues.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(Enum(MemberRole), default=MemberRole.member)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    league = relationship("League", back_populates="memberships")