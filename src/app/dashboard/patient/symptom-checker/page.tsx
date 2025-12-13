'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { symptomChecker, SymptomCheckerOutput } from '@/ai/ai-symptom-checker';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  symptoms: z.string().min(10, {
    message: 'Please describe your symptoms in at least 10 characters.',
  }),
});

export default function SymptomCheckerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SymptomCheckerOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await symptomChecker(values);
      setResult(output);
    } catch (error) {
      console.error('Symptom checker error:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to get a response from the AI. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold">AI Symptom Checker</h1>
      <p className="text-muted-foreground">
        Describe your symptoms to get preliminary guidance and care options.
      </p>
      
      <Alert variant="destructive" className="mt-4">
        <AlertTitle>Disclaimer</AlertTitle>
        <AlertDescription>
          This tool provides preliminary guidance and is not a substitute for professional medical advice. Always consult a qualified healthcare provider for any health concerns.
        </AlertDescription>
      </Alert>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Describe Your Symptoms</CardTitle>
          <CardDescription>
            Provide as much detail as possible for a more accurate assessment. For example, mention the duration, intensity, and location of your symptoms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I've had a persistent dry cough and a slight fever for the last 3 days...'"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Analyzing...' : 'Get AI Guidance'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Preliminary Guidance</h3>
              <p className="text-muted-foreground">{result.preliminaryGuidance}</p>
            </div>
            <div>
              <h3 className="font-semibold">Suggested Care Options</h3>
              <p className="text-muted-foreground">{result.suggestedCareOptions}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
