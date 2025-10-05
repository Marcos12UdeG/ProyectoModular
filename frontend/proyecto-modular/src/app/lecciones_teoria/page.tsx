"use client";

import Link from "next/link";

const levels = [
  { name: "A1", color: "from-blue-400 to-blue-600" },
  { name: "A2", color: "from-green-400 to-green-600" },
  { name: "B1", color: "from-yellow-400 to-yellow-600" },
  { name: "B2", color: "from-purple-400 to-purple-600" },
  { name: "C1", color: "from-pink-400 to-pink-600" },
  { name: "C2", color: "from-indigo-400 to-indigo-600" },
];

export default function LessonsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {levels.map((level) => (
          <Link
            key={level.name}
            href={`/lessons/${level.name}`}
            className={`flex items-center justify-center h-40 w-40 rounded-2xl shadow-lg text-xl font-bold text-white bg-gradient-to-br ${level.color} transform hover:scale-105 transition-transform`}
          >
            {level.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

