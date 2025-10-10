from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.servicios import router
from backend.database import Base, engine

app = FastAPI()




app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear tablas
Base.metadata.create_all(bind=engine)

# Incluir routers
app.include_router(router)

