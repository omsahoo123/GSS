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
    fileUrl: '#',
  },
  {
    id: 'consult-2',
    doctor: 'Dr. Priya Singh',
    department: 'General Medicine',
    date: '2024-04-22',
    fileUrl: '#',
  },
  {
    id: 'consult-3',
    doctor: 'Dr. Arun Verma',
    department: 'Dermatology',
    date: '2024-02-10',
    fileUrl: '#',
  },
];

const labReports = [
  {
    id: 'report-1',
    name: 'Complete Blood Count (CBC)',
    date: '2024-06-10',
    status: 'Available',
    fileUrl: '#',
  },
  {
    id: 'report-2',
    name: 'Lipid Profile',
    date: '2024-06-10',
    status: 'Available',
    fileUrl: '#',
  },
  {
    id: 'report-3',
    name: 'Thyroid Function Test',
    date: '2024-03-05',
    status: 'Available',
    fileUrl: '#',
  },
  {
    id: 'report-4',
    name: 'Liver Function Test',
    date: '2023-11-20',
    status: 'Superseded',
    fileUrl: '#',
  },
];

export default function HealthRecordsPage() {
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
            Past Prescriptions
          </TabsTrigger>
          <TabsTrigger value="lab-reports">
            <FileText className="mr-2 h-4 w-4" />
            Lab Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="prescriptions">
          <Card>
            <CardHeader>
              <CardTitle>Past Consultancy Prescriptions</CardTitle>
              <CardDescription>
                Here is a list of your prescriptions from previous consultations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastConsultations.map((consultation) => (
                    <TableRow key={consultation.id}>
                      <TableCell className="font-medium">{consultation.doctor}</TableCell>
                      <TableCell>{consultation.department}</TableCell>
                      <TableCell>{consultation.date}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
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
                        <Button variant="outline" size="sm" disabled={report.status !== 'Available'}>
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
