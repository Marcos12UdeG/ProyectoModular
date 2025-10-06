"use client";
import React, { useState, useEffect } from "react";
import { BookOpen, Users, BookMarked } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import UserMenu from "../usermenu/menu";
import { useUser } from "../context/UserContext";

export default function PrincipalPage() {
  const sections = [
    {
      title: "Historias",
      text: "Fascinantes relatos para practicar tu inglés. (Desde la lección 5)",
      icon: <BookMarked className="h-10 w-10 mb-4 text-white" />,
      link: "/cuentos",
    },
    {
      title: "Lecciones",
      text: "Aprende paso a paso con lecciones cortas e interactivas.",
      icon: <BookOpen className="h-10 w-10 mb-4 text-white" />,
      link: "/lecciones",
    },
    {
      title: "Grupos",
      text: "Conéctate con estudiantes y comparte tu progreso.",
      icon: <Users className="h-10 w-10 mb-4 text-white" />,
      link: "/grupos",
    },
  ];

  const { user } = useUser();
  const [welcomeMessage, setWelcomeMessage] = useState("Cargando...");

  useEffect(() => {
    const ObtenerLevel = async () => {
      try {
        const res = await fetch(`http://localhost:8000/user/${user?.id_user}/level`);
        if (!res.ok) throw new Error("Usuario no encontrado");
        const data = await res.json();
        console.log("Datos del usuario:", data);

        // Formatear mensaje de bienvenida
        setWelcomeMessage(`Bienvenido, ${data.Usuario}. Tu nivel es ${data.Nivel}`);
      } catch (error) {
        console.error("Error al obtener nivel:", error);
        setWelcomeMessage("Bienvenido. Nivel no asignado");
      }
    };

    if (user?.id_user) {
      ObtenerLevel();
    }
  }, [user?.id_user]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-white px-4">
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

      <section className="text-center max-w-2xl mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#4E342E] mb-3">
          Aprende inglés de forma divertida
        </h2>
        <p className="text-[#3E2723] text-base md:text-lg">
          Historias, lecciones y grupos diseñados para ti.
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-6xl">
        {sections.map((section, index) => (
          <Link key={index} href={section.link} passHref>
            <div className="cursor-pointer bg-[#6D4C41] text-white p-8 rounded-3xl shadow-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:scale-105 transition-all flex flex-col items-center text-center">
              {section.icon}
              <h3 className="text-xl font-bold mb-2 uppercase">{section.title}</h3>
              <p className="text-sm md:text-base leading-snug">{section.text}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base text-[#3E2723] font-medium mt-12">
        <span>✔️ 50+ Lecciones</span>
        <span>📖 15 Historias</span>
        <span>👥 200 Estudiantes</span>
        <UserMenu />
      </div>
    </div>
  );
}
