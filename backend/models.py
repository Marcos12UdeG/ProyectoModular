from pydantic import EmailStr
from sqlalchemy import Column, Integer, String
from backend.database import Base

class Usuario(Base):
    __tablename__ = "user"

    id_user = Column(Integer, primary_key=True,autoincrement=True)
    name = Column(String(50),nullable=False)
    password = Column(String(30), nullable = False)
    email = Column(String(100),unique=True,nullable=False)

