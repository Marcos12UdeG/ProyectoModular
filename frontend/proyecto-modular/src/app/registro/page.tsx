"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistroPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const Registro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMensaje("❌ Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        setMensaje(`❌ ${err.detail}`);
        return;
      }

      const data = await res.json();
      setMensaje(`✅ Usuario ${data.name} creado correctamente`);

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      console.error("Error al conectar al servidor", error);
      setMensaje("❌ Error al conectar al servidor");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FDE2D3] to-[#F8CBA6]">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/images/logo.jpg" // 🔹 Coloca tu logo aquí (en public/logo.png)
            alt="Logo"
            className="w-16 h-16 rounded-full border-2 border-[#8B3E2F] shadow-md"
          />
        </div>

        <h1 className="text-2xl font-extrabold text-[#8B3E2F] text-center mb-3">
          Crear Cuenta
        </h1>
        <p className="text-center text-[#8B3E2F] mb-6 text-sm">
          Regístrate en <span className="font-semibold">STORYTELLER</span>
        </p>

        <form onSubmit={Registro} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-[#8B3E2F]">
              Nombre completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#8B3E2F] outline-none transition text-sm"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-[#8B3E2F]">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#8B3E2F] outline-none transition text-sm"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-[#8B3E2F]">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#8B3E2F] outline-none transition text-sm"
              required
            />
          </div>

          {/* Confirmar Password */}
          <div>
            <label className="block text-xs font-semibold text-[#8B3E2F]">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#8B3E2F] outline-none transition text-sm"
              required
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-[#8B3E2F] text-white py-2 rounded-lg hover:bg-[#A44C3B] transition font-semibold text-sm shadow-md"
          >
            Registrarse
          </button>
        </form>

        {mensaje && (
          <p className="mt-4 text-center text-xs font-semibold text-[#A44C3B]">
            {mensaje}
          </p>
        )}

        <p className="text-xs text-[#8B3E2F] text-center mt-6">
          ¿Ya tienes cuenta?{" "}
          <span
            onClick={() => router.push("/")}
            className="text-[#A44C3B] hover:underline cursor-pointer font-medium transition"
          >
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
}
