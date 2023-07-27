"""Add post table

Revision ID: 17d6c3e44adb
Revises: 0d773cfcfd62
Create Date: 2023-07-27 12:18:37.727568

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '17d6c3e44adb'
down_revision = '0d773cfcfd62'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'post',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('content', sa.String(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.alter_column('user', 'user_name', existing_type=sa.VARCHAR(), nullable=False)
    op.alter_column('user', 'password', existing_type=sa.VARCHAR(), nullable=False)


def downgrade() -> None:
    op.alter_column('user', 'password', existing_type=sa.VARCHAR(), nullable=True)
    op.alter_column('user', 'user_name', existing_type=sa.VARCHAR(), nullable=True)
    op.drop_table('post')
