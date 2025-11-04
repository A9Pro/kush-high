"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

// Define a TypeScript interface for better type safety and maintainability
interface Game {
  title: string;
  description: string;
  href: string;
  emoji: string;
  color: string;
  sound?: string; // Optional sound effect for each game (e.g., path to audio file)
}

// Particle interface for explosion
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

const games: Game[] = [
  {
    title: "High or Hilarious 🌿",
    description:
      "Say something wild and let KushAI decide — deep truth or baked nonsense?",
    href: "/game/high-or-hilarious",
    emoji: "😂",
    color: "from-green-400 to-emerald-600",
    sound: "/sounds/laugh.mp3",
  },
  {
    title: "Vibe Memory Match 🪩",
    description:
      "Flip glowing cards and match stoner symbols before your high wears off!",
    href: "/game/vibe-memory",
    emoji: "🃏",
    color: "from-pink-500 to-purple-600",
    sound: "/sounds/shuffle.mp3",
  },
  {
    title: "Trip Quest 🌈",
    description:
      "An AI adventure through hazy lands. Choose your path and embrace the weird.",
    href: "/game/trip-quest",
    emoji: "🌀",
    color: "from-indigo-500 to-blue-700",
    sound: "/sounds/swirl.mp3",
  },
  {
    title: "Guess the High Song 🎵",
    description:
      "Hear a vibe and guess the artist or track. Test your high-level hearing!",
    href: "/game/guess-the-song",
    emoji: "🎶",
    color: "from-yellow-400 to-orange-600",
    sound: "/sounds/note.mp3",
  },
  {
    title: "Mood Spinner 🔮",
    description:
      "Spin the cosmic wheel and get your stoner mission for the moment.",
    href: "/game/mood-spinner",
    emoji: "🔮",
    color: "from-teal-400 to-cyan-600",
    sound: "/sounds/spin.mp3",
  },
  {
    title: "Hit Counter 💨",
    description:
      "Tap the blunt as many times as you can before time runs out.",
    href: "/game/hit-counter",
    emoji: "💨",
    color: "from-red-500 to-orange-600",
    sound: "/sounds/hit.mp3",
  },
];

// ParticleExplosion Component
function ParticleExplosion({ x, y }: { x: number; y: number }) {
  const particles: Particle[] = Array.from({ length: 30 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 30;
    const velocity = 100 + Math.random() * 200; // Speed variation
    const size = 2 + Math.random() * 4;
    const colors = ['#22c55e', '#84cc16', '#10b981', '#059669']; // Green hazy theme
    return {
      id: i,
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      size,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1.0,
    };
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 pointer-events-none z-50">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full opacity-0"
            initial={{
              x: particle.x,
              y: particle.y,
              scale: 0,
              opacity: 0,
            }}
            animate={{
              x: particle.x + particle.vx * 0.5, // Animate over time
              y: particle.y + particle.vy * 0.5 + (particle.vy * 0.1), // Gravity for arc
              scale: [0, particle.size / 10, particle.size / 10, 0],
              opacity: [0, 1, 0.5, 0],
              backgroundColor: particle.color,
            }}
            transition={{
              duration: 1.5 + Math.random() * 0.5,
              ease: "easeOut",
            }}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
          />
        ))}
      </div>
    </AnimatePresence>
  );
}

