"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft,
  MapPin,
  Phone,
  User,
  Mail,
  Bitcoin,
  Banknote,
  Wallet
} from "lucide-react";

interface DeliveryDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  deliveryNotes?: string;
}

type PaymentMethod = "card" | "crypto" | "transfer" | "cash";

export default function StandardCheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    deliveryNotes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDeliveryDetails({
      ...deliveryDetails,
      [e.target.name]: e.target.value,
    });
  };

  const validateDeliveryDetails = () => {
    return (
      deliveryDetails.fullName &&
      deliveryDetails.email &&
      deliveryDetails.phone &&
      deliveryDetails.address &&
      deliveryDetails.city &&
      deliveryDetails.state
    );
  };

  const handleCompleteCheckout = async () => {
    setLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setStep(3);
    setLoading(false);
    
    setTimeout(() => {
      clearCart();
    }, 3000);
  };

  if (items.length === 0 && step !== 3) {
    return (
      <section className="min-h-screen bg-[#050505] text-[#fefce8] flex items-center justify-center px-6">
        <div className="text-center">
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

  const paymentOptions = [
    {
      value: "card" as PaymentMethod,
      label: "Card Payment",
      desc: "Visa, Mastercard, Verve via Paystack",
      icon: CreditCard,
      color: "text-blue-400",
    },
    {
      value: "crypto" as PaymentMethod,
      label: "Cryptocurrency",
      desc: "Bitcoin, USDT, Ethereum (Most Discreet)",
      icon: Bitcoin,
      color: "text-orange-400",
    },
    {
      value: "transfer" as PaymentMethod,
      label: "Bank Transfer",
      desc: "Direct transfer to our account",
      icon: Banknote,
      color: "text-green-400",
    },
    {
      value: "cash" as PaymentMethod,
      label: "Cash on Delivery",
      desc: "Pay when you receive (Lagos only)",
      icon: Wallet,
      color: "text-yellow-400",
    },
  ];

  return (
    <section className="relative min-h-screen bg-[#050505] text-[#fefce8] px-6 md:px-12 py-28 md:py-40">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12 gap-4">
          {[
            { num: 1, label: "Delivery", icon: Truck },
            { num: 2, label: "Payment", icon: CreditCard },
            { num: 3, label: "Confirm", icon: CheckCircle2 },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                  step >= s.num
                    ? "bg-[#22c55e] border-[#22c55e] text-black"
                    : "border-gray-600 text-gray-600"
                }`}
              >
                <s.icon size={20} />
              </div>
              <span className={`hidden md:block ${step >= s.num ? "text-[#22c55e]" : "text-gray-600"}`}>
                {s.label}
              </span>
              {s.num < 3 && (
                <div className={`w-12 h-0.5 ${step > s.num ? "bg-[#22c55e]" : "bg-gray-600"}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Delivery Details */}
          {step === 1 && (
            <motion.div
              key="delivery"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg"
            >
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <MapPin className="text-[#22c55e]" /> Delivery Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="text"
                      name="fullName"
                      value={deliveryDetails.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#22c55e] transition text-white"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={deliveryDetails.email}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#22c55e] transition text-white"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      value={deliveryDetails.phone}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#22c55e] transition text-white"
                      placeholder="+234 123 456 7890"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={deliveryDetails.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#22c55e] transition text-white"
                    placeholder="Lagos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={deliveryDetails.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#22c55e] transition text-white"
                    placeholder="Lagos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={deliveryDetails.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#22c55e] transition text-white"
                    placeholder="100001"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Delivery Address *</label>
                  <textarea
                    name="address"
                    value={deliveryDetails.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#22c55e] transition resize-none text-white"
                    placeholder="Enter your full delivery address"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Delivery Notes (Optional)</label>
                  <textarea
                    name="deliveryNotes"
                    value={deliveryDetails.deliveryNotes}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#22c55e] transition resize-none text-white"
                    placeholder="Any special instructions for discreet delivery?"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => router.push("/checkout")}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-full hover:bg-white/10 transition"
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!validateDeliveryDetails()}
                  className="flex-1 py-3 bg-[#22c55e] text-black font-semibold rounded-full hover:bg-[#16a34a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Payment
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg"
            >
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <CreditCard className="text-[#22c55e]" /> Select Payment Method
              </h2>

              <div className="space-y-4 mb-8">
                {paymentOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.value}
                      onClick={() => setPaymentMethod(option.value)}
                      className={`p-5 border-2 rounded-xl cursor-pointer transition ${
                        paymentMethod === option.value
                          ? "border-[#22c55e] bg-[#22c55e]/10"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === option.value
                              ? "border-[#22c55e]"
                              : "border-gray-500"
                          }`}
                        >
                          {paymentMethod === option.value && (
                            <div className="w-3 h-3 bg-[#22c55e] rounded-full" />
                          )}
                        </div>
                        <Icon className={option.color} size={28} />
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{option.label}</p>
                          <p className="text-sm text-gray-400">{option.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Payment Info based on selection */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
                {paymentMethod === "crypto" && (
                  <div>
                    <h3 className="font-bold mb-2 text-orange-400">🔒 Most Discreet Option</h3>
                    <p className="text-sm text-gray-400">
                      Pay with Bitcoin, USDT, or Ethereum. Our crypto wallet details will be provided after order confirmation. 
                      Completely anonymous and untraceable.
                    </p>
                  </div>
                )}
                {paymentMethod === "transfer" && (
                  <div>
                    <h3 className="font-bold mb-2 text-green-400">💰 Bank Transfer</h3>
                    <p className="text-sm text-gray-400">
                      You'll receive our bank details after order confirmation. Transfer the exact amount and send proof via WhatsApp.
                    </p>
                  </div>
                )}
                {paymentMethod === "cash" && (
                  <div>
                    <h3 className="font-bold mb-2 text-yellow-400">💵 Cash on Delivery</h3>
                    <p className="text-sm text-gray-400">
                      Available in Lagos only. Pay when you receive your package. Discreet packaging guaranteed.
                    </p>
                  </div>
                )}
                {paymentMethod === "card" && (
                  <div>
                    <h3 className="font-bold mb-2 text-blue-400">💳 Secure Card Payment</h3>
                    <p className="text-sm text-gray-400">
                      Powered by Paystack. Your card details are encrypted and secure. Supports Visa, Mastercard, and Verve.
                    </p>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-xl mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {item.name} x{item.quantity}
                      </span>
                      <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#22c55e]">₦{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-full hover:bg-white/10 transition"
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <button
                  onClick={handleCompleteCheckout}
                  disabled={loading}
                  className="flex-1 py-3 bg-[#22c55e] text-black font-semibold rounded-full hover:bg-[#16a34a] transition disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Confirm Order"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-lg text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <CheckCircle2 className="mx-auto text-[#22c55e] mb-6" size={80} />
              </motion.div>
              
              <h2 className="text-4xl font-bold mb-4">Order Confirmed! 🎉</h2>
              <p className="text-gray-400 mb-8 text-lg">
                Your order has been received. We'll contact you shortly with {paymentMethod === "crypto" ? "crypto wallet details" : paymentMethod === "transfer" ? "bank transfer details" : "next steps"}. Discreet packaging guaranteed! 🌿
              </p>

              <div className="bg-white/5 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
                <h3 className="font-semibold mb-3">Delivery Details:</h3>
                <p className="text-sm text-gray-400 mb-1">
                  <strong>Name:</strong> {deliveryDetails.fullName}
                </p>
                <p className="text-sm text-gray-400 mb-1">
                  <strong>Phone:</strong> {deliveryDetails.phone}
                </p>
                <p className="text-sm text-gray-400 mb-3">
                  <strong>Address:</strong> {deliveryDetails.address}, {deliveryDetails.city}
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Payment:</strong> {paymentOptions.find(p => p.value === paymentMethod)?.label}
                </p>
              </div>

              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => router.push("/")}
                  className="px-8 py-3 bg-white/5 rounded-full hover:bg-white/10 transition"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => router.push("/collection")}
                  className="px-8 py-3 bg-[#22c55e] text-black font-semibold rounded-full hover:bg-[#16a34a] transition"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}