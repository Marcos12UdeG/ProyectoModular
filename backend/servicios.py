from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

from ProyectoModular.backend.database import SessionLocal

class UsuarioCreate(BaseModel):
    name: str
    password:str
    email: EmailStr

class UsuarioRead(BaseModel):
    id_user:int
    name:str
    password:str
    email:EmailStr

    model_config = {"from_attributes":True}

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

    