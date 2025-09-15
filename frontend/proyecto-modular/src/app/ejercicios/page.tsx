export default function EjercicioPage() {
  // Array de ejercicios
  const ejercicios = [
    { id: 1, title: "Ejercicio 1", id_lesson: 1, level_type: "listening" },
    { id: 2, title: "Ejercicio 2", id_lesson: 1, level_type: "reading"},
    { id: 3, title: "Ejercicio 3", id_lesson: 2, level_type: "listening" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        Lista de ejercicios
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ejercicios.map((ejercicio) => (
          <div
            key={ejercicio.id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="bg-[#6D4C41] text-white px-3 py-1 rounded-full text-xs font-semibold">
                Lección {ejercicio.id_lesson}
              </span>
              <span className="text-sm text-gray-400">ID: {ejercicio.id}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{ejercicio.title}</h2>
            <p className="text-gray-600">Descripción breve del ejercicio...</p>
            <button className="mt-4 w-full bg-[#6D4C41] text-white py-2 rounded-xl hover:bg-[#4E342E] transition font-semibold">
              Comenzar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
