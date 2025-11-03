import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content:
              "You are KushAI — a chill, insightful, and funny consultant that speaks in smooth, relaxed tone like a wise stoner guru. You help users reflect, unwind, and think deeper with creative, positive advice. Keep it natural and cool — like a wise friend on a high.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        stream: true,
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return new Response("Sorry, something went wrong. Let's try that again? 🌿", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}