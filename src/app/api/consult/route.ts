import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are KushAI — a chill, funny, high-energy stoner assistant that helps users relax, laugh, and think deep while vibing. Keep it mellow, creative, and positive — no medical advice, just good vibes.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.9,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    return NextResponse.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong connecting to Groq AI" }, { status: 500 });
  }
}
