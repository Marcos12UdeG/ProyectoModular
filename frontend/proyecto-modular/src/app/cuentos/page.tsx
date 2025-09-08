"use client";

import { useEffect, useState } from "react";

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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Cuentos</h1>

      {/* Mapear todos los cuentos */}
      <div className="flex flex-col gap-4">
        {tales.map((tale) => (
          <div key={tale.id_tale} className="p-4 border rounded shadow">
            <h2 className="text-lg font-semibold">{tale.tale_name}</h2>
            <p className="text-sm text-gray-700">{tale.content}</p>
            <p className="text-xs text-gray-500">Nivel: {tale.level_type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
