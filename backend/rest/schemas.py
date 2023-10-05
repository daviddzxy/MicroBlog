from pydantic import BaseModel, Field
from datetime import datetime


class UserBase(BaseModel):
    user_name: str = Field(alias="userName", min_length=4)


class UserCreate(UserBase):
    password: str = Field(min_length=8)


class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class PostBase(BaseModel):
    content: str


class Post(PostBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True


class PostWithUserDetails(Post):
    user_name: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None
