'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  Download,
  Eye,
  FileWarning,
  Hospital,
  ShieldCheck,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Report = {
  id: string;
  title: string;
  description: string;
  content: string;
  icon: React.ElementType;
};

const availableReports: Report[] = [
  {
    id: 'disease-summary',
    title: 'Weekly Disease Summary',
    description: 'A summary of communicable disease trends over the last 7 days.',
    content:
      'Flu cases have increased by 15% in Aligarh, while Dengue cases remain stable across all districts. No other significant outbreaks were reported. Recommend monitoring Aligarh closely.',
    icon: FileWarning,
  },
  {
    id: 'resource-utilization',
    title: 'Monthly Resource Utilization',
    description: 'An overview of hospital bed and staff allocation for the past month.',
    content:
      'Overall bed occupancy remained at 78%. Aligarh General Hospital experienced peak occupancy at 95% during the second week. Staffing levels were adequate across all regions.',
    icon: Hospital,
  },
  {
    id: 'vaccination-progress',
    title: 'Vaccination Campaign Progress',
    description: 'Report on the progress of the ongoing measles vaccination drive.',
    content:
      'The measles vaccination campaign has achieved 65% coverage in Rampur and 58% in Sitapur. Bareilly is lagging at 40%. Additional awareness campaigns are recommended for Bareilly.',
    icon: ShieldCheck,
  },
];

export default function ReportsPage() {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const { toast } = useToast();

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setIsDetailDialogOpen(true);
  };

  const handleDownload = (report: Report) => {
    const fileContent = `Report Title: ${report.title}\n\n${report.content}`;
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.id}_report.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast({
      title: 'Report Downloaded',
      description: `${report.title} has been downloaded.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Health Reports</h1>
        <p className="text-muted-foreground">
          Generate and view periodic reports on public health metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availableReports.map((report) => (
          <Card key={report.id} className="flex flex-col">
            <CardHeader className="flex-row items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <report.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle>{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </div>
            </CardHeader>
            <CardFooter className="mt-auto flex gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleViewDetails(report)}
              >
                <Eye className="mr-2 h-4 w-4" /> View Details
              </Button>
              <Button className="w-full" onClick={() => handleDownload(report)}>
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Report Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedReport?.title}</DialogTitle>
            <DialogDescription>
              A detailed summary of the report.
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="prose prose-sm max-w-none rounded-lg border bg-secondary/50 p-4">
              <p>{selectedReport.content}</p>
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
