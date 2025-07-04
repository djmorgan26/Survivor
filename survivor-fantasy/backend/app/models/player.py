from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from .database import Base

class SurvivorPlayer(Base):
    __tablename__ = 'survivor_players'

    id = Column(Integer, primary_key=True, index=True)
    castaway_id = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    season = Column(Integer)
    age = Column(Integer)
    occupation = Column(String)
    tribe = Column(String)
    status = Column(String)  # active, eliminated, winner
    total_score = Column(Float, default=0.0)
    immunity_wins = Column(Integer, default=0)
    reward_wins = Column(Integer, default=0)
    confessional_count = Column(Integer, default=0)
    days_survived = Column(Integer, default=0)

    # Relationships
    teams = relationship("TeamPlayer", back_populates="player")