export default function GameHub() {
  const [isMuted, setIsMuted] = useState(false);
  const [explosionPos, setExplosionPos] = useState<{ x: number; y: number } | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const buttonRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});

  // Staggered animation variants for cards
  const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: [0.6, 0.05, 0.01, 0.9] as const, // Add 'as const' to fix the type error
    },
  }),
};

  // Global hover variant
  const hoverVariants = {
    hover: {
      y: -10,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  // Play sound function
  const playSound = (soundPath: string) => {
    if (isMuted || !soundPath) return;
    const audio = new Audio(soundPath);
    audio.volume = 0.3;
    audio.play().catch((e) => console.log("Audio play failed:", e));
  };

  // Trigger explosion on click
  const handleEnterGame = (e: React.MouseEvent<HTMLAnchorElement>, game: Game) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setExplosionPos({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    playSound("/sounds/click.mp3");
    // Note: Navigation happens immediately; particles animate over it for flash
  };

  // Ambient background loop
  useEffect(() => {
    if (isMuted) return;
    const ambient = new Audio("/sounds/ambient-chill.mp3");
    ambient.loop = true;
    ambient.volume = 0.1;
    ambient.play().catch((e) => console.log("Ambient play failed:", e));
    return () => ambient.pause();
  }, [isMuted]);

  // Clear explosion after animation
  useEffect(() => {
    if (explosionPos) {
      const timer = setTimeout(() => setExplosionPos(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [explosionPos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 text-white flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Enhanced background: Floating particles */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2],
            rotate: [0, -180],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 10 }}
        />
      </div>

      {/* Mute toggle button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-4 right-4 z-20 bg-gray-800/50 hover:bg-gray-700 rounded-full p-2 text-white transition-all"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? "🔇" : "🔊"}
      </motion.button>

      {/* Particle Explosion Trigger */}
      <AnimatePresence>
        {explosionPos && <ParticleExplosion x={explosionPos.x} y={explosionPos.y} />}
      </AnimatePresence>

      <motion.h1
        initial={{ opacity: 0, y: -40, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-5xl md:text-6xl font-bold mb-6 text-green-400 drop-shadow-2xl text-center relative z-10"
        whileHover={{ scale: 1.02, textShadow: "0 0 20px rgba(34, 197, 94, 0.5)" }}
      >
        Kush Mode Game Hub 🎮
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-gray-300 mb-12 max-w-2xl text-center text-base md:text-lg leading-relaxed relative z-10"
      >
        Welcome to the chill zone 🍃 — choose your vibe and let KushAI guide
        your high. Each game hits different — play them all!
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full relative z-10">
        {games.map((game, i) => (
          <motion.div
            key={game.title}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={i}
            whileHover={hoverVariants.hover}
            whileTap={{ 
              scale: 0.96, 
              rotate: -1,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
            onHoverStart={() => playSound(game.sound || "/sounds/hover.mp3")}
            className={`bg-gradient-to-br ${game.color} p-[1px] rounded-2xl shadow-xl transition-all duration-300 overflow-hidden group relative`}
          >
            <div className="bg-gray-950 rounded-2xl h-full p-5 md:p-6 flex flex-col justify-between hover:bg-gray-900/50 transition-colors relative">
              {/* Inner glow on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
              <div>
                <motion.h2 
                  className="text-xl md:text-2xl font-bold mb-3 flex items-center gap-2 group-hover:text-green-300 transition-colors relative z-20"
                  whileHover={{ color: "#22c55e" }}
                >
                  <motion.span 
                    className="text-3xl"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    {game.emoji}
                  </motion.span> 
                  {game.title}
                </motion.h2>
                <motion.p 
                  className="text-gray-400 text-sm leading-relaxed relative z-20"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.8, x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {game.description}
                </motion.p>
              </div>
              <Link
                ref={(el) => { buttonRefs.current[game.title] = el; }}
                href={game.href}
                onClick={(e) => handleEnterGame(e, game)}
                className="mt-4 md:mt-6 inline-block bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-full text-center transition-all duration-300 transform hover:scale-105 shadow-md relative z-20"
                aria-label={`Enter the ${game.title} game`}
              >
                <motion.span whileHover={{ scale: 1.1 }}>Enter Game 🚀</motion.span>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <footer className="mt-16 text-gray-400 text-sm text-center relative z-10">
        <p>
          Made for the high-minded by{" "}
          <Link href="/about" className="text-green-400 font-medium hover:text-green-300 transition-colors">
            KushAI 🌿
          </Link>
        </p>
      </footer>
    </div>
  );
}