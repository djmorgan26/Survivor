"""
add bio to users

Revision ID: add_bio_20250706
Revises: add_profile_pic_20250706
Create Date: 2025-07-06
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_bio_20250706'
down_revision = 'add_profile_pic_20250706'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('users', sa.Column('bio', sa.String(), nullable=True))

def downgrade():
    op.drop_column('users', 'bio')
