import os
import shutil
<<<<<<< HEAD
from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models import Answer, Excercise, Tale, Usuario,level_num,Lesson,excercise_type
=======
from typing import List
from xml.parsers.expat import model
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.encoders import jsonable_encoder
import joblib
import pandas as pd
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from backend.database import SessionLocal, get_user_data
from .model_trainer import predict_user_progress
from backend.models import Answer, Answer_Quiz, Excercise, Quiz, Tale, UserAnswer, UserAnswer_Quiz, UserModuleProgress, UserSessionHistory, Usuario, level_num
>>>>>>> feature
from googletrans import Translator
from datetime import datetime, timezone
from sqlalchemy import func,desc

# ---------------- Pydantic Schemas ----------------
class UsuarioCreate(BaseModel):
    name: str
    password: str
    email: EmailStr
    role:str

class UsuarioRead(BaseModel):
    id_user: int
    name: str
    password: str
    email: EmailStr
    id_session: int | None = None
    role:str
    
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

<<<<<<< HEAD
class ExcerciseCreate(BaseModel):
    excercise_name:str
    excercise_type:excercise_type
    id_lesson: int
    question:str

class ExcerciseRead(BaseModel):
    id_excercise:int
    excercise_name:str
    excercise_type:excercise_type
    id_lesson: int 
    question:str
    model_config = {"from_attributes": True}

=======
>>>>>>> feature
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

<<<<<<< HEAD
=======
class SubmitExerciseAnswer(BaseModel):
    id_excercise: int
    id_answer: int

class SubmitExerciseA(BaseModel):
    id_user: int
    answers: List[SubmitExerciseAnswer]


class TalesWithExcercises(BaseModel):
    id_tale: int
    tale_name: str
    content: str
    level_type: level_num
    excercises: list[ExcerciseWithAnswersRead]

class Answer_Quiz_Read(BaseModel):
    id_answer_quiz:int
    answer_text:str
    is_correct:bool

class QuizWithExcercise(BaseModel):
    id_quiz:int
    question:str
    quiz_level: level_num
    answers: list[Answer_Quiz_Read]

    class Config:
        orm_mode = True

class SubmitExcercise(BaseModel):
    id_quiz:int
    id_answer_quiz:int

class Submit_Quiz(BaseModel):
    id_user:int
    answers: list[SubmitExcercise]

# ---------------- Router ----------------
>>>>>>> feature
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

<<<<<<< HEAD

UPLOAD_DIR = "frontend/proyecto-modular/public/images"

@router.get("/usuario",response_model=list[UsuarioRead])
def ObtenerUsuario(db: Session = Depends(get_db)):
=======
# ---------------- Endpoints ----------------

# Usuarios
@router.get("/usuario", response_model=list[UsuarioRead])
def obtener_usuario(db: Session = Depends(get_db)):
>>>>>>> feature
    return db.query(Usuario).all()

@router.get("/user/{id_user}/level")
def obtener_nivel_usuario(id_user:int, db:Session = Depends(get_db)):
    print("🧩 ID recibido:", id_user)
    usuario = db.query(Usuario).filter(Usuario.id_user == id_user).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    results = {
    "Usuario": usuario.name,
    "Nivel": usuario.assigned_level
    }

    return results

@router.post("/create", response_model=UsuarioCreate)
def crear_usuario(request: UsuarioCreate, db: Session = Depends(get_db)):
    if db.query(Usuario).filter(Usuario.email == request.email).first():
        raise HTTPException(status_code=401, detail="Correo ya registrado")
    new_user = Usuario(
        name=request.name,
        password=request.password,
        email=request.email,
        role= request.role,
        
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
<<<<<<< HEAD
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

@router.get("/lesson",response_model=list[LessonRead])
def ObtenerLecciones(db: Session = Depends(get_db)):
    return db.query(Lesson).all()
=======

    filename = tale_name.replace(" ", "_").lower() + ".jpg"
    file_path = os.path.join(UPLOAD_DIR, filename)
>>>>>>> feature


    os.makedirs(UPLOAD_DIR, exist_ok=True)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)


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

<<<<<<< HEAD
=======
# ------------------------------------------------------------------------------------------

