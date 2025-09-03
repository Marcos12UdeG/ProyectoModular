"use client"
import { useState,useEffect } from "react";
export default function Home() {
    
  const [saludo,SetSaludo] = useState("")

    const ObtenerSaludo = async () =>{
      const res = await fetch("http://localhost:8000/saludo")
      const data = await res.json()
      SetSaludo(data.saludo);
      console.log(data);
    }

    useEffect(() => {
      ObtenerSaludo();
    },[]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Título */}
        <div>{saludo ? saludo : "Cargando"}</div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h1>

        {/* Formulario */}
        <form className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              placeholder="ejemplo@correo.com"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              placeholder="********"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Ingresar
          </button>
        </form>

        {/* Enlaces extras */}
        <p className="text-sm text-gray-500 text-center mt-6">
          ¿No tienes cuenta?{" "}
          <a href="/registro" className="text-indigo-600 hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}
