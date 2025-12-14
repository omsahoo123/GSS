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
import { allPatients } from '@/lib/patients-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function PatientHistoryPage() {
  const params = useParams();
  const patientId = params.patientId as string;
  const patient = allPatients.find((p) => p.id === patientId);
  const patientAvatar = PlaceHolderImages.find((img) => img.id === patient?.avatarId);

  if (!patient) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Patient not found</h1>
        <p>The requested patient record could not be found.</p>
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
            {patientAvatar && (
                <AvatarImage
                src={patientAvatar.imageUrl}
                alt={patient.name}
                data-ai-hint={patientAvatar.imageHint}
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
                        <p className="text-sm">{consult.note}</p>
                    </div>
                </div>
            ))}
             {patient.history.consultations.length === 0 && (
                 <p className="text-center text-muted-foreground">No consultation history available.</p>
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
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>{report.date}</TableCell>
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
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
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
