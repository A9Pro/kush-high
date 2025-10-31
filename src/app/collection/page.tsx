"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Leaf, Droplet, CupSoda, Box } from "lucide-react";
import { Button } from "@/components/ui/button";

// ✅ Define Product type
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  img: string;
  desc?: string; // optional for some collections
}

// 🌟 Base Collection
const products: Product[] = [
  {
    id: 1,
    name: "Skywalker OG",
    price: 12500,
    category: "all",
    img: "/collection/skywalker.jpg",
  },
  {
    id: 2,
    name: "Lemon Haze Vape",
    price: 18500,
    category: "oil",
    img: "/collection/lemonhaze.jpg",
  },
  {
    id: 3,
    name: "Brownie Bliss",
    price: 6500,
    category: "edibles",
    img: "/collection/brownie.jpg",
  },
  {
    id: 4,
    name: "Kush Rolling Kit",
    price: 9500,
    category: "accessories",
    img: "/collection/rollingkit.jpg",
  },
];

// 🌿 Flower Collection
const flowerProducts: Product[] = [
  {
    id: 101,
    name: "Kush High Mix",
    price: 12000,
    category: "flower",
    img: "/collection/KushHighmix.jpg",
    desc: "A balanced hybrid delivering a smooth euphoric high — crafted for those who love full flavor and mellow vibes.",
  },
  {
    id: 102,
    name: "OG Kush",
    price: 15000,
    category: "flower",
    img: "/collection/OGKush.jpg",
    desc: "The classic king of strains. Deep relaxation, pine aroma, and rich potency make it a timeless favorite.",
  },
  {
    id: 103,
    name: "Purple Blaze",
    price: 13500,
    category: "flower",
    img: "/collection/purpleblaze.jpg",
    desc: "A visually stunning purple bud with fruity notes — delivers uplifting calm and a creative high.",
  },
  {
    id: 104,
    name: "Black Widow",
    price: 14000,
    category: "flower",
    img: "/collection/Blackwidow.jpg",
    desc: "Intense and bold. A powerful hybrid with smooth smoke, known for its energizing yet mellow after-effect.",
  },
  {
    id: 105,
    name: "Canadian Blaze",
    price: 16000,
    category: "flower",
    img: "/collection/Canadianblaze.jpg",
    desc: "Imported premium sativa — crisp citrus tones and uplifting high perfect for daytime adventures.",
  },
];

// 🧢 Accessories Collection
const accessoriesProducts: Product[] = [
  {
    id: 201,
    name: "BackWood",
    price: 8500,
    category: "accessories",
    img: "/collection/Backwood.jpg",
    desc: "Authentic Backwood cigar pack — rich, natural tobacco leaf wraps that deliver a slow and flavorful burn.",
  },
  {
    id: 202,
    name: "Strawberry Fusion",
    price: 7500,
    category: "accessories",
    img: "/collection/StrawberryFusion.jpg",
    desc: "Tobacco-free herbal wrap infused with strawberry essence — smooth, sweet, and 100% natural.",
  },
  {
    id: 203,
    name: "Crusher 1",
    price: 6000,
    category: "accessories",
    img: "/collection/Crusher1.jpg",
    desc: "Durable plastic crusher designed for easy and efficient grinding — lightweight and travel friendly.",
  },
  {
    id: 204,
    name: "Crusher 2",
    price: 9500,
    category: "accessories",
    img: "/collection/Crusher2.jpg",
    desc: "Medium-sized steel crusher — precision teeth for smooth, consistent grind with a premium metallic finish.",
  },
  {
    id: 205,
    name: "Crusher 3",
    price: 12000,
    category: "accessories",
    img: "/collection/Crusher3.jpg",
    desc: "Large heavy-duty steel crusher built for effortless grinding — ideal for home or lounge setups.",
  },
  {
    id: 206,
    name: "Kush High Mix Crusher",
    price: 11000,
    category: "accessories",
    img: "/collection/KushHighMIxcrusher.jpg",
    desc: "Signature Kush High Mix crusher — available in plastic or iron. Sturdy, sleek, and built for daily use.",
  },
  {
    id: 207,
    name: "Brown Rizla",
    price: 5500,
    category: "accessories",
    img: "/collection/BrownRizla.jpg",
    desc: "Classic brown Rizla pack — unbleached rolling papers offering a clean, natural taste.",
  },
  {
    id: 208,
    name: "Brown Flavoured Rizla",
    price: 6500,
    category: "accessories",
    img: "/collection/BrownflavouredRizla.jpg",
    desc: "Flavoured Rizla pack with subtle sweet notes — for those who prefer a hint of taste with their roll.",
  },
  {
    id: 209,
    name: "Beach Lighter",
    price: 7000,
    category: "accessories",
    img: "/collection/Beachlighter.jpg",
    desc: "Stylish lighter with beach-inspired design — refillable and windproof for reliable use anywhere.",
  },
  {
    id: 210,
    name: "Gun Lighter",
    price: 9000,
    category: "accessories",
    img: "/collection/Gunlighter.jpg",
    desc: "Creative firearm-shaped lighter — unique collectible piece with powerful flame and durable build.",
  },
  {
    id: 211,
    name: "Gas Lighter",
    price: 6500,
    category: "accessories",
    img: "/collection/GasLighter.jpg",
    desc: "Refillable gas lighter — dependable ignition and long-lasting flame for consistent daily use.",
  },
  {
    id: 212,
    name: "Kush High Lighter",
    price: 8000,
    category: "accessories",
    img: "/collection/KushhighLighter.jpg",
    desc: "Custom Kush High branded lighter — sleek matte finish with powerful jet flame for instant ignition.",
  },
  {
    id: 213,
    name: "Tray",
    price: 9500,
    category: "accessories",
    img: "/collection/Tray.jpg",
    desc: "Premium rolling tray — smooth metallic finish with curved edges to keep your session organized.",
  },
  {
    id: 214,
    name: "Kush High Tray",
    price: 11000,
    category: "accessories",
    img: "/collection/KushHighTray.jpg",
    desc: "Exclusive Kush High rolling tray — sleek, durable, and perfectly sized for stylish rolling.",
  },
  {
    id: 215,
    name: "Kush High Container",
    price: 10000,
    category: "accessories",
    img: "/collection/KushHighContainer.jpg",
    desc: "Airtight Kush High container — keeps herbs fresh, discreet, and protected from moisture.",
  },
];

