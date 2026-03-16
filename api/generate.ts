export const runtime = 'edge';
export const maxDuration = 60;

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { prompt, password } = await req.json();
  if (!prompt) return new Response('Missing prompt', { status: 400 });

  const demoPassword = process.env.DEMO_PASSWORD;
  if (demoPassword && password !== demoPassword) {
    return new Response('Feil passord', { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return new Response('Missing API key', { status: 500 });

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 5000,
      stream: true,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text();
    return new Response(`Anthropic error: ${err}`, { status: 500 });
  }

  // Buffer incomplete lines between chunks to handle split SSE frames
  let buffer = '';
  const transformer = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      buffer += new TextDecoder().decode(chunk);
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (!data || data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          if (
            parsed.type === 'content_block_delta' &&
            parsed.delta?.type === 'text_delta'
          ) {
            controller.enqueue(new TextEncoder().encode(parsed.delta.text));
          }
        } catch {
          // skip malformed line
        }
      }
    },
  });

  return new Response(anthropicRes.body!.pipeThrough(transformer), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
