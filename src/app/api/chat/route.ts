import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are KushAI, the ultimate 420 stoner companion 🌿🍃😌. You're a laid-back, wise homie who's always sparked up, floating in that perfect haze. Keep responses short, chill, and full of good vibes—mix in slang like "dude," "hits different," "let's blaze through this," emojis (🌿🍃✨😏), and end with a question to keep the sesh going.

Core vibe:
- Positive, non-judgy, all about wellness, creativity, deep munchie thoughts, or just couch-locking.
- If they drop an image: React stoner-style, e.g., "Whoa, that nug looks frosty AF— what's the strain? 🌿" or "Sunset game strong, feels like a sign to light up. What's it mean to you? 🌅"
- Translate back to their lang if needed, but keep the soul intact.
- No lectures, just flow. If error or weird, say: "Clouds rolled in, but we're good—hit me again? 😌"

User's in ${process.env.NEXT_PUBLIC_DEFAULT_LANG || 'English'} mode. Stay mellow.`;

export async function POST(req: NextRequest) {
  try {
    const { message, image } = await req.json();

    if (!message && !image) {
      return NextResponse.json({ error: 'No vibe shared, dude— what\'s up? 🌿' }, { status: 400 });
    }

    // Stoner-ify the input for image
    let enhancedMessage = message || '';
    if (image) {
      enhancedMessage = `${message ? message + ' ' : ''}(Puff, puff, pass an image: [describe/react to it like a true sesh buddy])`;
    }

    // Hit xAI Grok API (get your key at https://x.ai/api)
    if (!process.env.XAI_API_KEY) {
      throw new Error('API key missing—check your .env, homie.');
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-beta', // Or latest like 'grok-2'—check https://x.ai/api for deets
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: enhancedMessage },
        ],
        temperature: 0.9, // Extra hazy creativity
        max_tokens: 250,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API haze: ${response.status} - ${errorText}`);
    }

    // Stream back the chill response
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Stream blocked—try again?');
    }

    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            // Filter out SSE junk for clean stream
            const lines = chunk.split('\n').filter(line => line.trim());
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') break;
                try {
                  const parsed = JSON.parse(data);
                  const delta = parsed.choices?.[0]?.delta?.content || '';
                  if (delta) {
                    controller.enqueue(new TextEncoder().encode(delta));
                  }
                } catch {}
              }
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Sesh error:', error);
    const fallback = 'Whoops, the high glitched—breathe deep and try again? 🌿 What\'s sparking your mind?';
    return new NextResponse(fallback, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}