const filters = [
  { label: "All", value: "all", icon: Sparkles },
  { label: "Flower", value: "flower", icon: Leaf },
  { label: "Oil", value: "oil", icon: Droplet },
  { label: "Edibles", value: "edibles", icon: CupSoda },
  { label: "Accessories", value: "accessories", icon: Box },
];

export default function CollectionPage() {
  const [activeFilter, setActiveFilter] = useState("all");
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

  // ✅ Dynamic filter logic
  const filtered =
    activeFilter === "all"
      ? products
      : activeFilter === "flower"
      ? flowerProducts
      : activeFilter === "accessories"
      ? accessoriesProducts
      : products.filter((p) => p.category === activeFilter);

  return (
    <section className="relative min-h-screen pt-40 pb-24 px-6 md:px-12 bg-[#0a0a0a] text-[#fefce8] overflow-hidden">
      {/* ✨ Glowing particles */}
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
            animate={{ y: ["0%", "8%", "0%"], opacity: [0.8, 0.2, 0.8] }}
            transition={{
              duration: 6 + Math.random() * 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight mb-3"
        >
          Our Collection
        </motion.h1>
        <p className="text-[#e4e4d0]/80 text-lg max-w-2xl mx-auto">
          Explore our premium strains, oils, edibles, and accessories — carefully curated for your peace and pleasure.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="relative z-10 flex flex-wrap justify-center gap-4 mb-12">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.value;
          return (
            <Button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`flex items-center gap-2 rounded-full px-6 py-3 border transition-all 
                ${
                  isActive
                    ? "bg-[#22c55e] text-black border-[#22c55e]"
                    : "bg-transparent border-[#22c55e]/30 text-[#fefce8]/80 hover:bg-[#22c55e]/10"
                }`}
            >
              <Icon size={18} /> {filter.label}
            </Button>
          );
        })}
      </div>

      {/* Product Grid */}
      <motion.div
        layout
        className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <AnimatePresence>
          {filtered.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="group relative rounded-3xl overflow-hidden shadow-xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-lg"
            >
              {/* Image */}
              <div
                className="h-64 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${product.img})`,
                }}
              />
              {/* Details */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-[#bbf7d0] font-medium text-lg mb-3">
                  ₦{product.price.toLocaleString()}
                </p>

                {product.desc && (
                  <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                    {product.desc}
                  </p>
                )}

                <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-black rounded-full px-6 py-2 transition-all">
                  Add to Cart
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
