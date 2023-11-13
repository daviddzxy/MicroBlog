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
from sqlalchemy import select, delete, func

from crypto import (
    get_password_hash,
    verify_password,
    create_access_token,
    oauth2_scheme,
    get_token_data,
)
from database import get_database_session
from env_vars import ACCESS_TOKEN_EXPIRE_TIME
from exceptions import unauthorized_exception

base_router = APIRouter()


@base_router.post("/sign-up", status_code=status.HTTP_201_CREATED)
async def signup(
    user: schemas.UserCreate, db_session: Session = Depends(get_database_session)
):
    existing_user_name = db_session.execute(
        select(models.User.user_name).where(models.User.user_name == user.user_name)
    ).scalar()
    if existing_user_name:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"User with username {user.user_name} already exists.",
        )

    db_session.add(
        models.User(user_name=user.user_name, password=get_password_hash(user.password))
    )
    db_session.commit()


@base_router.post("/sign-in", status_code=status.HTTP_200_OK)
async def signin(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db_session: Session = Depends(get_database_session),
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
    db_session: Session = Depends(get_database_session),
):
    current_user = get_current_user(token, db_session)
    db_session.add(models.Post(content=post.content, user=current_user))
    db_session.commit()


@base_router.post("/follow/{user_name}", status_code=status.HTTP_201_CREATED)
def follow_user(
    user_name: str,
    token: Annotated[str, Depends(oauth2_scheme)],
    db_session: Session = Depends(get_database_session),
):
    current_user = get_current_user(token, db_session)
    if current_user.user_name == user_name:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="User cannot follow himself.",
        )

    followed_user = db_session.execute(
        select(models.User).where(models.User.user_name == user_name)
    ).scalar()
    if not followed_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {user_name} does not exist.",
        )

    try:
        db_session.add(
            models.Follow(follower_id=current_user.id, followee_id=followed_user.id)
        )
        db_session.commit()
    except sqlalchemy.exc.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"User is already following user {user_name}.",
        )


@base_router.delete("/follow/{user_name}", status_code=status.HTTP_204_NO_CONTENT)
def unfollow_user(
    user_name: str,
    token: Annotated[str, Depends(oauth2_scheme)],
    db_session: Session = Depends(get_database_session),
):
    followed_user = db_session.execute(
        select(models.User).where(models.User.user_name == user_name)
    ).scalar()
    if not followed_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {user_name} does not exist.",
        )

    current_user = get_current_user(token, db_session)
    delete_result = db_session.execute(
        delete(models.Follow)
        .where(models.Follow.follower_id == current_user.id)
        .where(models.Follow.followee_id == followed_user.id)
    )

    db_session.commit()
    if not delete_result:  # type: ignore # https://github.com/sqlalchemy/sqlalchemy/issues/9377
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {current_user.user_name} does not follow {user_name}.",
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
            " To retrieve next page, use the lowest id value from previous page",
        ),
    ] = None,
    limit: Annotated[
        int, Query(description="Use limit parameter to set the size of returned page")
    ] = 20,
) -> list[schemas.PostWithUserDetails]:
    current_user = get_current_user(token, db_session)
    user_alias = aliased(models.User)
    query = (
        select(
            models.Post.id,
            models.Post.content,
            models.Post.created_at,
            models.Post.user_id,
            models.User.user_name,
        )
        .join(models.User, models.User.id == models.Post.user_id)
        .join(models.Follow, models.User.id == models.Follow.followee_id)
        .join(user_alias, user_alias.id == models.Follow.follower_id)
        .where(user_alias.id == current_user.id)
        .order_by(models.Post.id.desc())
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
            id=result.id,
        )
        for result in results
    ]


