"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Medal, User } from "lucide-react";
import { useUser } from "../context/UserContext";
import UserMenu from "../usermenu/menu";

interface RankingItem {
  id_user: number;
  nombre: string;
  puntos: number;
}

export default function RankingPage() {
  const { user } = useUser();
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await fetch("https://storytellermodular.lat/api/ranking");
        if (!res.ok) throw new Error("Error al obtener ranking");
        const data = await res.json();
        setRanking(data);
      } catch (error) {
        console.error("Error al obtener ranking:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

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
          Tabla de Clasificación
        </motion.h1>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center px-4 pb-12">
        {loading ? (
          <div className="text-[#5a3f36] mt-10">Cargando ranking...</div>
        ) : ranking.length === 0 ? (
          <div className="text-[#5a3f36] mt-10">
            No hay datos disponibles todavía
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-3xl bg-white/70 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg overflow-hidden"
          >
            <div className="bg-[#6D4C41] text-white py-3 px-6 font-semibold text-lg flex items-center gap-2">
              <Award className="w-5 h-5" />
              Ranking General
            </div>

            <div className="divide-y divide-[#e8d9ce]/70">
              {ranking.map((r, i) => (
                <motion.div
                  key={r.id_user}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex justify-between items-center px-6 py-4 ${
                    user?.id_user === r.id_user
                      ? "bg-[#fff6ec] font-semibold"
                      : "bg-white/60"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-xl font-bold text-[#6D4C41] w-6 text-right">
                      {i + 1}
                    </div>

                    <div
                      className={`w-9 h-9 rounded-full grid place-items-center ${
                        i === 0
                          ? "bg-yellow-400 text-white"
                          : i === 1
                          ? "bg-gray-300 text-white"
                          : i === 2
                          ? "bg-amber-700 text-white"
                          : "bg-[#f3e6d9] text-[#6D4C41]"
                      }`}
                    >
                      {i < 3 ? (
                        <Medal className="w-5 h-5" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[#3b2a25]">{r.nombre}</span>
                      {user?.id_user === r.id_user && (
                        <span className="text-xs text-[#8d6e63]">
                          (Tú)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-[#5D4037] font-medium text-lg">
                    {r.puntos} pts
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
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
