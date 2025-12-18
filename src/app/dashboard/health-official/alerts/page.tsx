
'use client';

import { useState, useEffect } from 'react';
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
import { Megaphone, FileSearch } from 'lucide-react';
import { REGIONAL_DATA_KEY } from '../../data-entry-operator/regional-data/page';

const HEALTH_ALERTS_STORAGE_KEY = 'healthOfficialAlerts';

const alertSchema = z.object({
  title: z.string().min(1, 'Alert title is required.'),
  region: z.string().min(1, 'Please select a region.'),
  priority: z.enum(['Low', 'Medium', 'High']),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
});

type AlertFormValues = z.infer<typeof alertSchema>;
type Alert = {
    id: string;
    title: string;
    priority: 'Low' | 'Medium' | 'High';
    region: string;
    status: string;
    date: string;
    description: string;
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [regions, setRegions] = useState<string[]>(['all']);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedAlerts = localStorage.getItem(HEALTH_ALERTS_STORAGE_KEY);
      if (storedAlerts) {
        setAlerts(JSON.parse(storedAlerts));
      }

      const storedRegionalData = localStorage.getItem(REGIONAL_DATA_KEY);
      if(storedRegionalData) {
        const regionalData = JSON.parse(storedRegionalData);
        const districtNames = regionalData.map((d: {district: string}) => d.district.toLowerCase());
        setRegions(['all', ...districtNames]);
      }

    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(HEALTH_ALERTS_STORAGE_KEY, JSON.stringify(alerts));
    } catch (error) {
      console.error("Failed to save alerts to localStorage", error);
    }
  }, [alerts]);

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      title: '',
      region: 'all',
      priority: 'Medium',
      description: '',
    },
  });

  const onSubmit = (data: AlertFormValues) => {
    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      title: data.title,
      priority: data.priority,
      region: data.region,
      status: 'Active',
      date: format(new Date(), 'yyyy-MM-dd'),
      description: data.description,
    };

    setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
    toast({
      title: 'Alert Issued',
      description: `A new ${data.priority} priority alert has been issued for the ${data.region} region.`,
    });
    form.reset();
  };
  
  const getPriorityVariant = (priority: string): 'destructive' | 'default' | 'secondary' => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'secondary';
    }
  };

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Public Health Alerts</h1>
        <p className="text-muted-foreground">Issue new alerts and monitor active advisories.</p>
      </div>
      
      <Card>
          <CardHeader>
            <CardTitle>Issue New Alert</CardTitle>
            <CardDescription>Create and dispatch a new health advisory to the public and relevant authorities.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                   <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alert Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Dengue Outbreak Warning" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-6">
                     <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Target Region</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select a region" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {regions.map(region => (
                                    <SelectItem key={region} value={region} className="capitalize">
                                        {region === 'all' ? 'All Regions' : region}
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
                        name="priority"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>
                   <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a detailed description of the alert, including recommendations and necessary actions."
                            {...field}
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit">
                  <Megaphone className="mr-2 h-4 w-4" />
                  Issue Alert
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

      <Card>
          <CardHeader>
             <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <CardTitle>Active & Recent Alerts</CardTitle>
                    <CardDescription>A log of recently issued public health advisories.</CardDescription>
                </div>
                <div className="relative">
                    <FileSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by title or region..."
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
                  <TableHead>Title</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Date Issued</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">{alert.title}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityVariant(alert.priority)}>{alert.priority}</Badge>
                    </TableCell>
                    <TableCell className="capitalize">{alert.region}</TableCell>
                    <TableCell>{alert.date}</TableCell>
                    <TableCell>
                      <Badge variant={alert.status === 'Active' ? 'default' : 'outline'}>{alert.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                 {filteredAlerts.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No alerts found.</TableCell>
                    </TableRow>
                 )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
}
