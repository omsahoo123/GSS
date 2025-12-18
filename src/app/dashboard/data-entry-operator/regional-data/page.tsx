'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import type { RegionalData } from '../page';

export const REGIONAL_DATA_KEY = 'healthRegionalData';

const regionalDataSchema = z.object({
    regionalData: z.array(z.object({
        district: z.string().min(1, 'District name is required.'),
        population: z.coerce.number().min(0),
        beds: z.object({
            occupied: z.coerce.number().min(0),
            total: z.coerce.number().min(0),
        }).refine(data => data.occupied <= data.total, {
            message: "Occupied beds cannot exceed total beds",
            path: ["occupied"],
        }),
        ambulances: z.coerce.number().min(0),
        staff: z.object({
            doctors: z.coerce.number().min(0),
            nurses: z.coerce.number().min(0),
        })
    }))
});

type FormValues = z.infer<typeof regionalDataSchema>;

export default function RegionalDataPage() {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(regionalDataSchema),
    defaultValues: {
      regionalData: [],
    },
  });
  
  const { fields, append } = useFieldArray({
    control: form.control,
    name: "regionalData",
  });
  
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(REGIONAL_DATA_KEY);
      const diseaseDataStored = localStorage.getItem('healthDiseaseData');

      if (storedData) {
        form.reset({ regionalData: JSON.parse(storedData) });
      } else if (diseaseDataStored) {
        // If regional data is empty but disease data exists, create entries for those districts
        const diseaseData = JSON.parse(diseaseDataStored);
        const newRegionalData = diseaseData.map((d: { district: string; }) => ({
             district: d.district,
             population: 0,
             beds: { occupied: 0, total: 0 },
             ambulances: 0,
             staff: { doctors: 0, nurses: 0 },
        }));
        form.reset({ regionalData: newRegionalData });
      }

    } catch (error) {
      console.error("Failed to load regional data from localStorage", error);
    }
  }, [form]);
  

  const onSubmit = (data: FormValues) => {
    try {
        localStorage.setItem(REGIONAL_DATA_KEY, JSON.stringify(data.regionalData));
        toast({
            title: 'Data Saved!',
            description: 'The regional health data has been successfully updated.',
        });
    } catch (error) {
        console.error("Failed to save data to localStorage", error);
        toast({
            variant: 'destructive',
            title: 'Save Failed',
            description: 'There was an error saving the data.',
        });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Manage Regional Data</h1>
        <p className="text-muted-foreground">
          Update the core health and resource metrics for each district. Add districts in the 'Disease Data' page first.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => (
                 <Card key={field.id}>
                    <CardHeader>
                        <CardTitle>{form.getValues(`regionalData.${index}.district`)}</CardTitle>
                        <CardDescription>Update the metrics for this district.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                                control={form.control}
                                name={`regionalData.${index}.population`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Population</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g., 900000" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`regionalData.${index}.beds.occupied`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Occupied Beds</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g., 85" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`regionalData.${index}.beds.total`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Beds</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g., 100" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`regionalData.${index}.ambulances`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ambulances</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g., 15" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`regionalData.${index}.staff.doctors`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Doctors</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`regionalData.${index}.staff.nurses`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nurses</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g., 120" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                       </div>
                    </CardContent>
                 </Card>
            ))}

            {fields.length === 0 && (
                 <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">No districts found. Please add a district on the "Disease Data" page to begin entering regional metrics.</p>
                    </CardContent>
                </Card>
            )}

            {fields.length > 0 && (
              <div className="flex justify-end">
                  <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Save All Changes
                  </Button>
              </div>
            )}
        </form>
      </Form>
    </div>
  );
}
