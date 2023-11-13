"""Add follow table

Revision ID: f29d65596923
Revises: 17d6c3e44adb
Create Date: 2023-08-01 17:18:29.043795

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "f29d65596923"
down_revision = "17d6c3e44adb"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "follow",
        sa.Column("follower_id", sa.Integer(), nullable=False),
        sa.Column("followee_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["followee_id"],
            ["user.id"],
        ),
        sa.ForeignKeyConstraint(
            ["follower_id"],
            ["user.id"],
        ),
        sa.PrimaryKeyConstraint("follower_id", "followee_id"),
    )


def downgrade() -> None:
    op.drop_table("follow")
