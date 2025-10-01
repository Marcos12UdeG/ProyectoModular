from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
import pandas as pd
url = "mysql+pymysql://3mhVJkucZsQgfTq.root:80LGu3gelv2dLyyh@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/storyteller?ssl_ca=<CA_PATH>&ssl_verify_cert=true&ssl_verify_identity=true"

engine = create_engine(url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()