@base_router.get("/user/{user_name}", status_code=status.HTTP_200_OK)
def get_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    user_name: str,
    db_session: Session = Depends(get_database_session),
) -> schemas.UserWithDetails:
    current_user = get_current_user(token, db_session)
    user_result = db_session.execute(
        select(models.User).where(models.User.user_name == user_name)
    ).scalar()
    if not user_result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with username {user_name} not found.",
        )

    follow = db_session.execute(
        select(models.Follow)
        .where(models.Follow.follower_id == current_user.id)
        .where(models.Follow.followee_id == user_result.id)
    ).scalar()

    followers_count = db_session.execute(
        select(func.count()).where(models.Follow.followee_id == user_result.id)
    ).scalar()
    following_count = db_session.execute(
        select(func.count()).where(models.Follow.follower_id == user_result.id)
    ).scalar()

    user = schemas.UserWithDetails(
        id=user_result.id,
        user_name=user_result.user_name,
        created_at=user_result.created_at,
        is_following=True if follow else False,
        follower_count=followers_count if followers_count else 0,
        following_count=following_count if following_count else 0,
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
            " To retrieve next page, use the lowest id value from previous page",
        ),
    ] = None,
    limit: Annotated[
        int, Query(description="Use limit parameter to set the size of returned page")
    ] = 20,
) -> list[schemas.Post]:
    user_id = db_session.execute(
        select(models.User.id).where(models.User.user_name == user_name)
    ).scalar()
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with username {user_name} not found.",
        )

    posts_query = (
        select(models.Post)
        .where(models.Post.user_id == user_id)
        .order_by(models.Post.id.desc())
    )
    if _id:
        posts_query = posts_query.where(_id > models.Post.id)

    if limit:
        posts_query = posts_query.limit(limit)

    results = db_session.execute(posts_query).scalars()
    return [
        schemas.Post(
            id=result.id,
            user_id=user_id,
            created_at=result.created_at,
            content=result.content,
        )
        for result in results
    ]


@base_router.get("/user/{user_name}/following", status_code=status.HTTP_200_OK)
def get_user_following(
    user_name: str,
    db_session: Session = Depends(get_database_session),
    _id: Annotated[
        int | None,
        Query(
            alias="id",
            description="The id parameter is used for pagination."
            " To retrieve the first page of results omit the parameter."
            " To retrieve next page, use the lowest id value from previous page",
        ),
    ] = None,
    limit: Annotated[
        int, Query(description="Use limit parameter to set the size of returned page")
    ] = 20,
):
    user_id = db_session.execute(
        select(models.User.id).where(models.User.user_name == user_name)
    ).scalar()
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with username {user_name} not found.",
        )

    query = (
        select(models.User.user_name, models.User.id, models.Follow.created_at)
        .join(models.Follow, models.User.id == models.Follow.followee_id)
        .where(models.Follow.follower_id == user_id)
        .order_by(models.User.id)
    )

    if _id:
        query = query.where(_id > models.User.id)

    if limit:
        query = query.limit(limit)

    results = db_session.execute(query).all()
    return [
        schemas.UserFollow(
            user_name=result.user_name, id=result.id, created_at=result.created_at
        )
        for result in results
    ]


@base_router.get("/user/{user_name}/followers", status_code=status.HTTP_200_OK)
def get_user_followers(
    user_name: str,
    db_session: Session = Depends(get_database_session),
    _id: Annotated[
        int | None,
        Query(
            alias="id",
            description="The id parameter is used for pagination."
            " To retrieve the first page of results omit the parameter."
            " To retrieve next page, use the lowest id value from previous page",
        ),
    ] = None,
    limit: Annotated[
        int, Query(description="Use limit parameter to set the size of returned page")
    ] = 20,
):
    user_id = db_session.execute(
        select(models.User.id).where(models.User.user_name == user_name)
    ).scalar()
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with username {user_name} not found.",
        )

    query = (
        select(models.User.user_name, models.User.id, models.Follow.created_at)
        .join(models.Follow, models.User.id == models.Follow.follower_id)
        .where(models.Follow.followee_id == user_id)
        .order_by(models.User.id)
    )

    if _id:
        query = query.where(_id > models.User.id)

    if limit:
        query = query.limit(limit)

    results = db_session.execute(query).all()
    return [
        schemas.UserFollow(
            user_name=result.user_name, id=result.id, created_at=result.created_at
        )
        for result in results
    ]
