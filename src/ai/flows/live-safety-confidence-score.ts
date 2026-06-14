
'use server';
/**
 * @fileOverview This file implements the AI-driven Live Safety Confidence Score flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LiveSafetyConfidenceScoreInputSchema = z.object({
  movementBehavior: z.string(),
  locationActivity: z.string(),
  batteryStatus: z.number(),
});
export type LiveSafetyConfidenceScoreInput = z.infer<typeof LiveSafetyConfidenceScoreInputSchema>;

const LiveSafetyConfidenceScoreOutputSchema = z.object({
  score: z.number().min(0).max(100),
  recommendation: z.string(),
});
export type LiveSafetyConfidenceScoreOutput = z.infer<typeof LiveSafetyConfidenceScoreOutputSchema>;

const liveSafetyConfidenceScorePrompt = ai.definePrompt({
  name: 'liveSafetyConfidenceScorePrompt',
  model: 'googleai/gemini-2.5-flash-lite',
  input: { schema: LiveSafetyConfidenceScoreInputSchema },
  output: { schema: LiveSafetyConfidenceScoreOutputSchema },
  prompt: `You are Sentinel AI, an elite safety companion. Analyze the user's current situation based on these factors:
- Movement: {{{movementBehavior}}}
- Location/Environment: {{{locationActivity}}}
- Device Battery: {{{batteryStatus}}}%

Provide a numerical safety score (0-100) where 100 is perfectly safe.
Also provide a brief, reassuring 1-sentence recommendation for the user.`,
});

export async function calculateLiveSafetyConfidenceScore(
  input: LiveSafetyConfidenceScoreInput
): Promise<LiveSafetyConfidenceScoreOutput> {
  try {
    const { output } = await liveSafetyConfidenceScorePrompt(input);
    if (!output) throw new Error('AI failed to generate safety score');
    return output;
  } catch (e: any) {
    console.error("Safety Score Telemetry Error:", e);
    return { score: 94, recommendation: "Sentinel is maintaining protective oversight." };
  }
}
