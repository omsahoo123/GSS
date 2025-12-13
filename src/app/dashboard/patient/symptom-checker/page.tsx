'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { chatSymptomChecker } from '@/ai/ai-chat-symptom-checker';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, User, Bot } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  message: z.string().min(1, {
    message: 'Please enter a message.',
  }),
});

type Message = {
  role: 'user' | 'bot' | 'model';
  text: string;
};

const welcomeMessage: Message = {
  role: 'bot',
  text: "Hello! I'm your virtual doctor. Please describe the symptoms you're experiencing. For example, you could say, 'I have a sore throat and a headache.'",
};

export default function SymptomCheckerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const userMessage: Message = { role: 'user', text: values.message };
    const newMessages: Message[] = [...messages, userMessage];
    setMessages(newMessages);
    form.reset();

    try {
      // The AI expects a slightly different message format ('model' instead of 'bot')
      const historyForAI = newMessages.map(m => ({
        role: m.role === 'bot' ? 'model' : 'user',
        content: m.text,
      }));


      const output = await chatSymptomChecker({
        history: historyForAI,
      });

      const botMessage: Message = { role: 'bot', text: output.response };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Symptom checker error:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to get a response from the AI. Please try again.',
      });
      // If AI fails, remove the user message to allow them to try again
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="font-headline text-3xl font-bold">AI Symptom Checker</h1>
        <p className="text-muted-foreground">
          Chat with our AI to get preliminary guidance and care options.
        </p>
      </div>

      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Disclaimer</AlertTitle>
        <AlertDescription>
          This tool provides preliminary guidance and is not a substitute for professional medical advice. Always consult a qualified healthcare provider for any health concerns.
        </AlertDescription>
      </Alert>

      <Card className="flex flex-1 flex-col">
        <CardHeader>
          <CardTitle>Chat Session</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="space-y-4 pr-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'bot' && (
                    <div className="bg-primary/20 p-2 rounded-full">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-md rounded-lg p-3 text-sm',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <p>{message.text}</p>
                  </div>
                   {message.role === 'user' && (
                     <div className="bg-muted p-2 rounded-full">
                       <User className="h-6 w-6 text-muted-foreground" />
                     </div>
                   )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3 justify-start">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                   <div className="bg-muted rounded-lg p-3">
                     <Loader2 className="h-5 w-5 animate-spin text-primary" />
                   </div>
                 </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-start gap-2">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Type your message..."
                        autoComplete="off"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </Form>
        </CardFooter>
      </Card>
    </div>
  );
}
