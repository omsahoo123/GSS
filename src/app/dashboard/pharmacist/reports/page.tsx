
'use client';

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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { IndianRupee, Pill, CalendarDays } from 'lucide-react';

const salesData = [
  { date: 'Mon', sales: 23 },
  { date: 'Tue', sales: 21 },
  { date: 'Wed', sales: 35 },
  { date: 'Thu', sales: 42 },
  { date: 'Fri', sales: 28 },
  { date: 'Sat', sales: 52 },
  { date: 'Sun', sales: 18 },
];

const recentTransactions = [
    { id: 't-1', medicine: 'Paracetamol', amount: 50.00, date: '2024-07-29' },
    { id: 't-2', medicine: 'Amoxicillin', amount: 120.00, date: '2024-07-29' },
    { id: 't-3', medicine: 'Metformin', amount: 85.00, date: '2024-07-28' },
    { id: 't-4', medicine: 'Lisinopril', amount: 150.00, date: '2024-07-28' },
    { id: 't-5', medicine: 'Ibuprofen', amount: 40.00, date: '2024-07-27' },
]

const chartConfig = {
  sales: {
    label: 'Sales',
    color: 'hsl(var(--primary))',
  },
};


export default function PharmacistReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">Sales Reports</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prescriptions Filled</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Busiest Day</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Saturday</div>
            <p className="text-xs text-muted-foreground">
              Based on sales volume this week
            </p>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>This Week's Sales</CardTitle>
          <CardDescription>
            A visual summary of sales activity over the last 7 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart accessibilityLayer data={salesData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
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
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            A list of the latest sales recorded.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.medicine}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell className="text-right">₹{transaction.amount.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
