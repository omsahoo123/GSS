
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, useWatch, Control } from 'react-hook-form';
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
import { Save, Users, Bed, Ambulance, User, UserCog } from 'lucide-react';
import { DISEASE_DATA_KEY } from '../disease-data/page';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const REGIONAL_DATA_KEY = 'healthRegionalData';

const hospitalSchema = z.object({
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
  }),
});

const districtSchema = z.object({
  districtName: z.string(),
  hospitals: z.array(hospitalSchema),
});

const regionalDataSchema = z.object({
  districts: z.array(districtSchema),
});

type FormValues = z.infer<typeof regionalDataSchema>;

export default function HospitalInfrastructurePage() {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(regionalDataSchema),
    defaultValues: {
      districts: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "districts",
  });

  const fetchData = () => {
    try {
      const storedRegionalData = localStorage.getItem(REGIONAL_DATA_KEY);
      const districtHospitalDataStored = localStorage.getItem(DISEASE_DATA_KEY);

      const existingData = storedRegionalData ? JSON.parse(storedRegionalData) : [];
      const districtHospitalData = districtHospitalDataStored ? JSON.parse(districtHospitalDataStored) : [];

      const finalData = districtHospitalData.map((dist: { district: string; hospitals: { name: string }[] }) => {
        const existingDistrict = existingData.find((d: any) => d.districtName === dist.district);
        
        const hospitals = dist.hospitals.map(h => {
          const existingHospital = existingDistrict?.hospitals.find((eh: any) => eh.hospitalName === h.name);
          return existingHospital || {
            hospitalName: h.name,
            population: 0,
            beds: { occupied: 0, total: 0 },
            ambulances: 0,
            staff: { doctors: 0, nurses: 0 },
          };
        });

        return {
          districtName: dist.district,
          hospitals,
        };
      });

      replace(finalData);

    } catch (error) {
      console.error("Failed to load regional data from localStorage", error);
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener('focus', fetchData);

    return () => {
      window.removeEventListener('focus', fetchData);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: FormValues) => {
    try {
      localStorage.setItem(REGIONAL_DATA_KEY, JSON.stringify(data.districts));
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
          Update the core health and resource metrics for each hospital. The district totals will be calculated automatically.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field, index) => (
            <DistrictInfrastructureCard
              key={field.id}
              districtIndex={index}
              control={form.control}
            />
          ))}

          {fields.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No districts found. Please add a district and hospital on the "Districts & Hospitals" page to begin.</p>
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

function DistrictInfrastructureCard({ districtIndex, control }: { districtIndex: number; control: Control<FormValues> }) {
  const districtData = useWatch({
    control,
    name: `districts.${districtIndex}`,
  });

  const { fields } = useFieldArray({
    control,
    name: `districts.${districtIndex}.hospitals`,
  });

  const totals = districtData.hospitals.reduce(
    (acc, hospital) => {
      acc.population += hospital.population || 0;
      acc.beds.occupied += hospital.beds?.occupied || 0;
      acc.beds.total += hospital.beds?.total || 0;
      acc.ambulances += hospital.ambulances || 0;
      acc.staff.doctors += hospital.staff?.doctors || 0;
      acc.staff.nurses += hospital.staff?.nurses || 0;
      return acc;
    },
    {
      population: 0,
      beds: { occupied: 0, total: 0 },
      ambulances: 0,
      staff: { doctors: 0, nurses: 0 },
    }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{districtData.districtName}</CardTitle>
        <CardDescription>District-wide resource totals. Expand to edit individual hospitals.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center mb-6">
            <div className="rounded-lg border p-3">
                 <Users className="mx-auto h-6 w-6 text-muted-foreground"/>
                 <p className="mt-1 text-xl font-bold">{totals.population.toLocaleString()}</p>
                 <p className="text-xs text-muted-foreground">Population</p>
            </div>
            <div className="rounded-lg border p-3">
                 <Bed className="mx-auto h-6 w-6 text-muted-foreground"/>
                 <p className="mt-1 text-xl font-bold">{totals.beds.occupied}</p>
                 <p className="text-xs text-muted-foreground">Occupied Beds</p>
            </div>
            <div className="rounded-lg border p-3">
                 <Bed className="mx-auto h-6 w-6 text-muted-foreground"/>
                 <p className="mt-1 text-xl font-bold">{totals.beds.total}</p>
                 <p className="text-xs text-muted-foreground">Total Beds</p>
            </div>
            <div className="rounded-lg border p-3">
                 <Ambulance className="mx-auto h-6 w-6 text-muted-foreground"/>
                 <p className="mt-1 text-xl font-bold">{totals.ambulances}</p>
                 <p className="text-xs text-muted-foreground">Ambulances</p>
            </div>
            <div className="rounded-lg border p-3">
                 <User className="mx-auto h-6 w-6 text-muted-foreground"/>
                 <p className="mt-1 text-xl font-bold">{totals.staff.doctors}</p>
                 <p className="text-xs text-muted-foreground">Doctors</p>
            </div>
            <div className="rounded-lg border p-3">
                 <UserCog className="mx-auto h-6 w-6 text-muted-foreground"/>
                 <p className="mt-1 text-xl font-bold">{totals.staff.nurses}</p>
                 <p className="text-xs text-muted-foreground">Nurses</p>
            </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {fields.map((hospitalField, hospitalIndex) => (
            <AccordionItem key={hospitalField.id} value={`item-${hospitalIndex}`}>
              <AccordionTrigger>
                <span className="font-medium">{districtData.hospitals[hospitalIndex].hospitalName}</span>
              </AccordionTrigger>
              <AccordionContent>
                <HospitalInfrastructureForm districtIndex={districtIndex} hospitalIndex={hospitalIndex} control={control} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}


function HospitalInfrastructureForm({ districtIndex, hospitalIndex, control }: { districtIndex: number; hospitalIndex: number; control: Control<FormValues> }) {
  return (
    <div className="space-y-4 rounded-md border p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={control}
          name={`districts.${districtIndex}.hospitals.${hospitalIndex}.population`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Population Served</FormLabel>
              <FormControl><Input type="number" placeholder="e.g., 50000" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`districts.${districtIndex}.hospitals.${hospitalIndex}.beds.occupied`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Occupied Beds</FormLabel>
              <FormControl><Input type="number" placeholder="e.g., 85" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`districts.${districtIndex}.hospitals.${hospitalIndex}.beds.total`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Beds</FormLabel>
              <FormControl><Input type="number" placeholder="e.g., 100" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`districts.${districtIndex}.hospitals.${hospitalIndex}.ambulances`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ambulances</FormLabel>
              <FormControl><Input type="number" placeholder="e.g., 5" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`districts.${districtIndex}.hospitals.${hospitalIndex}.staff.doctors`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctors</FormLabel>
              <FormControl><Input type="number" placeholder="e.g., 20" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`districts.${districtIndex}.hospitals.${hospitalIndex}.staff.nurses`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nurses</FormLabel>
              <FormControl><Input type="number" placeholder="e.g., 40" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
