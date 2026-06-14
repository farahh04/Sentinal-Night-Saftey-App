
'use server';
/**
 * @fileOverview Sentinel Navigation Intelligence - Pakistan Edition.
 * Generates descriptive safe paths and evaluates environmental risk.
 * Optimized for text-based guidance.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SafeRouteSuggestionInputSchema = z.object({
  origin: z.string(),
  destination: z.string(),
  preferences: z.object({
    avoidDarkAlleys: z.boolean().default(true),
    preferMainRoads: z.boolean().default(true),
    avoidDangerZones: z.boolean().default(true),
  }),
  timeOfDay: z.enum(['day', 'evening', 'night', 'late_night']).default('night'),
});

const RouteOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  safetyScore: z.number(),
  distance: z.string(),
  duration: z.string(),
  factors: z.array(z.string()).describe("Detailed text-based street-by-street safe segments."),
  waypoints: z.array(z.object({ lat: z.number(), lng: z.number() })),
  dangerZones: z.array(z.object({
    name: z.string(),
    lat: z.number(),
    lng: z.number(),
    risk: z.enum(['Low', 'Medium', 'High']),
    reason: z.string(),
  })),
});

const SafeRouteSuggestionOutputSchema = z.object({
  options: z.array(RouteOptionSchema),
  safetyTips: z.array(z.string()),
});

export type SafeRouteSuggestionOutput = z.infer<typeof SafeRouteSuggestionOutputSchema>;

const safeRoutePrompt = ai.definePrompt({
  name: 'safeRouteSuggestionPrompt',
  model: 'googleai/gemini-2.5-flash-lite',
  input: {schema: SafeRouteSuggestionInputSchema},
  output: {schema: SafeRouteSuggestionOutputSchema},
  prompt: `You are a Pakistan Tactical Safety Expert. Generate TWO descriptive route options between:
Origin: {{{origin}}}
Destination: {{{destination}}}
Time: {{{timeOfDay}}}

PAKISTAN SAFETY CONTEXT (TEXTUAL PATHFINDING):
- Karachi: Prioritize Shahrah-e-Faisal, Sunset Blvd, and Korangi Road (Main). Avoid dark interior streets of P.E.C.H.S or Gulshan.
- Lahore: Prioritize Ferozepur Road, Canal Bank Road (Well-lit parts), and DHA Main Boulevards.
- Islamabad: Stick to Blue Area, Jinnah Ave, and Sector Main Roads (Aga Khan Rd, etc).

REQUIREMENTS:
1. Provide extremely detailed 'factors'. Each factor should be a text-based safe segment (e.g. "Take Main Khayaban-e-Ittehad - High visibility and frequent DHA patrols").
2. Option 1 MUST be the "Safest" (Main boulevards, maximum lighting).
3. Option 2 can be "Alternative" (Shorter, perhaps less commercial).
4. Identify specific Danger Zones (street corners, underpasses) along these paths with reasons.

Return ONLY valid JSON.`,
});

export async function safeRouteSuggestion(input: z.infer<typeof SafeRouteSuggestionInputSchema>): Promise<SafeRouteSuggestionOutput> {
  try {
    const {output} = await safeRoutePrompt(input);
    return output!;
  } catch (e) {
    console.error("Navigation AI Error:", e);
    return {
      options: [
        {
          id: "route_fallback_1",
          name: "Standard Safety Path (Main Blvd)",
          safetyScore: 85,
          distance: "2.5 km",
          duration: "15 min",
          factors: [
            "Exit origin and head strictly towards the nearest Main Boulevard.",
            "Stay on the central lit lane of the boulevard.",
            "Maintain visibility near active commercial areas (shops/banks).",
            "Final approach through well-guarded residential gates."
          ],
          waypoints: [{ lat: 24.8607, lng: 67.0011 }, { lat: 24.8707, lng: 67.0111 }],
          dangerZones: []
        }
      ],
      safetyTips: ["Stick to main commercial roads with high footfall."]
    };
  }
}
