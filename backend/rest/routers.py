from datetime import timedelta
from typing import TypedDict, Annotated

import sqlalchemy.exc
from fastapi.security import OAuth2PasswordRequestForm
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
from database import get_database_session
from env_vars import ACCESS_TOKEN_EXPIRE_TIME
from exceptions import unauthorized_exception

operation_router = APIRouter(prefix="/operations")
base_router = APIRouter()


@operation_router.post("/sign-up", status_code=status.HTTP_201_CREATED)
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


@operation_router.post("/sign-in", response_model=schemas.Token, status_code=status.HTTP_200_OK)
async def signin(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db_session: Session = Depends(get_database_session)
) -> SignInResponse:
    result = db_session.execute(
        select(models.User).where(models.User.user_name == form_data.username)
    ).first()
    if result is None:
        raise unauthorized_exception

    db_user = result[0]
    if not verify_password(form_data.password, db_user.password):
        raise unauthorized_exception

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_TIME)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
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


@operation_router.post("/publish-post", status_code=status.HTTP_201_CREATED)
def publish_post(
    post: schemas.PostBase,
    token: Annotated[str, Depends(oauth2_scheme)],
    db_session: Session = Depends(get_database_session)
):
    current_user = get_current_user(token, db_session)
    db_session.add(models.Post(content=post.content, user=current_user))
    db_session.commit()


@operation_router.post("/follow-user", status_code=status.HTTP_201_CREATED)
def follow_user(
    user_id: int,
    token: Annotated[str, Depends(oauth2_scheme)],
    db_session: Session = Depends(get_database_session)
):
    current_user = get_current_user(token, db_session)
    if current_user.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"User cannot follow himself."
        )

    try:
        db_session.add(models.Follow(follower_id=current_user.id, followee_id=user_id))
        db_session.commit()
    except sqlalchemy.exc.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"User is already following user with user id {user_id}."
        )


@base_router.get("/user/{user_id}/posts", response_model=list[schemas.Post], status_code=status.HTTP_200_OK)
def get_user_posts(user_id: int, db_session: Session = Depends(get_database_session)):
    result = db_session.execute(
        select(models.Post).where(models.Post.user_id == user_id)
    ).scalars().all()

    return result
