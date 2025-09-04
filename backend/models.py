from pydantic import EmailStr
from sqlalchemy import Column, Integer, String
from backend.database import Base

class Usuario(Base):
    __tablename__ = "user"
    id_user = Column(Integer, primary_key=True,autoincrement=True)
    name = Column(String,nullable=False)
    password = Column(String, nullable = False)
    email = Column(String,unique=True,nullable=False)

