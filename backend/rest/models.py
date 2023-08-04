from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


class Follow(Base):
    __tablename__ = "follow"

    follower_id: Mapped[int] = mapped_column(ForeignKey("user.id"), primary_key=True)
    followee_id: Mapped[int] = mapped_column(ForeignKey("user.id"), primary_key=True)
    follower = relationship('User', foreign_keys=[follower_id])
    followee = relationship('User', foreign_keys=[followee_id])


class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_name: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str] = mapped_column()
    posts: Mapped[list["Post"]] = relationship(back_populates="user")
    following: Mapped[list["User"]] = relationship(
        secondary="follow",
        primaryjoin=id == Follow.follower_id,
        secondaryjoin=id == Follow.followee_id,
        back_populates="following",
        viewonly=True
    )
    followers: Mapped[list["User"]] = relationship(
        secondary="follow",
        primaryjoin=id == Follow.followee_id,
        secondaryjoin=id == Follow.follower_id,
        back_populates="followers",
        viewonly=True
    )


class Post(Base):
    __tablename__ = "post"

    id: Mapped[int] = mapped_column(primary_key=True)
    content: Mapped[str] = mapped_column()
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="posts")
