
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
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Save, PlusCircle, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DISEASE_DATA_KEY } from '../disease-data/page';
import { format } from 'date-fns';

export const HOSPITAL_CASE_DATA_KEY = 'healthHospitalCaseData';

const diseaseEntrySchema = z.object({
    date: z.string().min(1, "Date is required."),
    diseaseName: z.string().min(1, "Disease name is required."),
    caseCount: z.coerce.number().min(0, "Cases cannot be negative."),
});

const hospitalDataSchema = z.object({
  hospitalData: z.array(z.object({
    district: z.string(),
    hospitalName: z.string(),
    entries: z.array(diseaseEntrySchema)
  }))
});

type FormValues = z.infer<typeof hospitalDataSchema>;

export default function HospitalDataPage() {
  const { toast } = useToast();
  const [availableHospitals, setAvailableHospitals] = useState<{label: string, value: string}[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<string>('');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(hospitalDataSchema),
    defaultValues: {
      hospitalData: [],
    },
  });
  
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "hospitalData",
  });

  const fetchData = () => {
    try {
      const storedCaseData = localStorage.getItem(HOSPITAL_CASE_DATA_KEY);
      const caseData = storedCaseData ? JSON.parse(storedCaseData) : [];
      
      const storedDistrictData = localStorage.getItem(DISEASE_DATA_KEY);
      const districtData = storedDistrictData ? JSON.parse(storedDistrictData) : [];
      
      const hospitals = districtData.flatMap((d: any) => {
        if (!d.hospitals || !Array.isArray(d.hospitals)) {
          return [];
        }
        return d.hospitals.map((h: any) => ({
          label: `${h.name}, ${d.district}`,
          value: `${d.district}|${h.name}`
        }));
      });
      setAvailableHospitals(hospitals);
      
      const allHospitalData = hospitals.map((h: {value: string}) => {
        const [district, hospitalName] = h.value.split('|');
        const existingData = caseData.find((cd: any) => cd.district === district && cd.hospitalName === hospitalName);
        return existingData || { district, hospitalName, entries: [] };
      });
      replace(allHospitalData);

    } catch (error) => {
      console.error("Failed to load hospital data from localStorage", error);
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
        localStorage.setItem(HOSPITAL_CASE_DATA_KEY, JSON.stringify(data.hospitalData));
        toast({
            title: 'Data Saved!',
            description: 'The hospital case data has been successfully updated.',
        });
    } catch (error) {
        console.error("Failed to save data to localStorage", error);
        toast({
            variant: 'destructive',
            title: 'Save Failed',
            description: 'There was an error saving the case data.',
        });
    }
  };

  const visibleHospitalIndex = fields.findIndex(field => `${field.district}|${field.hospitalName}` === selectedHospital);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Hospital Data Entry</h1>
        <p className="text-muted-foreground">
          Select a hospital and log its daily disease case numbers.
        </p>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>Select Hospital</CardTitle>
                <CardDescription>Choose a hospital to view and manage its case data.</CardDescription>
            </CardHeader>
            <CardContent>
                <Select onValueChange={setSelectedHospital} value={selectedHospital}>
                    <SelectTrigger className="w-full max-w-md">
                        <SelectValue placeholder="Select a hospital..."/>
                    </SelectTrigger>
                    <SelectContent>
                        {availableHospitals.map(h => (
                            <SelectItem key={h.value} value={h.value}>{h.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {selectedHospital && visibleHospitalIndex > -1 && (
                 <HospitalCaseCard 
                    key={fields[visibleHospitalIndex].id} 
                    hospitalIndex={visibleHospitalIndex} 
                    control={form.control} 
                 />
            )}

            {selectedHospital && visibleHospitalIndex > -1 && (
                <div className="flex justify-end">
                    <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            )}
        </form>
      </Form>
    </div>
  );
}

function HospitalCaseCard({ hospitalIndex, control }: { hospitalIndex: number, control: any }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `hospitalData.${hospitalIndex}.entries`
    });

    const hospitalName = useWatch({ control, name: `hospitalData.${hospitalIndex}.hospitalName` });
    const districtName = useWatch({ control, name: `hospitalData.${hospitalIndex}.district` });

    const addNewEntry = () => {
        append({ date: format(new Date(), 'yyyy-MM-dd'), diseaseName: '', caseCount: 0 });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{hospitalName}</CardTitle>
                <CardDescription>Daily case entries for {districtName} district.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {fields.map((entryField, entryIndex) => (
                    <div key={entryField.id} className="grid grid-cols-1 items-end gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
                         <FormField
                            control={control}
                            name={`hospitalData.${hospitalIndex}.entries.${entryIndex}.date`}
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
                            name={`hospitalData.${hospitalIndex}.entries.${entryIndex}.diseaseName`}
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
                            name={`hospitalData.${hospitalIndex}.entries.${entryIndex}.caseCount`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Number of Cases</FormLabel>
                                <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button variant="ghost" size="sm" onClick={() => remove(entryIndex)} className="w-full md:w-auto">
                            <Trash2 className="mr-2 h-4 w-4" /> Remove
                        </Button>
                    </div>
                ))}
                 {fields.length === 0 && <p className="text-muted-foreground text-center">No entries for this hospital yet. Add one to begin.</p>}
            </CardContent>
            <CardFooter>
                <Button variant="secondary" onClick={addNewEntry}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Entry
                </Button>
            </CardFooter>
        </Card>
    )
}
