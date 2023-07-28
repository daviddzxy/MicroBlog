from pydantic import BaseModel, Field


class UserBase(BaseModel):
    user_name: str = Field(alias="username")


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int

    class Config:
        orm_mode = True


class PostBase(BaseModel):
    content: str


class Post(PostBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None
