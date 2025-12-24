
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
import { Save, PlusCircle, Trash2, Hospital } from 'lucide-react';
import Link from 'next/link';

export const DISEASE_DATA_KEY = 'healthDiseaseData';

const hospitalSchema = z.object({
  name: z.string().min(1, "Hospital name is required."),
});

const districtSchema = z.object({
  district: z.string().min(1, "District name is required."),
  hospitals: z.array(hospitalSchema)
});

const diseaseDataSchema = z.object({
    districts: z.array(districtSchema)
});

type FormValues = z.infer<typeof diseaseDataSchema>;

export default function ManageDistrictsAndHospitalsPage() {
  const { toast } = useToast();
  const [newDistrictName, setNewDistrictName] = useState('');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(diseaseDataSchema),
    defaultValues: {
      districts: [],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "districts",
  });
  
  const fetchData = () => {
    try {
      const storedData = localStorage.getItem(DISEASE_DATA_KEY);
      if (storedData) {
        form.reset({ districts: JSON.parse(storedData) });
      }
    } catch (error) {
      console.error("Failed to load district data from localStorage", error);
    }
  };

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
        localStorage.setItem(DISEASE_DATA_KEY, JSON.stringify(data.districts));
        toast({
            title: 'Data Saved!',
            description: 'The district and hospital list has been successfully updated.',
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

  const handleAddDistrict = () => {
    if (newDistrictName.trim() === '') {
        toast({ variant: 'destructive', title: 'District name cannot be empty.' });
        return;
    }
    append({
        district: newDistrictName,
        hospitals: []
    });
    setNewDistrictName('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Manage Districts & Hospitals</h1>
        <p className="text-muted-foreground">
          Step 1: Add districts. Step 2: Add hospitals to those districts. Step 3: Go to the <Link href="/dashboard/data-entry-operator/hospital-data" className="text-primary underline">Hospital Data Entry</Link> page to add cases.
        </p>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>Add New District</CardTitle>
                <CardDescription>Enter the name of a new district to start adding hospitals to it.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex w-full max-w-sm flex-col gap-2 sm:flex-row sm:items-center">
                    <Input 
                        value={newDistrictName}
                        onChange={(e) => setNewDistrictName(e.target.value)}
                        placeholder="e.g., Lucknow"
                    />
                    <Button onClick={handleAddDistrict} className="w-full sm:w-auto">
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
        name: `districts.${districtIndex}.hospitals`
    });

    const districtName = useWatch({
      control,
      name: `districts.${districtIndex}.district`
    });

    const [newHospitalName, setNewHospitalName] = useState('');

    const addNewHospital = () => {
        if (!newHospitalName.trim()) {
            // This toast is optional, basic validation prevents empty append
            return;
        }
        append({ name: newHospitalName });
        setNewHospitalName('');
    };

    return (
        <Card>
            <CardHeader className="flex-row items-start justify-between">
                <div>
                    <CardTitle>{districtName}</CardTitle>
                    <CardDescription>Manage hospitals for this district.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeDistrict(districtIndex)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Remove District</span>
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {fields.map((hospitalField, hospitalIndex) => (
                    <div key={hospitalField.id} className="flex items-center justify-between rounded-md border p-3">
                         <div className="flex items-center gap-2">
                             <Hospital className="h-4 w-4 text-muted-foreground"/>
                             <FormField
                                control={control}
                                name={`districts.${districtIndex}.hospitals.${hospitalIndex}.name`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                         </div>
                        <Button variant="ghost" size="icon" onClick={() => remove(hospitalIndex)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Remove Hospital</span>
                        </Button>
                    </div>
                ))}
                 {fields.length === 0 && <p className="text-muted-foreground text-center">No hospitals added for this district yet.</p>}
            </CardContent>
            <CardFooter>
                 <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
                    <Input 
                        value={newHospitalName}
                        onChange={(e) => setNewHospitalName(e.target.value)}
                        placeholder="New Hospital Name"
                    />
                    <Button variant="secondary" onClick={addNewHospital} className="w-full sm:w-auto">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Hospital
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
