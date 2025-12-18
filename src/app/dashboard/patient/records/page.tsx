'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { LOGGED_IN_PATIENT_KEY } from '@/app/signup/patient/page';
import { format, parseISO } from 'date-fns';
import { type Appointment } from '../../doctor/appointments/page';
import { type LabReport } from '../../doctor/lab-reports/page';
import { type Prescription } from '../../doctor/prescriptions/page';


export default function HealthRecordsPage() {
  const [patientName, setPatientName] = useState<string>('');
  const [consultations, setConsultations] = useState<Appointment[]>([]);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => {
    try {
      const patientAccount = JSON.parse(localStorage.getItem(LOGGED_IN_PATIENT_KEY) || '{}');
      const name = patientAccount.fullName;
      if (name) {
        setPatientName(name);

        const allAppointments: Appointment[] = JSON.parse(localStorage.getItem('allAppointmentsData') || '[]');
        const patientAppointments = allAppointments.filter(a => a.patient === name && a.status !== 'Upcoming');
        setConsultations(patientAppointments);

        const allLabReports: LabReport[] = JSON.parse(localStorage.getItem('initialLabReports') || '[]');
        const patientLabReports = allLabReports.filter(r => r.patientName === name);
        setLabReports(patientLabReports);
        
        const allPrescriptions: Prescription[] = JSON.parse(localStorage.getItem('initialPrescriptions') || '[]');
        const patientPrescriptions = allPrescriptions.filter(p => p.patientName === name);
        setPrescriptions(patientPrescriptions);
      }
    } catch(e) {
      console.error("Error loading patient records", e);
    }
  }, []);

  const handleDownload = (fileName: string, fileContentDetails: string) => {
    const fileContent = `This is a dummy file for ${fileName}.\n\nDetails:\n${fileContentDetails}`;
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">My Health Records</h1>
        <p className="text-muted-foreground">
          Access your past consultation prescriptions and lab reports.
        </p>
      </div>

      <Tabs defaultValue="prescriptions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="prescriptions">
            <FileText className="mr-2 h-4 w-4" />
            Past Consultations & Prescriptions
          </TabsTrigger>
          <TabsTrigger value="lab-reports">
            <FileText className="mr-2 h-4 w-4" />
            Lab Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="prescriptions">
          <Card>
            <CardHeader>
              <CardTitle>Past Consultations & Prescriptions</CardTitle>
              <CardDescription>
                Here is a list of your prescriptions and notes from previous consultations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescriptions.length > 0 ? prescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell className="font-medium">{consultations.find(c => c.date.toString() === prescription.date)?.doctor || 'N/A'}</TableCell>
                      <TableCell>{format(parseISO(prescription.date), 'PPP')}</TableCell>
                      <TableCell>{consultations.find(c => c.date.toString() === prescription.date)?.type || 'N/A'}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownload(`${prescription.medication}_Prescription.txt`, `Doctor: ${consultations.find(c => c.date.toString() === prescription.date)?.doctor}\nDate: ${prescription.date}\nMedication: ${prescription.medication}\nDosage: ${prescription.dosage}\nInstructions: ${prescription.instructions}`)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Prescription
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No past prescriptions found.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab-reports">
          <Card>
            <CardHeader>
              <CardTitle>Lab Reports</CardTitle>
              <CardDescription>
                View and download your medical test results.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labReports.length > 0 ? labReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.reportName}</TableCell>
                      <TableCell>{format(parseISO(report.date), 'PPP')}</TableCell>
                      <TableCell>
                        <Badge variant={report.status === 'Available' ? 'secondary' : 'outline'}>
                            {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={report.status !== 'Available'}
                          onClick={() => handleDownload(report.fileName, `Report: ${report.reportName}\nDate: ${report.date}`)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                     <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No lab reports found.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
