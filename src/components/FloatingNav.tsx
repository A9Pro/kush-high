"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Home,
  Boxes,
  Brain,
  Gamepad2,
  Info,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Collection", href: "/collection", icon: Boxes },
  { name: "Mood Kush", href: "/ai-consultation", icon: Brain },
  { name: "Game", href: "/game", icon: Gamepad2 },
  { name: "About", href: "/about", icon: Info },
];

export default function FloatingNav() {
  const { items } = useCart();
const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between 
      gap-4 md:gap-6 px-5 md:px-8 py-3 rounded-full
      bg-white/10 border border-white/20 backdrop-blur-2xl shadow-lg
      hover:bg-white/15 transition-all duration-500"
      style={{ backdropFilter: "blur(20px)" }}
    >
      {/* Brand Logo / Name */}
      <Link
        href="/"
        className="text-lg md:text-xl font-extrabold tracking-wide bg-gradient-to-r 
        from-green-400 via-lime-300 to-yellow-300 bg-clip-text text-transparent"
      >
        KUSH HIGH
      </Link>

      {/* Nav icons */}
      <div className="flex items-center justify-center gap-6 md:gap-8">
        {navItems.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            className="relative group flex flex-col items-center text-[#fefce8]/90 
            hover:text-lime-300 transition-all duration-300"
            aria-label={name}
          >
            <Icon className="w-6 h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform duration-300" />
            <span className="absolute bottom-[-22px] text-[10px] md:text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {name}
            </span>
          </Link>
        ))}

        {/* Cart */}
        <Link
          href="/cart"
          className="relative flex flex-col items-center text-[#fefce8]/90 
          hover:text-lime-300 transition-all duration-300"
          aria-label="Cart"
        >
          <ShoppingCart className="w-6 h-6 md:w-7 md:h-7 hover:scale-110 transition-transform duration-300" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-2 w-4 h-4 bg-lime-400 text-black text-[10px] rounded-full flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
          <span className="absolute bottom-[-22px] text-[10px] md:text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Cart
          </span>
        </Link>
      </div>
    </motion.nav>
  );
}
