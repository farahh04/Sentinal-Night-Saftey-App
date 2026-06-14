import { config } from 'dotenv';
config();

import '@/ai/flows/safe-route-suggestion.ts';
import '@/ai/flows/live-safety-confidence-score.ts';
import '@/ai/flows/safety-voice-companion-check-in.ts';
import '@/ai/flows/anomaly-detection-check-in.ts';