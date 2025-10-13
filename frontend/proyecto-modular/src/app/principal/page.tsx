"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, BookMarked } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import UserMenu from "../usermenu/menu";
import { useUser } from "../context/UserContext";
import ReactSpeedometer from "react-d3-speedometer";

interface Prediccion {
  mensaje: string;
  nivel_actual: string;
  nivel_predicho: string; // nivel asignado por quiz
}

const Index = () => {
  const { user } = useUser();
  const [welcomeMessage, setWelcomeMessage] = useState("Cargando...");
  const [prediccion, setPrediccion] = useState<Prediccion | null>(null);

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
      link: "/ejercicios",
    },
  ];

  // Fetch predicción del usuario
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
          setWelcomeMessage(
            `Bienvenido, ${user.name}. Tu nivel actual es ${data.nivel_actual}`
          );
        }
      } catch (error) {
        console.error("Error al obtener predicción:", error);
        setWelcomeMessage("Bienvenido. Nivel no asignado");
      }
    };

    fetchUserData();
  }, [user?.id_user]);

  // Convertir nivel a valor numérico (0-100)
  const nivelToValue = (nivel: string) => {
    const mapa: Record<string, number> = {
      A1: 20,
      A2: 40,
      B1: 60,
      B2: 80,
      C1: 100,
    };
    return mapa[nivel] || 0;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-white px-4">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-center gap-4 mt-10 mb-8">
        <div className="h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden border-4 border-[#6D4C41]">
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

      {/* Bienvenida */}
      <div className="text-center mb-12">
        <p className="text-2xl md:text-3xl font-semibold text-[#5D4037]">{welcomeMessage}</p>
      </div>

      {/* Velocímetro */}
      {prediccion && (
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5D4037] mb-6">Progreso</h2>
          <ReactSpeedometer
            maxValue={100}
            value={nivelToValue(prediccion.nivel_predicho)}
            segments={5}
            startColor="#8BFF5A"
            endColor="#FF4D4D"
            segmentColors={["#8BFF5A", "#D4FF00", "#FFD700", "#FF7F50", "#FF4D4D"]}
            needleColor="#6D4C41"
            ringWidth={30}
            width={350}
            height={200}
            textColor="#3E2723"
            customSegmentLabels={[
              { text: "A1", color: "#333", fontSize: "12px" },
              { text: "A2", color: "#333", fontSize: "12px" },
              { text: "B1", color: "#333", fontSize: "12px" },
              { text: "B2", color: "#333", fontSize: "12px" },
              { text: "C1", color: "#333", fontSize: "12px" },
            ]}
          />
          <p className="text-sm md:text-base mt-4 text-[#5D4037]">
            Nivel asignado por quiz: <b>{prediccion.nivel_predicho}</b>
          </p>
        </div>
      )}

      {/* Secciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl mb-16">
        {sections.map((section, index) => {
          const href =
            section.title === "Lessons"
              ? `/ejercicios/${prediccion?.nivel_actual || "1"}`
              : section.link;

          return (
            <Link key={index} href={href}>
              <div className="cursor-pointer bg-[#6D4C41] text-white p-8 rounded-3xl shadow-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:scale-105 transition-all flex flex-col items-center text-center">
                <section.icon className="h-10 w-10 mb-3" />
                <h3 className="text-xl md:text-2xl font-bold mb-2 uppercase">{section.title}</h3>
                <p className="text-sm md:text-base leading-snug">{section.text}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Estadísticas y menú */}
      <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base text-[#3E2723] font-medium mb-12">
        <span>✔️ 50+ Lecciones</span>
        <span>📖 15 Historias</span>
        <span>👥 200 Estudiantes</span>
        <UserMenu />
      </div>
    </div>
  );
};

export default Index;
