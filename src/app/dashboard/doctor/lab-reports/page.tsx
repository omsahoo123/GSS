
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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, FileSearch } from 'lucide-react';
import type { Appointment } from '../appointments/page';

const LAB_REPORTS_KEY = 'allLabReports';

const labReportSchema = z.object({
  patientName: z.string().min(1, 'Please select a patient.'),
  reportName: z.string().min(1, 'Report name is required.'),
  reportFile: z.any().refine(files => files?.length > 0, 'Report file is required.'),
});

export type LabReport = {
    id: string;
    patientId: string;
    patientName: string;
    reportName: string;
    date: string;
    status: 'Available' | 'Pending';
    fileName: string;
};

type LabReportFormValues = z.infer<typeof labReportSchema>;

export default function LabReportsPage() {
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [allPatients, setAllPatients] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    try {
        const storedReports = localStorage.getItem(LAB_REPORTS_KEY);
        if (storedReports) {
            setLabReports(JSON.parse(storedReports));
        }

        const storedAppointments: Appointment[] = JSON.parse(localStorage.getItem('allAppointmentsData') || '[]');
        const patientNames = [...new Set(storedAppointments.map(a => a.patient))];
        setAllPatients(patientNames);
    } catch(e) {
        console.error("Failed to load data", e);
    }
  }, []);

  const saveReports = (updatedReports: LabReport[]) => {
      setLabReports(updatedReports);
      localStorage.setItem(LAB_REPORTS_KEY, JSON.stringify(updatedReports));
  }

  const form = useForm<LabReportFormValues>({
    resolver: zodResolver(labReportSchema),
    defaultValues: {
      patientName: '',
      reportName: '',
      reportFile: undefined,
    },
  });

  const onSubmit = (data: LabReportFormValues) => {
    const newReport: LabReport = {
      id: `lab-${Date.now()}`,
      patientId: `pat-${data.patientName.replace(' ', '').toLowerCase()}`,
      patientName: data.patientName,
      reportName: data.reportName,
      date: format(new Date(), 'yyyy-MM-dd'),
      status: 'Available',
      fileName: data.reportFile[0].name,
    };

    saveReports([newReport, ...labReports]);
    toast({
      title: 'Lab Report Uploaded',
      description: `A new report for ${data.patientName} has been added.`,
    });
    form.reset();
    (document.getElementById('reportFile') as HTMLInputElement).value = '';
  };
  
  const handleDownload = (report: LabReport) => {
    const fileContent = `This is a dummy lab report for ${report.reportName} for patient ${report.patientName} dated ${report.date}.`;
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = report.fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  
  const getStatusVariant = (status: string) => {
    return status === 'Available' ? 'secondary' : 'outline';
  };

  const filteredReports = labReports.filter(
    (report) =>
      report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Manage Lab Reports</h1>
        <p className="text-muted-foreground">Upload new reports and view patient history.</p>
      </div>
      
      <Card>
          <CardHeader>
            <CardTitle>Upload New Lab Report</CardTitle>
            <CardDescription>Select a patient and the report file to upload.</CardDescription>
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
                    name="reportName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Complete Blood Count" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reportFile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report File</FormLabel>
                        <FormControl>
                            <Input id="reportFile" type="file" onChange={(e) => field.onChange(e.target.files)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Report
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

      <Card>
          <CardHeader>
             <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <CardTitle>Recent Lab Reports</CardTitle>
                    <CardDescription>A list of the most recently uploaded reports.</CardDescription>
                </div>
                <div className="relative">
                    <FileSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by patient or report name..."
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
                  <TableHead>Report Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length > 0 ? filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.patientName}</TableCell>
                    <TableCell>{report.reportName}</TableCell>
                    <TableCell>{format(parseISO(report.date), 'PPP')}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(report.status)}>{report.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleDownload(report)}>
                           <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground h-24">No lab reports found.</TableCell>
                    </TableRow>
                 )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
}
