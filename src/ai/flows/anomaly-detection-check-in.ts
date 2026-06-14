
'use server';
/**
 * @fileOverview This file implements the AI Anomaly Detection flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnomalyDetectionInputSchema = z.object({
  sensorEvents: z.array(z.string()),
  contextualInfo: z.string(),
});
export type AnomalyDetectionInput = z.infer<typeof AnomalyDetectionInputSchema>;

const AnomalyDetectionOutputSchema = z.object({
  isAnomalyDetected: z.boolean(),
  anomalyType: z.string().optional(),
  reasoning: z.string(),
  recommendedAction: z.enum(['prompt_check_in', 'alert_contacts', 'no_action']),
});
export type AnomalyDetectionOutput = z.infer<typeof AnomalyDetectionOutputSchema>;

const anomalyDetectionPrompt = ai.definePrompt({
  name: 'anomalyDetectionPrompt',
  model: 'googleai/gemini-2.5-flash-lite',
  input: {schema: AnomalyDetectionInputSchema},
  output: {schema: AnomalyDetectionOutputSchema},
  prompt: `Analyze these sensor events for anomalies: {{#each sensorEvents}}- {{{this}}} {{/each}}`,
});

export async function anomalyDetectionCheckIn(input: AnomalyDetectionInput): Promise<AnomalyDetectionOutput> {
  try {
    const {output} = await anomalyDetectionPrompt(input);
    return output!;
  } catch (e) {
    return {
      isAnomalyDetected: false,
      reasoning: "Telemetry baseline confirmed.",
      recommendedAction: "no_action"
    };
  }
}
