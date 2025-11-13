FROM python:3.11-slim

# 1. Establecer el directorio raíz del contenedor
# Nota: Cambiamos a /app
WORKDIR /app

# 2. Instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 3. Copiar el contenido de la carpeta 'backend' del host 
# (que es tu context: ./ProyectoModular/backend)
# y crear la carpeta 'backend' dentro de /app.
# El resultado será: /app/backend/main.py
COPY . backend 

EXPOSE 8000

# CMD ya es correcto para la nueva estructura /app/backend/main.py
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
