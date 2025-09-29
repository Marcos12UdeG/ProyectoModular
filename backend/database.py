from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
import pandas as pd
url = "mysql+pymysql://3mhVJkucZsQgfTq.root:80LGu3gelv2dLyyh@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/storyteller?ssl_ca=<CA_PATH>&ssl_verify_cert=true&ssl_verify_identity=true"

engine = create_engine(url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


query = """
SELECT 
    u.id_user,
    u.name AS user_name,
    e.id_excercise,
    e.excercise_name,
    e.excercise_type,
    a.id_answer,
    a.answer_text,
    a.is_correct,
    l.id_lesson,
    l.title AS lesson_title,
    c.id_tale,
    c.level_type AS cuento_level
FROM user_answer au
INNER JOIN user u ON u.id_user = au.id_user
INNER JOIN excercises e ON e.id_excercise = au.id_excercise
INNER JOIN answer a ON a.id_answer = au.id_answer
INNER JOIN lessons l ON e.id_lesson = l.id_lesson
INNER JOIN tale c ON l.id_tale = c.id_tale;
"""

df = pd.read_sql(query, engine)
df.to_csv("user_responses.csv", index=False)
print("Datos guardados correctamente")

