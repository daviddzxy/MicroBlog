import models
import schemas
from fastapi import APIRouter
from fastapi import Depends
from fastapi import status
from fastapi import Response
from sqlalchemy.orm import Session
from sqlalchemy import select
from database import SessionLocal

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
    response: Response,
    db_session: Session = Depends(get_database_session)
):
    existing_user_name = db_session.execute(
        select(models.User.user_name).where(models.User.user_name == user.user_name)
    ).first()
    if existing_user_name:
        response.status_code = status.HTTP_409_CONFLICT
        return
    db_session.add(models.User(user_name=user.user_name, password=user.password))
    db_session.commit()
