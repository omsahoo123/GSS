import {genkit} from 'genkit';
import {googleAI} from '@gen-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-pro',
});
