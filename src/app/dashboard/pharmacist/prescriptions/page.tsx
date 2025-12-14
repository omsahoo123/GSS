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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, FileSearch } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const initialRecordedPrescriptions = [
  {
    id: 'rec-presc-1',
    patientName: 'Aarav Sharma',
    doctorName: 'Dr. Priya Singh',
    date: format(new Date(), 'yyyy-MM-dd'),
    medication: 'Amoxicillin',
    dosage: '500mg',
    instructions: 'Take one tablet twice a day for 7 days.',
    status: 'Filled',
  },
  {
    id: 'rec-presc-2',
    patientName: 'Neha Gupta',
    doctorName: 'Dr. Anjali Sharma',
    date: format(
      new Date(new Date().setDate(new Date().getDate() - 2)),
      'yyyy-MM-dd'
    ),
    medication: 'Ibuprofen',
    dosage: '200mg',
    instructions: 'Take as needed for pain, up to 3 times a day.',
    status: 'Filled',
  },
];

const prescriptionSchema = z.object({
  patientName: z.string().min(1, 'Patient name is required.'),
  doctorName: z.string().min(1, 'Doctor name is required.'),
  medication: z.string().min(1, 'Medication name is required.'),
  dosage: z.string().min(1, 'Dosage is required.'),
  instructions: z.string().min(1, 'Instructions are required.'),
});

type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;
type RecordedPrescription = (typeof initialRecordedPrescriptions)[0];

export default function PharmacistPrescriptionsPage() {
  const [recordedPrescriptions, setRecordedPrescriptions] = useState(initialRecordedPrescriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<RecordedPrescription | null>(null);

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientName: '',
      doctorName: '',
      medication: '',
      dosage: '',
      instructions: '',
    },
  });

  const onSubmit = (data: PrescriptionFormValues) => {
    const newPrescription: RecordedPrescription = {
      id: `rec-presc-${Date.now()}`,
      patientName: data.patientName,
      doctorName: data.doctorName,
      date: format(new Date(), 'yyyy-MM-dd'),
      medication: data.medication,
      dosage: data.dosage,
      instructions: data.instructions,
      status: 'Filled',
    };

    setRecordedPrescriptions([newPrescription, ...recordedPrescriptions]);
    toast({
      title: 'Prescription Recorded',
      description: `A new prescription for ${data.patientName} has been recorded as filled.`,
    });
    form.reset();
  };
  
  const handleViewDetails = (prescription: RecordedPrescription) => {
    setSelectedPrescription(prescription);
    setIsDetailDialogOpen(true);
  };
  
  const getStatusVariant = (status: string) => {
      return status === 'Filled' ? 'secondary' : 'outline';
  };

  const filteredPrescriptions = recordedPrescriptions.filter(
    (presc) =>
      presc.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      presc.medication.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">Record and Manage Prescriptions</h1>
      
      <Card>
          <CardHeader>
            <CardTitle>Record New Prescription</CardTitle>
            <CardDescription>
              Enter the details from the patient's prescription slip to record it in your system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="patientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Sunita Devi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="doctorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prescribing Doctor</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Dr. Priya Singh" {...field} />
                        </FormControl>
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
                      <FormItem className="md:col-span-2">
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
                </div>
                <Button type="submit">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Record as Filled
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

      <Card>
          <CardHeader>
             <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <CardTitle>Prescription History</CardTitle>
                    <CardDescription>A list of prescriptions you have recorded.</CardDescription>
                </div>
                <div className="relative">
                    <FileSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by patient or medication..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 md:w-64 lg:w-80"
                    />
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Medication</TableHead>
                  <TableHead>Date Filled</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrescriptions.map((presc) => (
                  <TableRow key={presc.id}>
                    <TableCell className="font-medium">
                      {presc.patientName}
                    </TableCell>
                    <TableCell>{presc.medication} {presc.dosage}</TableCell>
                    <TableCell>{presc.date}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(presc.status)}>
                        {presc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(presc)}>
                            View
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
                 {filteredPrescriptions.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                            No prescriptions recorded.
                        </TableCell>
                    </TableRow>
                 )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Prescription Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Recorded Prescription Details</DialogTitle>
              <DialogDescription>
                Viewing prescription for {selectedPrescription?.patientName} filled on {selectedPrescription?.date}.
              </DialogDescription>
            </DialogHeader>
            {selectedPrescription && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Patient</h4>
                  <p>{selectedPrescription.patientName}</p>
                </div>
                 <div>
                  <h4 className="font-semibold">Prescribing Doctor</h4>
                  <p>{selectedPrescription.doctorName}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Medication</h4>
                  <p>{selectedPrescription.medication}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Dosage</h4>
                  <p>{selectedPrescription.dosage}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Instructions</h4>
                  <p>{selectedPrescription.instructions}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Status</h4>
                  <Badge variant={getStatusVariant(selectedPrescription.status)}>
                    {selectedPrescription.status}
                  </Badge>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
}
