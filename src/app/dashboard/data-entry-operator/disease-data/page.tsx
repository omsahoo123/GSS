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
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Save, PlusCircle, Trash2 } from 'lucide-react';

export const DISEASE_DATA_KEY = 'healthDiseaseData';
const initialDistricts = ['Rampur', 'Sitapur', 'Aligarh', 'Bareilly', 'Meerut'];

export type DiseaseData = {
    district: string;
    cases: {
        diseaseName: string;
        caseCount: number;
    }[];
};

const initialData: DiseaseData[] = initialDistricts.map(district => ({
    district,
    cases: [
        { diseaseName: 'Flu', caseCount: 0 },
        { diseaseName: 'Dengue', caseCount: 0 },
    ]
}));

const diseaseDataSchema = z.object({
    diseaseData: z.array(z.object({
        district: z.string(),
        cases: z.array(z.object({
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
      diseaseData: initialData,
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

  const handleAddDistrict = () => {
    if (newDistrictName.trim() === '') {
        toast({ variant: 'destructive', title: 'District name cannot be empty.' });
        return;
    }
    append({
        district: newDistrictName,
        cases: [{ diseaseName: 'Flu', caseCount: 0 }]
    });
    setNewDistrictName('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Manage Disease Data</h1>
        <p className="text-muted-foreground">
          Update reported disease cases and add new districts or diseases as needed.
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

function DistrictCard({ districtIndex, control, removeDistrict }: { districtIndex: number, control: any, removeDistrict: (index: number) => void }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `diseaseData.${districtIndex}.cases`
    });

    const districtName = control.getValues(`diseaseData.${districtIndex}.district`);

    const addNewDisease = () => {
        append({ diseaseName: '', caseCount: 0 });
    };

    return (
        <Card>
            <CardHeader className="flex-row items-start justify-between">
                <div>
                    <CardTitle>{districtName}</CardTitle>
                    <CardDescription>Update the case numbers for this district.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeDistrict(districtIndex)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {fields.map((caseField, caseIndex) => (
                    <div key={caseField.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                         <FormField
                            control={control}
                            name={`diseaseData.${districtIndex}.cases.${caseIndex}.diseaseName`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Disease Name</FormLabel>
                                <FormControl><Input placeholder="e.g., Cholera" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`diseaseData.${districtIndex}.cases.${caseIndex}.caseCount`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Number of Cases</FormLabel>
                                <FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button variant="ghost" size="sm" onClick={() => remove(caseIndex)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Remove
                        </Button>
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                <Button variant="secondary" onClick={addNewDisease}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Disease
                </Button>
            </CardFooter>
        </Card>
    )
}
