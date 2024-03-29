from datetime import datetime, timedelta
from typing import Any
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from passlib.context import CryptContext
from env_vars import SECRET_KEY, ALGORITHM
from schemas import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="sign-in")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(
    data: dict[Any, Any], expires_delta: timedelta | None = None
) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_token_data(token: str) -> TokenData | None:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    username: str = payload.get("sub")
    if username is None:
        return None
    return TokenData(username=username)
