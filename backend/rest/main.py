from fastapi import FastAPI
from routers import signup_router

app = FastAPI()
app.include_router(signup_router)
