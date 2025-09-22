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


  const ObtenerCuentos = async () => {
    const res = await fetch("http://localhost:8000/tales");
    const data = await res.json();
    setCuentos(data);
  };

  useEffect(() => {
    ObtenerCuentos();
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Formulario de Lecciones
      </h1>

      <form onSubmit={CrearLeccion} className="space-y-4">
        {/* Título */}
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

        {/* Selección de cuento */}
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

        {/* Botón */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Guardar Lección
        </button>
      </form>
    </div>
  );
}
