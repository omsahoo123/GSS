import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DoctorDashboardPage() {
  return (
    <div>
      <h1 className="font-headline text-3xl font-bold">Doctor Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome, Dr. Singh. Here is your daily overview.
      </p>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is where the main content for the doctor's dashboard will go. It can include a list of upcoming appointments, patient alerts, and quick access to records.</p>
        </CardContent>
      </Card>
    </div>
  );
}
