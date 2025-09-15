"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  const Login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        setMensaje(`❌ ${err.detail}`);
        return;
      }

      const data = await res.json();
      setMensaje(`✅ Bienvenido ${data.name}`);

      setTimeout(() => {
        router.push("/principal");
      }, 1000);
    } catch (error) {
      console.error("Error al conectar al servidor", error);
      setMensaje("❌ Error al conectar al servidor");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      {/* Caja central */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-10 flex flex-col md:flex-row items-center md:items-stretch gap-10">
        
        {/* Logo sin contorno */}
        <div className="flex justify-center items-center w-full md:w-1/2">
          <Image
            src="/images/logo.jpg"
            alt="Storyteller Logo"
            width={280}
            height={280}
            className="object-contain"
          />
        </div>

        {/* Formulario */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-[#3E2723] mb-6 text-center md:text-left tracking-wide">
            STORYTELLER
          </h1>

          <form className="space-y-6" onSubmit={Login}>
            <div>
              <label className="block text-sm font-semibold text-[#4E342E]">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@reallygreatsite.com"
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6D4C41] outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#4E342E]">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6D4C41] outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#6D4C41] text-white py-3 rounded-lg hover:bg-[#4E342E] transition font-semibold text-lg shadow-md"
            >
              Sign In
            </button>

            <p className="mt-6 text-center text-sm text-[#3E2723]">
              Don&apos;t have an account?{" "}
              <span
                onClick={() => router.push("/registro")}
                className="text-[#6D4C41] hover:underline cursor-pointer transition font-medium"
              >
                Sign Up
              </span>
            </p>
          </form>

          {mensaje && (
            <p className="mt-6 text-center text-sm font-semibold text-[#4E342E]">
              {mensaje}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
