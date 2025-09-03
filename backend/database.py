from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

url = "mysql+pymysql://root:12345678@localhost/storyteller"

engine = create_engine(url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


try:
    db = SessionLocal()
    
    db.execute(text("SELECT * FROM ejemplo"))
    print("✅ Conexión exitosa a la base de datos")
except Exception as e:
    print("❌ Error de conexión:", e)
finally:
    db.close()
