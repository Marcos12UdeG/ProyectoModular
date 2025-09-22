"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Lesson {
  id_lesson: number;
  title: string;
}


export default function LessonsByTale() {
  const { id_tale } = useParams();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id_tale) return;

    const fetchLessons = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/tales/${id_tale}/lessons`);
        const data = await res.json();
        setLessons(data);
        console.log(data)
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [id_tale]);


  const handleExerciseClick = (lessonId: number) => {
    router.push(`/ejercicios/${lessonId}`);
  };
  

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-6">
      <h1 className="text-4xl font-extrabold text-[#3E2723] mt-6 mb-8 text-center tracking-wide">
        📚 Lecciones del cuento {id_tale}
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Cargando lecciones...</p>
      ) : lessons.length === 0 ? (
        <p className="text-center text-gray-500">No hay lecciones para este cuento.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
          {lessons.map((lesson) => (
            <div
              key={lesson.id_lesson}
              className="bg-white/95 rounded-3xl shadow-2xl hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] transition-all p-6 flex flex-col justify-between"
            >
              <h2 className="text-2xl font-bold text-[#4E342E] mb-4">{lesson.title}</h2>

              <p className="text-sm text-gray-700 mb-6 line-clamp-2">
                Esta lección contiene ejercicios interactivos para reforzar lo aprendido.
              </p>

              <button
                onClick={() => handleExerciseClick(lesson.id_lesson)}
                className="bg-[#6D4C41] text-white py-3 rounded-xl hover:bg-[#4E342E] transition font-semibold shadow-md"
              >
                📝 Contestar ejercicios
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}