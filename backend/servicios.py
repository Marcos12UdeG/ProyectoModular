import os
import shutil
from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models import Answer, Excercise, Tale, Usuario,level_num,Lesson,excercise_type
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

router = APIRouter()
translator = Translator()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



UPLOAD_DIR = "frontend/proyecto-modular/public/images"

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

@router.get("/tales/{tale_id}/lessons", response_model=list[LessonRead])
def get_lessons_by_tale(tale_id: int, db: Session = Depends(get_db)):
    tale = db.query(Tale).filter(Tale.id_tale == tale_id).first()
    if not tale:
        raise HTTPException(status_code=404, detail="Cuento no encontrado")
    return jsonable_encoder(tale.lessons)

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


