
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlayCircle, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NaturalLanguageToQueryOutput, naturalLanguageToQuery } from '@/ai/flows/natural-language-query-flow';

export default function DataQueriesPage() {
  const [question, setQuestion] = useState('How many flu cases were there in Aligarh last month?');
  const [generatedQuery, setGeneratedQuery] = useState('');
  const [results, setResults] = useState<NaturalLanguageToQueryOutput['results'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRunQuery = async () => {
    if (!question.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Question',
        description: 'Please enter a question to generate a query.',
      });
      return;
    }
    setIsLoading(true);
    setResults(null);
    setGeneratedQuery('');
    
    try {
      const output = await naturalLanguageToQuery({ question });
      setGeneratedQuery(output.query);
      setResults(output.results);
      toast({
        title: 'Query Generated Successfully',
        description: `Returned ${output.results.rows.length} rows.`,
      });
    } catch (error) {
      console.error('Error generating query:', error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Could not generate query. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Natural Language Querying</h1>
        <p className="text-muted-foreground">
          Ask a question in plain English, and AI will generate the query and results for you.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
          <CardDescription>
            For example: "Show me the average age of patients in Rampur."
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full max-w-xl items-center space-x-2">
             <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question here..."
              />
              <Button onClick={handleRunQuery} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate
              </Button>
          </div>
        </CardContent>
      </Card>
      
       {generatedQuery && (
         <Card>
            <CardHeader>
                <CardTitle>Generated Query</CardTitle>
                <CardDescription>This is the SQL-like query the AI generated from your question.</CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea
                    value={generatedQuery}
                    readOnly
                    className="h-40 font-mono text-sm bg-secondary/50"
                />
            </CardContent>
         </Card>
      )}
      
      {results && (
         <Card>
            <CardHeader>
                <CardTitle>Query Results</CardTitle>
                <CardDescription>
                    Displaying the mock output of your query.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    {results.columns.map(col => <TableHead key={col}>{col.replace(/_/g, ' ')}</TableHead>)}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {results.rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {results.columns.map(col => <TableCell key={col}>{String(row[col])}</TableCell>)}
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
         </Card>
      )}

    </div>
  );
}
