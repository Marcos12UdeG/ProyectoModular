"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";

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

export default function ExercisesPage() {
  const { id_lesson } = useParams<{ id_lesson: string }>();
  const [exercises, setExercises] = useState<Excercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const { user } = useUser();

  useEffect(() => {
    if (!id_lesson) return;

    const fetchExercises = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/lessons/${id_lesson}/exercises_with_answers`
        );
        if (!res.ok) throw new Error("Error en el fetch");
        const data: Excercise[] = await res.json();
        setExercises(data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [id_lesson]);

  const handleSelectAnswer = (exerciseId: number, answerId: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [exerciseId]: answerId }));
  };

  const handleSubmitAnswers = async () => {
    if (!user) {
      console.warn("⚠️ No hay usuario logueado, no se pueden guardar respuestas");
      return;
    }

    try {
      const requestBody = {
        id_user: user.id_user,
        answers: Object.entries(selectedAnswers).map(([exerciseId, answerId]) => ({
          id_excercise: Number(exerciseId),
          id_answer: answerId,
        })),
      };

      const res = await fetch("http://localhost:8000/submit-exercise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) throw new Error("Error guardando respuestas");

      const data = await res.json();
      console.log("✅ Respuestas guardadas:", data);
      alert("Respuestas enviadas correctamente 🚀");
    } catch (error) {
      console.error("❌ Error en handleSubmitAnswers:", error);
    }
  };

  // Los tipos de ejercicios que quieres mostrar
  const types = ["reading", "writting", "listening"];

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-6">
      <h1 className="text-4xl font-extrabold text-[#3E2723] mt-6 mb-8 text-center tracking-wide">
        📚 Ejercicios de la Lección
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Cargando ejercicios...</p>
      ) : exercises.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay ejercicios para esta lección.
        </p>
      ) : (
        <>
          {types.map((tipo) => {
            const exercisesByType = exercises.filter(
              (exercise) => exercise.excercise_type === tipo
            );

            if (exercisesByType.length === 0) return null;

            return (
              <div key={tipo} className="w-full max-w-7xl mb-12">
                <h2 className="text-2xl font-bold text-[#4E342E] mb-6 capitalize">
                  {tipo}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {exercisesByType.map((exercise) => (
                    <div
                      key={exercise.id_excercise}
                      className="bg-white/95 rounded-3xl shadow-2xl p-6 flex flex-col"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-bold text-[#4E342E]">
                          {exercise.excercise_name}
                        </h2>
                        <span className="text-xs bg-[#FFCC80] text-[#4E342E] font-semibold px-3 py-1 rounded-full">
                          {exercise.excercise_type}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 mb-4">{exercise.question}</p>

                      <div className="flex flex-col gap-2">
                        {exercise.answers.length > 0 ? (
                          exercise.answers.map((answer) => (
                            <button
                              key={answer.id_answer}
                              onClick={() =>
                                handleSelectAnswer(
                                  exercise.id_excercise,
                                  answer.id_answer
                                )
                              }
                              className={`px-4 py-2 rounded-lg border text-left transition-all ${
                                selectedAnswers[exercise.id_excercise] ===
                                answer.id_answer
                                  ? "bg-[#FFCC80] border-[#FF9800] text-[#4E342E] font-bold"
                                  : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                              }`}
                            >
                              {answer.answer_text}
                            </button>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">
                            No hay respuestas disponibles.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* 🔥 Botón para enviar todas las respuestas */}
          <button
            onClick={handleSubmitAnswers}
            className="mt-10 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:bg-green-700 transition"
          >
            Subir Respuestas
          </button>
        </>
      )}
    </div>
  );
}
