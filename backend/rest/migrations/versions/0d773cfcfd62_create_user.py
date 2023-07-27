"""Create user

Revision ID: 0d773cfcfd62
Revises: 
Create Date: 2023-06-25 21:57:56.397311

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0d773cfcfd62'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'user',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_name', sa.String(), nullable=True),
        sa.Column('password', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_id'), 'user', ['id'], unique=False)
    op.create_index(op.f('ix_user_user_name'), 'user', ['user_name'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_user_user_name'), table_name='user')
    op.drop_index(op.f('ix_user_id'), table_name='user')
    op.drop_table('user')
