"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Pause, Play } from "lucide-react";

interface Tale {
  id_tale: number;
  tale_name: string;
  content: string;
  level_type: string;
}

interface Answer {
  id_answer: number;
  answer_text: string;
  is_correct?: boolean;
}

interface Excercise {
  id_excercise: number;
  excercise_name: string;
  question: string;
  excercise_type: string;
  answers: Answer[];
}

export default function EjerciciosConCuentoPage() {
  const { id_tale } = useParams<{ id_tale: string }>();
  const [tale, setTale] = useState<Tale | null>(null);
  const [excercises, setExcercises] = useState<Excercise[]>([]);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [progress, setProgress] = useState(0);

  // -------------------- Fetch cuento --------------------
  const fetchTale = async () => {
    try {
      const res = await fetch(`http://localhost:8000/tales/${id_tale}`);
      const data: Tale = await res.json();
      setTale(data);
    } catch (error) {
      console.error("Error al obtener el cuento", error);
    }
  };

  // -------------------- Fetch ejercicios --------------------
  const fetchExcercises = async () => {
    try {
      const res = await fetch(`http://localhost:8000/tales/${id_tale}/excercises`);
      const data: Excercise[] = await res.json();
      setExcercises(data);
    } catch (error) {
      console.error("Error al obtener ejercicios", error);
    }
  };

  // -------------------- Traducir y leer --------------------
  const TraducirYLeer = async (texto: string) => {
    if (!synth) return;
    synth.cancel();
    setProgress(0);

    try {
      const res = await fetch("http://localhost:8000/traducir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto, destino: "en" }),
      });
      const data = await res.json();
      const utter = new SpeechSynthesisUtterance(data.traduccion);
      utter.lang = "en-US";

      // Actualiza barra de progreso por cada palabra leída
      const words = data.traduccion.split(/\s+/);
      let wordIndex = 0;
      utter.onboundary = (event) => {
        if (event.name === "word") {
          wordIndex++;
          setProgress((wordIndex / words.length) * 100);
        }
      };

      utter.onend = () => {
        setIsSpeaking(false);
        setProgress(100);
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

  useEffect(() => {
    if (typeof window !== "undefined") setSynth(window.speechSynthesis);
    fetchTale();
    fetchExcercises();
  }, [id_tale]);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex justify-center py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-7xl px-6">
        {/* ------------------ Cuento ------------------ */}
        <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col">
          {tale ? (
            <>
              <img
                src={`/images/${tale.tale_name.replace(/\s+/g, "_").toLowerCase()}.jpg`}
                alt={tale.tale_name}
                className="w-full h-56 object-cover rounded-2xl mb-4 shadow-md"
              />
              <h1 className="text-3xl font-bold text-[#4E342E] mb-3">
                {tale.tale_name}
              </h1>
              <p className="text-gray-700 mb-4">{tale.content}</p>
              <p className="text-sm font-semibold text-[#6D4C41] mb-6">
                Nivel: {tale.level_type}
              </p>

              {/* Botón de lectura con barra de progreso */}
              <div className="relative w-full">
                <button
                  onClick={() =>
                    isSpeaking && synth?.speaking
                      ? PausarReanudar()
                      : TraducirYLeer(tale.content)
                  }
                  className="relative flex items-center justify-center gap-3 w-full py-3 bg-[#FFB74D] text-white font-semibold rounded-xl shadow-lg hover:brightness-105 transition"
                >
                  {isSpeaking ? <Pause size={22} /> : <Play size={22} />}
                  <span className="z-10">{isSpeaking ? "Pausar" : "Traducir y Leer"}</span>
                </button>
                {/* Barra de progreso */}
                <div className="absolute bottom-0 left-0 h-1 bg-green-400 rounded-r-xl transition-all" style={{ width: `${progress}%` }} />
              </div>
            </>
          ) : (
            <p>Cargando cuento...</p>
          )}
        </div>

        {/* ------------------ Ejercicios ------------------ */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-[#3E2723] mb-6">📝 Ejercicios</h2>
          {excercises.length > 0 ? (
            excercises.map((ej) => (
              <div key={ej.id_excercise} className="mb-6 border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-[#5D4037] mb-2">{ej.excercise_name}</h3>
                <p className="mb-3 text-gray-800">{ej.question}</p>
                <ul className="space-y-2">
                  {ej.answers.map((ans) => (
                    <li key={ans.id_answer} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer">
                      {ans.answer_text}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No hay ejercicios disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
}
