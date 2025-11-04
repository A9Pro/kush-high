"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HitCounter() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showStart, setShowStart] = useState(true);

  // countdown logic
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
    setIsPlaying(true);
    setShowStart(false);
  };

  const handleHit = () => {
    if (isPlaying) setScore((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-gray-900 to-green-800 text-white relative overflow-hidden">
      {/* Glowing Background Animation */}
      <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_center,rgba(0,255,128,0.2),transparent_70%)] blur-3xl"></div>

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-green-400 drop-shadow-lg mb-6 z-10"
      >
        Hit Counter 💨
      </motion.h1>

      {/* Timer */}
      <div className="text-xl sm:text-2xl font-semibold text-gray-300 mb-4 z-10">
        Time: <span className="text-green-400">{timeLeft}s</span>
      </div>

      {/* Score Display */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-5xl sm:text-6xl font-bold text-white mb-6 drop-shadow-md z-10"
      >
        {score}
      </motion.div>

      {/* Hit Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: isPlaying
            ? ["0 0 20px #22c55e", "0 0 40px #16a34a", "0 0 20px #22c55e"]
            : "none",
        }}
        transition={{ repeat: isPlaying ? Infinity : 0, duration: 1.2 }}
        onClick={handleHit}
        disabled={!isPlaying}
        className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-green-500 hover:bg-green-600 text-4xl sm:text-5xl flex items-center justify-center cursor-pointer active:scale-90 transition-all z-10 ${
          isPlaying ? "" : "opacity-60"
        }`}
      >
        🚬
      </motion.button>

      {/* Start / Restart Button */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 flex flex-col items-center gap-4 z-10"
          >
            {timeLeft === 0 ? (
              <>
                <p className="text-2xl font-semibold text-green-400">
                  You took {score} hits 💨🔥
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-full font-semibold text-white"
                >
                  Play Again 🔁
                </motion.button>
              </>
            ) : (
              showStart && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="px-8 py-3 bg-green-500 hover:bg-green-600 rounded-full font-bold text-lg"
                >
                  Start Game 🌿
                </motion.button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back link */}
      <a
        href="/game"
        className="mt-10 text-green-400 hover:underline text-sm z-10"
      >
        ⬅️ Back to Game Hub
      </a>
    </div>
  );
}
