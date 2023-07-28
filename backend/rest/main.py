from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import operation_router, base_router

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(operation_router)
app.include_router(base_router)
