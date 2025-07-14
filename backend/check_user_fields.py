from fastapi_users.db import SQLAlchemyBaseUserTable
from app.core.database import Base

class TestUser(SQLAlchemyBaseUserTable[int], Base):
    __tablename__ = 'test_users'

# Print what fields are inherited
print("Fields inherited from SQLAlchemyBaseUserTable:")
for column in TestUser.__table__.columns:
    print(f"  {column.name}: {column.type}")