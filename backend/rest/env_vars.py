import os
from typing import Final

DB_USER: Final[str] = os.environ["DB_USER"]
DB_PASSWORD: Final[str] = os.environ["DB_PASSWORD"]
DB_HOST: Final[str] = os.environ["DB_HOST"]
DB_PORT: Final[str] = os.environ["DB_PORT"]
DB_NAME: Final[str] = os.environ["DB_NAME"]

SECRET_KEY: Final[str] = os.environ["SECRET_KEY"]
ACCESS_TOKEN_EXPIRE_TIME: Final[int] = int(os.environ["ACCESS_TOKEN_EXPIRE_TIME"])
ALGORITHM: Final[str] = os.environ["ALGORITHM"]
