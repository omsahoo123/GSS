
'use client';

import { useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Download, FileText, Calendar } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { type Appointment } from '../../appointments/page';
import { type LabReport } from '../../lab-reports/page';
import { format, parseISO } from 'date-fns';

type PatientDetails = {
    id: string;
    name: string;
    age: number;
    lastVisit: string;
    avatarUrl?: string;
    history: {
        consultations: Appointment[];
        labReports: LabReport[];
    }
}

export default function PatientHistoryPage() {
  const params = useParams();
  const patientId = params.patientId as string;
  const [patient, setPatient] = useState<PatientDetails | null>(null);

  useEffect(() => {
    if (!patientId) return;
    try {
        const allAppointments: Appointment[] = JSON.parse(localStorage.getItem('allAppointmentsData') || '[]').map((a:any) => ({...a, date: parseISO(a.date)}));
        const allLabReports: LabReport[] = JSON.parse(localStorage.getItem('allLabReports') || '[]');
        
        const patientAppointments = allAppointments.filter(a => `pat-${a.patient.replace(/\s+/g, '-').toLowerCase()}` === patientId);

        if (patientAppointments.length > 0) {
            const patientName = patientAppointments[0].patient;
            const patientLabReports = allLabReports.filter(r => r.patientName === patientName);
            const lastVisit = patientAppointments.sort((a,b) => b.date.getTime() - a.date.getTime())[0];
            const age = (patientName.length * 3) % 40 + 20;

            const patientAccountKey = `patientAccount_${patientName}`;
            const patientAccount = JSON.parse(localStorage.getItem(patientAccountKey) || '{}');
            const avatarUrl = patientAccount.photo;

            setPatient({
                id: patientId,
                name: patientName,
                age: age,
                lastVisit: format(lastVisit.date, 'PPP'),
                avatarUrl: avatarUrl,
                history: {
                    consultations: patientAppointments.filter(a => a.status !== 'Upcoming'),
                    labReports: patientLabReports
                }
            });
        }
    } catch(e) {
        console.error("Error loading patient history", e);
    }
  }, [patientId]);
  
  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-2xl font-bold">Patient not found</h1>
        <p className="text-muted-foreground">The requested patient record could not be found or has no history.</p>
        <Link href="/dashboard/doctor/patients">
            <Button variant="outline" className="mt-4">Back to Patients List</Button>
        </Link>
      </div>
    );
  }

  const handleDownload = (fileName: string) => {
    const fileContent = `This is a dummy lab report for ${fileName}.`;
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
      <Card>
        <CardHeader className="flex flex-col items-start gap-4 sm:flex-row">
            <Avatar className="h-20 w-20">
            {patient.avatarUrl && (
                <AvatarImage
                src={patient.avatarUrl}
                alt={patient.name}
                />
            )}
            <AvatarFallback className="text-3xl">
                {patient.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <CardTitle className="text-3xl font-bold">{patient.name}</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                    Age: {patient.age} &bull; Patient ID: {patient.id} &bull; Last Visit: {patient.lastVisit}
                </CardDescription>
            </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Consultation History
          </CardTitle>
          <CardDescription>
            A log of past appointments and clinical notes.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
            {patient.history.consultations.map((consult, index) => (
                <div key={index} className="flex gap-4 rounded-lg border bg-secondary/50 p-4">
                    <div className="flex flex-col items-center">
                        <p className="font-bold">{new Date(consult.date).getDate()}</p>
                        <p className="text-xs uppercase">{new Date(consult.date).toLocaleString('default', { month: 'short' })}</p>
                        <p className="text-xs text-muted-foreground">{new Date(consult.date).getFullYear()}</p>
                    </div>
                    <div className="border-l pl-4">
                        <p className="font-semibold">{consult.type} Consultation with {consult.doctor}</p>
                        <p className="text-sm">{consult.notes || "No notes for this consultation."}</p>
                    </div>
                </div>
            ))}
             {patient.history.consultations.length === 0 && (
                 <p className="text-center text-muted-foreground h-24 flex items-center justify-center">No consultation history available.</p>
             )}
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lab Reports
          </CardTitle>
           <CardDescription>
            Downloadable copies of past laboratory test results.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patient.history.labReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.reportName}</TableCell>
                  <TableCell>{format(parseISO(report.date), 'PPP')}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDownload(report.fileName)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {patient.history.labReports.length === 0 && (
                <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                        No lab reports available for this patient.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
