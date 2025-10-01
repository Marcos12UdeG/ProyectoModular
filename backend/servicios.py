import os
import shutil
from typing import List
from xml.parsers.expat import model
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.encoders import jsonable_encoder
import joblib
import pandas as pd
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.modelo_predictivo import generate_features
from backend.models import Answer, Excercise, Tale, UserAnswer, UserSessionHistory, Usuario, level_num
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

class SubmitExerciseAnswer(BaseModel):
    id_excercise: int
    id_answer: int

class SubmitExercise(BaseModel):
    id_user: int
    answers: List[SubmitExerciseAnswer]


class TalesWithExcercises(BaseModel):
    id_tale: int
    tale_name: str
    content: str
    level_type: level_num
    excercises: list[ExcerciseWithAnswersRead]

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
model = joblib.load("user_level_model.pkl")

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

@router.get("/user/{id_user}/level")
def get_user_level(id_user: int):
    # Cargar CSV con todas las respuestas
    df = pd.read_csv("user_responses.csv")
    
    # Filtrar solo las respuestas del usuario
    df_user = df[df['id_user'] == id_user]
    
    if df_user.empty:
        raise HTTPException(status_code=404, detail="Usuario no encontrado o sin respuestas")
    
    # Generar features y predecir nivel
    X_user = generate_features(df_user)
    predicted_level = model.predict(X_user)
    
    return {
        "id_user": id_user,
        "predicted_level": predicted_level[0]  # como es un array de 1 elemento
    }

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

@router.get("/tales/{id_tale}/excercises",response_model=list[ExcerciseWithAnswersRead])
def ObtenerTales_Con_Ejercicios(id_tale:int, db:Session = Depends(get_db)):
    tales_ejercicios = db.query(Excercise).filter(Excercise.id_tale == id_tale).all()

    if not tales_ejercicios:
        raise HTTPException(status_code=404, detail="Cuento no encontrado")
    
    tales_with_ejercicios = []

    for tal in tales_ejercicios:
        respuestas = db.query(Answer).filter(Answer.id_excercise == tal.id_excercise).all()
        tales_with_ejercicios.append({
            "id_excercise": tal.id_excercise,
            "excercise_name":tal.excercise_name,
            "question":tal.question,
            "excercise_type":tal.excercise_type,
            "answers":respuestas
        }   
        )
    return tales_with_ejercicios

@router.get("/tales/{id_tale}", response_model=TaleRead)
def obtener_cuento_por_id(id_tale: int, db: Session = Depends(get_db)):
    cuento = db.query(Tale).filter(Tale.id_tale == id_tale).first()
    if not cuento:
        raise HTTPException(status_code=404, detail="Cuento no encontrado")
    return cuento
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

@router.get("/tales/{id_tale}/exercises_with_answers", response_model=list[ExcerciseWithAnswersRead])
def obtener_ejercicios_con_respuestas(id_lesson: int, db: Session = Depends(get_db)):
    """
    Devuelve todos los ejercicios de una lección junto con sus respuestas.
    """
    ejercicios = db.query(Excercise).filter(Excercise.id_lesson == id_lesson).all()
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

#Respuestas Usuario

@router.post("/submit-exercise")
def submit_exercise(request: SubmitExercise, db: Session = Depends(get_db)):
    """
    Guarda las respuestas de un usuario para múltiples ejercicios.
    """
    if not request.answers:
        raise HTTPException(status_code=400, detail="No se enviaron respuestas")

    for ans in request.answers:
        user_answer = UserAnswer(
            id_user=request.id_user,
            id_excercise=ans.id_excercise,
            id_answer=ans.id_answer,
        )
        db.add(user_answer)

    db.commit()
    return {"status": "ok", "message": "Respuestas guardadas correctamente"}
    