# Paginación de lecciones por cuento
>>>>>>> feature
@router.get("/tales/{tale_id}/lessons", response_model=list[LessonRead])
def get_lessons_by_tale(tale_id: int, db: Session = Depends(get_db)):
    tale = db.query(Tale).filter(Tale.id_tale == tale_id).first()
    if not tale:
        raise HTTPException(status_code=404, detail="Cuento no encontrado")
    return jsonable_encoder(tale.lessons)
<<<<<<< HEAD

@router.get("/lessons/{id_lesson}/excercises", response_model=list[ExcerciseRead])
def get_excercise_by_lesson(id_lesson: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id_lesson == id_lesson).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Leccion no encontrada")
    return jsonable_encoder(lesson.excercises)

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
=======

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
        id_session=new_session.id_session,
        role = user.role
    )

# ------------------------------------------------------------------------------------------

#Respuestas Usuario

@router.post("/submit-excercise")
def submit_exercise(request: SubmitExerciseA, db: Session = Depends(get_db)):
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
    
@router.post("/submit-quiz")
def submit_quiz(submission: Submit_Quiz, db: Session = Depends(get_db)):
    user_id = submission.id_user

    # 1️⃣ Guardar respuestas del usuario
    for ans in submission.answers:
        new_answer = UserAnswer_Quiz(
            id_user=user_id,
            id_quiz=ans.id_quiz,
            id_answer_quiz=ans.id_answer_quiz
        )
        db.add(new_answer)
    db.commit()

    # 2️⃣ Calcular respuestas correctas por nivel
    results = (
        db.query(Quiz.quiz_level, func.count().label("correct_answers"))  # ✅ func en lugar de db.func
        .join(Answer_Quiz, Quiz.id_quiz == Answer_Quiz.id_quiz)
        .join(UserAnswer_Quiz, UserAnswer_Quiz.id_answer_quiz == Answer_Quiz.id_answer_quiz)
        .filter(UserAnswer_Quiz.id_user == user_id, Answer_Quiz.is_correct == True)
        .group_by(Quiz.quiz_level)
        .all()
    )

    if not results:
        raise HTTPException(status_code=400, detail="No se encontraron respuestas correctas.")

    # 3️⃣ Determinar el nivel con más aciertos
    top_level = max(results, key=lambda x: x.correct_answers).quiz_level

    # 4️⃣ Actualizar el nivel asignado del usuario
    user = db.query(Usuario).filter(Usuario.id_user == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    
    user.assigned_level = top_level
    db.commit()

    return {
        "message": f"Respuestas guardadas correctamente. Nivel asignado: {top_level}",
        "assigned_level": top_level
    }

@router.get("/quiz/{id_quiz}/answer")
def obtener_quiz(id_quiz: int, db: Session = Depends(get_db)):

    quiz = db.query(Quiz).filter(Quiz.id_quiz == id_quiz).first()
    if not quiz:
        return {"error": "Quiz no encontrado"}
    

    answers = db.query(Answer_Quiz).filter(Answer_Quiz.id_quiz == id_quiz).all()

    quiz_con_respuestas = {
        "id_quiz": quiz.id_quiz,
        "quiz_name": quiz.quiz_name,
        "question": quiz.question,
        "quiz_level": quiz.quiz_level,
        "answers": [
            {
                "id_answer_quiz": a.id_answer_quiz,
                "answer_text": a.answer_text,
                "is_correct": a.is_correct
            }
            for a in answers
        ]
    }

    return quiz_con_respuestas

@router.get("/quizes")
def ObtenerQuizes(db:Session = Depends(get_db)):
    quizes = db.query(Quiz).all()

    return quizes

#Obtener progreso

@router.get("/predict/{id_user}")
def predict(id_user: int):
    """
    Predice el posible nivel futuro del usuario según su desempeño.
    """
    try:
        # 1️⃣ Cargar modelo y transformadores
        model = joblib.load("ml/modelo_prediccion_nivel.pkl")
        scaler = joblib.load("ml/scaler.pkl")
        label_encoder = joblib.load("ml/label_encoder.pkl")

        # 2️⃣ Obtener los datos actualizados desde la BD
        df = get_user_data()

        # 3️⃣ Predecir con los datos actuales
        result = predict_user_progress(
            id_user,
            df=df,
            model=model,
            scaler=scaler,
            label_encoder=label_encoder
        )
        return result

    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=f"Archivo no encontrado: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en la predicción: {e}")



