from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models import Tale, Usuario, level_num, UserSessionHistory, Lesson
from googletrans import Translator
from datetime import datetime, timezone


# ---------------- Pydantic Schemas ----------------
class UsuarioCreate(BaseModel):
    name: str
    password: str
    email: EmailStr

class UsuarioRead(BaseModel):
    id_user: int
    name: str
    password: str
    email: EmailStr
    id_session: int | None = None
    model_config = {"from_attributes": True}

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

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
    id_tale: int
    title: str

class LessonRead(BaseModel):
    id_lesson: int
    title: str
    id_tale: int
    model_config = {"from_attributes": True}

class TraducirRead(BaseModel):
    texto: str
    destino: str


# ---------------- Router ----------------
router = APIRouter()
translator = Translator()


# ---------------- Dependencias ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- Endpoints ----------------

# Usuarios
@router.get("/usuario", response_model=list[UsuarioRead])
def obtener_usuario(db: Session = Depends(get_db)):
    return db.query(Usuario).all()


@router.post("/create", response_model=UsuarioCreate)
def crear_usuario(request: UsuarioCreate, db: Session = Depends(get_db)):
    if db.query(Usuario).filter(Usuario.email == request.email).first():
        raise HTTPException(status_code=401, detail="Correo ya registrado")
    new_user = Usuario(
        name=request.name,
        password=request.password,
        email=request.email,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=UsuarioRead)
def verificar_usuario(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.email == request.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Correo no encontrado")
    if user.password != request.password:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    now = datetime.now(timezone.utc)
    user.last_login = now

    # Crear sesión de usuario
    new_session = UserSessionHistory(
        id_user=user.id_user,
        login_at=now
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return UsuarioRead(
        id_user=user.id_user,
        name=user.name,
        password=user.password,
        email=user.email,
        id_session=new_session.id_session
    )

from datetime import datetime, timezone

@router.post("/logout/{session_id}")
def logout(session_id: int, db: Session = Depends(get_db)):
    try:
        session = db.query(UserSessionHistory).filter(UserSessionHistory.id_session == session_id).first()
        if not session:
            return {"status": "failed", "message": "Sesión no encontrada"}

        now = datetime.now(timezone.utc)  # datetime aware
        session.logout_at = now

        if session.login_at:
            # Convertimos login_at a aware si es naive
            if session.login_at.tzinfo is None:
                login_time_aware = session.login_at.replace(tzinfo=timezone.utc)
            else:
                login_time_aware = session.login_at
            session.duration_seconds = (now - login_time_aware).total_seconds()
        else:
            session.duration_seconds = 0

        db.commit()
        return {"status": "ok", "message": "Logout registrado correctamente"}

    except Exception as e:
        print("Error en logout:", e)
        return {"status": "failed", "message": f"No se pudo registrar logout: {e}"}

# Cuentos y lecciones
@router.get("/tales", response_model=list[TaleRead])
def obtener_cuentos(db: Session = Depends(get_db)):
    return db.query(Tale).all()


@router.get("/lesson", response_model=list[LessonRead])
def obtener_lecciones(db: Session = Depends(get_db)):
    return db.query(Lesson).all()


@router.post("/lesson", response_model=LessonRead)
def crear_leccion(request: LessonCreate, db: Session = Depends(get_db)):
    if not db.query(Tale).filter(Tale.id_tale == request.id_tale).first():
        raise HTTPException(status_code=401, detail="Cuento no encontrado")
    new_lesson = Lesson(title=request.title, id_tale=request.id_tale)
    db.add(new_lesson)
    db.commit()
    db.refresh(new_lesson)
    return new_lesson


# Traducción
@router.post("/traducir")
def traducir(request: TraducirRead):
    traduccion = translator.translate(request.texto, dest=request.destino)
    return {"texto_original": request.texto, "traduccion": traduccion.text}


# Paginación de lecciones por cuento
@router.get("/lessons_by_tale_full")
def get_lessons_by_tale_full(id_tale: int, page: int = 1, page_size: int = 5, db: Session = Depends(get_db)):
    query = (
        db.query(Lesson.id_lesson, Lesson.title, Tale.tale_name, Tale.level_type)
        .join(Tale, Lesson.id_tale == Tale.id_tale)
        .filter(Tale.id_tale == id_tale)
    )
    total = query.count()
    lessons = query.offset((page - 1) * page_size).limit(page_size).all()
    return {"total": total, "lessons": [dict(l._asdict()) for l in lessons]}
