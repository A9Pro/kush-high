"use client";

import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { MessageCircle, CreditCard, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, total } = useCart();
  const router = useRouter();

  // WhatsApp business number (replace with your actual number)
  const WHATSAPP_NUMBER = "2348012345678"; // Format: country code + number (no + or spaces)

  // Generate WhatsApp message with order details
  const generateWhatsAppMessage = () => {
    let message = `🌿 *New Order from Kush High*\n\n`;
    message += `📦 *Order Details:*\n`;
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Qty: ${item.quantity} × ₦${item.price.toLocaleString()}\n`;
      message += `   Subtotal: ₦${(item.price * item.quantity).toLocaleString()}\n\n`;
    });
    
    message += `💰 *Total: ₦${total.toLocaleString()}*\n\n`;
    message += `I'd like to complete this order. Please confirm availability and delivery details.`;
    
    return encodeURIComponent(message);
  };

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${generateWhatsAppMessage()}`;

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <section className="min-h-screen bg-[#050505] text-[#fefce8] flex items-center justify-center px-6">
        <div className="text-center">
          <ShoppingBag className="mx-auto text-gray-600 mb-4" size={80} />
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Add some items before checking out</p>
          <button
            onClick={() => router.push("/collection")}
            className="px-6 py-3 bg-[#22c55e] text-black rounded-full font-semibold hover:bg-[#16a34a] transition"
          >
            Browse Collection
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-[#050505] text-[#fefce8] px-6 md:px-12 py-28 md:py-40">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-[#22c55e] via-[#a3e635] to-[#16a34a] text-transparent bg-clip-text">
            Choose Your Checkout Method
          </h1>
          <p className="text-gray-400 text-lg">
            Select how you'd like to complete your order 🌿
          </p>
        </motion.div>

        {/* Order Summary Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12 backdrop-blur-lg"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <ShoppingBag size={20} /> Your Order Summary
          </h3>
          <div className="space-y-2 mb-4">
            {items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-gray-400">
                <span>{item.name} x{item.quantity}</span>
                <span>₦{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            {items.length > 3 && (
              <p className="text-xs text-gray-500">+ {items.length - 3} more items</p>
            )}
          </div>
          <div className="border-t border-white/10 pt-4 flex justify-between items-center">
            <span className="font-bold text-lg">Total</span>
            <span className="text-2xl font-extrabold text-[#22c55e]">
              ₦{total.toLocaleString()}
            </span>
          </div>
        </motion.div>

        {/* Checkout Options */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* WhatsApp Checkout */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <div className="bg-gradient-to-br from-[#25D366]/20 to-[#128C7E]/20 border-2 border-[#25D366]/30 rounded-3xl p-8 h-full backdrop-blur-lg hover:border-[#25D366] transition-all cursor-pointer relative overflow-hidden">
              {/* Popular Badge */}
              <div className="absolute top-4 right-4 bg-[#25D366] text-black text-xs font-bold px-3 py-1 rounded-full">
                POPULAR 🔥
              </div>

              <MessageCircle className="text-[#25D366] mb-4" size={48} />
              
              <h2 className="text-3xl font-bold mb-4 text-[#25D366]">
                WhatsApp Checkout
              </h2>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Quick and personal! Chat with us directly on WhatsApp. Share your order, 
                confirm details, and arrange payment & delivery all in one conversation.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#25D366] rounded-full mt-2"></div>
                  <p className="text-sm text-gray-400">Instant communication & support</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#25D366] rounded-full mt-2"></div>
                  <p className="text-sm text-gray-400">Flexible payment options discussed live</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#25D366] rounded-full mt-2"></div>
                  <p className="text-sm text-gray-400">Personalized delivery arrangements</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#25D366] rounded-full mt-2"></div>
                  <p className="text-sm text-gray-400">Most discreet & trusted method</p>
                </div>
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-semibold rounded-full hover:bg-[#128C7E] transition-all shadow-[0_0_30px_#25D36655] group-hover:shadow-[0_0_40px_#25D366]"
              >
                Continue with WhatsApp
                <ArrowRight size={20} />
              </a>

              <p className="text-center text-xs text-gray-500 mt-4">
                Opens WhatsApp with your order pre-filled
              </p>
            </div>
          </motion.div>

          {/* Standard Checkout */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <div className="bg-gradient-to-br from-[#22c55e]/20 to-[#16a34a]/20 border-2 border-[#22c55e]/30 rounded-3xl p-8 h-full backdrop-blur-lg hover:border-[#22c55e] transition-all cursor-pointer relative overflow-hidden">
              <CreditCard className="text-[#22c55e] mb-4" size={48} />
              
              <h2 className="text-3xl font-bold mb-4 text-[#22c55e]">
                Standard Checkout
              </h2>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Complete your purchase through our secure checkout process. Multiple 
                payment options available including cards, crypto, and bank transfer.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#22c55e] rounded-full mt-2"></div>
                  <p className="text-sm text-gray-400">Debit/Credit Card payments</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#22c55e] rounded-full mt-2"></div>
                  <p className="text-sm text-gray-400">Bitcoin & cryptocurrency accepted</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#22c55e] rounded-full mt-2"></div>
                  <p className="text-sm text-gray-400">Direct bank transfer option</p>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout/standard")}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#22c55e] text-black font-semibold rounded-full hover:bg-[#16a34a] transition-all shadow-[0_0_30px_#22c55e55] group-hover:shadow-[0_0_40px_#22c55e]"
              >
                Continue to Payment
                <ArrowRight size={20} />
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                🔒 Secure & encrypted payment gateway
              </p>
            </div>
          </motion.div>
        </div>

        {/* Back to Cart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#22c55e] transition"
          >
            ← Back to Cart
          </Link>
        </motion.div>
      </div>
    </section>
  );
}