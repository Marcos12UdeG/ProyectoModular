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
    u.name,
    u.assigned_level AS nivel_actual,

    COALESCE(ua_stats.total_ejercicios, 0) AS total_ejercicios,
    COALESCE(ua_stats.total_respuestas, 0) AS total_respuestas,
    COALESCE(ua_stats.promedio_aciertos, 0) AS promedio_aciertos,

    COALESCE(ush_stats.total_sesiones, 0) AS total_sesiones,
    COALESCE(ush_stats.tiempo_promedio_sesion, 0) AS tiempo_promedio_sesion,
    COALESCE(ush_stats.semanas_activas, 0) AS semanas_activas,

    CASE 
        WHEN COALESCE(ush_stats.semanas_activas, 0) > 0 
        THEN COALESCE(ua_stats.promedio_aciertos, 0) / ush_stats.semanas_activas
        ELSE 0
    END AS tasa_mejora

FROM user u
LEFT JOIN (
    SELECT 
        ua.id_user,
        COUNT(DISTINCT ua.id_excercise) AS total_ejercicios,
        COUNT(ua.id_answer_user) AS total_respuestas,
        SUM(CASE WHEN a.is_correct = 1 THEN 1 ELSE 0 END) / COUNT(ua.id_answer_user) AS promedio_aciertos
    FROM user_answer ua
    INNER JOIN answer a ON a.id_answer = ua.id_answer
    GROUP BY ua.id_user
) ua_stats ON ua_stats.id_user = u.id_user

LEFT JOIN (
    SELECT 
        ush.id_user,
        COUNT(DISTINCT ush.id_session) AS total_sesiones,
        AVG(ush.duration_seconds) AS tiempo_promedio_sesion,
        DATEDIFF(NOW(), MIN(ush.login_at)) / 7 AS semanas_activas
    FROM user_session_history ush
    GROUP BY ush.id_user
) ush_stats ON ush_stats.id_user = u.id_user

WHERE u.assigned_level IS NOT NULL;

"""

# Ejecutar query y guardar CSV
df = pd.read_sql(query, engine)
df = df.fillna(0)
df.to_csv("usuarios.csv", index=False)
print("✅ CSV generado correctamente: usuarios.csv")
