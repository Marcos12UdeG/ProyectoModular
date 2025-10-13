"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Pause, Play } from "lucide-react";
import { useUser } from "../../context/UserContext";

interface Tale {
  id_tale: number;
  tale_name: string;
  content: string;
  level_type: string;
}

interface Answer {
  id_answer: number;
  answer_text: string;
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
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | null>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useUser();

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

  // -------------------- Revisar progreso del cuento --------------------
  const checkCompletion = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:8000/progress/${user.id_user}/${id_tale}`);
      const data = await res.json();
      setIsCompleted(data.is_completed);
    } catch (error) {
      console.error("Error al revisar progreso", error);
    }
  };

  // -------------------- Enviar respuestas --------------------
  const handleSubmitAnswers = async () => {
    if (!user) return alert("Debes iniciar sesión");
    setLoading(true);

    const answersArray = Object.entries(selectedAnswers).map(([id_excercise, id_answer]) => ({
      id_excercise: parseInt(id_excercise),
      id_answer: id_answer!,
    }));

    if (answersArray.length !== excercises.length) {
      alert("Responde todas las preguntas antes de enviar.");
      setLoading(false);
      return;
    }

    try {
      // Guardar respuestas
      const res = await fetch("http://localhost:8000/submit-excercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_user: user.id_user,
          answers: answersArray,
        }),
      });

      if (!res.ok) throw new Error("Error al enviar respuestas");
      setMessage("✅ Respuestas guardadas correctamente.");

      // Evaluar cuento
      const scoreRes = await fetch(
        `http://localhost:8000/evaluate-tale/${id_tale}?id_user=${user.id_user}`
      );
      const data = await scoreRes.json();
      const score = data.score;

      if (typeof score === "number") {
        if (score >= 60) {
          setIsCompleted(true);
          setMessage(`🎉 Cuento completado con éxito (${score.toFixed(1)}%)`);
        } else {
          setMessage(`Tu puntaje fue ${score.toFixed(1)}%. Intenta mejorar tus respuestas.`);
        }
      } else {
        setMessage("❌ Error: respuesta del servidor inválida.");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error al guardar o evaluar las respuestas.");
    } finally {
      setLoading(false);
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
    checkCompletion();
  }, [id_tale]);

  // -------------------- Render --------------------
  return (
    <div className="min-h-screen w-full bg-gray-50 flex justify-center py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-7xl px-6">
        {/* ------------------ Cuento ------------------ */}
        <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col">
          {tale ? (
            <>
              {/* Imagen del cuento */}
              <img
                src={`/images/${tale.tale_name.replace(/\s+/g, "_").toLowerCase()}.jpg`}
                alt={tale.tale_name}
                className="w-full h-56 object-cover rounded-2xl mb-4 shadow-md"
              />

              <h1 className="text-3xl font-bold text-[#4E342E] mb-3">{tale.tale_name}</h1>
              <p className="text-gray-700 mb-4">{tale.content}</p>
              <p className="text-sm font-semibold text-[#6D4C41] mb-6">
                Nivel: {tale.level_type}
              </p>

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
                  <span>{isSpeaking ? "Pausar" : "Traducir y Leer"}</span>
                </button>
                <div
                  className="absolute bottom-0 left-0 h-1 bg-green-400 rounded-r-xl transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <p>Cargando cuento...</p>
          )}
        </div>

        {/* ------------------ Ejercicios ------------------ */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-[#3E2723] mb-6">📝 Ejercicios</h2>

          {isCompleted ? (
            <p className="text-green-600 font-semibold text-lg">
              ✅ Este cuento ya está completado.
            </p>
          ) : excercises.length > 0 ? (
            <>
              {excercises.map((ej) => (
                <div key={ej.id_excercise} className="mb-6 border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-semibold text-[#5D4037] mb-2">
                    {ej.excercise_name}
                  </h3>
                  <p className="mb-3 text-gray-800">{ej.question}</p>
                  <ul className="space-y-2">
                    {ej.answers.map((ans) => (
                      <li
                        key={ans.id_answer}
                        onClick={() =>
                          setSelectedAnswers((prev) => ({
                            ...prev,
                            [ej.id_excercise]: ans.id_answer,
                          }))
                        }
                        className={`p-2 rounded-lg cursor-pointer border ${
                          selectedAnswers[ej.id_excercise] === ans.id_answer
                            ? "bg-[#FFB74D] text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {ans.answer_text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <button
                onClick={handleSubmitAnswers}
                disabled={loading}
                className="w-full py-3 mt-4 bg-[#6D4C41] text-white rounded-xl shadow-md hover:bg-[#4E342E] transition"
              >
                {loading ? "Enviando..." : "Enviar respuestas"}
              </button>
              {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
            </>
          ) : (
            <p>No hay ejercicios disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
}
