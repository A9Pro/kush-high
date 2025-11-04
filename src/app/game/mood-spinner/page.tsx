"use client";
import { useState } from "react";

export default function MoodSpinner() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("");
  const missions = [
    "💭 Describe your current vibe in one word",
    "🎶 Sing your favorite high tune",
    "🎨 Draw something that feels 'alive'",
    "😂 Tell your wildest munchies story",
    "🌌 Stare at the sky and breathe for 60 seconds"
  ];

  const spin = () => {
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      const random = missions[Math.floor(Math.random() * missions.length)];
      setResult(random);
    }, 2000);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-pink-300 via-yellow-200 to-green-300 p-4 text-black">
      <h1 className="text-3xl font-bold mb-4 animate-bounce">🎡 Mood Spinner</h1>
      <button
        onClick={spin}
        className={`bg-white/80 px-6 py-3 rounded-full shadow-lg text-lg font-semibold ${spinning && "animate-spin"}`}
      >
        {spinning ? "🌪 Spinning..." : "🎲 Spin the Wheel"}
      </button>
      {result && <p className="mt-6 text-xl font-medium animate-fadeIn">{result}</p>}
    </main>
  );
}
