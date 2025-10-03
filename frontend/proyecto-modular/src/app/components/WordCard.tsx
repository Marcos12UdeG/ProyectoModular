"use client";

import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

interface Word {
  text: string;
  image: string;
  translation: string;
}

export default function WordCard({ word }: { word: Word }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  if (typeof window !== "undefined" && !synthRef.current) {
    synthRef.current = window.speechSynthesis;
  }

  const speak = () => {
    if (!synthRef.current) return;
    const utter = new SpeechSynthesisUtterance(word.text);
    utter.lang = "en-US";
    utter.onend = () => setIsPlaying(false);
    synthRef.current.speak(utter);
    setIsPlaying(true);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center">
      <img src={word.image} alt={word.text} className="h-20 w-20 object-contain mb-2" />
      <p className="font-semibold">{word.text}</p>
      <p className="text-gray-500 italic text-sm">{word.translation}</p>
      <button
        onClick={speak}
        className="mt-2 flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        <span className="text-sm">Play</span>
      </button>
    </div>
  );
}
