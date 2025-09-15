from fastapi import FastAPI
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from backend.servicios import router
from backend.database import Base, engine

app = FastAPI()


origins = "http://localhost:3000"

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],

)

Base.metadata.create_all(bind=engine)

app.include_router(router)



