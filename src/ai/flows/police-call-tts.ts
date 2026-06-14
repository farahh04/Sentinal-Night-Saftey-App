
'use server';
/**
 * @fileOverview Generates an automated emergency call for Pakistan Police.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

const PoliceCallInputSchema = z.object({
  incidentType: z.string(),
  locationName: z.string(),
  coordinates: z.string(),
  userName: z.string(),
});

async function toWav(pcmData: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({ channels: 1, sampleRate: 24000, bitDepth: 16 });
    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));
    writer.write(pcmData);
    writer.end();
  });
}

export async function generatePoliceEmergencyCall(input: z.infer<typeof PoliceCallInputSchema>) {
  const promptText = `This is an automated emergency call from SafeWalk Pakistan. 
  A user named ${input.userName} is in immediate danger. 
  Incident Type: ${input.incidentType}.
  Location: ${input.locationName}.
  Coordinates: ${input.coordinates}.
  Please dispatch a patrol unit immediately. A live tracking link has been sent to your digital dashboard.`;

  const { media } = await ai.generate({
    model: googleAI.model('gemini-2.5-flash-preview-tts'),
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Algenib' } } },
    },
    prompt: promptText,
  });

  if (!media) throw new Error('TTS Failed');
  const audioBuffer = Buffer.from(media.url.split(',')[1], 'base64');
  return {
    audioDataUri: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    textContent: promptText,
  };
}
