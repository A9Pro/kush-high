"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const games = [
  {
    title: "High or Hilarious 🌿",
    description:
      "Say something wild and let KushAI decide — deep truth or baked nonsense?",
    href: "/game/high-or-hilarious",
    emoji: "😂",
    color: "from-green-400 to-emerald-600",
  },
  {
    title: "Vibe Memory Match 🪩",
    description:
      "Flip glowing cards and match stoner symbols before your high wears off!",
    href: "/game/vibe-memory",
    emoji: "🃏",
    color: "from-pink-500 to-purple-600",
  },
  {
    title: "Trip Quest 🌈",
    description:
      "An AI adventure through hazy lands. Choose your path and embrace the weird.",
    href: "/game/trip-quest",
    emoji: "🌀",
    color: "from-indigo-500 to-blue-700",
  },
  {
    title: "Guess the High Song 🎵",
    description:
      "Hear a vibe and guess the artist or track. Test your high-level hearing!",
    href: "/game/guess-the-song",
    emoji: "🎶",
    color: "from-yellow-400 to-orange-600",
  },
  {
    title: "Mood Spinner 🔮",
    description:
      "Spin the cosmic wheel and get your stoner mission for the moment.",
    href: "/game/mood-spinner",
    emoji: "🔮",
    color: "from-teal-400 to-cyan-600",
  },
  {
    title: "Hit Counter 💨",
    description:
      "Tap the blunt as many times as you can before time runs out.",
    href: "/game/hit-counter",
    emoji: "💨",
    color: "from-teal-400 to-cyan-600",
  },
];

export default function GameHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 text-white flex flex-col items-center justify-center px-6 py-20">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl font-bold mb-8 text-green-400 drop-shadow-lg text-center"
      >
        Kush Mode Game Hub 🎮
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-300 mb-12 max-w-2xl text-center text-lg"
      >
        Welcome to the chill zone 🍃 — choose your vibe and let KushAI guide
        your high. Each game hits different — play them all!
      </motion.p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
        {games.map((game, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.07, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            className={`bg-gradient-to-br ${game.color} p-[2px] rounded-2xl shadow-lg hover:shadow-green-400/40 transition-all duration-300`}
          >
            <div className="bg-gray-950 rounded-2xl h-full p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <span>{game.emoji}</span> {game.title}
                </h2>
                <p className="text-gray-400 text-sm">{game.description}</p>
              </div>
              <Link
                href={game.href}
                className="mt-6 inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full text-center transition-all"
              >
                Enter Game 🚀
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <footer className="mt-16 text-gray-500 text-sm text-center">
        <p>Made for the high-minded by <span className="text-green-400">KushAI 🌿</span></p>
      </footer>
    </div>
  );
}
