'use client';

import { useState } from 'react';
import { Bot, Send, Loader, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { virtualDoctor } from '@/ai/flows/virtual-doctor-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ReactMarkdown from 'react-markdown';


type Message = {
    role: 'user' | 'model';
    content: string;
};

export default function VirtualAssistantPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', content: 'Hello! I am your virtual health assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await virtualDoctor({
                history: messages,
                message: input,
            });

            const modelMessage: Message = { role: 'model', content: response.response };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error('Error calling virtual doctor flow:', error);
            const errorMessage: Message = { role: 'model', content: 'I am sorry, but I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] flex-col">
             <div>
                <h1 className="font-headline text-3xl font-bold">Virtual Health Assistant</h1>
                <p className="text-muted-foreground">
                    Chat with our AI assistant for health advice and information. This is not a substitute for professional medical advice.
                </p>
            </div>
            <Card className="mt-6 flex-1 flex flex-col">
                <CardContent className="flex-1 p-0 flex flex-col">
                    <ScrollArea className="flex-1 p-6 space-y-4">
                       <div className="space-y-6">
                         {messages.map((message, index) => (
                            <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                                {message.role === 'model' && (
                                    <Avatar className="h-9 w-9 border-2 border-primary">
                                        <AvatarFallback><Bot /></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={`max-w-prose rounded-lg p-3 text-sm ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                                    <ReactMarkdown className="prose prose-sm dark:prose-invert">
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                                {message.role === 'user' && (
                                     <Avatar className="h-9 w-9">
                                        <AvatarFallback><User /></AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                             <div className="flex items-start gap-4">
                                <Avatar className="h-9 w-9 border-2 border-primary">
                                    <AvatarFallback><Bot /></AvatarFallback>
                                </Avatar>
                                <div className="max-w-prose rounded-lg bg-secondary p-3 text-sm flex items-center">
                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                    <span>Thinking...</span>
                                </div>
                            </div>
                        )}
                       </div>
                    </ScrollArea>
                    <div className="border-t p-4">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Describe your symptoms..."
                                className="flex-1"
                                disabled={isLoading}
                            />
                            <Button type="submit" disabled={isLoading || !input.trim()}>
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Send</span>
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
