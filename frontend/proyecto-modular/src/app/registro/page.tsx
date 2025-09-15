"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      {/* Caja central más compacta */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row items-center md:items-stretch gap-6">
        
        {/* Logo sin contorno */}
        <div className="flex justify-center items-center w-full md:w-1/2">
          <Image
            src="/images/logo.jpg"
            alt="Storyteller Logo"
            width={220}
            height={220}
            className="object-contain"
          />
        </div>

        {/* Formulario */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h1 className="text-3xl font-extrabold text-[#3E2723] mb-4 text-center md:text-left tracking-wide">
            Crear Cuenta
          </h1>

          <form className="space-y-4" onSubmit={Registro}>
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-[#4E342E]">
                Nombre completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6D4C41] outline-none transition text-sm"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#4E342E]">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6D4C41] outline-none transition text-sm"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#4E342E]">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6D4C41] outline-none transition text-sm"
                required
              />
            </div>

            {/* Confirmar Password */}
            <div>
              <label className="block text-sm font-semibold text-[#4E342E]">
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6D4C41] outline-none transition text-sm"
                required
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="w-full bg-[#6D4C41] text-white py-2 rounded-lg hover:bg-[#4E342E] transition font-semibold text-sm shadow-md"
            >
              Registrarse
            </button>
          </form>

          {mensaje && (
            <p className="mt-4 text-center text-sm font-semibold text-[#4E342E]">
              {mensaje}
            </p>
          )}

          <p className="mt-4 text-center text-sm text-[#3E2723]">
            ¿Ya tienes cuenta?{" "}
            <span
              onClick={() => router.push("/")}
              className="text-[#6D4C41] hover:underline cursor-pointer transition font-medium"
            >
              Inicia sesión
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
