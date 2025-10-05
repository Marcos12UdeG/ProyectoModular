"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import WordCard from "../components/WordCard";

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
  const { level } = params;
  const [data, setData] = useState<LevelData | null>(null);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((allLevels: LevelData[]) => {
        const found = allLevels.find((l) => l.level === level);
        setData(found || null);
      });
  }, [level]);

  if (!data) return <div className="p-6">Loading {level}...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Nivel {data.level}</h1>
      {data.topics.map((topic) => (
        <div key={topic.letter} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Letra {topic.letter}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {topic.words.map((word, index) => (
              <WordCard key={index} word={word} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

