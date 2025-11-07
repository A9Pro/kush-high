"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { 
  Truck, CreditCard, CheckCircle2, ArrowLeft, MapPin, Phone, User, Mail,
  Bitcoin, Banknote, Wallet, Copy, Check
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

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function StandardCheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    fullName: "", email: "", phone: "", address: "", city: "", state: "", zipCode: "", deliveryNotes: ""
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDeliveryDetails({ ...deliveryDetails, [e.target.name]: e.target.value });
  };

  const validateDeliveryDetails = () => {
    return deliveryDetails.fullName && deliveryDetails.email && deliveryDetails.phone && 
           deliveryDetails.address && deliveryDetails.city && deliveryDetails.state;
  };

  const handleCompleteCheckout = async () => {
    if (paymentMethod === "cash" && deliveryDetails.city.toLowerCase() !== "lagos") {
      alert("Cash on Delivery is only available in Lagos. Please choose another payment method.");
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === "card") {
        if (!window.PaystackPop) {
          alert("Payment system is loading. Please try again.");
          setLoading(false);
          return;
        }

        const handler = window.PaystackPop.setup({
          key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxx', // REPLACE WITH YOUR PAYSTACK PUBLIC KEY
          email: deliveryDetails.email,
          amount: total * 100,
          currency: 'NGN',
          ref: 'KUSHHIGH_' + Math.floor((Math.random() * 1000000000) + 1),
          metadata: {
            custom_fields: [
              { display_name: "Customer Name", variable_name: "customer_name", value: deliveryDetails.fullName },
              { display_name: "Phone Number", variable_name: "phone", value: deliveryDetails.phone },
              { display_name: "Delivery Address", variable_name: "address", 
                value: `${deliveryDetails.address}, ${deliveryDetails.city}, ${deliveryDetails.state}` },
              { display_name: "Items", variable_name: "items", 
                value: items.map(i => `${i.name} (${i.quantity}x)`).join(", ") }
            ]
          },
          onClose: () => {
            setLoading(false);
            alert('Payment window closed. If completed, contact us on WhatsApp.');
          },
          callback: (response: any) => {
            setPaymentReference(response.reference);
            setStep(3);
            setLoading(false);
          }
        });
        handler.openIframe();
      } else {
        setLoading(false);
        setStep(3);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setLoading(false);
      alert('Payment failed. Please try again.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (items.length === 0 && step !== 3) {
    return (
      <section className="min-h-screen bg-[#050505] text-[#fefce8] flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Add some items before checking out</p>
          <button onClick={() => router.push("/collection")}
            className="px-6 py-3 bg-[#22c55e] text-black rounded-full font-semibold hover:bg-[#16a34a] transition">
            Browse Collection
          </button>
        </div>
      </section>
    );
  }

  const paymentOptions = [
    { value: "card" as PaymentMethod, label: "Card Payment", desc: "Visa, Mastercard, Verve via Paystack", 
      icon: CreditCard, color: "text-blue-400" },
    { value: "crypto" as PaymentMethod, label: "Cryptocurrency", desc: "Bitcoin, USDT, Ethereum (Most Discreet)", 
      icon: Bitcoin, color: "text-orange-400" },
    { value: "transfer" as PaymentMethod, label: "Bank Transfer", desc: "Direct transfer to our account", 
      icon: Banknote, color: "text-green-400" },
    { value: "cash" as PaymentMethod, label: "Cash on Delivery", desc: "Pay when you receive (Lagos only)", 
      icon: Wallet, color: "text-yellow-400" }
  ];

  const progressSteps = [
    { num: 1, label: "Delivery", icon: Truck },
    { num: 2, label: "Payment", icon: CreditCard },
    { num: 3, label: "Confirm", icon: CheckCircle2 }
  ];

  const formFields = [
    { name: "fullName", label: "Full Name *", type: "text", icon: User, placeholder: "John Doe" },
    { name: "email", label: "Email *", type: "email", icon: Mail, placeholder: "john@example.com" },
    { name: "phone", label: "Phone Number *", type: "tel", icon: Phone, placeholder: "+234 123 456 7890" },
    { name: "city", label: "City *", type: "text", icon: null, placeholder: "Lagos" },
    { name: "state", label: "State *", type: "text", icon: null, placeholder: "Lagos" },
    { name: "zipCode", label: "Zip Code", type: "text", icon: null, placeholder: "100001" }
  ];

  return (
    <section className="relative min-h-screen bg-[#050505] text-[#fefce8] px-6 md:px-12 py-28 md:py-40">
      <div className="max-w-4xl mx-auto">
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12 gap-4">
          {progressSteps.map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                step >= s.num ? "bg-[#22c55e] border-[#22c55e] text-black" : "border-gray-600 text-gray-600"
              }`}>
                <s.icon size={20} />
              </div>
              <span className={`hidden md:block ${step >= s.num ? "text-[#22c55e]" : "text-gray-600"}`}>
                {s.label}
              </span>
              {s.num < 3 && <div className={`w-12 h-0.5 ${step > s.num ? "bg-[#22c55e]" : "bg-gray-600"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          
          {/* STEP 1: Delivery Details */}
          {step === 1 && (
            <motion.div key="delivery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <MapPin className="text-[#22c55e]" /> Delivery Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formFields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium mb-2">{field.label}</label>
                    <div className="relative">
                      {field.icon && <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />}
                      <input type={field.type} name={field.name}
                        value={deliveryDetails[field.name as keyof DeliveryDetails]}
                        onChange={handleInputChange}
                        className={`w-full ${field.icon ? 'pl-11' : 'pl-4'} pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#22c55e] transition text-white`}
                        placeholder={field.placeholder} />
                    </div>
                  </div>
                ))}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Delivery Address *</label>
                  <textarea name="address" value={deliveryDetails.address} onChange={handleInputChange} rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#22c55e] transition resize-none text-white"
                    placeholder="Enter your full delivery address" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Delivery Notes (Optional)</label>
                  <textarea name="deliveryNotes" value={deliveryDetails.deliveryNotes} onChange={handleInputChange} rows={2}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#22c55e] transition resize-none text-white"
                    placeholder="Any special instructions for discreet delivery?" />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button onClick={() => router.push("/checkout")}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-full hover:bg-white/10 transition">
                  <ArrowLeft size={18} /> Back
                </button>
                <button onClick={() => setStep(2)} disabled={!validateDeliveryDetails()}
                  className="flex-1 py-3 bg-[#22c55e] text-black font-semibold rounded-full hover:bg-[#16a34a] transition disabled:opacity-50 disabled:cursor-not-allowed">
                  Continue to Payment
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Payment Method */}
          {step === 2 && (
            <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <CreditCard className="text-[#22c55e]" /> Select Payment Method
              </h2>

              <div className="space-y-4 mb-8">
                {paymentOptions.map((option) => {
                  const Icon = option.icon;
                  const isDisabled = option.value === "cash" && deliveryDetails.city.toLowerCase() !== "lagos";
                  
                  return (
                    <div key={option.value} onClick={() => !isDisabled && setPaymentMethod(option.value)}
                      className={`p-5 border-2 rounded-xl transition ${isDisabled 
                        ? "opacity-50 cursor-not-allowed border-white/5" 
                        : "cursor-pointer " + (paymentMethod === option.value
                          ? "border-[#22c55e] bg-[#22c55e]/10" : "border-white/10 hover:border-white/20")}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === option.value ? "border-[#22c55e]" : "border-gray-500"}`}>
                          {paymentMethod === option.value && <div className="w-3 h-3 bg-[#22c55e] rounded-full" />}
                        </div>
                        <Icon className={option.color} size={28} />
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{option.label}</p>
                          <p className="text-sm text-gray-400">{option.desc}{isDisabled && " (Not available)"}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Payment Info */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
                {paymentMethod === "crypto" && (
                  <div>
                    <h3 className="font-bold mb-2 text-orange-400">🔒 Most Discreet Option</h3>
                    <p className="text-sm text-gray-400">Pay with Bitcoin, USDT, or Ethereum. Wallet details provided after confirmation.</p>
                  </div>
                )}
                {paymentMethod === "transfer" && (
                  <div>
                    <h3 className="font-bold mb-2 text-green-400">💰 Bank Transfer</h3>
                    <p className="text-sm text-gray-400">Bank details provided after confirmation. Send proof via WhatsApp.</p>
                  </div>
                )}
                {paymentMethod === "cash" && (
                  <div>
                    <h3 className="font-bold mb-2 text-yellow-400">💵 Cash on Delivery</h3>
                    <p className="text-sm text-gray-400">Lagos only. Pay when you receive. Discreet packaging guaranteed.</p>
                  </div>
                )}
                {paymentMethod === "card" && (
                  <div>
                    <h3 className="font-bold mb-2 text-blue-400">💳 Secure Card Payment</h3>
                    <p className="text-sm text-gray-400">Powered by Paystack. Supports Visa, Mastercard, and Verve.</p>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-xl mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-400">{item.name} x{item.quantity}</span>
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
                <button onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-full hover:bg-white/10 transition">
                  <ArrowLeft size={18} /> Back
                </button>
                <button onClick={handleCompleteCheckout} disabled={loading}
                  className="flex-1 py-3 bg-[#22c55e] text-black font-semibold rounded-full hover:bg-[#16a34a] transition disabled:opacity-50">
                  {loading ? <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> Processing...</span> : "Confirm Order"}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Confirmation - See Part 2 */}
          {step === 3 && (
            <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-lg text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                <CheckCircle2 className="mx-auto text-[#22c55e] mb-6" size={80} />
              </motion.div>
              
              <h2 className="text-4xl font-bold mb-4">Order Confirmed! 🎉</h2>
              
              {/* Card Payment Reference */}
              {paymentMethod === "card" && paymentReference && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6 text-left max-w-md mx-auto">
                  <p className="text-sm text-blue-400 mb-2"><strong>Payment Reference:</strong></p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-black/20 px-3 py-2 rounded text-xs">{paymentReference}</code>
                    <button onClick={() => copyToClipboard(paymentReference)}
                      className="p-2 hover:bg-white/10 rounded transition">
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Crypto Wallets */}
              {paymentMethod === "crypto" && (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 mb-6 text-left max-w-md mx-auto">
                  <h3 className="font-semibold mb-4 text-orange-400">Send Payment To:</h3>
                  <div className="space-y-4 text-sm">
                    {[
                      { name: "Bitcoin (BTC)", addr: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
                      { name: "USDT (TRC20)", addr: "TYASr5UV6HEcXatwdFQfmLVUqQQQMUxHLS" },
                      { name: "Ethereum (ETH)", addr: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F" }
                    ].map((crypto) => (
                      <div key={crypto.name}>
                        <p className="text-gray-400 mb-1">{crypto.name}</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-black/20 px-3 py-2 rounded text-xs break-all">{crypto.addr}</code>
                          <button onClick={() => copyToClipboard(crypto.addr)}
                            className="p-2 hover:bg-white/10 rounded transition">
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-4">💬 Send proof to WhatsApp: <strong>+234 801 234 5678</strong></p>
                </div>
              )}

              {/* Bank Transfer */}
              {paymentMethod === "transfer" && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mb-6 text-left max-w-md mx-auto">
                  <h3 className="font-semibold mb-4 text-green-400">Bank Transfer Details:</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Bank:</strong> Access Bank</p>
                    <p><strong>Account Name:</strong> Kush High Ventures</p>
                    <div className="flex items-center gap-2">
                      <p className="flex-1"><strong>Account Number:</strong> 0123456789</p>
                      <button onClick={() => copyToClipboard("0123456789")}
                        className="p-2 hover:bg-white/10 rounded transition">
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                    <p className="text-[#22c55e] font-bold"><strong>Amount:</strong> ₦{total.toLocaleString()}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">💬 Send proof to WhatsApp: <strong>+234 801 234 5678</strong></p>
                </div>
              )}

              <p className="text-gray-400 mb-8 text-lg">
                {paymentMethod === "card" 
                  ? "Payment successful! We'll process your order and contact you shortly."
                  : "Your order has been received. We'll contact you shortly."}
                <br />Discreet packaging guaranteed! 🌿
              </p>

              <div className="bg-white/5 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
                <h3 className="font-semibold mb-3">Delivery Details:</h3>
                <p className="text-sm text-gray-400 mb-1"><strong>Name:</strong> {deliveryDetails.fullName}</p>
                <p className="text-sm text-gray-400 mb-1"><strong>Phone:</strong> {deliveryDetails.phone}</p>
                <p className="text-sm text-gray-400 mb-3">
                  <strong>Address:</strong> {deliveryDetails.address}, {deliveryDetails.city}
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Payment:</strong> {paymentOptions.find(p => p.value === paymentMethod)?.label}
                </p>
              </div>

              <div className="flex gap-4 justify-center flex-wrap">
                <button onClick={() => { clearCart(); router.push("/"); }}
                  className="px-8 py-3 bg-white/5 rounded-full hover:bg-white/10 transition">
                  Back to Home
                </button>
                <button onClick={() => { clearCart(); router.push("/collection"); }}
                  className="px-8 py-3 bg-[#22c55e] text-black font-semibold rounded-full hover:bg-[#16a34a] transition">
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