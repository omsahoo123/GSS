
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingUp, BedDouble, Users } from 'lucide-react';
import { format, subDays } from 'date-fns';

// Mock data
const dailyCaseData = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(new Date(), 29 - i), 'MMM d'),
  flu: Math.floor(Math.random() * 50 + 10),
  dengue: Math.floor(Math.random() * 30 + 5),
}));

const hospitalOccupancyData = [
  { region: 'Rampur', occupied: 85, total: 100 },
  { region: 'Sitapur', occupied: 60, total: 80 },
  { region: 'Aligarh', occupied: 190, total: 200 },
  { region: 'Bareilly', occupied: 75, total: 100 },
  { region: 'Meerut', occupied: 150, total: 180 },
];

const ageDemographicsData = [
  { name: '0-18', value: 400 },
  { name: '19-45', value: 300 },
  { name: '46-65', value: 200 },
  { name: '65+', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const diseaseChartConfig = {
  flu: { label: 'Flu', color: 'hsl(var(--chart-1))' },
  dengue: { label: 'Dengue', color: 'hsl(var(--chart-2))' },
};

const occupancyChartConfig = {
  occupancy: { label: 'Occupancy', color: 'hsl(var(--destructive))' },
};

const ageChartConfig = {
    "0-18": { label: '0-18', color: COLORS[0] },
    "19-45": { label: '19-45', color: COLORS[1] },
    "46-65": { label: '46-65', color: COLORS[2] },
    "65+": { label: '65+', color: COLORS[3] },
};

export default function HealthAnalyticsPage() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedDisease, setSelectedDisease] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Health Analytics</h1>
          <p className="text-muted-foreground">
            In-depth analysis of public health data and trends.
          </p>
        </div>
        <div className="flex gap-4">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="rampur">Rampur</SelectItem>
              <SelectItem value="sitapur">Sitapur</SelectItem>
              <SelectItem value="aligarh">Aligarh</SelectItem>
              <SelectItem value="bareilly">Bareilly</SelectItem>
              <SelectItem value="meerut">Meerut</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDisease} onValueChange={setSelectedDisease}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Disease" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Diseases</SelectItem>
              <SelectItem value="flu">Flu</SelectItem>
              <SelectItem value="dengue">Dengue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Daily Disease Trends (Last 30 Days)
          </CardTitle>
          <CardDescription>
            Reported cases over time for Flu and Dengue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={diseaseChartConfig} className="h-72 w-full">
            <LineChart
              accessibilityLayer
              data={dailyCaseData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="flu"
                stroke="var(--color-flu)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="dengue"
                stroke="var(--color-dengue)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BedDouble className="h-5 w-5" />
              Hospital Bed Occupancy by Region
            </CardTitle>
            <CardDescription>
              Percentage of occupied beds in key districts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={occupancyChartConfig} className="h-72 w-full">
              <BarChart
                accessibilityLayer
                data={hospitalOccupancyData.map(d => ({...d, occupancy: (d.occupied / d.total) * 100}))}
                layout="vertical"
                 margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="region"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent formatter={(value) => `${(value as number).toFixed(1)}%`} />}
                />
                <Bar dataKey="occupancy" fill="var(--color-occupancy)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Patient Demographics by Age
            </CardTitle>
            <CardDescription>
              Distribution of cases across different age groups.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={ageChartConfig} className="h-72 w-full">
                <ResponsiveContainer width="100%" height={288}>
                  <PieChart>
                    <Pie
                      data={ageDemographicsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                        return (
                          <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                            {`${(percent * 100).toFixed(0)}%`}
                          </text>
                        );
                      }}
                      outerRadius={110}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ageDemographicsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
