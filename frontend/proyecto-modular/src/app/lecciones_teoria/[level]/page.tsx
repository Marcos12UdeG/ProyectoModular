"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BookOpen, BarChart3 } from "lucide-react"; // iconos

interface Word {
  text: string;
  image: string;
  translation: string;
}

interface Topic {
  letter: string;
  words: Word[];
}

interface LevelData {
  level: string;
  topics: Topic[];
}

export default function NivelPage() {
  const params = useParams();
  const { level } = params; // A1, A2, B1, etc.
  const [data, setData] = useState<LevelData | null>(null);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((allLevels: LevelData[]) => {
        const found = allLevels.find((l) => l.level === level);
        setData(found || null);
      });
  }, [level]);

  if (!data) {
    return <div className="p-6">Loading {level}...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Nivel {data.level}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.topics.map((topic) => (
          <div
            key={topic.letter}
            className="rounded-2xl shadow-lg p-6 text-white flex flex-col justify-between hover:scale-105 transition-transform cursor-pointer"
            style={{
              background:
                data.level === "A1"
                  ? "#3b82f6"
                  : data.level === "A2"
                  ? "#10b981"
                  : data.level === "B1"
                  ? "#f59e0b"
                  : data.level === "B2"
                  ? "#8b5cf6"
                  : data.level === "C1"
                  ? "#ec4899"
                  : "#2563eb",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Letra {topic.letter}</h2>
            </div>

            <p className="text-sm text-gray-100 mb-4">
              {topic.words.length} palabras disponibles
            </p>

            <div className="flex items-center gap-2 mt-auto">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm">Próximamente ejercicios</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
