"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Package, Truck, CheckCircle, Clock, Leaf, Zap, ShoppingBag, Mail, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const trackingSteps = [
  { id: 1, title: "Order Placed", icon: ShoppingBag, status: "completed", description: "Your order has been received and is being prepared." },
  { id: 2, title: "Processing", icon: Zap, status: "current", description: "We're carefully packing your premium selection with love 🌿." },
  { id: 3, title: "Shipped", icon: Truck, status: "pending", description: "On its way! Discreet packaging, nationwide delivery." },
  { id: 4, title: "Delivered", icon: CheckCircle, status: "pending", description: "Elevate responsibly. Enjoy your Kush High experience!" },
];

const generateFakeTrackingData = (trackingId: string) => {
  // Simulate different statuses based on trackingId length or hash
  const hash = trackingId.split('').reduce((a, b) => a + b.charCodeAt(0), 0) % 4;
  const updatedSteps = [...trackingSteps];
  for (let i = 0; i <= hash; i++) {
    updatedSteps[i].status = i < hash ? "completed" : i === hash ? "current" : "pending";
  }
  return {
    trackingId,
    estimatedDelivery: new Date(Date.now() + (2 + Math.random() * 3) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    orderTotal: `₦${(Math.random() * 50000 + 10000).toFixed(0)}`,
    ...updatedSteps[hash], // Current step details
  };
};

const isValidTrackingId = (id: string) => /^KH-\d{6}$/.test(id.toUpperCase());

const Step = ({ step }: { step: typeof trackingSteps[0] }) => {
  const iconVariants = {
    completed: { color: "#22c55e", scale: 1.1 },
    current: { color: "#facc15", scale: 1.05 },
    pending: { color: "#94a3b8", scale: 1 },
  };

  return (
    <motion.div
      className="flex flex-col items-center flex-1 relative px-2 sm:px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <motion.div
        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4 border-4 bg-white/10 backdrop-blur-sm"
        variants={iconVariants}
        animate={step.status}
        transition={{ duration: 0.3 }}
      >
        <step.icon size={20} className="sm:size-24 stroke-current" />
      </motion.div>
      <h3 className="text-xs sm:text-sm font-semibold text-white mb-1 text-center">{step.title}</h3>
      <p className="text-xs text-gray-300 text-center px-1 leading-relaxed">{step.description}</p>
      {step.id < 4 && (
        <motion.div
          className={`absolute top-20 left-1/2 transform -translate-x-1/2 w-1 h-12 sm:h-16 ${step.status === 'completed' ? 'bg-[#22c55e]' : 'bg-gray-600'}`}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: step.status === 'completed' ? 1 : 0.5 }}
          transition={{ delay: 0.5 }}
        />
      )}
    </motion.div>
  );
};

const EmailNotification = ({ trackingData }: { trackingData: any }) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // Simulate email subscription (in real app, integrate with EmailJS, SendGrid, etc.)
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubscribed(true);
    setLoading(false);
    // Reset after 3 seconds
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-8"
    >
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-lg font-bold text-white mb-2">
            <Mail className="size-5 text-[#22c55e]" />
            Get Email Updates
          </CardTitle>
          <p className="text-sm text-gray-300">Stay notified on every step of your order's journey 🌿</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-[#22c55e] rounded-lg"
                disabled={loading || subscribed}
              />
              <Button
                type="submit"
                disabled={!email.trim() || loading || subscribed}
                className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#22c55e] text-white font-semibold px-6 rounded-lg min-w-[120px]"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : subscribed ? (
                  "Subscribed!"
                ) : (
                  "Subscribe"
                )}
              </Button>
            </div>
            {subscribed && (
              <p className="text-sm text-green-400 text-center animate-pulse">You'll receive updates at {email}!</p>
            )}
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const SmokeParticle = ({ delay, x, y }: { delay: number; x: number; y: number }) => (
  <motion.div
    className="absolute w-2 h-2 bg-white/40 rounded-full blur-sm"
    style={{
      left: `${x}%`,
      top: `${y}%`,
    }}
    initial={{ opacity: 0, scale: 0, y: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      y: [-20, -80, -120],
    }}
    transition={{
      duration: 2.5,
      delay,
      repeat: 1,
      ease: "easeOut",
    }}
  />
);

