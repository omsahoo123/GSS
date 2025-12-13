import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PharmacistDashboardPage() {
  return (
    <div>
      <h1 className="font-headline text-3xl font-bold">Pharmacist Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome, Ramesh. Manage your pharmacy inventory and prescriptions.
      </p>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is where the main content for the pharmacist's dashboard will go. It can include low-stock alerts, new prescription notifications, and inventory management tools.</p>
        </CardContent>
      </Card>
    </div>
  );
}
