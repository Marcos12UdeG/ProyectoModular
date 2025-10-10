import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import joblib

# ======================================
# CARGAR DATASET
# ======================================
df = pd.read_csv("dataset_usuarios.csv")
print("Datos cargados:", df.shape)

# ======================================
# LIMPIEZA DE DATOS
# ======================================
df = df.fillna(0)

# Convertir etiquetas (niveles A1–C2) a valores numéricos
label_encoder = LabelEncoder()
df["nivel_encoded"] = label_encoder.fit_transform(df["nivel_actual"])

# ======================================
# DEFINICIÓN DE VARIABLES
# ======================================
X = df[[
    "total_quizzes",
    "total_respuestas",
    "promedio_aciertos",
    "total_sesiones",
    "tiempo_promedio_sesion",
    "semanas_activas",
    "tasa_mejora"
]]
y = df["nivel_encoded"]

# Escalado de variables
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ======================================
# DIVISIÓN DE DATOS
# ======================================
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# ======================================
# ENTRENAMIENTO DEL MODELO
# ======================================
model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

# ======================================
# EVALUACIÓN
# ======================================
y_pred = model.predict(X_test)
print("\n=== MATRIZ DE CONFUSIÓN ===")
print(confusion_matrix(y_test, y_pred))
print("\n=== REPORTE DE CLASIFICACIÓN ===")
print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))

# ======================================
# GUARDAR MODELO, ESCALADOR Y LABEL ENCODER
# ======================================
joblib.dump(model, "ml/modelo_prediccion_nivel.pkl")
joblib.dump(scaler, "ml/scaler.pkl")
joblib.dump(label_encoder, "ml/label_encoder.pkl")

print("✅ Modelo entrenado y guardado correctamente.")

# Función para predicción
def predict_user_progress(id_user: int, df=df, model=model, scaler=scaler, label_encoder=label_encoder):
    user = df[df["id_user"] == id_user]
    if user.empty:
        return {"error": "Usuario no encontrado o sin datos suficientes"}

    X_user = user[[
        "total_quizzes",
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
