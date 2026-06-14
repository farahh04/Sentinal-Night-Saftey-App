
'use server';
/**
 * @fileOverview An AI-driven verbal support system providing check-ins and safety awareness prompts.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const SafetyVoiceCompanionCheckInInputSchema = z.object({
  userLocation: z.string(),
  timeSinceLastCheckInMinutes: z.number(),
  userState: z.string().optional(),
});
export type SafetyVoiceCompanionCheckInInput = z.infer<typeof SafetyVoiceCompanionCheckInInputSchema>;

const SafetyVoiceCompanionCheckInOutputSchema = z.object({
  audioDataUri: z.string(),
  textContent: z.string(),
});
export type SafetyVoiceCompanionCheckInOutput = z.infer<typeof SafetyVoiceCompanionCheckInOutputSchema>;

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  const wav = await import('wav');
  return new Promise((resolve, reject) => {
    const writer = new wav.default.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', function (d: Buffer) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const safetyVoiceCompanionCheckInPrompt = ai.definePrompt({
  name: 'safetyVoiceCompanionCheckInPrompt',
  model: 'googleai/gemini-2.5-flash-lite',
  input: { schema: SafetyVoiceCompanionCheckInInputSchema },
  output: { schema: z.object({ checkInMessage: z.string() }) },
  prompt: `You are a friendly safety companion AI named Sentinel. Generate a brief check-in for a user in Pakistan at {{{userLocation}}}.`,
});

export async function safetyVoiceCompanionCheckIn(
  input: SafetyVoiceCompanionCheckInInput
): Promise<SafetyVoiceCompanionCheckInOutput> {
  try {
    const { output } = await safetyVoiceCompanionCheckInPrompt(input);
    const textContent = output?.checkInMessage || 'I am here to help keep you safe.';

    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: textContent,
    });

    if (!media) throw new Error('No audio media returned');

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: 'data:audio/wav;base64,' + wavBase64,
      textContent,
    };
  } catch (e) {
    return { audioDataUri: '', textContent: "I'm with you on your journey." };
  }
}
