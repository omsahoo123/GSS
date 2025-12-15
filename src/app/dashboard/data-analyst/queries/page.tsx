
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
import { Textarea } from '@/components/ui/textarea';
import { PlayCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const sampleQuery = `SELECT 
    d.region,
    d.disease_name,
    COUNT(p.patient_id) AS number_of_cases,
    AVG(p.age) AS average_age
FROM 
    disease_incidents d
JOIN 
    patients p ON d.patient_id = p.patient_id
WHERE 
    d.incident_date >= '2024-01-01'
    AND d.disease_name = 'Flu'
GROUP BY 
    d.region, d.disease_name
ORDER BY 
    number_of_cases DESC;`;

const mockResults = {
  columns: ['region', 'disease_name', 'number_of_cases', 'average_age'],
  rows: [
    { region: 'Aligarh', disease_name: 'Flu', number_of_cases: 450, average_age: 35.2 },
    { region: 'Meerut', disease_name: 'Flu', number_of_cases: 320, average_age: 38.1 },
    { region: 'Rampur', disease_name: 'Flu', number_of_cases: 210, average_age: 32.5 },
    { region: 'Sitapur', disease_name: 'Flu', number_of_cases: 180, average_age: 41.0 },
    { region: 'Bareilly', disease_name: 'Flu', number_of_cases: 150, average_age: 39.7 },
  ],
};

export default function DataQueriesPage() {
  const [query, setQuery] = useState(sampleQuery);
  const [results, setResults] = useState<{columns: string[], rows: any[]} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRunQuery = () => {
    if (!query.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Query',
        description: 'Please enter a query to run.',
      });
      return;
    }
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setResults(mockResults);
      setIsLoading(false);
      toast({
        title: 'Query Executed Successfully',
        description: `Returned ${mockResults.rows.length} rows.`,
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Data Query Editor</h1>
        <p className="text-muted-foreground">
          Write and execute SQL-like queries against the health data warehouse.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Query</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SELECT * FROM patients WHERE region = 'Aligarh'..."
            className="h-64 font-mono text-sm"
          />
          <Button onClick={handleRunQuery} disabled={isLoading} className="mt-4">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlayCircle className="mr-2 h-4 w-4" />
            )}
            Run Query
          </Button>
        </CardContent>
      </Card>
      
      {results && (
         <Card>
            <CardHeader>
                <CardTitle>Query Results</CardTitle>
                <CardDescription>
                    Displaying the output of your query.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    {results.columns.map(col => <TableHead key={col}>{col}</TableHead>)}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {results.rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {results.columns.map(col => <TableCell key={col}>{row[col]}</TableCell>)}
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
