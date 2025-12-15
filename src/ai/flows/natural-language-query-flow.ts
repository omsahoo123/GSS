'use server';
/**
 * @fileOverview A flow for converting natural language to a SQL-like query.
 *
 * - naturalLanguageToQuery - A function that handles the conversion process.
 * - NaturalLanguageToQueryInput - The input type for the function.
 * - NaturalLanguageToQueryOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const NaturalLanguageToQueryInputSchema = z.object({
  question: z.string().describe('The natural language question to convert to a query.'),
});
export type NaturalLanguageToQueryInput = z.infer<typeof NaturalLanguageToQueryInputSchema>;

const NaturalLanguageToQueryOutputSchema = z.object({
  query: z.string().describe('The generated SQL-like query.'),
  results: z.object({
    columns: z.array(z.string()).describe('The columns of the result set.'),
    rows: z.array(z.record(z.any())).describe('The rows of the result set.'),
  }).describe('The mock results of the query.'),
});
export type NaturalLanguageToQueryOutput = z.infer<typeof NaturalLanguageToQueryOutputSchema>;

export async function naturalLanguageToQuery(input: NaturalLanguageToQueryInput): Promise<NaturalLanguageToQueryOutput> {
  return naturalLanguageToQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'naturalLanguageToQueryPrompt',
  input: { schema: NaturalLanguageToQueryInputSchema },
  output: { schema: NaturalLanguageToQueryOutputSchema },
  prompt: `You are a data analyst expert. Your task is to convert a natural language question into a SQL-like query and provide mock results for it.

The available tables are:
- 'disease_incidents' (columns: incident_id, patient_id, disease_name, region, incident_date)
- 'patients' (columns: patient_id, name, age, gender)
- 'hospital_resources' (columns: hospital_id, region, bed_capacity, current_occupancy)

Based on the user's question, generate a plausible SQL-like query.

Then, create a realistic but brief set of mock data (3-5 rows) that would be the result of running that query.

User Question: {{{question}}}
`,
});

const naturalLanguageToQueryFlow = ai.defineFlow(
  {
    name: 'naturalLanguageToQueryFlow',
    inputSchema: NaturalLanguageToQueryInputSchema,
    outputSchema: NaturalLanguageToQueryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
