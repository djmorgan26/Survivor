from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from .base import Base  # Assuming you have a base model defined

class League(Base):
    __tablename__ = 'leagues'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    owner_id = Column(Integer, ForeignKey('users.id'))
    max_teams = Column(Integer, default=10)
    draft_date = Column(DateTime)
    season = Column(Integer)
    status = Column(String)  # draft_pending, drafting, active, completed
    is_public = Column(Integer, default=0)  # 0 for False, 1 for True
    entry_fee = Column(Integer, default=0)
    scoring_settings = Column(JSON)
    created_at = Column(DateTime)

    owner = relationship("User", back_populates="leagues_owned")
    teams = relationship("Team", back_populates="league")
    draft = relationship("Draft", back_populates="league")