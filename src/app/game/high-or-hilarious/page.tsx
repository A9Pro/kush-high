"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Submission {
  thought: string;
  result: string;
  timestamp: Date;
  type: "deep" | "hilarious";
}

export default function HighOrHilarious() {
  const [thought, setThought] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Submission[]>([]);
  const [streak, setStreak] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Set mounted state on client side only
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load history and streak from localStorage - only on client
  useEffect(() => {
    if (!mounted) return;
    
    try {
      const savedHistory = localStorage.getItem("kushHistory");
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory) as Submission[];
        setHistory(parsed.slice(-10));
        const deepCount = parsed.filter(h => h.type === "deep").length;
        setStreak(deepCount > 0 ? (parsed.slice(-1)[0]?.type === "deep" ? deepCount : 0) : 0);
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  }, [mounted]);

  // Save to localStorage on new submission
  useEffect(() => {
    if (!mounted || !result) return;
    
    try {
      const newSubmission: Submission = {
        thought,
        result,
        timestamp: new Date(),
        type: result.includes("Deep") || result.includes("Profound") || result.includes("Enlightened") ? "deep" : "hilarious"
      };
      const updatedHistory = [newSubmission, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem("kushHistory", JSON.stringify(updatedHistory));

      if (newSubmission.type === "deep") {
        setStreak(prev => prev + 1);
      } else {
        setStreak(0);
      }
    } catch (e) {
      console.error("Failed to save history:", e);
    }
  }, [result, thought, mounted]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [thought]);

  // Play sound
  const playSound = (type: "submit" | "deep" | "hilarious") => {
    if (isMuted || !mounted) return;
    const sounds = {
      submit: "/sounds/whoosh.mp3",
      deep: "/sounds/aha.mp3",
      hilarious: "/sounds/laugh.mp3"
    };
    const audio = new Audio(sounds[type]);
    audio.volume = 0.2;
    audio.play().catch(() => {});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought.trim()) return;

    setLoading(true);
    setResult("");
    setError("");
    playSound("submit");

    try {
      // Call our API route instead of directly calling xAI
      const response = await fetch("/api/judge-thought", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ thought }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      const apiResult = data.result || "🤔 KushAI is pondering the vibes...";
      setResult(apiResult);

      // Determine type for streak/history
      const isDeep = apiResult.includes("Deep") || apiResult.includes("Profound") || apiResult.includes("Enlightened");
      playSound(isDeep ? "deep" : "hilarious");
    } catch (err: any) {
      console.error("API Error:", err);
      setError("Vibes jammed—check your connection. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setThought("");
    setResult("");
    setError("");
  };

  // Share result to X (simple tweet intent)
  const shareToX = () => {
    if (!mounted) return;
    const tweetText = `Just dropped a wild thought in KushAI's High or Hilarious: "${thought.substring(0, 100)}..." Got: ${result} 🔥 Play now: ${window.location.origin}/game/high-or-hilarious #KushAI #HighVibes`;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 flex flex-col items-center justify-start px-4 py-12 text-white relative overflow-hidden">
      {/* Subtle background haze */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      {/* Mute toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-4 right-4 z-10 bg-gray-800/50 hover:bg-gray-700 rounded-full p-3 text-white transition-all"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? "🔇" : "🔊"}
      </motion.button>

      <motion.h1
        initial={{ opacity: 0, y: -30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl sm:text-5xl font-bold mb-4 text-green-400 drop-shadow-2xl text-center relative z-10"
        whileHover={{ scale: 1.02, textShadow: "0 0 20px rgba(34, 197, 94, 0.5)" }}
      >
        High or Hilarious 🌿
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-gray-400 text-center max-w-md mb-8 text-lg leading-relaxed relative z-10"
      >
        Spill your wildest thought or baked epiphany — KushAI's got the verdict: *deep wisdom* or *glorious nonsense*? 🍃
      </motion.p>

      {/* Streak display */}
      {streak > 0 && (
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          className="mb-6 px-4 py-2 bg-green-500/20 border border-green-400 rounded-full text-green-300 font-semibold relative z-10"
        >
          🔥 Deep Streak: {streak} {streak === 1 ? "truth" : "truths"} in a row!
        </motion.div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg flex flex-col items-center space-y-6 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full"
        >
          <textarea
            ref={textareaRef}
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="e.g., What if the universe is just God's forgotten screensaver? 🌌"
            className="w-full min-h-[120px] p-5 rounded-2xl bg-gray-800/50 text-gray-200 placeholder-gray-500 border-2 border-green-600/30 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/50 resize-none transition-all duration-300"
            disabled={loading}
            suppressHydrationWarning
          />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading || !thought.trim()}
          type="submit"
          className="w-full max-w-md py-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-400/25"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              Vibing with the cosmos...
            </div>
          ) : (
            "Unleash the Thought 💫"
          )}
        </motion.button>
      </form>

      {/* Error display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-4 bg-red-500/20 border border-red-400 rounded-xl text-red-300 text-center relative z-10"
        >
          {error}
        </motion.div>
      )}

      {/* Result with animation */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ duration: 0.6, type: "spring" as const, stiffness: 300 }}
            className="mt-8 w-full max-w-lg text-center p-6 rounded-2xl bg-gray-800/50 border border-green-600/30 relative z-10"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [-2, 2, 0] }}
              transition={{ duration: 0.8, repeat: 1 }}
              className="text-2xl font-bold mb-2"
            >
              {result}
            </motion.div>
            <div className="flex gap-2 justify-center mt-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={clearForm}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full text-sm transition-all"
              >
                New Thought 🚀
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={shareToX}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm transition-all"
              >
                Share on X 📤
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History sidebar */}
      {mounted && history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 w-full max-w-lg relative z-10"
        >
          <h3 className="text-lg font-semibold mb-4 text-green-400 text-center">Recent Vibes 🍃</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto bg-gray-800/30 rounded-xl p-4">
            {history.slice(0, 5).map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-3 rounded-lg text-sm ${entry.type === "deep" ? "bg-green-500/10 border-l-4 border-green-400" : "bg-purple-500/10 border-l-4 border-purple-400"}`}
              >
                <p className="text-gray-300 font-medium">"{entry.thought.substring(0, 50)}..."</p>
                <p className="text-gray-500 mt-1">{entry.result}</p>
                <p className="text-xs text-gray-600 mt-1">{new Date(entry.timestamp).toLocaleTimeString()}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-12 text-center relative z-10"
      >
        <Link
          href="/game"
          className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-medium transition-all underline-offset-2"
        >
          ⬅️ Back to Game Hub
        </Link>
      </motion.div>
    </div>
  );
}