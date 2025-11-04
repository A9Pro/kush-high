"use client";
import { useState } from "react";

export default function TripQuest() {
  const [step, setStep] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [choice, setChoice] = useState("");
  const [timer, setTimer] = useState(60);

  const scenes = [
    {
      text: "You open your eyes... the world is melting into colors. Do you follow the rainbow or chill under the tree?",
      options: ["🌈 Follow the rainbow", "🌳 Chill under the tree"]
    },
    {
      text: "The rainbow leads you to a glowing pond. A frog offers you wisdom or a cookie. What do you choose?",
      options: ["🐸 Wisdom", "🍪 Cookie"]
    },
    {
      text: "You ascend into cosmic bliss — KushAI whispers: 'You’ve reached higher consciousness.'",
      options: ["✨ Play again", "🚪 Exit"]
    }
  ];

  const handleChoice = (option: string) => {
    setLog([...log, option]);
    setChoice(option);
    setStep((prev) => (prev + 1) % scenes.length);
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-green-300 via-yellow-200 to-pink-300 text-black p-4">
      <h1 className="text-3xl font-bold mb-4 animate-bounce">🌿 Trip Quest</h1>
      <p className="mb-6 text-lg">{scenes[step].text}</p>

      <div className="grid gap-3 w-full max-w-sm">
        {scenes[step].options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleChoice(opt)}
            className="bg-white/70 hover:bg-white text-black py-2 px-4 rounded-xl shadow-md backdrop-blur-md"
          >
            {opt}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm opacity-70">🕒 {timer}s left</p>
    </main>
  );
}
