"use client";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const oils = [
  {
    id: 1,
    name: "Lemon Haze Vape",
    img: "/collection/lemonhaze.jpg",
    desc: "Zesty citrus vape oil with smooth vapor and an uplifting, euphoric finish.",
    price: 18500,
  },
  {
    id: 2,
    name: "Skywalker OG Oil",
    img: "/collection/skywalker.jpg",
    desc: "Classic strain in oil form — deep body calm, balanced head high, ultra-smooth hit.",
    price: 19000,
  },
  {
    id: 3,
    name: "Pine Dream Cartridge",
    img: "/collection/pineoil.jpg",
    desc: "Fresh pine aroma and clear sativa buzz — made for energetic days and creativity.",
    price: 17500,
  },
  {
    id: 4,
    name: "Mango Drift Vape",
    img: "/collection/mangooil.jpg",
    desc: "Sweet tropical mango tone blended with rich THC distillate for silky vapor and mellow high.",
    price: 18000,
  },
  {
    id: 5,
    name: "Kush High Signature Oil",
    img: "/collection/signatureoil.jpg",
    desc: "Premium Kush High exclusive distillate — full potency, refined clarity, and luxury feel.",
    price: 21000,
  },
];

export default function OilsPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: { x: number; y: number; r: number; a: number; s: number }[] = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 60 }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2,
        a: Math.random() * 0.7 + 0.3,
        s: Math.random() * 0.4 + 0.2,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.a})`;
        ctx.fill();
        p.y -= p.s;
        if (p.y < 0) p.y = canvas.height;
      });
      requestAnimationFrame(animate);
    };
    animate();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center py-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-600 bg-clip-text text-transparent drop-shadow-lg"
        >
          Kush High Oils
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto"
        >
          Precision-crafted distillates and vapes that redefine smoothness and potency.
        </motion.p>
      </div>

      {/* Oil Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6 pb-20 max-w-7xl mx-auto">
        {oils.map((oil, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className="group relative overflow-hidden rounded-3xl bg-zinc-800/40 backdrop-blur-lg border border-zinc-700 shadow-xl hover:shadow-yellow-500/10 transition-all"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-all duration-700"
              style={{ backgroundImage: `url(${oil.img})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="relative p-8 flex flex-col justify-end h-[400px]">
              <h2 className="text-2xl font-bold text-yellow-300 mb-2">{oil.name}</h2>
              <p className="text-gray-300 text-sm mb-3 line-clamp-3">{oil.desc}</p>
              <p className="text-lg font-semibold text-yellow-400 mb-4">
                ₦{oil.price.toLocaleString()}
              </p>
              <button className="self-start px-6 py-2 bg-yellow-400 text-black font-semibold rounded-full hover:bg-yellow-300 transition-all">
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
