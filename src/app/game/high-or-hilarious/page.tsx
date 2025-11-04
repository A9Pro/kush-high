"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function HighOrHilarious() {
  const [thought, setThought] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought.trim()) return;

    setLoading(true);
    setResult("");

    // Simulate AI judgment logic 🍃
    await new Promise((r) => setTimeout(r, 1200));
    const random = Math.random();
    if (random > 0.5) {
      setResult("🌿 Deep Truth 💭 — That actually makes cosmic sense!");
    } else {
      setResult("😂 High Nonsense 💨 — You’re baked, bro. But we love it.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-green-900 flex flex-col items-center justify-center px-6 py-20 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl sm:text-5xl font-bold mb-6 text-green-400 drop-shadow-md text-center"
      >
        High or Hilarious 🌿
      </motion.h1>

      <p className="text-gray-400 text-center max-w-md mb-10">
        Type your wildest thought or weirdest high idea — KushAI will decide if
        it’s *deep wisdom* or *stoned nonsense*. 🍃
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col items-center space-y-4"
      >
        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="e.g. What if trees are just slow humans?"
          className="w-full h-32 p-4 rounded-xl bg-gray-800 text-gray-200 placeholder-gray-500 border border-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          type="submit"
          className="w-full py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold text-lg transition-all disabled:opacity-50"
        >
          {loading ? "Evaluating vibes..." : "Check the Vibe 💫"}
        </motion.button>
      </form>

      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mt-8 text-center text-xl font-semibold"
        >
          {result}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-12 text-gray-500 text-sm"
      >
        <a
          href="/game"
          className="text-green-400 hover:underline transition-all"
        >
          ⬅️ Back to Game Hub
        </a>
      </motion.div>
    </div>
  );
}
