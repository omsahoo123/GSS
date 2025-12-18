'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Save, PlusCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export const DISEASE_DATA_KEY = 'healthDiseaseData';

export type DiseaseEntry = {
    date: string;
    diseaseName: string;
    caseCount: number;
};

export type DistrictDiseaseData = {
    district: string;
    entries: DiseaseEntry[];
};

const diseaseDataSchema = z.object({
    diseaseData: z.array(z.object({
        district: z.string(),
        entries: z.array(z.object({
            date: z.string().min(1, "Date is required."),
            diseaseName: z.string().min(1, "Disease name is required."),
            caseCount: z.coerce.number().min(0, "Cases cannot be negative."),
        }))
    }))
});

type FormValues = z.infer<typeof diseaseDataSchema>;

export default function DiseaseDataPage() {
  const { toast } = useToast();
  const [newDistrictName, setNewDistrictName] = useState('');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(diseaseDataSchema),
    defaultValues: {
      diseaseData: [],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "diseaseData",
  });
  
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(DISEASE_DATA_KEY);
      if (storedData) {
        form.reset({ diseaseData: JSON.parse(storedData) });
      }
    } catch (error) {
      console.error("Failed to load disease data from localStorage", error);
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

  const handleAddDistrict = () => {
    if (newDistrictName.trim() === '') {
        toast({ variant: 'destructive', title: 'District name cannot be empty.' });
        return;
    }
    append({
        district: newDistrictName,
        entries: [{ date: format(new Date(), 'yyyy-MM-dd'), diseaseName: 'Flu', caseCount: 0 }]
    });
    setNewDistrictName('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Manage Daily Disease Data</h1>
        <p className="text-muted-foreground">
          Log daily disease cases for each district.
        </p>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>Add New District</CardTitle>
                <CardDescription>Enter the name of a new district to start tracking its data.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input 
                        value={newDistrictName}
                        onChange={(e) => setNewDistrictName(e.target.value)}
                        placeholder="e.g., Lucknow"
                    />
                    <Button onClick={handleAddDistrict}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add District
                    </Button>
                </div>
            </CardContent>
        </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => (
                 <DistrictCard key={field.id} districtIndex={index} control={form.control} removeDistrict={remove} />
            ))}

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

function DistrictCard({ districtIndex, control, removeDistrict }: { districtIndex: number, control: any, removeDistrict: (index: number) => void }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `diseaseData.${districtIndex}.entries`
    });

    const districtName = useWatch({
      control,
      name: `diseaseData.${districtIndex}.district`
    });

    const addNewEntry = () => {
        append({ date: format(new Date(), 'yyyy-MM-dd'), diseaseName: '', caseCount: 0 });
    };

    return (
        <Card>
            <CardHeader className="flex-row items-start justify-between">
                <div>
                    <CardTitle>{districtName}</CardTitle>
                    <CardDescription>Manage daily case entries for this district.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeDistrict(districtIndex)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {fields.map((entryField, entryIndex) => (
                    <div key={entryField.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                         <FormField
                            control={control}
                            name={`diseaseData.${districtIndex}.entries.${entryIndex}.date`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl><Input type="date" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={control}
                            name={`diseaseData.${districtIndex}.entries.${entryIndex}.diseaseName`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Disease Name</FormLabel>
                                <FormControl><Input placeholder="e.g., Dengue" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`diseaseData.${districtIndex}.entries.${entryIndex}.caseCount`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Number of Cases</FormLabel>
                                <FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button variant="ghost" size="sm" onClick={() => remove(entryIndex)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Remove Entry
                        </Button>
                    </div>
                ))}
                 {fields.length === 0 && <p className="text-muted-foreground text-center">No entries for this district yet. Add one to begin.</p>}
            </CardContent>
            <CardFooter>
                <Button variant="secondary" onClick={addNewEntry}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Entry
                </Button>
            </CardFooter>
        </Card>
    )
}
