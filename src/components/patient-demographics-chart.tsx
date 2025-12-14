'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { age: '0-10', patients: 15 },
  { age: '11-20', patients: 25 },
  { age: '21-30', patients: 45 },
  { age: '31-40', patients: 60 },
  { age: '41-50', patients: 55 },
  { age: '51-60', patients: 40 },
  { age: '60+', patients: 30 },
];

const chartConfig = {
  patients: {
    label: 'Patients',
    color: 'hsl(var(--primary))',
  },
};

export function PatientDemographicsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <XAxis
          dataKey="age"
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
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="patients" fill="var(--color-patients)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
