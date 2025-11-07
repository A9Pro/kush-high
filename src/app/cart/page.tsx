"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const router = useRouter();

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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-lg"
            >
              <ShoppingBag className="mx-auto text-gray-600 mb-4" size={80} />
              <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
              <p className="text-[#c7c7a5] text-lg mb-8">
                Go get something that hits right 🔥
              </p>
              <Link
                href="/collection"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#22c55e] text-black font-semibold rounded-full hover:bg-[#16a34a] transition"
              >
                Browse Collection
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          ) : (
            <>
              <motion.div className="space-y-6 mb-8">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
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
                          className="px-4 py-2 bg-[#22c55e]/20 rounded-full text-[#22c55e] font-bold hover:bg-[#22c55e]/30 transition"
                        >
                          -
                        </button>
                        <span className="text-lg font-semibold min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-4 py-2 bg-[#22c55e]/20 rounded-full text-[#22c55e] font-bold hover:bg-[#22c55e]/30 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <p className="text-2xl font-bold text-[#fefce8]">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-2 px-4 py-2 text-[#ef4444] hover:text-[#f87171] hover:bg-red-500/10 rounded-full transition"
                      >
                        <Trash2 size={18} />
                        <span className="text-sm">Remove</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Order Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg shadow-xl"
              >
                <h2 className="text-2xl font-bold mb-6 text-center">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Delivery Fee</span>
                    <span className="text-[#22c55e]">FREE 🎉</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold">Total</span>
                      <span className="text-3xl font-extrabold text-[#22c55e]">
                        ₦{total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => router.push("/checkout")}
                    className="w-full flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-[#22c55e] text-black font-semibold hover:bg-[#16a34a] transition-all shadow-[0_0_30px_#22c55e55]"
                  >
                    Proceed to Checkout
                    <ArrowRight size={20} />
                  </button>
                  
                  <Link
                    href="/collection"
                    className="w-full flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-white/5 text-[#fefce8] font-semibold hover:bg-white/10 transition-all border border-white/10"
                  >
                    <ArrowLeft size={20} />
                    Continue Shopping
                  </Link>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                  🔒 Secure checkout • 🚚 Discreet packaging • ⚡ Fast delivery
                </p>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}