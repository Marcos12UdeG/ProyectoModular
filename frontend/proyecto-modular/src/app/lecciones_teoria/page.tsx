"use client";

import Link from "next/link";

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function LessonsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {levels.map((level) => (
          <Link
            key={level}
            href={`/lessons/${level}`}
            className="flex items-center justify-center h-40 w-40 rounded-2xl shadow-md bg-white text-xl font-bold hover:bg-blue-100 transition"
          >
            {level}
          </Link>
        ))}
      </div>
    </div>
  );
}
