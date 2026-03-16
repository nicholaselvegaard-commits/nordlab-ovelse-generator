import type { WizardData, GeneratedExercise } from './types';
import { buildGenerationPrompt } from './prompt';

export async function generateExercise(data: WizardData): Promise<GeneratedExercise> {
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

  const { content } = await response.json();

  // Extract JSON from response (Claude may wrap in ```json ... ```)
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
                    content.match(/```\s*([\s\S]*?)\s*```/);
  const jsonStr = jsonMatch ? jsonMatch[1] : content;

  try {
    return JSON.parse(jsonStr) as GeneratedExercise;
  } catch {
    throw new Error('Klarte ikke parse øvelsesdokumentet. Prøv igjen.');
  }
}
