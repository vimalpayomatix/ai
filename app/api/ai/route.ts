import { NextRequest } from 'next/server';

const EXTERNAL_AI_URL = 'https://backed-ai.vercel.app/api/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Forward the request to the external AI API with JSON body.
    const upstream = await fetch(EXTERNAL_AI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const text = await upstream.text();

    // Try to maintain JSON response if possible.
    try {
      const json = JSON.parse(text);
      return new Response(JSON.stringify(json), {
        status: upstream.status,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch {
      return new Response(text, { status: upstream.status });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}


