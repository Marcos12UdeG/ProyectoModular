import React from "react";
import { BookOpen, Users, BookMarked } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PrincipalPage() {
  const sections = [
    {
      title: "Historias",
      text: "Fascinantes relatos para practicar tu inglés. (Desde la lección 5)",
      icon: <BookMarked className="h-10 w-10 mb-4" />,
      link: "/cuentos",
    },
    {
      title: "Lecciones",
      text: "Aprende paso a paso con lecciones cortas e interactivas.",
      icon: <BookOpen className="h-10 w-10 mb-4" />,
      link: "/lecciones",
    },
    {
      title: "Grupos",
      text: "Conéctate con estudiantes y comparte tu progreso.",
      icon: <Users className="h-10 w-10 mb-4" />,
      link: "/grupos",
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FDE2D3] to-[#F8CBA6] px-4">
      <div className="w-full max-w-7xl h-[65vh] lg:h-[75vh] bg-white rounded-3xl shadow-2xl p-8 md:p-16 flex flex-col items-center justify-center gap-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-center md:justify-start mb-6 gap-4">
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden shadow-md border-2 border-[#FDE2D3]">
            <Image
              src="/images/logo.jpg"
              alt="Storyteller Logo"
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#8B3E2F] tracking-wide text-center md:text-left">
            STORYTELLER
          </h1>
        </header>

        {/* Contenido central */}
        <section className="text-center md:text-left flex flex-col items-center md:items-start gap-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#8B3E2F]">
            Aprende inglés de forma divertida
          </h2>
          <p className="text-[#8B3E2F] text-base md:text-lg">
            Historias, lecciones y grupos diseñados para ti.
          </p>
        </section>

        {/* Tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-6">
          {sections.map((section, index) => (
            <Link key={index} href={section.link} passHref>
              <div className="cursor-pointer bg-[#FDE2D3] text-[#8B3E2F] p-6 md:p-8 rounded-xl shadow-md flex flex-col items-center justify-center hover:scale-105 transition">
                {section.icon}
                <h3 className="text-lg md:text-xl font-semibold mb-2 uppercase">{section.title}</h3>
                <p className="text-sm md:text-base leading-snug text-center">{section.text}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Estadísticas */}
        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm md:text-base text-[#8B3E2F] font-medium mt-6">
          <span>✔️ 50+ Lecciones</span>
          <span>📖 15 Historias</span>
          <span>👥 200 Estudiantes</span>
        </div>

        {/* Call To Action */}
        <button className="mt-6 px-8 md:px-10 py-3 md:py-4 bg-[#8B3E2F] text-white rounded-xl text-lg md:text-xl shadow hover:bg-[#A44C3B] transition font-semibold">
          Empezar ahora 🚀
        </button>
      </div>
    </div>
  );
}
