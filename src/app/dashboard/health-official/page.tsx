import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HealthOfficialDashboardPage() {
  return (
    <div>
      <h1 className="font-headline text-3xl font-bold">Health Official Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome, Ms. Verma. Monitor regional health trends and resource allocation.
      </p>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Regional Health Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is where the main content for the health official's dashboard will go. It can include epidemiological charts, resource maps, and public health alerts.</p>
        </CardContent>
      </Card>
    </div>
  );
}
