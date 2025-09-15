from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models import Tale, Usuario,level_num,Lesson
from googletrans import Translator

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

class TaleCreate(BaseModel):
    tale_name: str
    content: str
    level_type: level_num

class TaleRead(BaseModel):
    id_tale: int
    tale_name: str
    content: str
    level_type: level_num

    model_config = {"from_attributes": True}


class LessonCreate(BaseModel):
    id_tale:int
    title: str

class LessonRead(BaseModel):
    id_lesson:int
    title:str
    id_tale: int

    model_config = {"from_attributes": True}

class TraducirRead(BaseModel):
    texto:str
    destino: str

router = APIRouter()
translator = Translator()

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

@router.get("/tales",response_model=list[TaleRead])
def ObtenerCuentos(db: Session = Depends(get_db)):
    return db.query(Tale).all()

@router.get("/lesson",response_model=list[LessonRead])
def ObtenerLecciones(db: Session = Depends(get_db)):
    return db.query(Lesson).all()


@router.post("/lesson",response_model=LessonCreate)
def CrearLeccion(request:LessonCreate,db: Session = Depends(get_db)):
    tale = db.query(Tale).filter(Tale.id_tale == request.id_tale).first()
    if not tale:
        raise HTTPException(status_code=401,detail="Cuento no encontrado")
    
    new_lesson = Lesson(
        title = request.title,
        id_tale = request.id_tale
    )

    db.add(new_lesson)
    db.commit()
    db.refresh(new_lesson)

    return new_lesson

@router.post("/traducir")
def Traducir(request: TraducirRead, db: Session = Depends(get_db)):
    traduccion = translator.translate(request.texto, dest=request.destino)
    return {"texto_original": request.texto, "traduccion": traduccion.text}

@router.get("/lessons_by_tale_full")
def get_lessons_by_tale_full(
    id_tale: int,
    page: int = 1,
    page_size: int = 5,
    db: Session = Depends(get_db)
):
    query = (
        db.query(Lesson.id_lesson, Lesson.title, Tale.tale_name, Tale.level_type)
        .join(Tale, Lesson.id_tale == Tale.id_tale)
        .filter(Tale.id_tale == id_tale)
    )
    
    total = query.count()
    lessons = query.offset((page - 1) * page_size).limit(page_size).all()

    return {
        "total": total,
        "lessons": [dict(l._asdict()) if hasattr(l, "_asdict") else l.__dict__ for l in lessons]
    }


