'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';

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
import type { Appointment } from '../appointments/page';

const PRESCRIPTIONS_KEY = 'initialPrescriptions';

const prescriptionSchema = z.object({
  patientName: z.string().min(1, 'Please select a patient.'),
  medication: z.string().min(1, 'Medication name is required.'),
  dosage: z.string().min(1, 'Dosage is required.'),
  instructions: z.string().min(1, 'Instructions are required.'),
});

export type Prescription = {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  medication: string;
  dosage: string;
  instructions: string;
  status: 'Filled' | 'Pending';
};
type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [allPatients, setAllPatients] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  useEffect(() => {
    try {
        const storedPrescriptions = localStorage.getItem(PRESCRIPTIONS_KEY);
        if (storedPrescriptions) {
            setPrescriptions(JSON.parse(storedPrescriptions));
        }

        const storedAppointments: Appointment[] = JSON.parse(localStorage.getItem('allAppointmentsData') || '[]');
        const patientNames = [...new Set(storedAppointments.map(a => a.patient))];
        setAllPatients(patientNames);
    } catch(e) {
        console.error("Failed to load data", e);
    }
  }, []);

  const savePrescriptions = (updatedPrescriptions: Prescription[]) => {
      setPrescriptions(updatedPrescriptions);
      localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(updatedPrescriptions));
  }

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientName: '',
      medication: '',
      dosage: '',
      instructions: '',
    },
  });

  const onSubmit = (data: PrescriptionFormValues) => {
    const newPrescription: Prescription = {
      id: `presc-${Date.now()}`,
      patientId: `pat-${data.patientName.replace(' ', '').toLowerCase()}`,
      patientName: data.patientName,
      date: format(new Date(), 'yyyy-MM-dd'),
      medication: data.medication,
      dosage: data.dosage,
      instructions: data.instructions,
      status: 'Pending',
    };

    savePrescriptions([newPrescription, ...prescriptions]);
    toast({
      title: 'Prescription Created',
      description: `A new prescription for ${data.patientName} has been issued.`,
    });
    form.reset();
  };

  const handleViewDetails = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsDetailDialogOpen(true);
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

  const filteredPrescriptions = prescriptions.filter(
    (presc) =>
      presc.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      presc.medication.toLowerCase().includes(searchTerm.toLowerCase())
  );


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
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="patientName"
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
                            {allPatients.map(patientName => (
                              <SelectItem key={patientName} value={patientName}>
                                {patientName}
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
                </div>
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
             <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <CardTitle>Recent Prescriptions</CardTitle>
                    <CardDescription>
                    A list of the most recently issued prescriptions.
                    </CardDescription>
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
                  <TableHead>Date</TableHead>
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
                    <TableCell>{format(parseISO(presc.date), 'PPP')}</TableCell>
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
                        <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                            No prescriptions found.
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
              <DialogTitle>Prescription Details</DialogTitle>
              <DialogDescription>
                Viewing prescription for {selectedPrescription?.patientName} issued on {selectedPrescription?.date ? format(parseISO(selectedPrescription.date), 'PPP') : ''}.
              </DialogDescription>
            </DialogHeader>
            {selectedPrescription && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Patient</h4>
                  <p>{selectedPrescription.patientName}</p>
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
