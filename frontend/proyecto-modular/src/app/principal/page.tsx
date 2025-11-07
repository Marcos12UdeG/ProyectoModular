"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookMarked,
  FileText,
  Zap,
  Award,
  User,
  ChevronRight,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import ReactSpeedometer from "react-d3-speedometer";
import UserMenu from "../usermenu/menu";

interface Prediccion {
  id_user: number;
  mensaje?: string;
  nivel_actual: string;
  nivel_predicho: string;
}

// --------- Diseño: Compacto, moderno y con microinteracciones ---------
// Recomendación: tener instaladas las dependencias:
// npm i react-d3-speedometer framer-motion lucide-react
// ---------------------------------------------------------------------

const LandingCompact = () => {
  const { user } = useUser();
  const [welcomeMessage, setWelcomeMessage] = useState("Cargando...");
  const [prediccion, setPrediccion] = useState<Prediccion | null>(null);
  const [loading, setLoading] = useState(false);
  const [progreso , setProgreso] = useState("");

  // Secciones actualizadas (sin "Lessons")
  const sections = [
    {
      title: "Stories",
      text: "Historias para practicar inglés de forma natural y entretenida.",
      icon: BookMarked,
      link: "/cuentos",
      tag: "Lectura",
    },
    {
      title: "Tips",
      text: "Trucos rápidos para mejorar vocabulario y pronunciación.",
      icon: FileText,
      link: "/tips",
      tag: "Consejos",
    },
    {
      title: "Ranking",
      text: "Compite con otros estudiantes y sube en la tabla de clasificación.",
      icon: Award,
      link: "/ranking",
      tag: "Competir",
    },
  ];

  // Fetch predicción (igual que antes)
  useEffect(() => {
    if (!user?.id_user) {
      setWelcomeMessage("Bienvenido — inicia sesión para ver tu progreso");
      return;
    }
	
    const FetchProgreso = async () => {
    try{
	const res = await fetch(`https://storytellermodular.lat/api/completados/${user?.id_user}`);
	if (!res.ok) throw new Error ("Error al obtener el progreso");
	const data = await res.json();
	setProgreso(data.total_completados);
    }catch(error){
      console.error("Error al obtener cuentos leidos", error);
    }

    }
    setLoading(true);
    const fetchUserPrediction = async () => {
      try {
        const res = await fetch(`https://storytellermodular.lat/api/predict/${user.id_user}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (data.error) {
          setWelcomeMessage(`Bienvenido, ${user.name}. ${data.error}`);
        } else {
          setPrediccion(data);
          setWelcomeMessage(`Bienvenido, ${user.name}`);
        }
      } catch (err) {
        console.error("Error fetching prediction:", err);
        setWelcomeMessage("Bienvenido. No se pudo obtener tu nivel.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPrediction();
  }, [user?.id_user, user?.name]);

  // Convierte nivel a valor para el velocímetro
  const nivelToValue = (nivel?: string) => {
    const mapa: Record<string, number> = { A1: 18, A2: 36, B1: 56, B2: 76, C1: 96 };
    return nivel ? mapa[nivel] || 0 : 0;
  };

  // Stats mock (puedes reemplazar por datos reales)
  const stats = {
    storiesRead: progreso, // podrías cargarlo desde el backend
    points: 0
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fffaf5] to-[#f3e6d9] text-[#3b2a25]">
      {/* CONTENT: compact grid */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Welcome + small insights */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl p-6 bg-white/70 backdrop-blur-md border border-white/30 shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                    {welcomeMessage}
                  </h2>
                  <p className="text-sm md:text-base text-[#5a3f36] mt-2">
                    {prediccion
                      ? `Nivel actual: ${prediccion.nivel_actual} · Próximo objetivo: ${prediccion.nivel_predicho}`
                      : "Accede a tu progreso personalizado para ver metas y recomendaciones."}
                  </p>
                </div>

                {/* Quick stats compact */}
                <div className="flex gap-3 items-center">
                  <div className="px-3 py-2 rounded-lg bg-[#fff6ec] border border-[#f0decd] text-center">
                    <div className="text-sm text-[#5D4037]">Historias</div>
                    <div className="font-semibold text-lg">{stats.storiesRead}</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-[#fff6ec] border border-[#f0decd] text-center">
                    <div className="text-sm text-[#5D4037]">Puntos</div>
                    <div className="font-semibold text-lg">{stats.points}</div>
                  </div>
                </div>
              </div>

              {/* Horizontal separator */}
              <div className="my-4 border-t border-[#eee7e1]" />

              {/* Small tips / CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/cuentos" className="flex-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="w-full py-3 rounded-lg bg-[#6D4C41] text-white font-semibold shadow-sm"
                  >
                    Leer historias ahora
                  </motion.button>
                </Link>

                <Link href="/tips" className="flex-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="w-full py-3 rounded-lg bg-white border border-[#e6d9cf] font-semibold"
                  >
                    Ver tips rápidos
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Grid de tarjetas compactas */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sections.map((sec, i) => {
                // compact card
                const Icon = sec.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * i }}
                  >
                    <Link href={sec.link}>
                      <div className="group bg-white/85 hover:scale-[1.02] transition-transform rounded-lg p-4 border border-white/30 shadow-sm flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-[#6D4C41]/10 grid place-items-center text-[#6D4C41]">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-[#3b2a25]">{sec.title}</h3>
                            <span className="text-xs bg-[#f3e6d9] px-2 py-1 rounded-full">{sec.tag}</span>
                          </div>
                          <p className="text-sm mt-1 text-[#5a3f36] opacity-90 leading-tight">
                            {sec.text}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: Card con velocímetro y detalles (compacto) */}
          <aside className="lg:col-span-5 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl p-5 bg-white/80 backdrop-blur-md border border-white/30 shadow-lg sticky top-6"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-[#6D4C41] grid place-items-center text-white">
                    <BookMarked className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-[#5D4037]">Progreso estimado</div>
                    <div className="font-semibold text-lg">{prediccion ? prediccion.nivel_actual : "—"}</div>
                  </div>
                </div>

                <div className="text-right text-xs text-[#5a3f36]">
                  <div>Meta: {prediccion ? prediccion.nivel_predicho : "—"}</div>
                  <div className="opacity-80">Última evaluación: {prediccion ? "reciente" : "—"}</div>
                </div>
              </div>

              {/* Velocímetro compacto */}
              <div className="flex justify-center">
                <ReactSpeedometer
                  maxValue={100}
                  value={nivelToValue(prediccion?.nivel_predicho)}
                  segments={5}
                  ringWidth={22}
                  needleColor="#6D4C41"
                  startColor="#C8E6C9"
                  endColor="#FF8A65"
                  width={280}
                  height={170}
                  textColor="#3b2a25"
                  customSegmentLabels={[
                    { text: "A1", color: "#333", fontSize: "10px" },
                    { text: "A2", color: "#333", fontSize: "10px" },
                    { text: "B1", color: "#333", fontSize: "10px" },
                    { text: "B2", color: "#333", fontSize: "10px" },
                    { text: "C1", color: "#333", fontSize: "10px" },
                  ]}
                />
              </div>

              {/* CTA pequeño y nota */}
              <div className="mt-4 text-center">
                <Link href="/cuentos">
                  <motion.button whileHover={{ scale: 1.03 }} className="py-2 px-4 rounded-lg bg-[#6D4C41] text-white font-medium shadow-sm">
                    Seguir practicando
                  </motion.button>
                </Link>
                <p className="text-xs text-[#5a3f36] mt-3 opacity-90">
                  Sugerencia: lee 1 historia diaria para mejorar comprensión y vocabulario.
                </p>
              </div>
            </motion.div>

            {/* Pequeña tarjeta de logros */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.06 }}
              className="mt-4 p-4 rounded-xl bg-white/70 border border-white/30 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-[#fff6ec] grid place-items-center">
                    <Award className="h-5 w-5 text-[#b77b4b]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Insignias</div>
                    <div className="text-xs text-[#6d4c41] opacity-90">Has ganado 2 insignias</div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#6D4C41]">{stats.points} pts</div>
              </div>
            </motion.div>
          </aside>
        </div>
      </main>

      {/* Footer compacto */}
      <footer className="py-4 border-t border-[#efe1d8] text-center text-sm text-[#6d4c41]">
          <div className="mt-2 opacity-80">© {new Date().getFullYear()} Storyteller</div>
      </footer>
     <UserMenu />
    </div>
  );
};

export default LandingCompact;

