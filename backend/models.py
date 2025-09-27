from datetime import datetime, timezone
from sqlalchemy import TIMESTAMP, Column, Integer, String, Text, Enum as SQLEnum, ForeignKey, Boolean
from backend.database import Base
from enum import Enum
from sqlalchemy.orm import relationship

# Enumeraciones
class level_num(str, Enum):
    A1 = "A1"
    A2 = "A2"
    B1 = "B1"
    B2 = "B2"
    C1 = "C1"
    C2 = "C2"

class excercise_type(str, Enum):
    listening = "listening"
    writting = "writting"
    reading = "reading"

class Role(str,Enum):
    administrador = "administrador"
    usuario = "usuario"

# Modelo Usuario
class Usuario(Base):
    __tablename__ = "user"

    id_user = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    password = Column(String(30), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    last_login = Column(TIMESTAMP(timezone=True), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), default=lambda: datetime.now(timezone.utc))
    role = Column(SQLEnum(Role), nullable=True)
    sessions = relationship("UserSessionHistory", back_populates="user")
    user = relationship("UserAnswer", back_populates="users")

# Modelo Tale
class Tale(Base):
    __tablename__ = "tale"

    id_tale = Column(Integer, primary_key=True, autoincrement=True)
    tale_name = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    level_type = Column(SQLEnum(level_num), nullable=False)

    # Relación con Lesson
    lessons = relationship("Lesson", back_populates="tale", cascade="all, delete-orphan")

# Modelo Lesson
class Lesson(Base):
    __tablename__ = "lessons"

    id_lesson = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(50), nullable=False)
    id_tale = Column(Integer, ForeignKey("tale.id_tale"))
    # Relaciones
    tale = relationship("Tale", back_populates="lessons")
    excercises = relationship("Excercise", back_populates="lesson", cascade="all, delete-orphan")

# Modelo Excercise
class Excercise(Base):
    __tablename__ = "excercises"

    id_excercise = Column(Integer, primary_key=True, autoincrement=True)
    excercise_name = Column(String(100), nullable=False)
    question = Column(Text, nullable=False)
    excercise_type = Column(SQLEnum(excercise_type), nullable=False)
    id_lesson = Column(Integer, ForeignKey("lessons.id_lesson"))

    answers = relationship("Answer",back_populates = "excercises")
    # Relaciones
    lesson = relationship("Lesson", back_populates="excercises")
    excercises = relationship("UserAnswer", back_populates="excercise")

class Answer(Base):

    __tablename__ = "answer"

    id_answer = Column(Integer,primary_key = True, autoincrement=True)
    answer_text = Column(String(50),nullable = False)
    is_correct = Column(Boolean,nullable = False)
    id_excercise = Column(Integer,ForeignKey("excercises.id_excercise"))

    excercises = relationship("Excercise",back_populates="answers")
    answers = relationship("UserAnswer",back_populates="answer")

class UserSessionHistory(Base):
    __tablename__ = "user_session_history"

    id_session = Column(Integer, primary_key=True, autoincrement=True)
    id_user = Column(Integer, ForeignKey("user.id_user", ondelete="CASCADE"), nullable=False)
    login_at = Column(TIMESTAMP(timezone=True), default=lambda: datetime.now(timezone.utc))
    logout_at = Column(TIMESTAMP(timezone=True), nullable=True)
    duration_seconds = Column(Integer, nullable=True)

    user = relationship("Usuario", back_populates="sessions")

class UserAnswer(Base):
    __tablename__ = "user_answer"

    id_answer_user = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_user = Column(Integer, ForeignKey("user.id_user", ondelete="CASCADE"), nullable=False)
    id_excercise = Column(Integer, ForeignKey("excercises.id_excercise", ondelete="CASCADE"), nullable=False)
    id_answer = Column(Integer, ForeignKey("answer.id_answer", ondelete="CASCADE"), nullable=False)

    users = relationship("Usuario",back_populates="user")
    excercise = relationship("Excercise",back_populates="excercises")
    answer = relationship("Answer",back_populates="answers")