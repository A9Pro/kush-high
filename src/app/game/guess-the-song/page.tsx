"use client";
import { useState, useRef } from "react";

export default function GuessTheSong() {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [timer, setTimer] = useState(30);

  const handlePlay = () => {
    setPlaying(true);
    audioRef.current?.play();
  };

  const handleGuess = (guess: string) => {
    if (guess === "Lo-Fi Chill") setScore(score + 1);
    setPlaying(false);
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-400 via-blue-300 to-green-300 p-4 text-black">
      <h1 className="text-3xl font-bold mb-4 animate-pulse">🎵 Guess the Song</h1>
      <audio ref={audioRef} src="/sounds/lofi.mp3" />
      {!playing ? (
        <button onClick={handlePlay} className="bg-white/70 px-6 py-2 rounded-xl shadow-lg">
          ▶️ Play Clip
        </button>
      ) : (
        <div className="mt-4 grid gap-2">
          {["Lo-Fi Chill", "Trap", "Reggae", "Psychedelic Rock"].map((opt) => (
            <button
              key={opt}
              onClick={() => handleGuess(opt)}
              className="bg-white/60 hover:bg-white text-black rounded-xl px-4 py-2"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
      <p className="mt-4 text-sm opacity-70">🕒 {timer}s left | 🌟 Score: {score}</p>
    </main>
  );
}
