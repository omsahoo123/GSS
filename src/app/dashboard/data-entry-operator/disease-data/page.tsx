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

export const DISEASE_DATA_KEY = 'healthDiseaseData';
const initialDistricts = ['Rampur', 'Sitapur', 'Aligarh', 'Bareilly', 'Meerut'];

export type DiseaseData = {
    district: string;
    flu_cases: number;
    dengue_cases: number;
};

const initialData: DiseaseData[] = initialDistricts.map(district => ({
    district,
    flu_cases: 0,
    dengue_cases: 0,
}));

const diseaseDataSchema = z.object({
    diseaseData: z.array(z.object({
        district: z.string(),
        flu_cases: z.coerce.number().min(0, "Cases cannot be negative."),
        dengue_cases: z.coerce.number().min(0, "Cases cannot be negative."),
    }))
});

type FormValues = z.infer<typeof diseaseDataSchema>;

export default function DiseaseDataPage() {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(diseaseDataSchema),
    defaultValues: {
      diseaseData: initialData,
    },
  });
  
  const { fields } = useFieldArray({
    control: form.control,
    name: "diseaseData",
  });
  
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(DISEASE_DATA_KEY);
      if (storedData) {
        form.reset({ diseaseData: JSON.parse(storedData) });
      } else {
        form.reset({ diseaseData: initialData });
      }
    } catch (error) {
      console.error("Failed to load disease data from localStorage", error);
      form.reset({ diseaseData: initialData });
    }
  }, [form]);
  

  const onSubmit = (data: FormValues) => {
    try {
        localStorage.setItem(DISEASE_DATA_KEY, JSON.stringify(data.diseaseData));
        toast({
            title: 'Data Saved!',
            description: 'The disease case data has been successfully updated.',
        });
    } catch (error) {
        console.error("Failed to save data to localStorage", error);
        toast({
            variant: 'destructive',
            title: 'Save Failed',
            description: 'There was an error saving the disease data.',
        });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Manage Disease Data</h1>
        <p className="text-muted-foreground">
          Update the number of reported communicable disease cases for each district.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => (
                 <Card key={field.id}>
                    <CardHeader>
                        <CardTitle>{form.getValues(`diseaseData.${index}.district`)}</CardTitle>
                        <CardDescription>Update the case numbers for this district.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name={`diseaseData.${index}.flu_cases`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Flu Cases</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g., 150" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`diseaseData.${index}.dengue_cases`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dengue Cases</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                       </div>
                    </CardContent>
                 </Card>
            ))}

            <div className="flex justify-end">
                <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save All Changes
                </Button>
            </div>
        </form>
      </Form>
    </div>
  );
}
