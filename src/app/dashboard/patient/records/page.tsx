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

const pastConsultations = [
  {
    id: 'consult-1',
    doctor: 'Dr. Anjali Sharma',
    department: 'Cardiology',
    date: '2024-06-15',
    type: 'Video',
    fileName: 'Prescription_Dr_Sharma_20240615.txt',
    fileUrl: '#',
  },
  {
    id: 'consult-2',
    doctor: 'Dr. Priya Singh',
    department: 'General Medicine',
    date: '2024-04-22',
    type: 'In-Person',
    fileName: 'Prescription_Dr_Singh_20240422.txt',
    fileUrl: '#',
  },
  {
    id: 'consult-3',
    doctor: 'Dr. Arun Verma',
    department: 'Dermatology',
    date: '2024-02-10',
    type: 'In-Person',
    fileName: 'Prescription_Dr_Verma_20240210.txt',
    fileUrl: '#',
  },
];

const labReports = [
  {
    id: 'report-1',
    name: 'Complete Blood Count (CBC)',
    date: '2024-06-10',
    status: 'Available',
    fileName: 'LabReport_CBC_20240610.txt',
    fileUrl: '#',
  },
  {
    id: 'report-2',
    name: 'Lipid Profile',
    date: '2024-06-10',
    status: 'Available',
    fileName: 'LabReport_LipidProfile_20240610.txt',
    fileUrl: '#',
  },
  {
    id: 'report-3',
    name: 'Thyroid Function Test',
    date: '2024-03-05',
    status: 'Available',
    fileName: 'LabReport_Thyroid_20240305.txt',
    fileUrl: '#',
  },
  {
    id: 'report-4',
    name: 'Liver Function Test',
    date: '2023-11-20',
    status: 'Superseded',
    fileName: 'LabReport_Liver_20231120.txt',
    fileUrl: '#',
  },
];

export default function HealthRecordsPage() {

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
            Past Consultations
          </TabsTrigger>
          <TabsTrigger value="lab-reports">
            <FileText className="mr-2 h-4 w-4" />
            Lab Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="prescriptions">
          <Card>
            <CardHeader>
              <CardTitle>Past Consultations</CardTitle>
              <CardDescription>
                Here is a list of your prescriptions and recordings from previous consultations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastConsultations.map((consultation) => (
                    <TableRow key={consultation.id}>
                      <TableCell className="font-medium">{consultation.doctor}</TableCell>
                      <TableCell>{consultation.department}</TableCell>
                      <TableCell>{consultation.date}</TableCell>
                      <TableCell>{consultation.type}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownload(consultation.fileName, `Doctor: ${consultation.doctor}\nDate: ${consultation.date}`)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Prescription
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
                  {labReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>{report.date}</TableCell>
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
                          onClick={() => handleDownload(report.fileName, `Report: ${report.name}\nDate: ${report.date}`)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
