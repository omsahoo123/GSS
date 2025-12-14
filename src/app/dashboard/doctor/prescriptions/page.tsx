'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { allPatients } from '@/lib/patients-data';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';

const initialPrescriptions = [
  {
    id: 'presc-1',
    patientName: 'Aarav Sharma',
    date: format(new Date(), 'yyyy-MM-dd'),
    medication: 'Amoxicillin 500mg',
    status: 'Filled',
  },
  {
    id: 'presc-2',
    patientName: 'Sunita Devi',
    date: format(new Date(new Date().setDate(new Date().getDate() - 1)), 'yyyy-MM-dd'),
    medication: 'Metformin 1000mg',
    status: 'Pending',
  },
];

const prescriptionSchema = z.object({
  patientId: z.string().min(1, 'Please select a patient.'),
  medication: z.string().min(1, 'Medication name is required.'),
  dosage: z.string().min(1, 'Dosage is required.'),
  instructions: z.string().min(1, 'Instructions are required.'),
});

type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const { toast } = useToast();

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientId: '',
      medication: '',
      dosage: '',
      instructions: '',
    },
  });

  const onSubmit = (data: PrescriptionFormValues) => {
    const patient = allPatients.find(p => p.id === data.patientId);
    if (!patient) return;

    const newPrescription = {
      id: `presc-${Date.now()}`,
      patientName: patient.name,
      date: format(new Date(), 'yyyy-MM-dd'),
      medication: `${data.medication} ${data.dosage}`,
      status: 'Pending',
    };

    setPrescriptions([newPrescription, ...prescriptions]);
    toast({
      title: 'Prescription Created',
      description: `A new prescription for ${patient.name} has been issued.`,
    });
    form.reset();
  };
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Filled':
        return 'secondary';
      case 'Pending':
        return 'default';
      default:
        return 'outline';
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">
            Manage Prescriptions
          </h1>
          <p className="text-muted-foreground">
            Create new prescriptions and view recent history.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create New Prescription</CardTitle>
            <CardDescription>
              Select a patient and fill in the medication details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a patient" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {allPatients.map(patient => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name} (ID: {patient.id})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="medication"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medication Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Paracetamol" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 500mg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Take one tablet twice a day after meals."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Issue Prescription
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Prescriptions</CardTitle>
            <CardDescription>
              A list of the most recently issued prescriptions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Medication</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptions.map((presc) => (
                  <TableRow key={presc.id}>
                    <TableCell className="font-medium">
                      {presc.patientName}
                    </TableCell>
                    <TableCell>{presc.medication}</TableCell>
                    <TableCell>{presc.date}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(presc.status)}>
                        {presc.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                 {prescriptions.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                            No recent prescriptions found.
                        </TableCell>
                    </TableRow>
                 )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
