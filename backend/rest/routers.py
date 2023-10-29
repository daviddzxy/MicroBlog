from datetime import timedelta
from typing import Annotated

import sqlalchemy.exc
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError

import models
import schemas
from fastapi import APIRouter, Query
from fastapi import Depends
from fastapi import status
from fastapi import HTTPException
from sqlalchemy.orm import Session, aliased
from sqlalchemy import select

from crypto import get_password_hash, verify_password, create_access_token, oauth2_scheme, get_token_data
from database import get_database_session
from env_vars import ACCESS_TOKEN_EXPIRE_TIME
from exceptions import unauthorized_exception

base_router = APIRouter()


@base_router.post("/sign-up", status_code=status.HTTP_201_CREATED)
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


@base_router.post("/sign-in", status_code=status.HTTP_200_OK)
async def signin(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db_session: Session = Depends(get_database_session)
) -> schemas.Token:
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
    return schemas.Token(access_token=access_token)


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


@base_router.post("/post", status_code=status.HTTP_201_CREATED)
def publish_post(
    post: schemas.PostBase,
    token: Annotated[str, Depends(oauth2_scheme)],
    db_session: Session = Depends(get_database_session)
):
    current_user = get_current_user(token, db_session)
    db_session.add(models.Post(content=post.content, user=current_user))
    db_session.commit()


@base_router.post("/follow/{user_name}", status_code=status.HTTP_201_CREATED)
def follow_user(
    user_name: str,
    token: Annotated[str, Depends(oauth2_scheme)],
    db_session: Session = Depends(get_database_session)
):
    current_user = get_current_user(token, db_session)
    if current_user.user_name == user_name:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="User cannot follow himself."
        )

    followed_user = db_session.execute(select(models.User).where(models.User.user_name == user_name)).scalar()
    if not followed_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"User {user_name} does not exist."
        )

    try:
        db_session.add(models.Follow(follower_id=current_user.id, followee_id=followed_user.id))
        db_session.commit()
    except sqlalchemy.exc.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"User is already following user {user_name}."
        )


@base_router.get("/followers/posts", status_code=status.HTTP_200_OK)
def get_posts_from_followers(
    token: Annotated[str, Depends(oauth2_scheme)],
    db_session: Session = Depends(get_database_session),
    _id: Annotated[
        int | None,
        Query(
            alias="id",
            description="The id parameter is used for pagination."
                        " To retrieve the first page of results omit the parameter."
                        " To retrieve next page, use the lowest id value from previous page")
    ] = None,
    limit: Annotated[
        int, Query(description="Use limit parameter to set the size of returned page")] = 20,
) -> list[schemas.PostWithUserDetails]:
    current_user = get_current_user(token, db_session)
    user_alias: models.User = aliased(models.User)
    query = (
        select(
            models.Post.id,
            models.Post.content,
            models.Post.created_at,
            models.Post.user_id,
            models.User.user_name,
        ).
        join(models.User, models.User.id == models.Post.user_id).
        join(models.Follow, models.User.id == models.Follow.followee_id).
        join(user_alias, user_alias.id == models.Follow.follower_id).
        where(user_alias.id == current_user.id).order_by(models.Post.id.desc())
    )
    if _id:
        query = query.where(_id > models.Post.id)

    if limit:
        query = query.limit(limit)

    results = db_session.execute(query).all()
    return [
        schemas.PostWithUserDetails(
            user_name=result.user_name,
            content=result.content,
            created_at=result.created_at,
            user_id=result.user_id,
            id=result.id
        ) for result in results
    ]


@base_router.get("/user/{user_name}")
def get_user(user_name: str, db_session: Session = Depends(get_database_session)) -> schemas.User:
    result = db_session.execute(select(models.User).where(models.User.user_name == user_name)).scalar()
    if result:
        user = schemas.User(id=result.id, userName=result.user_name, created_at=result.created_at)
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"User with username {user_name} not found."
        )
    return user


@base_router.get("/user/{user_name}/posts", status_code=status.HTTP_200_OK)
def get_user_posts(
    user_name: str,
    db_session: Session = Depends(get_database_session),
    _id: Annotated[
        int | None,
        Query(
            alias="id",
            description="The id parameter is used for pagination."
                        " To retrieve the first page of results omit the parameter."
                        " To retrieve next page, use the lowest id value from previous page")
    ] = None,
    limit: Annotated[
        int, Query(description="Use limit parameter to set the size of returned page")] = 20,
) -> list[schemas.Post]:
    user_id = db_session.execute(select(models.User.id).where(models.User.user_name == user_name)).scalar()
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"User with username {user_name} not found."
        )

    posts_query = select(models.Post).where(models.Post.user_id == user_id).order_by(models.Post.id.desc())
    if _id:
        posts_query = posts_query.where(_id > models.Post.id)

    if limit:
        posts_query = posts_query.limit(limit)

    results = db_session.execute(posts_query).scalars()
    return [
        schemas.Post(id=result.id, user_id=user_id, created_at=result.created_at, content=result.content)
        for result in results
    ]
