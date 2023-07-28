from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from env_vars import DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_database_session():
    db_session = SessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()
