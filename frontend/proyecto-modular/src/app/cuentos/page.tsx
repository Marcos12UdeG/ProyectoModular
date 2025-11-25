"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Pause, Play, Trash2, Lock } from "lucide-react";
import { useUser } from "../context/UserContext";

interface Tale {
  id_tale: number;
  tale_name: string;
  content: string;
  level_type: string;
  is_completed?: boolean;
}

interface Progreso {
  total_completados: number;
  total_cuentos: number;
  porcentaje: number;
}

export default function CuentosPage() {
  const [tales, setTales] = useState<Tale[]>([]);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [taleName, setTaleName] = useState("");
  const [content, setContent] = useState("");
  const [levelType, setLevelType] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [progreso, setProgreso] = useState<Progreso | null>(null); // 🟤 Nuevo estado

  const niveles = ["A1", "A2", "B1", "B2", "C1", "C2"];

  const [showModal, setShowModal] = useState(false);
  const [taleName, setTaleName] = useState("");
  const [content, setContent] = useState("");
  const [levelType, setLevelType] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") setSynth(window.speechSynthesis);
    if (user) {
      fetchTales();
      fetchProgreso(); // 🟤 Llamar progreso del usuario
    }
  }, [user]);

  const fetchTales = async () => {
    try {
      const res = await fetch("https://storytellermodular.lat/api/tales");
      const data = await res.json();

      const talesWithProgress = await Promise.all(
        data.map(async (tale: Tale) => {
          try {
            const res = await fetch(
              `https://storytellermodular.lat/api/progress/${user?.id_user}/${tale.id_tale}`
            );
            const progressData = await res.json();
            return { ...tale, is_completed: progressData.is_completed || false };
          } catch {
            return { ...tale, is_completed: false };
          }
        })
      );

      setTales(talesWithProgress);
    } catch (error) {
      console.error("Error al obtener los cuentos", error);
    }
  };

  // 🟤 Función para obtener el progreso general
  const fetchProgreso = async () => {
    try {
      const res = await fetch(`https://storytellermodular.lat/api/completados/${user?.id_user}`);
      if (!res.ok) throw new Error("Error al obtener el progreso");
      const data = await res.json();
      setProgreso(data);
    } catch (error) {
      console.error("Error al obtener progreso general", error);
    }
  };

  const EliminarCuento = async (id_tale: number) => {
    try {
      const res = await fetch(`https://storytellermodular.lat/api/taleseliminate/${id_tale}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar el cuento");
      setTales((prevTales) => prevTales.filter((tale) => tale.id_tale !== id_tale));
      fetchProgreso(); // 🟤 Actualiza progreso tras eliminar
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
      const res = await fetch("https://storytellermodular.lat/api/talescreate", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Error al guardar cuento");

      await fetchTales();
      await fetchProgreso();
      setShowModal(false);
      setTaleName("");
      setContent("");
      setLevelType("");
      setImage(null);
    } catch (err) {
      console.error(err);
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
<<<<<<< HEAD
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
=======
    <div className="min-h-screen w-full flex flex-col items-center bg-[#FFFDF9]">
  {/* Título centrado con progreso a la izquierda y botón a la derecha */}
  <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-7xl px-4 mt-8 mb-8 gap-4">
    
    {/* 🟤 Cajita de progreso */}
    {progreso && (
      <div className="bg-[#FFF8E1] border border-[#FFD54F] rounded-2xl px-6 py-4 shadow-md flex flex-col items-center text-[#5D4037] min-w-[200px]">
        <p className="text-lg font-semibold">
          {progreso.total_completados} / {progreso.total_cuentos}
        </p>
        <p className="text-sm text-[#8D6E63]">Completados</p>
        <div className="w-48 bg-gray-300 h-2 rounded-full mt-2">
          <div
            className="h-2 bg-[#6D4C41] rounded-full transition-all duration-500"
            style={{ width: `${progreso.porcentaje}%` }}
          ></div>
        </div>
      </div>
    )}
>>>>>>> feature

    {/* Título centrado */}
    <h1 className="text-4xl font-extrabold text-[#3E2723] text-center flex-1">
      📖 CUENTOS
    </h1>

    {/* Botón Agregar cuento */}
    {user?.role === "administrador" && (
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 bg-[#6D4C41] text-white rounded-xl hover:bg-[#4E342E] shadow-md transition"
      >
        ➕ Agregar Cuento
      </button>
    )}
  </div>

      {/* Secciones por Nivel */}
      {niveles.map((nivel) => {
        const cuentosPorNivel = tales.filter((tale) => tale.level_type === nivel);
        if (cuentosPorNivel.length === 0) return null;

        return (
          <div key={nivel} className="w-full max-w-7xl px-4 mb-16">
            <h2 className="text-3xl font-bold mb-6 text-[#5D4037]">Nivel {nivel}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {cuentosPorNivel.map((tale) => {
                const imageUrl = `/images/${tale.tale_name
                  .replace(/\s+/g, "_")
                  .toLowerCase()}.jpg`;

                return (
                  <div
                    key={tale.id_tale}
                    className="bg-white/95 rounded-3xl shadow-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all p-6 flex flex-col justify-between relative"
                  >
                    <h2 className="text-2xl font-bold text-[#4E342E] mb-2">
                      {tale.tale_name}
                    </h2>

                    {tale.is_completed && (
                      <div className="absolute top-4 right-4 bg-[#6D4C41]/80 text-white rounded-full p-2 shadow-md">
                        <Lock size={20} />
                      </div>
                    )}

                    <img
                      src={imageUrl}
                      alt={tale.tale_name}
                      className={`w-full h-48 object-cover rounded-2xl mb-4 shadow-md ${
                        tale.is_completed ? "opacity-50" : ""
                      }`}
                    />

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
                        href={
                          tale.is_completed
                            ? "#"
                            : `/ejercicios/${tale.id_tale}`
                        }
                        onClick={(e) => {
                          if (tale.is_completed) e.preventDefault();
                        }}
                        className={`flex-1 text-center py-2 rounded-xl shadow-md transition ${
                          tale.is_completed
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-[#6D4C41] text-white hover:bg-[#4E342E]"
                        }`}
                      >
                        {tale.is_completed ? "Completado" : "Ver Ejercicios"}
                      </Link>
                      {user?.role == "administrador" && (
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
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Modal (sin cambios) */}
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
            <select
              value={levelType}
              onChange={(e) => setLevelType(e.target.value)}
              className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6D4C41]"
            >
              <option value="">Selecciona un nivel</option>
              {niveles.map((nivel) => (
                <option key={nivel} value={nivel}>
                  {nivel}
                </option>
              ))}
            </select>

<<<<<<< HEAD
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
=======
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
>>>>>>> feature
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
    </div>
  );
}
