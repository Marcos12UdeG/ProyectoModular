import os
import shutil
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models import Answer, Excercise, Tale, UserSessionHistory, Usuario, level_num, Lesson
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

class AnswerRead(BaseModel):
    id_answer:int
    answer_text:str
    is_correct:bool

    class Config:
        orm_mode = True

class ExcerciseWithAnswersRead(BaseModel):
    id_excercise: int
    excercise_name: str
    question: str
    excercise_type: str
    answers: list[AnswerRead]  # 👈 Aquí van las respuestas

    class Config:
        orm_mode = True

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

UPLOAD_DIR = "frontend/proyecto-modular/public/images"
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

# ------------------------------------------------------------------------------------------

# Cuentos
@router.get("/tales", response_model=list[TaleRead])
def obtener_cuentos(db: Session = Depends(get_db)):
    return db.query(Tale).all()

@router.post("/talescreate", response_model=TaleRead)
def crear_cuento(
    tale_name: str = Form(...),
    content: str = Form(...),
    level_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Guardar imagen en /public/images/nombre_del_cuento.jpg
    filename = tale_name.replace(" ", "_").lower() + ".jpg"
    file_path = os.path.join(UPLOAD_DIR, filename)

    # Crear carpeta si no existe
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Guardar en base de datos
    new_tale = Tale(
        tale_name=tale_name,
        content=content,
        level_type=level_type
    )
    db.add(new_tale)
    db.commit()
    db.refresh(new_tale)

    return new_tale

@router.delete("/taleseliminate/{id_tale}")
def Eliminar_Cuento(id_tale: int, db: Session = Depends(get_db)):
    cuento = db.query(Tale).filter(Tale.id_tale == id_tale).first()
    if not cuento:
        raise HTTPException(status_code=404, detail="Lección no encontrada")

    db.delete(cuento)
    db.commit()

    return {"message": "Lección eliminada correctamente"}


# ------------------------------------------------------------------------------------------

#Lecciones
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

# ------------------------------------------------------------------------------------------

# Traducción
@router.post("/traducir")
def traducir(request: TraducirRead):
    traduccion = translator.translate(request.texto, dest=request.destino)
    return {"texto_original": request.texto, "traduccion": traduccion.text}

# ------------------------------------------------------------------------------------------

# Paginación de lecciones por cuento
@router.get("/tales/{tale_id}/lessons", response_model=list[LessonRead])
def get_lessons_by_tale(tale_id: int, db: Session = Depends(get_db)):
    tale = db.query(Tale).filter(Tale.id_tale == tale_id).first()
    if not tale:
        raise HTTPException(status_code=404, detail="Cuento no encontrado")
    return jsonable_encoder(tale.lessons)

# ------------------------------------------------------------------------------------------

#Ejercicios

@router.get("/lessons/{lesson_id}/exercises_with_answers", response_model=list[ExcerciseWithAnswersRead])
def obtener_ejercicios_con_respuestas(lesson_id: int, db: Session = Depends(get_db)):
    """
    Devuelve todos los ejercicios de una lección junto con sus respuestas.
    """
    ejercicios = db.query(Excercise).filter(Excercise.id_lesson == lesson_id).all()
    if not ejercicios:
        raise HTTPException(status_code=404, detail="No se encontraron ejercicios para esta lección")

    ejercicios_con_respuestas = []
    for ex in ejercicios:
        respuestas = db.query(Answer).filter(Answer.id_excercise == ex.id_excercise).all()
        ejercicios_con_respuestas.append({
            "id_excercise": ex.id_excercise,
            "excercise_name": ex.excercise_name,
            "question": ex.question,
            "excercise_type": ex.excercise_type,
            "answers": respuestas
        })

    return ejercicios_con_respuestas

# ------------------------------------------------------------------------------------------

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

# ------------------------------------------------------------------------------------------