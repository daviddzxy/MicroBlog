from datetime import timedelta
from typing import TypedDict, Annotated

from jose import JWTError

import models
import schemas
from fastapi import APIRouter
from fastapi import Depends
from fastapi import status
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from crypto import get_password_hash, verify_password, create_access_token, oauth2_scheme, get_token_data
from database import SessionLocal
from env_vars import ACCESS_TOKEN_EXPIRE_TIME
from exceptions import unauthorized_exception

signup_router = APIRouter(prefix="/operations")


def get_database_session():
    db_session = SessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()


@signup_router.post("/sign-up", status_code=status.HTTP_201_CREATED)
async def signup(
    user: schemas.UserCreate,
    db_session: Session = Depends(get_database_session)
):
    existing_user_name = db_session.execute(
        select(models.User.user_name).where(models.User.user_name == user.user_name)
    ).scalar()
    if existing_user_name:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"User with username {user.user_name} already exists."
        )

    db_session.add(models.User(user_name=user.user_name, password=get_password_hash(user.password)))
    db_session.commit()


class SignInResponse(TypedDict):
    access_token: str
    token_type: str


@signup_router.post("/sign-in", response_model=schemas.Token, status_code=status.HTTP_200_OK)
async def signin(
    user: schemas.UserCreate,
    db_session: Session = Depends(get_database_session)
) -> SignInResponse:
    result = db_session.execute(
        select(models.User).where(models.User.user_name == user.user_name)
    ).first()
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    db_user = result[0]
    if not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_TIME)
    access_token = create_access_token(
        data={"sub": user.user_name}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


def get_current_user(token: str, db_session: Session) -> models.User:
    try:
        token_data = get_token_data(token)
    except JWTError:
        raise unauthorized_exception

    user = None
    if token_data:
        result = db_session.execute(
            select(models.User).where(models.User.user_name == token_data.username)
        ).first()
        user = result[0] if result else None

    if token_data is None or user is None:
        raise unauthorized_exception

    return user


@signup_router.post("/publish-post")
def publish_post(
    post: schemas.PostBase,
    token: Annotated[str, Depends(oauth2_scheme)],
    db_session: Session = Depends(get_database_session)
):
    current_user = get_current_user(token, db_session)
    db_session.add(models.Post(content=post.content, user=current_user))
    db_session.commit()
