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
import { Package, PackageCheck, PackageX, Save } from 'lucide-react';
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
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LOGGED_IN_USER_KEY } from '@/app/login/page';

export const PHARMACY_LOCATION_KEY = 'pharmacistLocation';
const INVENTORY_STORAGE_KEY = 'pharmacistInventory';

type Medicine = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  supplier: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
};

const locationSchema = z.object({
  name: z.string().min(1, 'Pharmacy name is required.'),
  address: z.string().min(1, 'Pharmacy address is required.'),
});

type LocationFormValues = z.infer<typeof locationSchema>;

const getInitialLocation = () => {
    if (typeof window === 'undefined') {
        return { name: '', address: '' };
    }
    try {
        const storedLocation = localStorage.getItem(PHARMACY_LOCATION_KEY);
        return storedLocation ? JSON.parse(storedLocation) : { name: '', address: '' };
    } catch (error) {
        console.error("Failed to parse location from localStorage", error);
        return { name: '', address: '' };
    }
};

export default function PharmacistDashboardPage() {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<Medicine[]>([]);
  const [userName, setUserName] = useState('Pharmacist');

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: getInitialLocation(),
  });

  useEffect(() => {
    try {
      const userData = localStorage.getItem(LOGGED_IN_USER_KEY);
      if (userData) {
          setUserName(JSON.parse(userData).name);
      }
      const storedInventory = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (storedInventory) {
        setInventory(JSON.parse(storedInventory));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

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

  const inStockCount = inventory.filter(m => m.status === 'In Stock').length;
  const lowStockCount = inventory.filter(m => m.status === 'Low Stock').length;
  const outOfStockCount = inventory.filter(m => m.status === 'Out of Stock').length;


  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">
          Pharmacist Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome, {userName}. Manage your pharmacy inventory and prescriptions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Overview</CardTitle>
            <CardDescription>A summary of your current stock status.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-lg border p-4">
              <PackageCheck className="mx-auto h-8 w-8 text-green-600" />
              <p className="mt-2 text-2xl font-bold">{inStockCount}</p>
              <p className="text-sm text-muted-foreground">In Stock</p>
            </div>
             <div className="rounded-lg border p-4">
              <Package className="mx-auto h-8 w-8 text-yellow-600" />
              <p className="mt-2 text-2xl font-bold">{lowStockCount}</p>
              <p className="text-sm text-muted-foreground">Low Stock</p>
            </div>
             <div className="rounded-lg border p-4">
              <PackageX className="mx-auto h-8 w-8 text-red-600" />
              <p className="mt-2 text-2xl font-bold">{outOfStockCount}</p>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/pharmacist/inventory" className="w-full">
              <Button variant="outline" className="w-full">Manage Inventory</Button>
            </Link>
          </CardFooter>
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
