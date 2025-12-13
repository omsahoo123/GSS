import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DataAnalystDashboardPage() {
  return (
    <div>
      <h1 className="font-headline text-3xl font-bold">Data Analyst Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome, Anil. Access data tools and generate insights.
      </p>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Data Workspace</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is where the main content for the data analyst's dashboard will go. It can include a query editor, chart builder, and a dashboard for displaying key metrics and visualizations.</p>
        </CardContent>
      </Card>
    </div>
  );
}
