from pydantic import BaseModel, Field


class UserBase(BaseModel):
    user_name: str = Field(alias="userName")


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int

    class Config:
        orm_mode = True
