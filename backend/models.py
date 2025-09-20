# backend/models.py
from sqlalchemy import Column, Integer, String, Text, Enum as SQLEnum, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from backend.database import Base
from datetime import datetime, timezone
from enum import Enum


class level_num(str, Enum):
    A1 = "A1"
    A2 = "A2"
    B1 = "B1"
    B2 = "B2"
    C1 = "C1"
    C2 = "C2"


class Usuario(Base):
    __tablename__ = "user"

    id_user = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    password = Column(String(30), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    last_login = Column(TIMESTAMP(timezone=True), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), default=lambda: datetime.now(timezone.utc))

    sessions = relationship("UserSessionHistory", back_populates="user")


class Tale(Base):
    __tablename__ = "tale"

    id_tale = Column(Integer, primary_key=True, autoincrement=True)
    tale_name = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    level_type = Column(SQLEnum(level_num), nullable=False)

    lessons = relationship("Lesson", back_populates="tale")


class UserSessionHistory(Base):
    __tablename__ = "user_session_history"

    id_session = Column(Integer, primary_key=True, autoincrement=True)
    id_user = Column(Integer, ForeignKey("user.id_user", ondelete="CASCADE"), nullable=False)
    login_at = Column(TIMESTAMP(timezone=True), default=lambda: datetime.now(timezone.utc))
    logout_at = Column(TIMESTAMP(timezone=True), nullable=True)
    duration_seconds = Column(Integer, nullable=True)

    user = relationship("Usuario", back_populates="sessions")


class Lesson(Base):
    __tablename__ = "lesson"

    id_lesson = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    id_tale = Column(Integer, ForeignKey("tale.id_tale", ondelete="CASCADE"), nullable=False)

    tale = relationship("Tale", back_populates="lessons")
