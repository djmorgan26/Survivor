"""add league, membership, and settings tables

Revision ID: f16353865656
Revises: 
Create Date: 2025-07-06 19:01:09.539061

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f16353865656'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'league_settings',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('max_members', sa.Integer(), nullable=False, server_default='20'),
        sa.Column('is_private', sa.Boolean(), nullable=False, server_default=sa.sql.expression.true()),
    )
    op.create_table(
        'leagues',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('name', sa.String(), nullable=False, unique=True),
        sa.Column('game_type', sa.Enum('survivor', 'love_island', 'big_brother', 'traitors', name='gametype'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('settings_id', sa.Integer(), sa.ForeignKey('league_settings.id')),
        sa.Column('owner_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
    )
    op.create_table(
        'league_memberships',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('league_id', sa.Integer(), sa.ForeignKey('leagues.id')),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id')),
        sa.Column('role', sa.Enum('owner', 'admin', 'member', name='memberrole'), nullable=False, server_default='member'),
        sa.Column('joined_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table('league_memberships')
    op.drop_table('leagues')
    op.drop_table('league_settings')
    sa.Enum(name='gametype').drop(op.get_bind(), checkfirst=False)
    sa.Enum(name='memberrole').drop(op.get_bind(), checkfirst=False)
