from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.servicios import router
from backend.database import Base, engine

app = FastAPI()

# CORS
origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear tablas
Base.metadata.create_all(bind=engine)

# Incluir routers
app.include_router(router)

