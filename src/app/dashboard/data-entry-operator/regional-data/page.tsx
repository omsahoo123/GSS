
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
import { DISEASE_DATA_KEY } from '../disease-data/page';

export const REGIONAL_DATA_KEY = 'healthRegionalData';

const hospitalInfrastructureSchema = z.object({
    district: z.string(),
    hospitalName: z.string(),
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
});

const regionalDataSchema = z.object({
    hospitals: z.array(hospitalInfrastructureSchema)
});

type FormValues = z.infer<typeof regionalDataSchema>;

export default function HospitalInfrastructurePage() {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(regionalDataSchema),
    defaultValues: {
      hospitals: [],
    },
  });
  
  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "hospitals",
  });
  
  const fetchData = () => {
    try {
      const storedData = localStorage.getItem(REGIONAL_DATA_KEY);
      const districtHospitalDataStored = localStorage.getItem(DISEASE_DATA_KEY);

      const existingData = storedData ? JSON.parse(storedData) : [];
      const districtHospitalData = districtHospitalDataStored ? JSON.parse(districtHospitalDataStored) : [];
      
      const existingHospitalKeys = new Set(existingData.map((d: any) => `${d.district}-${d.hospitalName}`));

      const newHospitalInfrastructure = districtHospitalData
        .flatMap((district: { district: string, hospitals: {name: string}[] }) => 
            district.hospitals.map(hospital => ({
                district: district.district,
                hospitalName: hospital.name
            }))
        )
        .filter((h: { district: string, hospitalName: string }) => !existingHospitalKeys.has(`${h.district}-${h.hospitalName}`))
        .map((h: { district: string, hospitalName: string }) => ({
             ...h,
             population: 0,
             beds: { occupied: 0, total: 0 },
             ambulances: 0,
             staff: { doctors: 0, nurses: 0 },
        }));
      
      const finalData = [...existingData, ...newHospitalInfrastructure];

      replace(finalData);

    } catch (error) {
      console.error("Failed to load regional data from localStorage", error);
    }
  }

  useEffect(() => {
    fetchData();
    window.addEventListener('focus', fetchData);

    return () => {
      window.removeEventListener('focus', fetchData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  const onSubmit = (data: FormValues) => {
    try {
        localStorage.setItem(REGIONAL_DATA_KEY, JSON.stringify(data.hospitals));
        toast({
            title: 'Data Saved!',
            description: 'The hospital infrastructure data has been successfully updated.',
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
        <h1 className="font-headline text-3xl font-bold">Manage Hospital Infrastructure</h1>
        <p className="text-muted-foreground">
          Update the core health and resource metrics for each hospital. Add new hospitals in the 'Districts & Hospitals' page.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => (
                 <Card key={field.id}>
                    <CardHeader>
                        <CardTitle>{form.getValues(`hospitals.${index}.hospitalName`)}</CardTitle>
                        <CardDescription>
                           District: {form.getValues(`hospitals.${index}.district`)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <FormField
                                control={form.control}
                                name={`hospitals.${index}.population`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Population Served</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g., 50000" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`hospitals.${index}.beds.occupied`}
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
                                name={`hospitals.${index}.beds.total`}
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
                                name={`hospitals.${index}.ambulances`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ambulances</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g., 5" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`hospitals.${index}.staff.doctors`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Doctors</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g., 20" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`hospitals.${index}.staff.nurses`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nurses</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g., 40" {...field} /></FormControl>
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
                        <p className="text-center text-muted-foreground">No hospitals found. Please add a district and hospital on the "Districts & Hospitals" page to begin.</p>
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
