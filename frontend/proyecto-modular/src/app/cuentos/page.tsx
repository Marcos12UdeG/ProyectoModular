"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Volume2, Pause, Play } from "lucide-react";

interface Tale {
  id_tale: number;
  tale_name: string;
  content: string;
  level_type: string;
}

export default function CuentosPage() {
  const [tales, setTales] = useState<Tale[]>([]);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setSynth(window.speechSynthesis);
    fetchTales();
  }, []);

  const fetchTales = async () => {
    try {
      const res = await fetch("http://localhost:8000/tales");
      const data = await res.json();
      setTales(data);
    } catch (error) {
      console.error("Error al obtener los cuentos", error);
    }
  };

  const TraducirYLeer = async (texto: string) => {
    if (!synth) return;
    synth.cancel();
    try {
      const res = await fetch("http://localhost:8000/traducir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto, destino: "en" }),
      });
      const data = await res.json();
      const utter = new SpeechSynthesisUtterance(data.traduccion);
      utter.lang = "en-US";
      utter.onend = () => {
        setIsSpeaking(false);
        utterRef.current = null;
      };
      utterRef.current = utter;
      synth.speak(utter);
      setIsSpeaking(true);
    } catch (error) {
      console.error(error);
    }
  };

  const PausarReanudar = () => {
    if (!synth || !utterRef.current) return;
    if (synth.speaking) {
      if (!synth.paused) {
        synth.pause();
        setIsSpeaking(false);
      } else {
        synth.resume();
        setIsSpeaking(true);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      {/* Título */}
      <h1 className="text-4xl font-extrabold text-[#3E2723] mt-6 mb-8 tracking-wide text-center">
        📖 CUENTOS
      </h1>

      {/* Grid de cuentos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl px-4 pb-10">
        {tales.map((tale) => {
          const imageUrl = `/images/${tale.tale_name
            .replace(/\s+/g, "_")
            .toLowerCase()}.jpg`;

          return (
            <div
              key={tale.id_tale}
              className="bg-white/95 rounded-3xl shadow-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all p-6 flex flex-col justify-between"
            >
              <img
                src={imageUrl}
                alt={tale.tale_name}
                className="w-full h-48 object-cover rounded-2xl mb-4 shadow-md"
              />

              <h2 className="text-2xl font-bold text-[#4E342E] mb-2">
                {tale.tale_name}
              </h2>

              <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {tale.content}
              </p>

              <p className="text-xs font-medium text-[#6D4C41] mb-4">
                Nivel:{" "}
                <span className="text-[#3E2723] font-semibold">
                  {tale.level_type}
                </span>
              </p>

              <div className="flex gap-3 items-center">
                <Link
                  href={`/cuentos/${tale.id_tale}/lecciones?page=1`}
                  className="flex-1 bg-[#6D4C41] text-white py-2 rounded-xl hover:bg-[#4E342E] transition text-center font-semibold shadow-md"
                >
                  Ver lecciones
                </Link>

                <button
                  onClick={() => TraducirYLeer(tale.content)}
                  className="flex items-center justify-center bg-[#D7CCC8] px-3 py-2 rounded-lg hover:bg-[#BCAAA4] transition"
                >
                  <Volume2 size={22} className="text-[#4E342E]" />
                </button>

                <button
                  onClick={PausarReanudar}
                  className="flex items-center justify-center bg-[#D7CCC8] px-3 py-2 rounded-lg hover:bg-[#BCAAA4] transition"
                >
                  {isSpeaking ? (
                    <Pause size={22} className="text-red-600" />
                  ) : (
                    <Play size={22} className="text-green-600" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
