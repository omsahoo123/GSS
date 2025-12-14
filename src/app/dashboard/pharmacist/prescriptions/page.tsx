'use client';

import { useState } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileSearch, CheckCircle, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const initialPrescriptions = [
  {
    id: 'presc-1',
    patientName: 'Aarav Sharma',
    date: format(new Date(), 'yyyy-MM-dd'),
    medication: 'Amoxicillin',
    dosage: '500mg',
    instructions: 'Take one tablet twice a day for 7 days.',
    status: 'Filled',
  },
  {
    id: 'presc-2',
    patientName: 'Sunita Devi',
    date: format(
      new Date(new Date().setDate(new Date().getDate() - 1)),
      'yyyy-MM-dd'
    ),
    medication: 'Metformin',
    dosage: '1000mg',
    instructions: 'Take one tablet daily with breakfast.',
    status: 'Pending',
  },
  {
    id: 'presc-3',
    patientName: 'Rohan Verma',
    date: format(new Date(), 'yyyy-MM-dd'),
    medication: 'Lisinopril',
    dosage: '10mg',
    instructions: 'Take one tablet daily.',
    status: 'Pending',
  },
  {
    id: 'presc-4',
    patientName: 'Neha Gupta',
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

type Prescription = (typeof initialPrescriptions)[0];

export default function PharmacistPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);

  const handleStatusChange = (prescriptionId: string, status: string) => {
    setPrescriptions(
      prescriptions.map((p) =>
        p.id === prescriptionId ? { ...p, status } : p
      )
    );
    toast({
      title: 'Status Updated',
      description: `Prescription status has been changed to ${status}.`,
    });
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
            View and process incoming patient prescriptions.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Prescription Queue</CardTitle>
              <CardDescription>
                A list of all pending and filled prescriptions.
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrescriptions.map((presc) => (
                <TableRow key={presc.id}>
                  <TableCell className="font-medium">
                    {presc.patientName}
                  </TableCell>
                  <TableCell>
                    {presc.medication} {presc.dosage}
                  </TableCell>
                  <TableCell>{presc.date}</TableCell>
                  <TableCell>
                    <Select
                      value={presc.status}
                      onValueChange={(value) =>
                        handleStatusChange(presc.id, value)
                      }
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" /> Pending
                          </div>
                        </SelectItem>
                        <SelectItem value="Filled">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" /> Filled
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(presc)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPrescriptions.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
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
              Viewing prescription for {selectedPrescription?.patientName}{' '}
              issued on {selectedPrescription?.date}.
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
            <Button
              variant="outline"
              onClick={() => setIsDetailDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
