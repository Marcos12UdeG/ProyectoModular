"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Volume2, Pause, Play, Trash2 } from "lucide-react";

interface Tale {
  id_tale: number;
  tale_name: string;
  content: string;
  level_type: string;
}

export default function CuentosPage() {
  const [tales, setTales] = useState<Tale[]>([]);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [taleName, setTaleName] = useState("");
  const [content, setContent] = useState("");
  const [levelType, setLevelType] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") setSynth(window.speechSynthesis);
    fetchTales();
  }, []);

  const fetchTales = async () => {
    try {
      const res = await fetch("http://localhost:8000/tales");
      const data = await res.json();
      setTales(data);
    } catch (error) {
      console.error("Error al obtener los cuentos", error);
    }
  };

  const TraducirYLeer = async (texto: string) => {
    if (!synth) return;
    synth.cancel();
    try {
      const res = await fetch("http://localhost:8000/traducir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto, destino: "en" }),
      });
      const data = await res.json();
      const utter = new SpeechSynthesisUtterance(data.traduccion);
      utter.lang = "en-US";
      utter.onend = () => {
        setIsSpeaking(false);
        utterRef.current = null;
      };
      utterRef.current = utter;
      synth.speak(utter);
      setIsSpeaking(true);
    } catch (error) {
      console.error(error);
    }
  };

  const PausarReanudar = () => {
    if (!synth || !utterRef.current) return;
    if (synth.speaking) {
      if (!synth.paused) {
        synth.pause();
        setIsSpeaking(false);
      } else {
        synth.resume();
        setIsSpeaking(true);
      }
    }
  };

  const EliminarCuento = async (id_tale: number) => {
    try {
      const res = await fetch(`http://localhost:8000/taleseliminate/${id_tale}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar el cuento");

      // Actualizar la lista de cuentos en el frontend
      setTales((prevTales) => prevTales.filter((tale) => tale.id_tale !== id_tale));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (!taleName || !content || !levelType || !image) {
      alert("Completa todos los campos e incluye una imagen");
      return;
    }

    const formData = new FormData();
    formData.append("tale_name", taleName);
    formData.append("content", content);
    formData.append("level_type", levelType);
    formData.append("file", image);

    try {
      const res = await fetch("http://localhost:8000/talescreate", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al guardar cuento");

      await fetchTales();
      setShowModal(false);
      setTaleName("");
      setContent("");
      setLevelType("");
      setImage(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      {/* Título centrado con botón a la derecha */}
      <div className="flex justify-between items-center w-full max-w-7xl px-4 mt-6 mb-8">
          <h1 className="text-4xl font-extrabold text-[#3E2723] text-center flex-1">
            📖 CUENTOS
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-[#6D4C41] text-white rounded-xl hover:bg-[#4E342E] shadow-md transition ml-4"
          >
            ➕ Agregar Cuento
          </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-[450px] animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-[#4E342E] text-center">
              ✨ Nuevo Cuento
            </h2>

            <input
              type="text"
              placeholder="Título"
              value={taleName}
              onChange={(e) => setTaleName(e.target.value)}
              className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6D4C41]"
            />
            <textarea
              placeholder="Contenido"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6D4C41] h-28 resize-none"
            />
            <input
              type="text"
              placeholder="Nivel (ej: fácil, intermedio)"
              value={levelType}
              onChange={(e) => setLevelType(e.target.value)}
              className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6D4C41]"
            />

            {/* Input de archivo con vista previa */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Imagen del cuento
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="hidden"
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="px-4 py-2 bg-[#6D4C41] text-white rounded-xl cursor-pointer hover:bg-[#4E342E] transition"
                >
                  Elegir archivo
                </label>
                {image && (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="preview"
                    className="h-16 w-16 object-cover rounded-xl border border-gray-300"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-[#6D4C41] text-white rounded-xl hover:bg-[#4E342E] shadow-md transition"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid de cuentos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl px-4 pb-10">
        {tales.map((tale) => {
          const imageUrl = `/images/${tale.tale_name
            .replace(/\s+/g, "_")
            .toLowerCase()}.jpg`;

          return (
            <div
              key={tale.id_tale}
              className="bg-white/95 rounded-3xl shadow-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all p-6 flex flex-col justify-between"
            >
              <img
                src={imageUrl}
                alt={tale.tale_name}
                className="w-full h-48 object-cover rounded-2xl mb-4 shadow-md"
              />

              <h2 className="text-2xl font-bold text-[#4E342E] mb-2">
                {tale.tale_name}
              </h2>

              <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {tale.content}
              </p>

              <p className="text-xs font-medium text-[#6D4C41] mb-4">
                Nivel:{" "}
                <span className="text-[#3E2723] font-semibold">
                  {tale.level_type}
                </span>
              </p>

              <div className="flex gap-3 items-center">
                  <Link
                    href={`/lecciones/${tale.id_tale}`}
                    className="flex-1 text-center py-2 bg-[#6D4C41] text-white rounded-xl hover:bg-[#4E342E] shadow-md transition"
                  >
                    Ver lecciones
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`¿Eliminar el cuento "${tale.tale_name}"?`)) {
                        EliminarCuento(tale.id_tale);
                      }
                    }}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition flex items-center justify-center"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button
                    onClick={() =>
                      isSpeaking && synth?.speaking
                        ? PausarReanudar()
                        : TraducirYLeer(tale.content)
                    }
                    className="p-2 bg-[#FFB74D] rounded-full hover:bg-[#FFA726] transition"
                  >
                    {isSpeaking ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}