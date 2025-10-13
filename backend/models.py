from datetime import datetime, timezone
from sqlalchemy import TIMESTAMP, Column, Integer, String, Text, Enum as SQLEnum, ForeignKey, Boolean
from backend.database import Base
from enum import Enum
from sqlalchemy.orm import relationship


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

class Role(str, Enum):
    administrador = "administrador"
    usuario = "usuario"


class Usuario(Base):
    __tablename__ = "user"

    id_user = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    password = Column(String(30), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    last_login = Column(TIMESTAMP(timezone=True), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), default=lambda: datetime.now(timezone.utc))
    role = Column(SQLEnum(Role), nullable=True)
    assigned_level = Column(SQLEnum(level_num), nullable=True)
    
    # Relaciones
    sessions = relationship("UserSessionHistory", back_populates="user")
    user_answers = relationship("UserAnswer", back_populates="user")
    user_answers_quiz = relationship("UserAnswer_Quiz", back_populates="user_quiz")
    user_progress = relationship("UserModuleProgress",back_populates="user_table")


class Tale(Base):
    __tablename__ = "tale"

    id_tale = Column(Integer, primary_key=True, autoincrement=True)
    tale_name = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    level_type = Column(SQLEnum(level_num), nullable=False)

    excercises = relationship("Excercise", back_populates="tale")
    tale_progress = relationship("UserModuleProgress", back_populates="tale_table")


class Excercise(Base):
    __tablename__ = "excercises"

    id_excercise = Column(Integer, primary_key=True, autoincrement=True)
    excercise_name = Column(String(100), nullable=False)
    question = Column(Text, nullable=False)
    excercise_type = Column(SQLEnum(excercise_type), nullable=False)
    id_tale = Column(Integer, ForeignKey("tale.id_tale"))

    answers = relationship("Answer", back_populates="excercise")
    tale = relationship("Tale", back_populates="excercises")
    user_answers = relationship("UserAnswer", back_populates="excercise")



class Answer(Base):
    __tablename__ = "answer"

    id_answer = Column(Integer, primary_key=True, autoincrement=True)
    answer_text = Column(String(50), nullable=False)
    is_correct = Column(Boolean, nullable=False)
    id_excercise = Column(Integer, ForeignKey("excercises.id_excercise"))

    excercise = relationship("Excercise", back_populates="answers")
    user_answers = relationship("UserAnswer", back_populates="answer")


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

    user = relationship("Usuario", back_populates="user_answers")
    excercise = relationship("Excercise", back_populates="user_answers")
    answer = relationship("Answer", back_populates="user_answers")



class Quiz(Base):
    __tablename__ = "quiz"

    id_quiz = Column(Integer, primary_key=True, autoincrement=True)
    quiz_name = Column(String(30), nullable=False)
    question = Column(Text, nullable=False)
    quiz_level = Column(SQLEnum(level_num), nullable=False)

    answers_quiz = relationship("Answer_Quiz", back_populates="quiz")
    user_answers_quiz = relationship("UserAnswer_Quiz", back_populates="quiz")



class Answer_Quiz(Base):
    __tablename__ = "answer_quiz"

    id_answer_quiz = Column(Integer, primary_key=True, autoincrement=True)
    answer_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    id_quiz = Column(Integer, ForeignKey("quiz.id_quiz"), nullable=False)

    quiz = relationship("Quiz", back_populates="answers_quiz")
    user_answers_quiz = relationship("UserAnswer_Quiz", back_populates="answer_quiz")



class UserAnswer_Quiz(Base):
    __tablename__ = "user_answer_quiz"

    id_answer_user_quiz = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_user = Column(Integer, ForeignKey("user.id_user", ondelete="CASCADE"), nullable=False)
    id_quiz = Column(Integer, ForeignKey("quiz.id_quiz", ondelete="CASCADE"), nullable=False)
    id_answer_quiz = Column(Integer, ForeignKey("answer_quiz.id_answer_quiz", ondelete="CASCADE"), nullable=False)

    user_quiz = relationship("Usuario", back_populates="user_answers_quiz")
    quiz = relationship("Quiz", back_populates="user_answers_quiz")
    answer_quiz = relationship("Answer_Quiz", back_populates="user_answers_quiz")


class UserModuleProgress(Base):
    __tablename__ = "user_progress"

    id_progress = Column(Integer,primary_key=True,autoincrement=True)
    id_user = Column(Integer, ForeignKey("user.id_user"),nullable=False)
    id_tale = Column(Integer, ForeignKey("tale.id_tale"),nullable=False)
    is_completed = Column(Boolean,default=False)
    completion_date = Column(TIMESTAMP(timezone=True), nullable=True)

    user_table = relationship("Usuario",back_populates="user_progress")
    tale_table = relationship("Tale",back_populates="tale_progress")