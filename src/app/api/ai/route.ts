import { NextResponse } from "next/server";
import OpenAI from "openai";

// Remove the module-level initialization and move it inside the handler
// This ensures it only runs when the API is actually called, not during build

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ error: "No message provided" }, { status: 400 });
  }

  // Initialize OpenAI client inside the handler
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // you can change to gpt-4o for extra juice
      messages: [
        {
          role: "system",
          content: `
          You are Kush High AI — a chill, relaxed, stoner-friendly assistant who talks with positive, calm, funny vibes.
          Your style: like a wise friend who's high but insightful.
          Avoid medical advice or illegal claims. You can talk about chill topics, mindset, creativity, weed culture, or philosophical stuff.
          Keep it conversational, warm, and funny when needed.
          `,
        },
        { role: "user", content: message },
      ],
    });

    const aiReply = completion.choices[0].message?.content || "Vibes only 🌿";
    return NextResponse.json({ reply: aiReply });
  } catch (error: any) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: "AI could not respond right now 🌫️" },
      { status: 500 }
    );
  }
}