from sqlalchemy import Column, Integer, String, Text, Enum as SQLEnum, ForeignKey
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


class Usuario(Base):
    __tablename__ = "user"

    id_user = Column(Integer, primary_key=True,autoincrement=True)
    name = Column(String(50),nullable=False)
    password = Column(String(30), nullable = False)
    email = Column(String(100),unique=True,nullable=False)

class Tale(Base):
    __tablename__ = "tale"

    id_tale = Column(Integer, primary_key=True, autoincrement=True)
    tale_name = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    level_type = Column(SQLEnum(level_num), nullable=False)
    lessons = relationship("Lesson",back_populates="tale")

class Lesson(Base):

    __tablename__ = "lessons"

    id_lesson = Column(Integer,primary_key=True,autoincrement=True)
    title = Column(String(50),nullable=False)

    id_tale = Column(Integer,ForeignKey("tale.id_tale"))

    tale = relationship("Tale",back_populates="lessons")

