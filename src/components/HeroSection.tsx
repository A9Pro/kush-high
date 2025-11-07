"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ShoppingBag, Leaf, Package, Sparkles, Truck, Menu, Zap } from "lucide-react";

// --- Configuration Data ---

const images = [
  "/hero-bg1.jpg",
  "/hero-bg2.jpg",
  "/hero-bg3.jpg",
  "/hero-bg4.jpg",
];

// Function to generate particles (moved from module level)
const generateParticles = () => {
  return Array.from({ length: 25 }).map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
  }));
};

// --- New Floating CTA Buttons Component ---

const FloatingCTAButtons = () => {
  const buttonData = [
    { icon: Leaf, label: "Shop Herb", color: "text-[#22c55e]", bgColor: "bg-[#22c55e]/90", move: [0, -10, 0], duration: 4.5, href: "/shop/herb" },
    { icon: Zap, label: "Accessories", color: "text-[#facc15]", bgColor: "bg-[#facc15]/90", move: [0, 15, 0], duration: 5.5, href: "/shop/accessories" },
    { icon: Truck, label: "Track Order", color: "text-[#3b82f6]", bgColor: "bg-[#3b82f6]/90", move: [0, -12, 0], duration: 5, href: "/track" },
  ];

  return (
    <div className="flex justify-center gap-6 mt-12 relative z-30">
      {buttonData.map((btn, index) => (
        <motion.a
          key={index}
          href={btn.href}
          className="relative block"
          animate={{ y: btn.move }}
          transition={{ repeat: Infinity, duration: btn.duration, ease: "easeInOut", repeatType: "reverse" }}
        >
          <motion.div
            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center p-2 text-white ${btn.bgColor} shadow-2xl shadow-current/50 backdrop-blur-sm cursor-pointer border border-white/20`}
            whileHover={{ scale: 1.08, boxShadow: `0 0 35px ${btn.bgColor.replace(/bg-/, '').replace(/\/90/, '')}` }}
            whileTap={{ scale: 0.95 }}
          >
            <btn.icon size={36} strokeWidth={2} />
            <span className="text-xs font-semibold mt-1 drop-shadow-md">{btn.label}</span>
          </motion.div>
        </motion.a>
      ))}
    </div>
  );
};

// --- Main Component ---

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; duration: number; delay: number }>>([]);
  const [mounted, setMounted] = useState(false);

  // Generate particles only on client side after mount
  useEffect(() => {
    setParticles(generateParticles());
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center text-white overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={images[index]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${images[index]})` }}
          />
        </AnimatePresence>

        {/* Ambient Gradient Overlays & Transparency Enhancement */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/80" />
        <div className="absolute inset-0 backdrop-blur-[6px]" />
      </div>

      {/* Floating Decorative Icons */}
      <motion.div
        className="absolute top-20 left-10 text-[#a3e635]/90 hidden sm:block"
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        <Leaf size={42} strokeWidth={1.5} />
      </motion.div>

      <motion.div
        className="absolute bottom-24 right-8 text-[#facc15]/90 hidden sm:block"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        <ShoppingBag size={46} strokeWidth={1.5} />
      </motion.div>
      
      {/* Particle Aura - Only render after mounting */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          {particles.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-[#bbf7d0]/70 blur-[1px]"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
              animate={{
                x: [`${p.x - 1}%`, `${p.x + 1}%`, `${p.x - 1}%`],
                y: [`${p.y - 1}%`, `${p.y + 1}%`, `${p.y - 1}%`],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
            />
          ))}
        </div>
      )}

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-20 px-6 max-w-lg md:max-w-2xl"
      >
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.9 }}
          className="text-6xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#22c55e] via-[#bbf7d0] to-[#facc15] drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]"
        >
          KUSH HIGH
        </motion.h1>

        <p className="mt-3 md:mt-5 text-xl md:text-2xl font-light text-[#fefce8]/90 leading-snug tracking-wide backdrop-blur-sm p-2 rounded-lg">
          🌿 Highest In The Room Without KUSH HIGH 🌿
        </p>

        <p className="mt-3 md:mt-5 text-xl md:text-2xl font-light text-[#fefce8]/90 leading-snug tracking-wide backdrop-blur-sm p-2 rounded-lg">
          🌿 Nigeria's premier legit cannabis & accessories plug. Fast, discreet, nationwide delivery. 🌿
        </p>

        {/* Floating CTA Buttons component is rendered here */}
        <FloatingCTAButtons />

      </motion.div>

      {/* Soft fade bottom overlay */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-[120px] bg-gradient-to-t from-black/80 to-transparent z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      />
    </section>
  );
}