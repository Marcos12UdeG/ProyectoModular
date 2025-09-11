"use client"
import { useState, useEffect } from "react"

interface Lesson {
  id_tale: number
  id_lesson: number
  title: string
}

export default function LeccionesPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])

  const ObtenerLecciones = async () => {
    const res = await fetch("http://localhost:8000/lesson") // ojo que sea plural
    const data = await res.json()
    setLessons(data)
  }

  useEffect(() => {
    ObtenerLecciones()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">📚 Lecciones</h1>

      {lessons.length === 0 ? (
        <p className="text-center text-gray-500">No hay lecciones disponibles</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((l) => (
            <div
              key={l.id_lesson}
              className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-semibold text-gray-800">{l.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Pertenece al cuento <span className="font-medium">#{l.id_tale}</span>
              </p>
              <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition-colors">
                Ver detalles
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
