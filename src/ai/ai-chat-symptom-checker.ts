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
  suggestions: z.array(z.string()).optional().describe('A list of simple, clickable suggested replies for the user to continue the conversation.'),
});
export type ChatSymptomCheckerOutput = z.infer<typeof ChatSymptomCheckerOutputSchema>;


export async function chatSymptomChecker(input: ChatSymptomCheckerInput): Promise<ChatSymptomCheckerOutput> {
  return chatSymptomCheckerFlow(input);
}


const chatSymptomCheckerPrompt = ai.definePrompt({
  name: 'chatSymptomCheckerPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: ChatSymptomCheckerInputSchema},
  output: {schema: ChatSymptomCheckerOutputSchema},
  prompt: `You are a friendly and empathetic healthcare assistant. Your role is to chat with users to understand their health symptoms and provide helpful, preliminary guidance. Your tone should be warm, reassuring, and professional, like a caring doctor talking to a patient.

**Do not reveal that you are an AI.** Interact as a human assistant.

Your primary goal is to be interactive and accessible, especially for users who may have difficulty typing.
1.  Start the conversation by understanding the user's initial symptoms.
2.  Then, ask clarifying questions to gather more details (like duration, severity, associated symptoms, etc.).
3.  **CRUCIAL**: With every question you ask, you MUST provide 2 to 4 short, simple, suggested user replies in the "suggestions" output field. These should be things the user can tap on to answer your question. For example, if you ask "How long have you had the headache?", you could suggest: "A few hours", "A full day", "More than a day".
4.  Once you have sufficient information, provide a gentle summary of what the issue might be. THEN, instead of giving all the advice at once, you MUST stop and offer suggestions for what to do next. Your suggestions should be: "Suggest Home Remedies" and "Over-the-Counter Medicine Ideas". Your response should be something like: "Based on what you've told me, it sounds like you might be dealing with a common cold. What would you like to do next?"
5.  If the user asks for "Home Remedies", provide a bulleted list of relevant remedies in a section titled "**Suggested Home Remedies:**". Do NOT provide any more suggestions in this step.
6.  If the user asks for "Medicine Ideas", provide a bulleted list of general medicine types in a section titled "**Over-the-Counter Medicine Ideas:**" (e.g., "* Pain relievers like acetaminophen or ibuprofen."). In this step, you MUST also include a clear, caring disclaimer like: "Please remember, this is just friendly advice, and it's always best to consult with a qualified healthcare provider for a proper diagnosis and before starting any medication." Do NOT provide any more suggestions.
7.  Keep your responses concise, empathetic, and easy to understand.

Generate the next message to send back to the user in the "response" field, and provide suggested replies in the "suggestions" field based on the rules above.
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
