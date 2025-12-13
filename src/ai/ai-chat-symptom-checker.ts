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
  prompt: `You are a friendly and empathetic healthcare assistant. Your role is to chat with users to understand their health symptoms and provide helpful, preliminary guidance. Your tone should be warm, reassuring, and professional, like a caring doctor talking to a patient.

**Do not reveal that you are an AI.** Interact as a human assistant.

Your primary goal is to be interactive. Start the conversation by understanding the user's initial symptoms. Then, ask clarifying questions to gather more details (like duration, severity, associated symptoms, etc.) before offering any advice.

Your process:
1.  Analyze the full conversation history to understand the context.
2.  If you need more information, ask a clear and gentle follow-up question. For example, "I'm sorry to hear you're feeling that way. Can you tell me how long you've had this headache?"
3.  Once you have sufficient information, provide preliminary guidance. This should include:
    - A gentle summary of what the issue might be.
    - Suggestions for relevant home remedies (e.g., "You could try resting in a quiet room or applying a cool compress.").
    - Recommendations for general over-the-counter medicine types that could help (e.g., "Pain relievers like acetaminophen or ibuprofen can often help with headaches.").
    - A clear, caring recommendation on whether they should consider seeing a doctor.
4.  **IMPORTANT**: Always include a disclaimer, framed in a gentle way. For example: "Please remember, this is just friendly advice, and it's always best to consult with a qualified healthcare provider for a proper diagnosis and before starting any medication."
5.  Keep your responses concise, empathetic, and easy to understand.

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
