from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

url = "mysql+pymysql://2UxnEdDWpCtV2b6.root:zoJ19BQooVV2IR3z@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/storyteller?ssl_ca=<CA_PATH>&ssl_verify_cert=true&ssl_verify_identity=true"

engine = create_engine(url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


try:
    db = SessionLocal()
    print("✅ Conexión exitosa a la base de datos")
except Exception as e:
    print("❌ Error de conexión:", e)
finally:
    db.close()
