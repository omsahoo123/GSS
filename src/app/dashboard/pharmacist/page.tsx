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
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';

export const PHARMACY_LOCATION_KEY = 'pharmacistLocation';

const locationSchema = z.object({
  name: z.string().min(1, 'Pharmacy name is required.'),
  address: z.string().min(1, 'Pharmacy address is required.'),
});

type LocationFormValues = z.infer<typeof locationSchema>;

export default function PharmacistDashboardPage() {
  const { toast } = useToast();

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: '',
      address: '',
    },
  });

  useEffect(() => {
    try {
      const storedLocation = localStorage.getItem(PHARMACY_LOCATION_KEY);
      if (storedLocation) {
        const location = JSON.parse(storedLocation);
        form.reset(location);
      }
    } catch (error) {
      console.error("Failed to load location from localStorage", error);
    }
  }, [form]);

  const onSubmit = (data: LocationFormValues) => {
     try {
      localStorage.setItem(PHARMACY_LOCATION_KEY, JSON.stringify(data));
      toast({
        title: 'Location Saved!',
        description: 'Your pharmacy location has been updated.',
      });
    } catch (error) {
      console.error("Failed to save location to localStorage", error);
       toast({
        variant: 'destructive',
        title: 'Error Saving Location',
        description: 'Could not save your pharmacy location.',
      });
    }
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Pharmacy Location</CardTitle>
                <CardDescription>
                  Set your pharmacy name and address for patients to see.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pharmacy Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Jan Aushadhi Kendra" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pharmacy Address</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 123, Village Market Rd, Rampur" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </CardContent>
              <CardFooter className="mt-auto">
                <Button type="submit" className="w-full">
                  <Save className="mr-2 h-4 w-4" /> Save Location
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
