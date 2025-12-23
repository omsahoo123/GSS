'use server';
/**
 * @fileOverview A virtual doctor AI agent.
 *
 * - virtualDoctor - A function that handles the conversation with the virtual doctor.
 * - VirtualDoctorInput - The input type for the virtualDoctor function.
 * - VirtualDoctorOutput - The return type for the virtualDoctor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const Message = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});

const VirtualDoctorInputSchema = z.object({
  history: z.array(Message).describe("The conversation history between the user and the model."),
  message: z.string().describe('The latest message from the user.'),
});
export type VirtualDoctorInput = z.infer<typeof VirtualDoctorInputSchema>;

const VirtualDoctorOutputSchema = z.object({
  response: z.string().describe("The virtual doctor's response to the user."),
});
export type VirtualDoctorOutput = z.infer<typeof VirtualDoctorOutputSchema>;

export async function virtualDoctor(input: VirtualDoctorInput): Promise<VirtualDoctorOutput> {
  return virtualDoctorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'virtualDoctorPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: VirtualDoctorInputSchema},
  output: {schema: VirtualDoctorOutputSchema},
  prompt: `You are a friendly and empathetic AI-powered virtual doctor for a service called Grameen Swasthya Setu, which serves rural communities in India. Your goal is to help patients with their health concerns.

  Your instructions are:
  1.  **Analyze the User's Message:** Carefully read the user's message and the conversation history to understand their symptoms and questions.
  2.  **Ask Clarifying Questions:** If the user's description is vague, ask simple, clear questions to get more details (e.g., "How long have you had this cough?", "Is the pain sharp or dull?").
  3.  **Provide a Potential Diagnosis:** Based on the symptoms, suggest one or two possible, common conditions. Use simple, easy-to-understand language.
  4.  **Suggest Home Remedies & OTC Medicine:** For mild conditions, recommend safe home remedies (e.g., rest, hydration, salt water gargle) and common over-the-counter (OTC) medicines available in India (e.g., Paracetamol for fever, an antacid for indigestion).
  5.  **Crucial Safety Warning:** ALWAYS include a clear disclaimer that you are an AI assistant, not a real doctor, and that your advice is for informational purposes only. Strongly recommend consulting a real doctor for a proper diagnosis and treatment, especially if symptoms are severe or persistent.
  6.  **Maintain a Caring Tone:** Be polite, patient, and reassuring throughout the conversation.

  Here is the conversation history:
  {{#each history}}
  - **{{role}}**: {{content}}
  {{/each}}
  
  **User's latest message**: "{{message}}"
  
  Based on this, generate a helpful and safe response.`,
});

const virtualDoctorFlow = ai.defineFlow(
  {
    name: 'virtualDoctorFlow',
    inputSchema: VirtualDoctorInputSchema,
    outputSchema: VirtualDoctorOutputSchema,
  },
  async input => {
    const llmResponse = await prompt(input);
    const output = llmResponse.output;

    if (!output) {
      return { response: 'I am sorry, but I am unable to provide a response at this time. Please try again later.' };
    }
    
    return { response: output.response };
  }
);
