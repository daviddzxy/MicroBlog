from pydantic import BaseModel, Field
from datetime import datetime
from pydantic.alias_generators import to_camel


class Schema(BaseModel):
    class Config:
        alias_generator = to_camel
        from_attributes = True
        populate_by_name = True


class UserBase(Schema):
    user_name: str = Field(min_length=4)


class UserCreate(UserBase):
    password: str = Field(min_length=8)


class User(UserBase):
    id: int
    created_at: datetime


class UserFollow(UserBase):
    id: int
    created_at: datetime


class UserWithDetails(User):
    is_following: bool
    follower_count: int
    following_count: int


class PostBase(Schema):
    content: str


class Post(PostBase):
    id: int
    user_id: int
    created_at: datetime


class PostWithUserDetails(Post):
    user_name: str


class Token(BaseModel):
    # OAuth's specification requires snake_case form, do not use camelCase alias
    access_token: str
    token_type: str = Field(default="bearer")


class TokenData(BaseModel):
    username: str | None = None
