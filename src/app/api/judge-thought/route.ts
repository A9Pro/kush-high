import { NextResponse } from "next/server";
import OpenAI from "openai";

const DEEP_RESPONSES = [
  "🌿 Deep Truth 💭 — Whoa, that's some next-level cosmic wisdom. The universe just nodded.",
  "🧠 Profound Insight 🌌 — Damn, you're channeling ancient sages. Pass the joint; this needs pondering.",
  "✨ Enlightened Vibes 🔮 — Straight fire from the higher planes. You're onto something eternal.",
  "🌊 Existential Gold 🌀 — Layers upon layers... this hits different. KushAI approves.",
  "💎 Hidden Truth Revealed 🌿 — You've cracked the code. Reality's glitching in agreement."
];

const HILARIOUS_RESPONSES = [
  "😂 High Nonsense 💨 — Peak baked brilliance! Who needs logic when you've got vibes?",
  "🤪 Stoned Shenanigans 🍃 — Hilarious AF. Your brain's on vacation—permanently.",
  "😆 Absurdly Awesome 🌪️ — Nonsense level: expert. But hey, it's the best kind of chaos.",
  "🎉 Wildly Wasted Wisdom 💥 — You're a legend in the lounge. Laughs guaranteed.",
  "🌀 Trippy Tomfoolery 🚀 — Baked beyond belief, but infinitely entertaining. More please!"
];

export async function POST(req: Request) {
  const { thought } = await req.json();

  if (!thought) {
    return NextResponse.json({ error: "No thought provided" }, { status: 400 });
  }

  // Initialize OpenAI client inside handler
  const openai = new OpenAI({
    apiKey: process.env.XAI_API_KEY, // Use server-side env var (not NEXT_PUBLIC_)
    baseURL: "https://api.x.ai/v1",
    timeout: 3600,
  });

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are KushAI, a chill stoner oracle. Judge the user's thought: if it's profound/philosophical, respond with a 'Deep Truth' vibe from this list, adding witty commentary: ${JSON.stringify(DEEP_RESPONSES)}. If it's silly/munchie-related, use 'High Nonsense' from: ${JSON.stringify(HILARIOUS_RESPONSES)}. Keep it fun, under 100 words, emoji-heavy.`
        },
        {
          role: "user",
          content: `Judge this high thought: "${thought}"`
        }
      ],
      model: "grok-beta",
      stream: false,
      temperature: 0.8,
    });

    const result = completion.choices[0].message.content || "🤔 KushAI is pondering the vibes...";
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("xAI API Error:", error);
    return NextResponse.json(
      { error: "Vibes jammed—check your connection or API key." },
      { status: 500 }
    );
  }
}