const TrackingAnimation = ({ isValid, onComplete }: { isValid: boolean; onComplete: () => void }) => {
  const validSequence = [
    // Rolling weed
    { duration: 1.5, ease: "easeInOut" },
    // Lighter appears
    { duration: 1, ease: "easeOut" },
    // Lighting
    { duration: 1.2, ease: "easeIn" },
    // Smoking
    { duration: 3, ease: "easeOut" },
    // Fade out
    { duration: 0.5 },
  ];

  const totalDuration = validSequence.reduce((sum, step) => sum + step.duration, 0);

  // Generate multiple smoke particles
  const particles = Array.from({ length: 12 }).map((_, i) => ({
    delay: 3.7 + i * 0.2,
    x: 50 + (Math.random() - 0.5) * 40,
    y: 50,
  }));

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        className="relative w-64 h-64 flex items-center justify-center"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: totalDuration, repeat: 1 }}
      >
        {/* Rolling Paper */}
        <motion.div
          className="absolute w-32 h-8 bg-[#f4e4bc]/80 rounded-full border border-[#d4af37]/50 shadow-md"
          initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
          animate={{
            rotate: 0,
            scale: 1,
            opacity: 1,
            ...(isValid && {
              backgroundColor: "#228B22", // Green for weed
              scale: [1, 1.05, 1],
            }),
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Lighter - only for valid */}
        {isValid && (
          <motion.div
            className="absolute bottom-0 right-0 w-12 h-16 bg-[#8B4513] rounded-t-lg shadow-lg"
            initial={{ x: 100, opacity: 0 }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            {/* Flame with flicker */}
            <motion.div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-gradient-to-b from-[#FF4500] to-[#FFD700] rounded-t-full shadow-lg"
              initial={{ scaleY: 0 }}
              animate={{
                scaleY: [0.8, 1.2, 0.8, 1],
                y: [-5, -15, -5],
              }}
              transition={{ 
                delay: 2.5, 
                duration: 1.2, 
                repeat: 4, 
                repeatType: "mirror",
                repeatDelay: 0.3 
              }}
            >
              <Flame className="absolute inset-0 w-4 h-4 text-[#FF6347] animate-pulse" />
              {/* Spark particles from flame */}
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-[#FFD700]/80 rounded-full"
                  style={{
                    left: `${20 + i * 10}%`,
                    top: `${10 + Math.sin(i) * 5}%`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: [0, 10, 0],
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 2.5 + i * 0.1,
                    repeat: 4,
                    repeatType: "loop",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Enhanced Smoke particles - only for valid */}
        {isValid && (
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((p, i) => (
              <SmokeParticle key={i} {...p} />
            ))}
            {/* Additional wispy smoke trails */}
            <motion.div
              className="absolute w-1 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
              style={{ left: "50%", top: "50%" }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{
                opacity: [0, 0.6, 0],
                scaleX: [0, 3, 0],
                rotate: [0, 10, 0],
              }}
              transition={{ delay: 4.2, duration: 2.5 }}
            />
          </div>
        )}

        {/* Invalid message with subtle shake */}
        {!isValid && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: [-5, 5, -5, 5, 0],
            }}
            transition={{ 
              delay: 1.5, 
              duration: 0.5,
              x: { duration: 0.8, repeat: 3, repeatType: "mirror" },
            }}
          >
            {/* Empty rolling paper for invalid */}
            <motion.div
              className="absolute w-32 h-8 bg-[#f4e4bc]/80 rounded-full border border-[#d4af37]/50 shadow-md"
              initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
              animate={{
                rotate: 0,
                scale: 1,
                opacity: 1,
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <div className="text-2xl font-bold text-red-400 text-center mt-8">
              <div>Invalid</div>
              <div>Tracking ID</div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      setError("Please enter your tracking ID.");
      return;
    }
    const valid = isValidTrackingId(trackingId);
    setIsValid(valid);
    setShowAnimation(true);
    setLoading(true);
    setError("");

    // Simulate animation time
    await new Promise(resolve => setTimeout(resolve, 5500)); // Adjusted for longer animation

    setShowAnimation(false);
    setLoading(false);

    if (valid) {
      setTrackingData(generateFakeTrackingData(trackingId.toUpperCase()));
      setError("");
    } else {
      setError("Invalid tracking ID. Please check and try again.");
      setTrackingData(null);
    }
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    if (isValid) {
      setTrackingData(generateFakeTrackingData(trackingId.toUpperCase()));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#111827] to-[#1f2937] text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(250,204,21,0.1),transparent_50%)]" />

      {/* Floating Leaf Icons - Responsive */}
      <motion.div
        className="absolute top-1/4 left-4 sm:left-10 text-[#22c55e]/50 hidden md:block"
        animate={{ y: [0, -20, 0], rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        <Leaf size={32} />
      </motion.div>
      <motion.div
        className="absolute bottom-1/4 right-4 sm:right-10 text-[#facc15]/50 hidden md:block"
        animate={{ y: [0, 20, 0], rotate: [360, 0] }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
      >
        <Leaf size={28} />
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 py-6 sm:py-8 max-w-4xl pt-20 sm:pt-24"> {/* Added top padding for floating nav */}
        {/* Header - Enhanced Responsive */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-[#22c55e] to-[#facc15] bg-clip-text text-transparent mb-3 sm:mb-4">
            Track Your Order
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 px-2">Stay elevated with real-time updates on your discreet delivery 🌿</p>
        </motion.div>

        {/* Tracking Form - More Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl p-4 sm:p-8 mb-8 sm:mb-12 border border-white/10"
        >
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Input
              type="text"
              placeholder="Enter your tracking ID (e.g., KH-123456)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-[#22c55e] rounded-lg py-3"
              disabled={loading || showAnimation}
            />
            <Button
              type="submit"
              disabled={!trackingId.trim() || loading || showAnimation}
              className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#22c55e] text-white font-semibold px-6 sm:px-8 rounded-lg py-3"
            >
              {loading || showAnimation ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                "Track"
              )}
            </Button>
          </form>
          {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}
        </motion.div>

        {/* Tracking Animation Overlay */}
        <AnimatePresence>
          {showAnimation && (
            <TrackingAnimation isValid={isValid} onComplete={handleAnimationComplete} />
          )}
        </AnimatePresence>

        {/* Tracking Results - Enhanced Responsive */}
        <AnimatePresence>
          {trackingData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-4 sm:p-8 border border-white/10"
            >
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Order #{trackingData.trackingId}</h2>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-gray-300 mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>Estimated Delivery: {trackingData.estimatedDelivery}</span>
                  </div>
                  <span className="hidden sm:block">•</span>
                  <span>Total: {trackingData.orderTotal}</span>
                </div>
              </div>

              {/* Progress Steps - Fully Responsive */}
              <div className="flex items-center justify-between mb-6 sm:mb-8 overflow-x-auto pb-4 -mx-4 sm:-mx-0 sm:pb-0">
                <div className="flex gap-0 sm:gap-0 min-w-max sm:min-w-0">
                  {trackingSteps.map((step) => (
                    <Step key={step.id} step={step} />
                  ))}
                </div>
              </div>

              {/* Current Step Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-4 sm:p-6 bg-gradient-to-r from-[#22c55e]/20 to-[#facc15]/20 rounded-xl"
              >
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                  {trackingData.title} {trackingData.status === 'completed' && '✓'}
                </h3>
                <p className="text-sm sm:text-gray-300 text-gray-300">{trackingData.description}</p>
              </motion.div>

              {/* Email Notification Section */}
              <EmailNotification trackingData={trackingData} />

              {/* CTA - Responsive */}
              <div className="text-center mt-6 sm:mt-8">
                <Button
                  asChild
                  className="bg-gradient-to-r from-[#facc15] to-[#eab308] hover:from-[#eab308] hover:to-[#facc15] text-gray-900 font-semibold px-6 sm:px-8 py-3 rounded-xl w-full sm:w-auto"
                >
                  <a href="/shop">Shop More</a>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!trackingData && !showAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 px-4"
          >
            <Package size={48} className="mx-auto text-gray-500 mb-4 sm:size-64" />
            <p className="text-lg sm:text-xl text-gray-400">Enter your tracking ID to see the magic unfold 🌿</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}