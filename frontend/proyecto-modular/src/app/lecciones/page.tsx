"use client"

import { useEffect, useState } from "react"

interface Lesson {
  title: string
  id_tale: number
}

export default function LeecionPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])

  const ObtenerLecciones = async () => {
    const res = await fetch("http://localhost:8000/lesson")
    const data = await res.json()
    setLessons(data)
  }

  useEffect(() => {
    ObtenerLecciones()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📚 Lista de Lecciones</h1>

      {lessons.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {lessons.map((lesson, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-gray-700">{lesson.title}</h2>
              <p className="text-sm text-gray-500 mt-2">
                Pertenece al cuento <span className="font-medium text-gray-700">{lesson.id_tale}</span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-lg animate-pulse">Cargando...</p>
      )}
    </div>
  )
}
