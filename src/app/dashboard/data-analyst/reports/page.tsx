
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
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const reportTypes = {
  'disease-distribution': 'Disease Distribution Report',
  'patient-demographics': 'Patient Demographics Overview',
  'resource-vs-cases': 'Resource vs. Case Load Analysis',
};

const dataSources = ['disease_incidents', 'patients', 'hospital_resources'];

const reportSchema = z.object({
  reportType: z.string().min(1, 'Please select a report type.'),
  dataSource: z.string().min(1, 'Please select a data source.'),
  startDate: z.string().min(1, 'Please select a start date.'),
  endDate: z.string().min(1, 'Please select an end date.'),
}).refine(data => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'Start date cannot be after end date.',
    path: ['startDate'],
});

type ReportFormValues = z.infer<typeof reportSchema>;
type GeneratedReport = {
  title: string;
  parameters: string;
  content: string;
};

export default function ReportsPage() {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  const { toast } = useToast();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reportType: 'disease-distribution',
      dataSource: 'disease_incidents',
      startDate: format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const generateReportContent = (data: ReportFormValues): GeneratedReport => {
    const reportTitle = reportTypes[data.reportType as keyof typeof reportTypes];
    const params = `Source: ${data.dataSource} | Period: ${format(new Date(data.startDate), 'PPP')} to ${format(new Date(data.endDate), 'PPP')}`;
    let content = `This is a mock report for "${reportTitle}".\n\n`;
    
    switch(data.reportType) {
        case 'disease-distribution':
            content += 'Analysis shows that Flu and Dengue were the most reported diseases in the selected period. Aligarh district reported the highest number of cases, accounting for approximately 35% of the total incidents from the selected data source.';
            break;
        case 'patient-demographics':
            content += 'The primary patient demographic affected was the 30-45 age group. The male-to-female ratio of reported cases was approximately 1.2:1. Data sourced from the patients table.';
            break;
        case 'resource-vs-cases':
            content += 'A correlation was found between high case loads in the Meerut district and strained hospital resources. Bed occupancy peaked at 92% during the second week of the analysis period, while case numbers were at their highest.';
            break;
    }

    return { title: reportTitle, parameters: params, content };
  };

  const onSubmit = (data: ReportFormValues) => {
    const report = generateReportContent(data);
    setGeneratedReport(report);
    setIsDetailDialogOpen(true);
  };
  
  const handleDownload = () => {
    if (!generatedReport) return;
    
    const fileContent = `Report Title: ${generatedReport.title}\nParameters: ${generatedReport.parameters}\n\n${generatedReport.content}`;
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedReport.title.toLowerCase().replace(/\s/g, '_')}_${format(new Date(), 'yyyyMMdd')}.txt`;
    document.body.appendChild(a);
a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast({
      title: 'Report Downloaded',
      description: `${generatedReport.title} has been downloaded.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Reporting Workbench</h1>
        <p className="text-muted-foreground">
          Generate custom reports from various data sources.
        </p>
      </div>

       <Card>
        <CardHeader>
            <CardTitle>Generate a New Report</CardTitle>
            <CardDescription>Select the parameters to build your report.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <FormField
                        control={form.control}
                        name="reportType"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Report Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select a report type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {Object.entries(reportTypes).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>{value}</SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="dataSource"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data Source</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select a data source" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {dataSources.map(source => (
                                    <SelectItem key={source} value={source}>{source}</SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                            <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                            <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <Button type="submit">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                </Button>
                </form>
            </Form>
        </CardContent>
       </Card>

      {/* Report Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{generatedReport?.title}</DialogTitle>
            <DialogDescription>
              {generatedReport?.parameters}
            </DialogDescription>
          </DialogHeader>
          {generatedReport && (
            <div className="prose prose-sm max-w-none rounded-lg border bg-secondary/50 p-4">
              <p>{generatedReport.content}</p>
            </div>
          )}
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
             <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Download Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
