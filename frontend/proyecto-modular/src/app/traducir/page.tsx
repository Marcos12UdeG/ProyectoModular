"use client"
import { useState } from "react";
export default function TraducirPage(){

const [cuento, setCuento] = useState("Había una vez un cuento en español...");
  const [traduccion, setTraduccion] = useState("");

    const Traducir = async () =>{
        const res = await fetch("http://localhost:8000/traducir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: cuento, target: "en" }),
        });

        const data = await res.json();
        setTraduccion(data.traduccion);
    };

   return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Traducir Cuento</h1>
      <p className="mt-2">{cuento}</p>
      <button
        onClick={Traducir}
        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded"
      >
        Traducir a Inglés
      </button>
      {traduccion && (
        <p className="mt-4 text-green-700">
          <strong>Traducción:</strong> {traduccion}
        </p>
      )}
    </div>
  );
}