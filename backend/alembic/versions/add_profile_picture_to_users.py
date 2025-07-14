"""
add profile_picture to users

Revision ID: add_profile_pic_20250706
Revises: 6cb988f331b0
Create Date: 2025-07-06
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_profile_pic_20250706'
down_revision = '6cb988f331b0'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('users', sa.Column('profile_picture', sa.String(), nullable=True))

def downgrade():
    op.drop_column('users', 'profile_picture')
