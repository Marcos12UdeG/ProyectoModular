"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Headphones, MessageCircle, Clock, Film, Globe } from "lucide-react";
import UserMenu from "../usermenu/menu";

const tips = [
  {
    icon: <BookOpen className="w-7 h-7 text-[#6D4C41]" />,
    title: "Lee en inglés todos los días 📚",
    description:
      "Empieza con historias cortas o artículos sencillos. Leer mejora tu vocabulario y comprensión de forma natural.",
  },
  {
    icon: <Headphones className="w-7 h-7 text-[#6D4C41]" />,
    title: "Escucha y repite 🎧",
    description:
      "Practica con podcasts o canciones. Escuchar diferentes acentos te ayuda a mejorar tu pronunciación.",
  },
  {
    icon: <MessageCircle className="w-7 h-7 text-[#6D4C41]" />,
    title: "Habla sin miedo 💬",
    description:
      "Conversar, aunque cometas errores, es la mejor forma de ganar confianza. Usa apps o busca compañeros para practicar.",
  },
  {
    icon: <Film className="w-7 h-7 text-[#6D4C41]" />,
    title: "Mira series o películas con subtítulos 🎬",
    description:
      "Aprende expresiones reales del día a día. Intenta ver sin subtítulos conforme mejores.",
  },
  {
    icon: <Clock className="w-7 h-7 text-[#6D4C41]" />,
    title: "Sé constante ⏰",
    description:
      "Dedica al menos 15 minutos diarios. La práctica constante vale más que largas sesiones ocasionales.",
  },
  {
    icon: <Globe className="w-7 h-7 text-[#6D4C41]" />,
    title: "Cambia el idioma de tus dispositivos 🌍",
    description:
      "Configura tu celular o redes sociales en inglés. Así lo practicas sin darte cuenta en tu rutina diaria.",
  },
];

export default function TipsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fffaf5] to-[#f3e6d9] text-[#3b2a25]">
      {/* HEADER */}
      <header className="py-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl md:text-4xl font-extrabold text-[#5D4037]"
        >
          💡 Tips para Aprender Inglés
        </motion.h1>
        <p className="text-sm text-[#5a3f36] mt-2">
          Mejora tu inglés con pequeños hábitos diarios
        </p>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col items-center px-4 pb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl"
        >
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/70 backdrop-blur-md rounded-2xl shadow-md border border-white/40 p-6 flex flex-col items-start hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="mb-3">{tip.icon}</div>
              <h3 className="font-semibold text-lg text-[#5D4037] mb-2">
                {tip.title}
              </h3>
              <p className="text-sm text-[#4e3a32]">{tip.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* FOOTER */}
      <footer className="py-4 border-t border-[#efe1d8] text-center text-sm text-[#6d4c41]">
        <div className="opacity-80">
          © {new Date().getFullYear()} Storyteller
        </div>
      </footer>

      <UserMenu />
    </div>
  );
}
