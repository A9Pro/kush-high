"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Music, Coffee, Gamepad2 } from "lucide-react";

export default function KushModePage() {
  const [messages, setMessages] = useState([
    { from: "ai", text: "Yo 🌿 Welcome to Kush Mode — your high-vibe zone!" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setTimeout(() => {
      const aiReplies = [
        "Haha nice one 😎",
        "That sounds deep, bro...",
        "You ever thought about how snacks are just crunchy dreams?",
        "Try listening to some Smino while you chill 🌈",
      ];
      const randomReply = aiReplies[Math.floor(Math.random() * aiReplies.length)];
      setMessages((prev) => [...prev, { from: "ai", text: randomReply }]);
    }, 1000);
    setInput("");
  };

  const vibes = [
    { icon: <Music />, text: "Play 'Kush & Orange Juice' 🍊" },
    { icon: <Coffee />, text: "Grab some munchies 🍪" },
    { icon: <Gamepad2 />, text: "Spin the blunt wheel 🎮" },
    { icon: <Sparkles />, text: "Think about life... or don’t 🌌" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b0b] via-[#1c1c1c] to-[#000000] text-white flex flex-col items-center justify-center px-4 py-10">
      {/* Hero Section */}
      <motion.h1
        className="text-6xl font-extrabold text-green-400 mb-10 drop-shadow-lg text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🌬️ Welcome to Kush Mode
      </motion.h1>
      <p className="text-gray-300 text-lg mb-8 text-center max-w-2xl">
        A chill space for stoners, dreamers, and deep thinkers. Talk to your AI Kush Consultant,
        vibe out, or play a relaxing mini-game while you float through the session.
      </p>

      {/* AI Chat Box */}
      <Card className="bg-black/40 border border-green-400/40 rounded-2xl w-full max-w-3xl mb-10 shadow-lg">
        <CardContent className="p-6 max-h-[400px] overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-xl w-fit max-w-[80%] ${
                msg.from === "ai"
                  ? "bg-green-500/20 border border-green-400/30"
                  : "bg-gray-800/80 self-end ml-auto border border-gray-700"
              }`}
            >
              {msg.text}
            </motion.div>
          ))}
        </CardContent>
        <div className="flex p-4 border-t border-green-400/20">
          <input
            className="flex-1 bg-transparent text-white border border-green-400/40 rounded-xl px-4 py-2 focus:outline-none"
            placeholder="Say something chill..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button
            onClick={handleSend}
            className="ml-2 bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-2 rounded-xl"
          >
            Send
          </Button>
        </div>
      </Card>

      {/* Chill Game Section */}
      <motion.div
        className="bg-green-500/10 border border-green-400/40 rounded-2xl p-6 mb-10 max-w-lg text-center shadow-lg"
        whileHover={{ scale: 1.05 }}
      >
        <h2 className="text-2xl font-bold text-green-400 mb-3">🎮 Mini Chill Game</h2>
        <p className="text-gray-300 mb-4">
          Spin the blunt and see what vibe you land on...
        </p>
        <Button
          className="bg-green-500 hover:bg-green-400 text-black font-semibold"
          onClick={() => alert("🔥 You landed on 'Deep Thoughts Mode' 🌌")}
        >
          Spin the Blunt
        </Button>
      </motion.div>

      {/* Mood Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {vibes.map((vibe, i) => (
          <Card key={i} className="bg-black/40 border border-green-400/30 rounded-2xl p-6 text-center hover:bg-green-400/10 transition">
            <div className="flex justify-center mb-3 text-green-400">{vibe.icon}</div>
            <p>{vibe.text}</p>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <Button className="bg-green-500 hover:bg-green-400 text-black font-semibold text-lg px-8 py-4 rounded-2xl shadow-lg">
        Join the Kush Consultation 🌿
      </Button>
    </div>
  );
}
