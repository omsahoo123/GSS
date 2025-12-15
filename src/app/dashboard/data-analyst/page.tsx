
'use client';

import Link from 'next/link';
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
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Database,
  Map,
  Search,
  FileText,
  BarChart,
  BrainCircuit,
  ArrowRight,
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const patientDataByRegion = [
  { region: 'Rampur', patients: 1250 },
  { region: 'Sitapur', patients: 980 },
  { region: 'Aligarh', patients: 2100 },
  { region: 'Bareilly', patients: 850 },
  { region: 'Meerut', patients: 1750 },
];

const chartConfig = {
  patients: {
    label: 'Patients',
    color: 'hsl(var(--primary))',
  },
};

const recentQueries = [
  { id: 'q1', name: 'Flu cases in Aligarh (Last 30 Days)', date: '2024-07-20' },
  { id: 'q2', name: 'Bed occupancy vs. Staffing', date: '2024-07-19' },
  { id: 'q3', name: 'Patient demographic breakdown', date: '2024-07-18' },
];

const quickActions = [
  {
    title: 'New Query',
    description: 'Start with a blank query editor.',
    icon: Database,
    href: '/dashboard/data-analyst/queries',
  },
  {
    title: 'New Report',
    description: 'Build a report from a template.',
    icon: FileText,
    href: '/dashboard/data-analyst/reports',
  },
  {
    title: 'AI Insights',
    description: 'Use AI to find data correlations.',
    icon: BrainCircuit,
    href: '/dashboard/data-analyst/insights',
  },
];

export default function DataAnalystDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">
            Data Analyst Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome, Anil. Access data tools and generate insights.
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search datasets or reports..."
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients Recorded
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6,930</div>
            <p className="text-xs text-muted-foreground">
              Across all regions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Disease Entries
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,204</div>
            <p className="text-xs text-muted-foreground">
              Total recorded disease instances
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Regional Data Points
            </CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Districts with available data
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Patient Data by Region
            </CardTitle>
            <CardDescription>
              Total number of patient records from each district.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <RechartsBarChart accessibilityLayer data={patientDataByRegion}>
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
                  tickFormatter={(value) =>
                    `${new Intl.NumberFormat('en-IN', {
                      notation: 'compact',
                    }).format(value as number)}`
                  }
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="patients" fill="var(--color-patients)" radius={4} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump directly into your tasks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href} passHref>
                <div className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent hover:text-accent-foreground">
                  <action.icon className="h-6 w-6" />
                  <div className="flex-1">
                    <p className="font-semibold">{action.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Queries</CardTitle>
          <CardDescription>
            A log of your most recently executed data queries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Query Name</TableHead>
                <TableHead>Date Executed</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentQueries.map((query) => (
                <TableRow key={query.id}>
                  <TableCell className="font-medium">{query.name}</TableCell>
                  <TableCell>{query.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Re-run
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