@router.get("/evaluate-tale/{id_tale}")
def EvaluarCuento(id_tale: int, id_user: int, db: Session = Depends(get_db)):

    total_ejercicios = db.query(Excercise).filter(Excercise.id_tale == id_tale).count()

    if total_ejercicios == 0:
        raise HTTPException(status_code=400, detail="Este cuento no tiene ejercicios")

    correct_answer = (
        db.query(UserAnswer)
        .join(Answer, Answer.id_answer == UserAnswer.id_answer)
        .join(Excercise, Excercise.id_excercise == UserAnswer.id_excercise)
        .filter(
            UserAnswer.id_user == id_user,
            Excercise.id_tale == id_tale,
            Answer.is_correct == True
        )
        .count()
    )

    score = (correct_answer / total_ejercicios) * 100

    progress = db.query(UserModuleProgress).filter_by(id_user=id_user, id_tale=id_tale).first()
    
    if not progress:
        progress = UserModuleProgress(id_user=id_user, id_tale=id_tale)
        db.add(progress)
    

    if score >= 60:
        progress.is_completed = True
        progress.completion_date = datetime.now(timezone.utc)
        db.commit()
        return {"status": "completed", "score": score}
    else:
        db.commit()
        return {"status": "failed", "score": score}

@router.get("/progress/{id_user}/{id_tale}")
def get_progress(id_user: int, id_tale: int, db: Session = Depends(get_db)):
    progress = db.query(UserModuleProgress).filter_by(id_user=id_user, id_tale=id_tale).first()
    return {"is_completed": bool(progress and progress.is_completed)}


@router.get("/completados/{id_user}")
def ObtenerProgresoUsuario(id_user: int, db: Session = Depends(get_db)):

    total_completados = db.query(UserModuleProgress).filter_by(id_user=id_user).count()

    if not total_completados:
        raise HTTPException(status_code=404 , detail="No existe el usuario")

    total_cuentos = db.query(Tale).count()
    if total_cuentos == 0:
        raise HTTPException(status_code=404, detail="No hay cuentos disponibles")


    porcentaje = (total_completados / total_cuentos) * 100 if total_cuentos > 0 else 0

    return {
        "id_user": id_user,
        "total_completados": total_completados,
        "total_cuentos": total_cuentos,
        "porcentaje": round(porcentaje, 2)
    }

@router.get("/puntuaje/{id_user}")
def ObtenerPuntuaje(id_user:int, db: Session = Depends(get_db)):

    completados = (
        db.query(UserModuleProgress)
        .filter_by(id_user=id_user, is_completed=True)
        .all()
    )

    if not completados:
        raise HTTPException(status_code=404, detail="El usuario no tiene cuentos completados")


    total_completados = len(completados)

 
    total_cuentos = db.query(Tale).count()

    if total_cuentos == 0:
        raise HTTPException(status_code=404, detail="No hay cuentos disponibles")


    total_puntos = (
        db.query(func.sum(Tale.points))
        .join(UserModuleProgress, Tale.id_tale == UserModuleProgress.id_tale)
        .filter(UserModuleProgress.id_user == id_user, UserModuleProgress.is_completed == True)
        .scalar()
    ) or 0 

    return {
        "total_puntos": total_puntos
    }
>>>>>>> feature


@router.get("/ranking")
def obtener_ranking(db: Session = Depends(get_db)):

    ranking = (
        db.query(
            Usuario.id_user,
            Usuario.name,
            func.coalesce(func.sum(Tale.points), 0).label("total_puntos")
        )
        .join(UserModuleProgress, Usuario.id_user == UserModuleProgress.id_user)
        .join(Tale, Tale.id_tale == UserModuleProgress.id_tale)
        .filter(UserModuleProgress.is_completed == True)
        .group_by(Usuario.id_user)
        .order_by(desc("total_puntos"))
        .limit(10)
        .all()
    )

    if not ranking:
        raise HTTPException(status_code=404, detail="No hay usuarios con progreso registrado")

    return [
        {
            "id_user": r.id_user,
            "nombre": r.name,
            "puntos": r.total_puntos
        }
        for r in ranking
    ]
