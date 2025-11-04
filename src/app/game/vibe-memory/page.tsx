"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const emojis = ["🍁", "💨", "🔥", "🌿", "😎", "🧠", "🎶", "🌈"];

export default function VibeMemoryMatch() {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    // duplicate + shuffle
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, []);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setWon(true);
    }
  }, [matched]);

  const handleFlip = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        setMatched((prev) => [...prev, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  const resetGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setWon(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-green-900 flex flex-col items-center justify-center px-4 py-16 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold text-green-400 drop-shadow-md mb-6"
      >
        Vibe Memory Match 🃏
      </motion.h1>

      <p className="text-gray-400 mb-8 text-center max-w-sm">
        Flip the glowing cards and find all the matching weed-vibe pairs 🌿
      </p>

      <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
        {cards.map((emoji, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          return (
            <motion.div
              key={index}
              onClick={() => handleFlip(index)}
              className={`aspect-square rounded-xl cursor-pointer flex items-center justify-center text-3xl font-bold transition-transform duration-300
                ${isFlipped
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 hover:bg-green-700 text-transparent"} 
                ${matched.includes(index) ? "opacity-70" : ""}
              `}
              whileTap={{ scale: 0.9 }}
            >
              {isFlipped ? emoji : "🍃"}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 text-gray-400">
        Moves: <span className="text-green-400 font-semibold">{moves}</span>
      </div>

      {won && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-2xl font-bold text-green-400 mb-4">
            You cleared the haze! 🌈🔥
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-full text-white font-semibold"
          >
            Play Again 🍁
          </motion.button>
        </motion.div>
      )}

      {!won && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={resetGame}
          className="mt-8 px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-sm text-gray-300"
        >
          Shuffle 🔄
        </motion.button>
      )}

      <a
        href="/game"
        className="mt-10 text-green-400 hover:underline text-sm"
      >
        ⬅️ Back to Game Hub
      </a>
    </div>
  );
}
