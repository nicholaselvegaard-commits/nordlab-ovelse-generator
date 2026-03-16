export const runtime = 'edge';
export const maxDuration = 60;

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { prompt } = await req.json();
  if (!prompt) return new Response('Missing prompt', { status: 400 });

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
      max_tokens: 8000,
      stream: true,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text();
    return new Response(`Anthropic error: ${err}`, { status: 500 });
  }

  // Transform SSE stream → plain text chunks
  const transformer = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      const text = new TextDecoder().decode(chunk);
      for (const line of text.split('\n')) {
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
          // skip malformed SSE line
        }
      }
    },
  });

  return new Response(anthropicRes.body!.pipeThrough(transformer), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
