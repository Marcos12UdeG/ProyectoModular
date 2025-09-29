# predictive_model.py
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

# ---------------- Funciones ----------------
def load_data(csv_path="user_responses.csv"):
    df = pd.read_csv(csv_path)
    df['is_correct'] = df['is_correct'].astype(int)
    return df

def generate_features(df_user):
    features = df_user.pivot_table(
        index='id_user',
        columns='excercise_type',
        values='is_correct',
        aggfunc='mean'
    ).fillna(0)
    return features

def predict_level(model, df_user):
    X = generate_features(df_user)
    return model.predict(X)

# ---------------- Entrenamiento y guardado ----------------
if __name__ == "__main__":
    df = load_data()
    X = generate_features(df)
    
    # Supongamos que ya tienes la columna 'cuento_level' como target
    y = df.groupby('id_user')['cuento_level'].first()

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Guardar modelo entrenado
    joblib.dump(model, "user_level_model.pkl")
    print("✅ Modelo entrenado y guardado en user_level_model.pkl")

    # ---------------- Mostrar predicciones ----------------
    # Cargar el modelo desde .pkl
    loaded_model = joblib.load("user_level_model.pkl")
    
    # Predecir nivel de todos los usuarios del CSV
    predicted_levels = predict_level(loaded_model, df)
    
    # Combinar predicciones con los usuarios
    user_ids = df['id_user'].unique()
    results = pd.DataFrame({
        "id_user": user_ids,
        "predicted_level": predicted_levels
    })
    
    print("🔹 Predicciones de nivel de usuarios:")
    print(results)
