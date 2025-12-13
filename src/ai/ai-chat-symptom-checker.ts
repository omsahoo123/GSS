'use server';
/**
 * @fileOverview An interactive, conversational AI symptom checker.
 *
 * - chatSymptomChecker - A function that takes the current user message and chat history.
 * - ChatSymptomCheckerInput - The input type for the chatSymptomChecker function.
 * - ChatSymptomCheckerOutput - The return type for the chatSymptomChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatSymptomCheckerInputSchema = z.object({
  history: z.array(MessageSchema).describe('The history of messages in the current session.'),
});
export type ChatSymptomCheckerInput = z.infer<typeof ChatSymptomCheckerInputSchema>;

const ChatSymptomCheckerOutputSchema = z.object({
  response: z.string().describe("The AI's next response in the conversation."),
});
export type ChatSymptomCheckerOutput = z.infer<typeof ChatSymptomCheckerOutputSchema>;


export async function chatSymptomChecker(input: ChatSymptomCheckerInput): Promise<ChatSymptomCheckerOutput> {
  return chatSymptomCheckerFlow(input);
}


const chatSymptomCheckerPrompt = ai.definePrompt({
  name: 'chatSymptomCheckerPrompt',
  input: {schema: ChatSymptomCheckerInputSchema},
  output: {schema: ChatSymptomCheckerOutputSchema},
  prompt: `You are an AI-powered symptom checker designed to provide preliminary guidance to patients through a conversational chat. Behave like a chatbot.

  Your goal is to be interactive. Start by understanding the user's initial symptoms, then ask clarifying questions to gather more information before providing guidance.

  Your Task:
  1.  Analyze the full conversation history to understand the context.
  2.  If you don't have enough information (like duration, severity, or related symptoms), ask a specific follow-up question.
  3.  If you have enough information, provide preliminary guidance and suggest appropriate care options (e.g., rest, hydration, see a doctor, etc.).
  4.  Keep your responses concise and easy to understand.

  Generate the next message to send back to the user in the "response" field.
  `,
  messages: ({history}) => history.map(m => ({role: m.role, content: [{text: m.content}]})),
});

const chatSymptomCheckerFlow = ai.defineFlow(
  {
    name: 'chatSymptomCheckerFlow',
    inputSchema: ChatSymptomCheckerInputSchema,
    outputSchema: ChatSymptomCheckerOutputSchema,
  },
  async (input) => {
    const {output} = await chatSymptomCheckerPrompt(input);
    return output!;
  }
);
