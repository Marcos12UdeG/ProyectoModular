"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, BookMarked } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import UserMenu from "../usermenu/menu";
import { useUser } from "../context/UserContext";

const Index = () => {
  const { user } = useUser();
  const [welcomeMessage, setWelcomeMessage] = useState("Cargando...");
  const [prediccion, setPrediccion] = useState<any>(null);

  const sections = [
    {
      title: "Stories",
      text: "Fascinating tales to practice your English. Improve while having fun!",
      icon: BookMarked,
      link: "/cuentos",
    },
    {
      title: "Lessons",
      text: "Learn step by step with short, interactive lessons.",
      icon: BookOpen,
      link: "/ejercicios", // link base, añadiremos ID dinámico
    },
  ];

  // ===============================
  // Fetch predicción del usuario
  // ===============================
  useEffect(() => {
    if (!user?.id_user) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/predict/${user.id_user}`);
        const data = await res.json();

        if (data.error) {
          setWelcomeMessage("Bienvenido. Nivel no asignado");
        } else {
          setPrediccion(data);
          setWelcomeMessage(`Bienvenido, ${user.name}. Tu nivel actual es ${data.nivel_actual}`);
        }
      } catch (error) {
        console.error("Error al obtener predicción:", error);
        setWelcomeMessage("Bienvenido. Nivel no asignado");
      }
    };

    fetchUserData();
  }, [user?.id_user]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-white px-4">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-center gap-4 mt-10 mb-12">
        <div className="h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden shadow-lg border-4 border-[#6D4C41]">
          <Image
            src="/images/logo.jpg"
            alt="Storyteller Logo"
            width={100}
            height={100}
            className="object-cover"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#3E2723] tracking-wide text-center md:text-left">
          STORYTELLER
        </h1>
      </header>

      {/* Mensaje de bienvenida */}
      <p className="text-lg mb-6 font-bold text-[#6D4C41]">{welcomeMessage}</p>

      {/* Predicción */}
      {prediccion && (
        <div className="p-6 bg-pink-50 rounded-2xl shadow-md mb-8 w-full max-w-3xl">
          <h2 className="text-xl font-bold text-pink-700">✨ Predicción de Progreso ✨</h2>
          {prediccion.mensaje && <p className="mt-2 text-gray-700">{prediccion.mensaje}</p>}
          <p className="text-sm mt-1">
            Nivel actual: <b>{prediccion.nivel_actual}</b>
          </p>
          <p className="text-sm">
            Nivel estimado: <b>{prediccion.nivel_predicho}</b>
          </p>
        </div>
      )}

      {/* Secciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl mb-12">
        {sections.map((section, index) => {
          // Link dinámico para Lessons
          const href =
            section.title === "Lessons"
              ? `/ejercicios/${prediccion?.nivel_actual || "1"}`
              : section.link;

          return (
            <Link key={index} href={href}>
              <div className="cursor-pointer bg-[#6D4C41] text-white p-8 rounded-3xl shadow-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:scale-105 transition-all flex flex-col items-center text-center">
                <section.icon className="h-8 w-8 mb-2" />
                <h3 className="text-xl font-bold mb-2 uppercase">{section.title}</h3>
                <p className="text-sm md:text-base leading-snug">{section.text}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Estadísticas y menú */}
      <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base text-[#3E2723] font-medium mt-4 mb-12">
        <span>✔️ 50+ Lecciones</span>
        <span>📖 15 Historias</span>
        <span>👥 200 Estudiantes</span>
        <UserMenu />
      </div>
    </div>
  );
};

export default Index;
