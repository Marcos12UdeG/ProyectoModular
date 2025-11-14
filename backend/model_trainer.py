import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import joblib

from backend.database import query, engine

def train_model(df):
    """Entrena y guarda el modelo usando nivel futuro como objetivo"""

    df = df.fillna(0)

    # --- Codificar nivel actual ---
    label_encoder = LabelEncoder()
    df["nivel_encoded"] = label_encoder.fit_transform(df["nivel_actual"])

    # --- Crear métrica objetivo: nivel futuro ---
    # Por ejemplo: si promedio_aciertos / semanas_activas > 0.1, sube 1 nivel
    df["nivel_siguiente_encoded"] = df["nivel_encoded"] + (df["tasa_mejora"] > 0.1).astype(int)

    # Asegurarnos que no se salga del rango
    max_level = df["nivel_encoded"].max()
    df["nivel_siguiente_encoded"] = df["nivel_siguiente_encoded"].clip(upper=max_level)

    # --- Variables predictoras ---
    X = df[[
        "total_ejercicios",
        "total_respuestas",
        "promedio_aciertos",
        "total_sesiones",
        "tiempo_promedio_sesion",
        "semanas_activas",
        "tasa_mejora"
    ]]

    y = df["nivel_siguiente_encoded"]

    # --- Escalado ---
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # --- Split ---
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42
    )

    # --- Modelo ---
    model = RandomForestClassifier(n_estimators=200, random_state=42)
    model.fit(X_train, y_train)

    # --- Evaluación ---
    y_pred = model.predict(X_test)
    print("\n=== MATRIZ DE CONFUSIÓN ===")
    print(confusion_matrix(y_test, y_pred))
    print("\n=== REPORTE DE CLASIFICACIÓN ===")
    print(
        classification_report(
            y_test,
            y_pred,
            zero_division=0
        )
    )

    # --- Guardar ---
    import os
    os.makedirs("ml", exist_ok=True)
    joblib.dump(model, "ml/modelo_prediccion_nivel.pkl")
    joblib.dump(scaler, "ml/scaler.pkl")
    joblib.dump(label_encoder, "ml/label_encoder.pkl")
    print("✅ Modelo entrenado y guardado correctamente.")


def predict_user_progress(id_user: int, df, model, scaler, label_encoder):
    """Predice el progreso de un usuario dado"""

    user = df[df["id_user"] == id_user]
    if user.empty:
        return {"error": "Usuario no encontrado o sin datos suficientes"}

    X_user = user[[
        "total_ejercicios",
        "total_respuestas",
        "promedio_aciertos",
        "total_sesiones",
        "tiempo_promedio_sesion",
        "semanas_activas",
        "tasa_mejora"
    ]]

    X_scaled = scaler.transform(X_user)
    pred_encoded = model.predict(X_scaled)[0]
    nivel_predicho = label_encoder.inverse_transform([pred_encoded])[0]
    nivel_actual = user.iloc[0]["nivel_actual"]

    return {
        "id_user": int(id_user),
        "nivel_actual": nivel_actual,
        "nivel_predicho": nivel_predicho,
        "mensaje": f"Podrías alcanzar el siguiente nivel: {nivel_predicho}."
    }
