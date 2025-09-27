"use client";
import { useEffect, useState } from "react";

interface Tale {
  id_tale: number;
  tale_name: string;
  content: string;
  level_type: string;
}

interface Lesson {
  id_lesson: number;
  title: string;
}



export default function LeccionPage() {
  const [cuentos, setCuentos] = useState<Tale[]>([]);
  const [lesson, setLessons] = useState<Lesson[]>([]);
  const [title, setTitle] = useState("");
  const [selectedTale, setSelectedTale] = useState<number | null>(null);

  // 🔹 Formulario nuevo (ejemplo: ejercicios)
  const [exercise, setExercise] = useState("");
  const [difficulty, setDifficulty] = useState("facil");

  const CrearLeccion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !selectedTale) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          id_tale: selectedTale,
        }),
      });

      if (!res.ok) throw new Error("Error al guardar la lección");

      setTitle("");
      setSelectedTale(null);
      alert("Lección guardada ✅");
    } catch (error) {
      console.error("Error", error);
    }
  };

  const ObtenerLecciones = async () =>{
    const res = await fetch("http://localhost:8000/taleswithlessons");
    const data = await res.json();
    setLessons(data);
    console.log("Respuesta lecciones", data);
  }

  const CrearEjercicio = async () =>{
    const res = await fetch("http://localhost:8000/excercises",{
      method:'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({})
    })
  }

  const ObtenerCuentos = async () => {
    const res = await fetch("http://localhost:8000/tales");
    const data = await res.json();
    setCuentos(data);
  };

  useEffect(() => {
    ObtenerCuentos();
    ObtenerLecciones();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 px-6">
      {/* Formulario Lecciones */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Formulario de Lecciones
        </h1>

        <form onSubmit={CrearLeccion} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título de la Lección
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              type="text"
              placeholder="Escribe el título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selecciona un cuento
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={selectedTale ?? ""}
              onChange={(e) => setSelectedTale(Number(e.target.value))}
            >
              <option value="" disabled>
                -- Selecciona --
              </option>
              {cuentos.map((cuento) => (
                <option key={cuento.id_tale} value={cuento.id_tale}>
                  {cuento.tale_name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Guardar Lección
          </button>
        </form>
      </div>

      {/* Formulario Ejercicios */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Formulario de Ejercicios
        </h1>

        <form onSubmit={CrearEjercicio} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pregunta del Ejercicio
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
              type="text"
              placeholder="Escribe la pregunta"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dificultad
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="facil">Fácil</option>
              <option value="medio">Medio</option>
              <option value="dificil">Difícil</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Guardar Ejercicio
          </button>
        </form>
      </div>
    </div>
  );
}
