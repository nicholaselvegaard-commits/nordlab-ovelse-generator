import type { WizardData, GeneratedExercise } from './types';
import { buildGenerationPrompt } from './prompt';

export async function generateExercise(
  data: WizardData,
  onProgress?: (chunk: string) => void
): Promise<GeneratedExercise> {
  const prompt = buildGenerationPrompt(data);

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, password: sessionStorage.getItem('demo_password') ?? '' }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Generering feilet: ${error}`);
  }

  // Read streaming response
  const reader = response.body?.getReader();
  if (!reader) throw new Error('Ingen respons fra server.');

  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    fullText += chunk;
    onProgress?.(fullText);
  }

  // Extract JSON — try multiple strategies
  let jsonStr = fullText.trim();

  // Strategy 1: extract from ```json ... ``` block
  const fencedMatch = fullText.match(/```json\s*([\s\S]*?)\s*```/) ||
    fullText.match(/```\s*(\{[\s\S]*)\s*```/);
  if (fencedMatch) {
    jsonStr = fencedMatch[1].trim();
  } else {
    // Strategy 2: find first { and last } in the text
    const firstBrace = fullText.indexOf('{');
    const lastBrace = fullText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      jsonStr = fullText.slice(firstBrace, lastBrace + 1);
    }
  }

  try {
    return JSON.parse(jsonStr) as GeneratedExercise;
  } catch (e) {
    const parseErr = e instanceof Error ? e.message : String(e);
    const tail = jsonStr.slice(-300);
    throw new Error(`JSON parse feilet: ${parseErr} | Slutt på tekst: ${tail}`);
  }
}
