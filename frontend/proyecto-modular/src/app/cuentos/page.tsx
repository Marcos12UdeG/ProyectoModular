"use client";

import { useEffect, useState } from "react";

export default function CuentosPage() {
  const [tale, setTale] = useState("");

  const ObtenerTale = async () => {
    try {
      const res = await fetch("http://localhost:8000/tales");
      const data = await res.json();
      console.log(data);
      
      // Si data es un array, por ejemplo, tomamos el primer cuento
      if (data.length > 0) {
        setTale(data[0].tale_name);
      }
    } catch (error) {
      console.error("Error al obtener los cuentos", error);
    }
  };

  // ✅ Aquí usamos useEffect para llamar a la función al montar
  useEffect(() => {
    ObtenerTale();
  }, []); // <-- array vacío significa "solo al montar"

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Cuento</h1>
      <p className="mt-4">{tale}</p>
    </div>
  );
}
