"use client";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const edibles = [
  {
    id: 1,
    name: "Brownie Bliss",
    img: "/collection/brownie.jpg",
    desc: "Rich chocolate brownies infused with premium Kush extract — smooth, slow, and euphoric.",
    price: 6500,
  },
  {
    id: 2,
    name: "Gummy High Mix",
    img: "/collection/gummyhigh.jpg",
    desc: "Sweet, fruity, and potent — assorted gummies made for flavor and fun with a slow, strong hit.",
    price: 9500,
  },
  {
    id: 3,
    name: "Caramel Chill Bites",
    img: "/collection/caramelchill.jpg",
    desc: "Soft caramel edibles that melt in your mouth — creamy sweetness with mellow, long-lasting calm.",
    price: 8500,
  },
  {
    id: 4,
    name: "Kush Cookies",
    img: "/collection/kushcookies.jpg",
    desc: "Crispy golden cookies with a smooth THC blend — perfect for laid-back evenings and cozy vibes.",
    price: 9000,
  },
  {
    id: 5,
    name: "Dream Bar",
    img: "/collection/dreambar.jpg",
    desc: "A luxurious chocolate bar crafted with infused oils — rich flavor, clean potency, dreamlike balance.",
    price: 12000,
  },
];

export default function EdiblesPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let sparkles: { x: number; y: number; r: number; s: number; a: number }[] = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      sparkles = Array.from({ length: 50 }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.5,
        s: Math.random() * 0.3 + 0.1,
        a: Math.random() * 0.8 + 0.2,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparkles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 182, 193, ${p.a})`; // soft pink glow
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
    <div className="relative min-h-screen bg-gradient-to-b from-black via-zinc-900 to-pink-950 text-white overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center py-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-pink-400 via-rose-300 to-red-500 bg-clip-text text-transparent drop-shadow-lg"
        >
          Kush High Edibles
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
          className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto"
        >
          Sweet indulgence meets premium infusion — every bite, a journey.
        </motion.p>
      </div>

      {/* Edibles Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6 pb-20 max-w-7xl mx-auto">
        {edibles.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="group relative overflow-hidden rounded-3xl bg-pink-900/20 backdrop-blur-lg border border-pink-500/20 shadow-lg hover:shadow-pink-400/30 transition-all"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-90 transition-all duration-700"
              style={{ backgroundImage: `url(${item.img})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="relative p-8 flex flex-col justify-end h-[420px]">
              <h2 className="text-2xl font-bold text-pink-300 mb-2">{item.name}</h2>
              <p className="text-gray-300 text-sm mb-3 line-clamp-3">{item.desc}</p>
              <p className="text-lg font-semibold text-pink-400 mb-4">
                ₦{item.price.toLocaleString()}
              </p>
              <button className="self-start px-6 py-2 bg-pink-400 text-black font-semibold rounded-full hover:bg-pink-300 transition-all">
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
