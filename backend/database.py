import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
import pandas as pd

# URL de conexión
url = "mysql+pymysql://3mhVJkucZsQgfTq.root:80LGu3gelv2dLyyh@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/storyteller?ssl_ca=<CA_PATH>&ssl_verify_cert=true&ssl_verify_identity=true"

# Motor y sesión
engine = create_engine(url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Query para generar dataset
query = """
SELECT 
    u.id_user,
    u.assigned_level AS nivel_actual,
    COUNT(DISTINCT uq.id_quiz) AS total_quizzes,
    COUNT(uq.id_answer_quiz) AS total_respuestas,
    SUM(aq.is_correct) / COUNT(aq.id_answer_quiz) AS promedio_aciertos,
    COUNT(DISTINCT ush.id_session) AS total_sesiones,
    AVG(ush.duration_seconds) AS tiempo_promedio_sesion,
    DATEDIFF(NOW(), MIN(ush.login_at)) / 7 AS semanas_activas,
    (SUM(aq.is_correct) / COUNT(aq.id_answer_quiz)) / (DATEDIFF(NOW(), MIN(ush.login_at)) / 7) AS tasa_mejora
FROM user u
LEFT JOIN user_answer_quiz uq ON u.id_user = uq.id_user
LEFT JOIN answer_quiz aq ON uq.id_answer_quiz = aq.id_answer_quiz
LEFT JOIN user_session_history ush ON u.id_user = ush.id_user
WHERE u.assigned_level IS NOT NULL
GROUP BY u.id_user, u.assigned_level;
"""

# Ejecutar query y guardar CSV
df = pd.read_sql(query, engine)
df = df.fillna(0)
df.to_csv("dataset_usuarios.csv", index=False)
print("✅ CSV generado correctamente: dataset_usuarios.csv")
