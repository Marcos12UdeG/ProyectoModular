import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.model_trainer import train_model
from backend.servicios import router
from backend.database import Base, engine, get_user_data
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear tablas
Base.metadata.create_all(bind=engine)

# Incluir routers
app.include_router(router)

@app.on_event("startup")
def startup_event():
    """Entrena el modelo y sobrescribe los .pkl"""
    print("🧠 Entrenando modelo y sobrescribiendo archivos .pkl...")
    df = get_user_data()
    if not df.empty:
        train_model(df)
    else:
        print("⚠️ No hay datos suficientes para entrenar el modelo.")
