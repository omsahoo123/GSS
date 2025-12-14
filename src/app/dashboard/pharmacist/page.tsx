'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PharmacistDashboardPage() {
  const { toast } = useToast();
  const pharmacyAddress = 'Jan Aushadhi Kendra, 123, Village Market Rd, Rampur';

  const handleShare = () => {
    navigator.clipboard.writeText(pharmacyAddress).then(() => {
      toast({
        title: 'Address Copied!',
        description: 'The pharmacy address has been copied to your clipboard.',
      });
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">
          Pharmacist Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome, Ramesh. Manage your pharmacy inventory and prescriptions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              This is where the main content for the pharmacist's dashboard will
              go. It can include low-stock alerts, new prescription
              notifications, and inventory management tools.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pharmacy Location</CardTitle>
            <CardDescription>
              Your registered pharmacy address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{pharmacyAddress}</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" /> Share Location
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
