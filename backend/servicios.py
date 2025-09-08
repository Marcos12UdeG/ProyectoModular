from fastapi import APIRouter, Depends, HTTPException
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

class LoginRequest(BaseModel):
    email:EmailStr
    password:str

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

@router.post("/login", response_model=UsuarioRead)
def VerificarUsuario(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.email == request.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Correo no encontrado")
    
    if user.password != request.password:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    return user

@router.post("/create",response_model=UsuarioCreate)
def CrearUsuario(request: UsuarioCreate, db: Session = Depends(get_db)):
    user_exist = db.query(Usuario).filter(Usuario.email == request.email).first()

    if user_exist:
        raise HTTPException(status_code=401, detail="Correo ya registrado")
    
    new_user = Usuario(
        name = request.name,
        password = request.password,
        email = request.email,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

