from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models import Usuario

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

@router.get("/usuario",response_model=list[UsuarioRead])
def ObtenerUsuario(db: Session = Depends(get_db)):
    return db.query(Usuario).all()

