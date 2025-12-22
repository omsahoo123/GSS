'use client';

import { useState, useEffect } from 'react';
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
import { format, subDays, parseISO } from 'date-fns';

type Transaction = {
    id: string;
    medicine: string;
    amount: number;
    date: string;
};

const TRANSACTIONS_STORAGE_KEY = 'pharmacistTransactions';

const chartConfig = {
  sales: {
    label: 'Sales (₹)',
    color: 'hsl(var(--primary))',
  },
};


export default function PharmacistReportsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const fetchTransactions = () => {
        try {
            const storedTransactions = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
            if (storedTransactions) {
                setTransactions(JSON.parse(storedTransactions).map((t: any) => ({
                    ...t,
                    date: t.date ? format(parseISO(t.date), 'yyyy-MM-dd') : 'N/A'
                })));
            }
        } catch (error) {
            console.error("Failed to load transactions from localStorage", error);
        }
    };
    
    useEffect(() => {
        fetchTransactions();
        window.addEventListener('focus', fetchTransactions);
        return () => {
          window.removeEventListener('focus', fetchTransactions);
        }
    }, []);

    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalPrescriptions = transactions.length;

    // Prepare data for the sales chart (last 7 days)
    const salesData = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), i);
        const dateString = format(date, 'yyyy-MM-dd');
        const daySales = transactions
            .filter(t => t.date === dateString)
            .reduce((sum, t) => sum + t.amount, 0);
        return {
            date: format(date, 'E'), // e.g., 'Mon'
            sales: daySales,
        };
    }).reverse();
    
    const busiestDayData = salesData.reduce((max, day) => day.sales > max.sales ? day : max, salesData[0] || { date: 'N/A', sales: 0 });

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
            <div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From all recorded transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prescriptions Filled</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalPrescriptions}</div>
            <p className="text-xs text-muted-foreground">
              Total prescriptions recorded
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Busiest Day</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{busiestDayData.date}</div>
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
                tickFormatter={(value) => `₹${value}`}
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
                {transactions.slice(0, 10).map((transaction) => (
                    <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.medicine}</TableCell>
                        <TableCell>{format(parseISO(transaction.date), 'PPP')}</TableCell>
                        <TableCell className="text-right">₹{transaction.amount.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
                 {transactions.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                            No transactions recorded yet.
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
