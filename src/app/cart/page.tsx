"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart();

  return (
    <section className="relative min-h-screen bg-[#050505] text-[#fefce8] px-6 md:px-12 py-28 md:py-40">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <ShoppingBag className="mx-auto text-[#22c55e]" size={60} />
        <h1 className="text-5xl md:text-6xl font-extrabold mt-6 bg-gradient-to-r from-[#22c55e] via-[#a3e635] to-[#16a34a] text-transparent bg-clip-text">
          Your Cart
        </h1>
        <p className="text-[#d6d6b4]/90 mt-4 text-lg">
          Review your selections before you elevate 🌿
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto">
        <AnimatePresence>
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-[#c7c7a5] text-lg"
            >
              Your cart is empty — go get something that hits right 🔥
            </motion.div>
          ) : (
            <motion.div className="space-y-8">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  className="flex flex-col md:flex-row items-center gap-6 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-lg hover:bg-white/10 transition-all shadow-xl"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded-2xl border border-white/10"
                  />
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                    <p className="text-[#a3a38b] text-sm mb-2">
                      Price: ₦{item.price.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 bg-[#22c55e]/20 rounded-full text-[#22c55e] font-bold hover:bg-[#22c55e]/30"
                      >
                        -
                      </button>
                      <span className="text-lg font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 bg-[#22c55e]/20 rounded-full text-[#22c55e] font-bold hover:bg-[#22c55e]/30"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <p className="text-xl font-bold text-[#fefce8]">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#ef4444] hover:text-[#f87171] transition"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-20 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg shadow-xl text-center"
          >
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <p className="text-[#c7c7a5] mb-2">Subtotal</p>
            <p className="text-3xl font-extrabold text-[#22c55e] mb-6">
              ₦{total.toLocaleString()}
            </p>
            <button
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#22c55e] text-black font-semibold hover:bg-[#16a34a] transition-all shadow-[0_0_30px_#22c55e55]"
              onClick={() => alert('Checkout coming soon 🚀')}
            >
              Checkout
              <ArrowRight size={20} />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
