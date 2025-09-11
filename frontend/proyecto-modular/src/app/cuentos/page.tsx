"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// ✅ Interfaz de un cuento
interface Tale {
  id_tale: number;
  tale_name: string;
  content: string;
  level_type: string;
}

export default function CuentosPage() {
  // ✅ Array de cuentos tipado
  const [tales, setTales] = useState<Tale[]>([]);

  const ObtenerTale = async () => {
    try {
      const res = await fetch("http://localhost:8000/tales");
      const data = await res.json();
      console.log("DATA DEL BACKEND:", data);
      setTales(data); // guardamos el array completo
    } catch (error) {
      console.error("Error al obtener los cuentos", error);
    }
  };

  useEffect(() => {
    ObtenerTale();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-10">📖 Cuentos</h1>

      {/* Grid responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tales.map((tale) => (
          <div
            key={tale.id_tale}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 flex flex-col justify-between"
          >
            {/* Nombre del cuento */}
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {tale.tale_name}
            </h2>

            {/* Preview del contenido */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {tale.content}
            </p>

            {/* Nivel */}
            <p className="text-xs text-gray-500 mb-4">
              Nivel:{" "}
              <span className="font-medium text-blue-600">
                {tale.level_type}
              </span>
            </p>

            {/* Botón para ver lecciones */}
            <Link href={`/lecciones/${tale.id_tale}`}>
              <button className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition-colors">
                Ver lecciones
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
