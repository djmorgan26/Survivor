"""
Add join_code to League model
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_league_join_code'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('leagues', sa.Column('join_code', sa.String(), nullable=False, unique=True, server_default='temp'))
    # Remove server_default after filling in real codes if needed


def downgrade():
    op.drop_column('leagues', 'join_code')
