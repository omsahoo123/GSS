
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Siren,
  ShieldCheck,
  Building,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const diseaseData = [
  { region: 'Rampur', cases: 120 },
  { region: 'Sitapur', cases: 89 },
  { region: 'Aligarh', cases: 215 },
  { region: 'Bareilly', cases: 75 },
  { region: 'Meerut', cases: 150 },
];

const chartConfig = {
  cases: {
    label: 'Cases',
    color: 'hsl(var(--destructive))',
  },
};

const resourceData = [
  { district: 'Rampur', beds: '85/100', vaccines: '1.2k', status: 'Stable' },
  { district: 'Sitapur', beds: '60/80', vaccines: '800', status: 'Stable' },
  { district: 'Aligarh', beds: '190/200', vaccines: '450', status: 'Critical' },
  { district: 'Bareilly', beds: '70/100', vaccines: '1.5k', status: 'Stable' },
];

const alertData = [
    { id: 'alert-1', title: 'High incidence of Flu in Aligarh', priority: 'High', status: 'Active', date: '2024-07-20' },
    { id: 'alert-2', title: 'Vaccination drive for Measles in Rampur', priority: 'Medium', status: 'Active', date: '2024-07-18' },
    { id: 'alert-3', title: 'Heatwave advisory for all districts', priority: 'Low', status: 'Ongoing', date: '2024-07-15' },
];

export default function HealthOfficialDashboardPage() {

    const getPriorityVariant = (priority: string) => {
        switch(priority) {
            case 'High': return 'destructive';
            case 'Medium': return 'default';
            case 'Low': return 'secondary';
            default: return 'outline';
        }
    }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">
          Public Health Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome, Ms. Verma. Monitor regional health trends and resource
          allocation.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Population Coverage
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5M</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Health Alerts
            </CardTitle>
            <Siren className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              1 new alert this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vaccination Rate
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82.5%</div>
            <p className="text-xs text-muted-foreground">
              Target: 90%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hospitals At Capacity
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1/4</div>
            <p className="text-xs text-muted-foreground">
              Aligarh district reporting high occupancy
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Disease Incidence by Region</CardTitle>
                <CardDescription>Number of reported cases in the last 30 days.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <BarChart accessibilityLayer data={diseaseData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="region"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        fontSize={12}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        fontSize={12}
                        allowDecimals={false}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="cases" fill="var(--color-cases)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Resource Allocation</CardTitle>
                <CardDescription>Current status of key resources across districts.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>District</TableHead>
                            <TableHead>Bed Occupancy</TableHead>
                            <TableHead>Vaccine Stock</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {resourceData.map(res => (
                            <TableRow key={res.district}>
                                <TableCell className="font-medium">{res.district}</TableCell>
                                <TableCell>{res.beds}</TableCell>
                                <TableCell>{res.vaccines}</TableCell>
                                <TableCell>
                                    <Badge variant={res.status === 'Critical' ? 'destructive' : 'secondary'}>{res.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>Public Health Alerts</CardTitle>
                <CardDescription>Active alerts and advisories issued.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Alert Title</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Date Issued</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                       {alertData.map(alert => (
                         <TableRow key={alert.id}>
                            <TableCell className="font-medium">{alert.title}</TableCell>
                            <TableCell>
                                <Badge variant={getPriorityVariant(alert.priority)}>{alert.priority}</Badge>
                            </TableCell>
                            <TableCell>{alert.date}</TableCell>
                            <TableCell>{alert.status}</TableCell>
                         </TableRow>
                       ))}
                    </TableBody>
                </Table>
            </CardContent>
       </Card>

    </div>
  );
}
