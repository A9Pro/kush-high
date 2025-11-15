"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Package, Truck, CheckCircle, Clock, Leaf, Zap, ShoppingBag, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const trackingSteps = [
  { id: 1, title: "Order Placed", icon: ShoppingBag, status: "completed", description: "Your order has been received and is being prepared." },
  { id: 2, title: "Processing", icon: Zap, status: "current", description: "We're carefully packing your premium selection with care." },
  { id: 3, title: "Shipped", icon: Truck, status: "pending", description: "On its way! Discreet packaging, nationwide delivery." },
  { id: 4, title: "Delivered", icon: CheckCircle, status: "pending", description: "Enjoy your experience responsibly!" },
];

const generateFakeTrackingData = (trackingId: string) => {
  const hash = trackingId.split('').reduce((a, b) => a + b.charCodeAt(0), 0) % 4;
  const updatedSteps = [...trackingSteps];
  for (let i = 0; i <= hash; i++) {
    updatedSteps[i].status = i < hash ? "completed" : i === hash ? "current" : "pending";
  }
  return {
    trackingId,
    estimatedDelivery: new Date(Date.now() + (2 + Math.random() * 3) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    orderTotal: `₦${(Math.random() * 50000 + 10000).toFixed(0)}`,
    currentStep: updatedSteps[hash],
    steps: updatedSteps,
  };
};

const isValidTrackingId = (id: string) => /^KH-\d{6}$/.test(id.toUpperCase());

const Step = ({ step, index, total }: { step: typeof trackingSteps[0]; index: number; total: number }) => {
  const iconVariants = {
    completed: { color: "#22c55e", scale: 1.1 },
    current: { color: "#facc15", scale: 1.05 },
    pending: { color: "#94a3b8", scale: 1 },
  };
  const isLastStep = index === total - 1;
  return (
    <div className="flex flex-col items-center flex-1 relative">
      <motion.div
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 border-4 bg-white/10 backdrop-blur-sm z-10"
        variants={iconVariants}
        animate={step.status}
        transition={{ duration: 0.3 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <step.icon
          size={24}
          className="stroke-current"
          aria-hidden="true"
        />
      </motion.div>
     
      <h3 className="text-xs sm:text-sm font-semibold text-white mb-1 text-center px-1">
        {step.title}
      </h3>
     
      <p className="text-xs text-gray-300 text-center px-2 leading-relaxed max-w-[120px] sm:max-w-none">
        {step.description}
      </p>
     
      {!isLastStep && (
        <motion.div
          className={`absolute top-6 sm:top-7 left-[calc(50%+28px)] sm:left-[calc(50%+32px)] right-[calc(-50%+28px)] sm:right-[calc(-50%+32px)] h-1 ${
            step.status === 'completed' ? 'bg-[#22c55e]' : 'bg-gray-600'
          }`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: step.status === 'completed' ? 1 : 0.3 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ transformOrigin: 'left' }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

const EmailNotification = ({ trackingData }: { trackingData: any }) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleSubscribe = async () => {
    if (!email.trim()) {
      setEmailError("Please enter an email address");
      return;
    }
   
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
   
    setEmailError("");
    setLoading(true);
   
    await new Promise(resolve => setTimeout(resolve, 1500));
   
    setSubscribed(true);
    setLoading(false);
   
    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
    }, 3000);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-6 sm:mt-8"
    >
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-2 text-base sm:text-lg font-bold text-white mb-2">
            <Mail className="w-5 h-5 text-[#22c55e]" aria-hidden="true" />
            Get Email Updates
          </CardTitle>
          <p className="text-sm text-gray-300">Stay notified on every step of your order's journey</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="email-input" className="sr-only">
                  Email address
                </label>
                <Input
                  id="email-input"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSubscribe();
                    }
                  }}
                  className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-[#22c55e] rounded-lg"
                  disabled={loading || subscribed}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                />
              </div>
              <Button
                onClick={handleSubscribe}
                disabled={!email.trim() || loading || subscribed}
                className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#22c55e] text-white font-semibold px-6 rounded-lg min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={subscribed ? "Subscribed successfully" : "Subscribe to email updates"}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Loading</span>
                  </span>
                ) : subscribed ? (
                  "Subscribed!"
                ) : (
                  "Subscribe"
                )}
              </Button>
            </div>
           
            {emailError && (
              <p id="email-error" className="text-sm text-red-400 flex items-center gap-1" role="alert">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                {emailError}
              </p>
            )}
           
            {subscribed && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-green-400 text-center"
                role="status"
                aria-live="polite"
              >
                ✓ You'll receive updates at {email}!
              </motion.p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const SmokeParticle = ({ delay, x, y }: { delay: number; x: number; y: number }) => {
  const smokeImg = "https://pngimg.com/uploads/smoke/small/smoke_PNG55179.png"; // Realistic smoke puff PNG
  return (
    <motion.div
      className="absolute bg-center bg-no-repeat bg-contain"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: "40px",
        height: "40px",
        backgroundImage: `url(${smokeImg})`,
        filter: "blur(0.5px) opacity(0.8)",
      }}
      initial={{ opacity: 0, scale: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
        y: [-20, -80, -120],
        rotate: [0, 10, 0],
      }}
      transition={{
        duration: 2.5,
        delay,
        ease: "easeOut",
      }}
      aria-hidden="true"
    />
  );
};

const TrackingAnimation = ({ isValid, onComplete }: { isValid: boolean; onComplete: () => void }) => {
  const particles = Array.from({ length: 12 }).map((_, i) => ({
    delay: 2.5 + i * 0.15,
    x: 50 + (Math.random() - 0.5) * 30,
    y: 50,
  }));

  const lighterImg = "https://pngimg.com/uploads/lighter/small/lighter_PNG11195.png"; // Cartoon lighter PNG
  const flameImg = "https://pngimg.com/uploads/flame/small/flame_PNG13243.png"; // Flame PNG

  return (
    <motion.div
      className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="dialog"
      aria-label="Processing tracking request"
      aria-live="polite"
    >
      <motion.div
        className="relative w-80 h-80 flex items-center justify-center" // Increased size for better image fit
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        onAnimationComplete={() => {
          setTimeout(onComplete, isValid ? 4500 : 2500); // Adjusted for enhanced anim
        }}
      >
        {/* Enhanced Rolling Paper with texture simulation */}
        <motion.div
          className="absolute w-40 h-10 bg-gradient-to-r from-[#f4e4bc] to-[#e8d5a3] rounded-full border-2 border-[#d4af37]/70 shadow-lg flex items-center justify-center"
          initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
          animate={{
            rotate: 0,
            scale: 1,
            opacity: 1,
            ...(isValid && {
              background: "linear-gradient(to r, #228B22, #32CD32)", // Green weed fill
            }),
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          aria-hidden="true"
        >
          {/* Add leaf icon for weed realism */}
          {isValid && <Leaf className="w-6 h-6 text-white drop-shadow-md" />}
        </motion.div>

        {isValid && (
          <>
            {/* Realistic Lighter Image */}
            <motion.img
              src={lighterImg}
              alt=""
              className="absolute bottom-0 right-0 w-16 h-20 object-contain shadow-xl"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              aria-hidden="true"
            />

            {/* Realistic Flame Image with enhanced flicker */}
            <motion.img
              src={flameImg}
              alt=""
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-12 h-16 object-contain drop-shadow-2xl filter brightness-110"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0.8, 1.3, 0.9, 1.2, 1.0],
                opacity: [0, 1, 0.8, 1, 1],
                y: [0, -8, -12, -10, -5],
                rotate: [0, 2, -1, 3, 0],
              }}
              transition={{
                delay: 2.3,
                duration: 1.0,
                repeat: 4,
                repeatType: "mirror",
                repeatDelay: 0.2,
              }}
              aria-hidden="true"
            />

            {/* Enhanced Smoke Particles with Image */}
            <div className="absolute inset-0 pointer-events-none">
              {particles.map((p, i) => (
                <SmokeParticle key={i} {...p} />
              ))}
              {/* Main smoke trail */}
              <motion.div
                className="absolute bg-center bg-no-repeat bg-contain"
                style={{
                  left: "50%",
                  top: "40%",
                  width: "60px",
                  height: "60px",
                  backgroundImage: `ur[](https://pngimg.com/uploads/smoke/small/smoke_PNG55209.png)`,
                  filter: "blur(1px) opacity(0.7)",
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0, 2.5, 0],
                  y: [0, -100, -150],
                  rotate: [0, 15, 0],
                }}
                transition={{ delay: 3.0, duration: 2.5, ease: "easeOut" }}
                aria-hidden="true"
              />
            </div>
          </>
        )}

        {!isValid && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: [-5, 5, -5, 5, 0],
            }}
            transition={{
              delay: 1.5,
              duration: 0.5,
              x: { duration: 0.6, repeat: 3, repeatType: "mirror" },
            }}
          >
            {/* Empty paper for invalid */}
            <motion.div
              className="absolute w-40 h-10 bg-gradient-to-r from-[#f4e4bc] to-[#e8d5a3] rounded-full border-2 border-[#d4af37]/70 shadow-lg"
              initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
              animate={{
                rotate: 0,
                scale: 1,
                opacity: 1,
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              aria-hidden="true"
            />
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4 drop-shadow-lg" aria-hidden="true" />
            <div className="text-xl font-bold text-red-400 text-center">
              <div>Invalid</div>
              <div>Tracking ID</div>
            </div>
          </motion.div>
        )}
       
        <span className="sr-only">
          {isValid ? "Valid tracking ID, loading results" : "Invalid tracking ID"}
        </span>
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

  const handleTrack = async () => {
    const trimmedId = trackingId.trim();
   
    if (!trimmedId) {
      setError("Please enter your tracking ID.");
      return;
    }
   
    const valid = isValidTrackingId(trimmedId);
    setIsValid(valid);
    setShowAnimation(true);
    setLoading(true);
    setError("");
    setTrackingData(null);
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setLoading(false);
   
    if (isValid) {
      setTrackingData(generateFakeTrackingData(trackingId.toUpperCase()));
      setError("");
    } else {
      setError("Invalid tracking ID format. Please use format: KH-123456");
      setTrackingData(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#111827] to-[#1f2937] text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.1),transparent_50%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(250,204,21,0.1),transparent_50%)]" aria-hidden="true" />
      {/* Floating Leaf Icons */}
      <motion.div
        className="absolute top-1/4 left-10 text-[#22c55e]/50 hidden lg:block"
        animate={{ y: [0, -20, 0], rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        aria-hidden="true"
      >
        <Leaf size={32} />
      </motion.div>
      <motion.div
        className="absolute bottom-1/4 right-10 text-[#facc15]/50 hidden lg:block"
        animate={{ y: [0, 20, 0], rotate: [360, 0] }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        aria-hidden="true"
      >
        <Leaf size={28} />
      </motion.div>
      <main className="relative z-10 container mx-auto px-4 py-8 sm:py-12 max-w-5xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-[#22c55e] to-[#facc15] bg-clip-text text-transparent mb-3 sm:mb-4">
            Track Your Order
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 px-4">
            Stay updated with real-time delivery information
          </p>
        </motion.header>
        {/* Tracking Form */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-8 mb-8 sm:mb-12 border border-white/10"
          aria-label="Tracking form"
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <label htmlFor="tracking-id" className="sr-only">
                  Tracking ID
                </label>
                <Input
                  id="tracking-id"
                  type="text"
                  placeholder="Enter tracking ID (e.g., KH-123456)"
                  value={trackingId}
                  onChange={(e) => {
                    setTrackingId(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleTrack();
                    }
                  }}
                  className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-[#22c55e] rounded-lg py-3 text-base"
                  disabled={loading || showAnimation}
                  aria-invalid={!!error}
                  aria-describedby={error ? "tracking-error" : "tracking-hint"}
                  autoComplete="off"
                />
                <p id="tracking-hint" className="text-xs text-gray-400 mt-1 px-1">
                  Format: KH-XXXXXX (6 digits)
                </p>
              </div>
              <Button
                onClick={handleTrack}
                disabled={!trackingId.trim() || loading || showAnimation}
                className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#22c55e] text-white font-semibold px-8 rounded-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-label="Track order"
              >
                {loading || showAnimation ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Loading</span>
                    <span aria-hidden="true">Tracking...</span>
                  </span>
                ) : (
                  "Track"
                )}
              </Button>
            </div>
           
            {error && (
              <motion.p
                id="tracking-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm flex items-center gap-2"
                role="alert"
              >
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                {error}
              </motion.p>
            )}
          </div>
        </motion.section>
        {/* Tracking Animation Overlay */}
        <AnimatePresence>
          {showAnimation && (
            <TrackingAnimation isValid={isValid} onComplete={handleAnimationComplete} />
          )}
        </AnimatePresence>
        {/* Tracking Results */}
        <AnimatePresence mode="wait">
          {trackingData && (
            <motion.section
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10"
              aria-label="Tracking results"
            >
              <header className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  Order #{trackingData.trackingId}
                </h2>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    <span>Estimated Delivery: <time>{trackingData.estimatedDelivery}</time></span>
                  </div>
                  <span className="hidden sm:inline" aria-hidden="true">•</span>
                  <span>Total: {trackingData.orderTotal}</span>
                </div>
              </header>
              {/* Progress Steps */}
              <div
                className="mb-8 overflow-x-auto pb-4 -mx-2 px-2"
                role="list"
                aria-label="Order progress"
              >
                <div className="flex gap-0 min-w-max sm:min-w-0 sm:gap-0">
                  {trackingData.steps.map((step: any, index: number) => (
                    <div key={step.id} role="listitem">
                      <Step step={step} index={index} total={trackingData.steps.length} />
                    </div>
                  ))}
                </div>
              </div>
              {/* Current Step Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center p-6 bg-gradient-to-r from-[#22c55e]/20 to-[#facc15]/20 rounded-xl mb-6"
                role="status"
                aria-live="polite"
              >
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                  {trackingData.currentStep.title}
                  {trackingData.currentStep.status === 'completed' && (
                    <span className="ml-2" aria-label="Completed">✓</span>
                  )}
                </h3>
                <p className="text-sm text-gray-300">{trackingData.currentStep.description}</p>
              </motion.div>
              {/* Email Notification Section */}
              <EmailNotification trackingData={trackingData} />
              {/* CTA */}
              <div className="text-center mt-6 sm:mt-8">
                <Button
                  asChild
                  className="bg-gradient-to-r from-[#facc15] to-[#eab308] hover:from-[#eab308] hover:to-[#facc15] text-gray-900 font-semibold px-8 py-3 rounded-xl w-full sm:w-auto transition-all"
                >
                  <a href="/shop">Continue Shopping</a>
                </Button>
              </div>
            </motion.section>
          )}
          {!trackingData && !showAnimation && !loading && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 px-4"
              role="status"
            >
              <Package size={64} className="mx-auto text-gray-500 mb-4" aria-hidden="true" />
              <p className="text-lg sm:text-xl text-gray-400">
                Enter your tracking ID to view order status
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}