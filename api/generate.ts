export const config = { runtime: 'edge', maxDuration: 60 };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    const { prompt, password } = body;

    if (!prompt) return new Response('Missing prompt', { status: 400 });

    const demoPassword = process.env.DEMO_PASSWORD;
    if (demoPassword && password !== demoPassword) {
      return new Response('Feil passord', { status: 401 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return new Response('ANTHROPIC_API_KEY not set', { status: 500 });

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 8000,
        stream: true,
        system: 'Du er et JSON-genereringssystem. Svar KUN med et gyldig JSON-objekt. Ingen markdown, ingen forklaring, ingen ```-blokker. Bare rent JSON som starter med { og slutter med }.',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text();
      return new Response(`Anthropic API error ${anthropicRes.status}: ${err}`, { status: 500 });
    }

    // Forward raw SSE stream to client — zero CPU in edge function
    return new Response(anthropicRes.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(`Function error: ${msg}`, { status: 500 });
  }
}
