'use server';
/**
 * @fileOverview AI-powered symptom checker for preliminary guidance and care options.
 *
 * - symptomChecker - A function that takes user-reported symptoms and provides guidance.
 * - SymptomCheckerInput - The input type for the symptomChecker function.
 * - SymptomCheckerOutput - The return type for the symptomChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomCheckerInputSchema = z.object({
  symptoms: z.string().describe('A detailed description of the symptoms experienced by the user.'),
});
export type SymptomCheckerInput = z.infer<typeof SymptomCheckerInputSchema>;

const SymptomCheckerOutputSchema = z.object({
  preliminaryGuidance: z.string().describe('Preliminary guidance based on the symptoms provided.'),
  suggestedCareOptions: z.string().describe('Suggested care options based on the symptoms provided.'),
});
export type SymptomCheckerOutput = z.infer<typeof SymptomCheckerOutputSchema>;

export async function symptomChecker(input: SymptomCheckerInput): Promise<SymptomCheckerOutput> {
  return symptomCheckerFlow(input);
}

const symptomCheckerPrompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckerInputSchema},
  output: {schema: SymptomCheckerOutputSchema},
  prompt: `You are an AI-powered symptom checker designed to provide preliminary guidance to patients based on their reported symptoms, even with low bandwidth conditions.

  Symptoms reported: {{{symptoms}}}

  Based on these symptoms, provide preliminary guidance and suggest appropriate care options. Focus on clarity and brevity to ensure the information is easily accessible even with limited bandwidth.

  Output the preliminary guidance in the "preliminaryGuidance" field, and the suggested care options in the "suggestedCareOptions" field.
`,
});

const symptomCheckerFlow = ai.defineFlow(
  {
    name: 'symptomCheckerFlow',
    inputSchema: SymptomCheckerInputSchema,
    outputSchema: SymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await symptomCheckerPrompt(input);
    return output!;
  }
);
