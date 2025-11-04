"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Leaf, Flame, Star, Users } from "lucide-react";

export default function AboutPage() {
  const [particles, setParticles] = useState<
    { left: number; top: number; size: number }[]
  >([]);

  useEffect(() => {
    const generated = Array.from({ length: 30 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 2,
    }));
    setParticles(generated);
  }, []);

  return (
    <section className="relative min-h-screen bg-[#050505] text-[#fefce8] overflow-hidden px-6 md:px-12 py-28 md:py-40">
      {/* ✨ Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {particles.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-[#22c55e]/40 blur-[1px]"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{ y: ["0%", "10%", "0%"], opacity: [0.8, 0.3, 0.8] }}
            transition={{
              duration: 6 + Math.random() * 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-16">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-[#22c55e] via-[#a3e635] to-[#16a34a] text-transparent bg-clip-text"
        >
          About Kush High
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.2 }}
          className="text-lg md:text-xl text-[#e5e5d4]/90 leading-relaxed max-w-3xl mx-auto"
        >
          Kush High isn’t just a brand  it’s a lifestyle. 
          Born from a love for premium strains, smooth oils, 
          and quality vibes, we’re here to elevate your high with authenticity and elegance. 
          Every blend, every flavor, every detail is designed for those who move different  
          who chase peace, not pressure.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-20">
          {[
            {
              icon: Leaf,
              title: "Nature Grown",
              desc: "Handpicked strains, grown with love and precision for the purest experience.",
            },
            {
              icon: Flame,
              title: "Smooth Fire",
              desc: "Each puff hits clean — crafted from rich terpenes and top-tier distillation.",
            },
            {
              icon: Star,
              title: "Premium Quality",
              desc: "Our team ensures that every product delivers luxury, reliability, and flavor.",
            },
            {
              icon: Users,
              title: "Community First",
              desc: "We grow together — built for real people who value calm, culture, and connection.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.3 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg hover:bg-white/10 transition-all shadow-xl"
            >
              <feature.icon
                className="mx-auto text-[#22c55e] mb-4"
                size={40}
              />
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-[#d6d6b4]/90 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-24"
        >
          <a
            href="/collection"
            className="inline-block px-10 py-4 rounded-full text-black font-semibold bg-[#22c55e] hover:bg-[#16a34a] transition-all shadow-[0_0_30px_#22c55e55]"
          >
            Explore Our Collection
          </a>
        </motion.div>
      </div>
    </section>
  );
}
