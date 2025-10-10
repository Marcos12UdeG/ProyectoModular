"use client";
<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { BookOpen, Users, BookMarked } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import UserMenu from "../usermenu/menu";
import { useUser } from "../context/UserContext";
=======

import { useRouter } from "next/navigation";
import { BookOpen, BookMarked, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const Index = () => {
  const router = useRouter();
>>>>>>> e778024 (servidor)

  const sections = [
    {
      title: "Stories",
      text: "Fascinating tales to practice your English. Improve while having fun!",
      icon: BookMarked,
      color: "bg-orange-500",
      textColor: "text-orange-600",
      link: "/cuentos",
    },
    {
      title: "Lessons",
      text: "Learn step by step with short, interactive lessons.",
      icon: BookOpen,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      link: "/ejercicios/[id_tale]",
    },
  ];

<<<<<<< HEAD
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
=======
  return (
    <div className="h-screen flex flex-col justify-between bg-gradient-to-b from-[#F5F0EB] via-[#E8DED4] to-[#D7CCC8] overflow-hidden">
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col justify-center">
        {/* Hero Section */}
        <header className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500 mb-3 shadow-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-2 tracking-tight bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
            STORYTELLER
          </h1>

          <h2 className="text-lg md:text-xl font-semibold text-[#3E2723] mb-1">
            Learn English in a Fun Way
          </h2>
          <p className="text-sm md:text-base text-[#5D4037] mb-4">
            Stories and lessons designed just for you. Start your journey today!
          </p>

          {/* CTA */}
          <Button
            size="lg"
            className="gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-full shadow-md mb-4 whitespace-nowrap"
            onClick={() => router.push("/lessons")}
          >
            Start Learning
          </Button>

          {/* Stats */}
          <div className="flex justify-center gap-6 text-xs md:text-sm text-[#4E342E] font-medium">
            <span className="flex items-center gap-1">✔ 50+ Lessons</span>
            <span className="flex items-center gap-1">📖 15 Stories</span>
            <span className="flex items-center gap-1">👥 200 Students</span>
          </div>
        </header>

        {/* Section Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
          {sections.map(({ title, text, icon: Icon, color, textColor, link }, i) => (
            <Card
              key={i}
              className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer group"
              onClick={() => router.push(link)}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div
                  className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center shadow-md group-hover:scale-105 transition`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className={`text-lg font-bold uppercase ${textColor}`}>
                  {title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-snug">
                  {text}
                </p>
                <Button variant="ghost" className="mt-1 text-sm hover:bg-gray-100">
                  Explore →
                </Button>
              </div>
            </Card>
          ))}
        </div>
>>>>>>> e778024 (servidor)
      </div>
    </div>
  );
};

export default Index;
