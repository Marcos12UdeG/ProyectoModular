"use client";

import { useState } from "react";
import { Volume2, Languages } from "lucide-react";

interface Word {
  text: string;
  image: string;
  translation: string;
}

export default function WordCard({ word }: { word: Word }) {
  const [showTranslation, setShowTranslation] = useState(false);

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(word.text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center transition-all hover:scale-105 hover:shadow-lg">
      <img
        src={word.image}
        alt={word.text}
        className="w-24 h-24 object-contain mb-3"
      />
      <h3 className="text-xl font-semibold text-gray-800 capitalize mb-2">
        {word.text}
      </h3>

      {showTranslation && (
        <p className="text-gray-600 text-sm mb-2 italic">
          {word.translation}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleSpeak}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
          title="Reproducir pronunciación"
        >
          <Volume2 size={18} />
        </button>

        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
          title="Mostrar traducción"
        >
          <Languages size={18} />
        </button>
      </div>
    </div>
  );
}
