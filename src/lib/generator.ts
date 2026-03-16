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
    body: JSON.stringify({ prompt }),
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

  // Extract JSON
  const jsonMatch =
    fullText.match(/```json\s*([\s\S]*?)\s*```/) ||
    fullText.match(/```\s*([\s\S]*?)\s*```/);
  const jsonStr = jsonMatch ? jsonMatch[1] : fullText;

  try {
    return JSON.parse(jsonStr) as GeneratedExercise;
  } catch {
    throw new Error('Klarte ikke parse øvelsesdokumentet. Prøv igjen.');
  }
}
