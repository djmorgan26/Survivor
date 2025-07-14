"""empty message

Revision ID: 6cb988f331b0
Revises: add_league_join_code, f16353865656
Create Date: 2025-07-06 21:55:10.415235

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6cb988f331b0'
down_revision: Union[str, Sequence[str], None] = ('add_league_join_code', 'f16353865656')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
