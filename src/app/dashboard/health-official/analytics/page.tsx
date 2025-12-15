
'use client';

import { useState, useMemo } from 'react';
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
import { Button } from '@/components/ui/button';
import { TrendingUp, BedDouble, Users, Download } from 'lucide-react';
import { format, subDays } from 'date-fns';

// --- Expanded Mock Data ---

const regions = ['rampur', 'sitapur', 'aligarh', 'bareilly', 'meerut'];
const diseases = ['flu', 'dengue'];

// Generate more detailed mock data
const generateDailyData = (region: string, disease: string) => {
    const randomFactor = regions.indexOf(region) + 1 + (disease === 'flu' ? 1.5 : 1);
    return Array.from({ length: 30 }, (_, i) => ({
      date: format(subDays(new Date(), 29 - i), 'yyyy-MM-dd'),
      region,
      disease,
      cases: Math.floor(Math.random() * (15 * randomFactor) + (5 * randomFactor)),
    }));
};

const allDailyCaseData = regions.flatMap(region => 
    diseases.flatMap(disease => generateDailyData(region, disease))
);


const allHospitalOccupancyData = regions.map((region, i) => {
    const total = 80 + i * 20;
    const occupied = Math.floor(Math.random() * (total * 0.5) + (total * 0.3));
    return { region, occupied, total };
});

const allAgeDemographicsData = regions.reduce((acc, region) => {
    acc[region] = [
        { name: '0-18', value: Math.floor(Math.random() * 200 + 50) },
        { name: '19-45', value: Math.floor(Math.random() * 300 + 100) },
        { name: '46-65', value: Math.floor(Math.random() * 150 + 70) },
        { name: '65+', value: Math.floor(Math.random() * 80 + 40) },
    ];
    return acc;
}, {} as Record<string, {name: string, value: number}[]>);

allAgeDemographicsData['all'] = Object.values(allAgeDemographicsData).flat().reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.name);
    if (existing) {
        existing.value += curr.value;
    } else {
        acc.push({ ...curr });
    }
    return acc;
}, [] as {name: string, value: number}[]);


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

  const dailyCaseData = useMemo(() => {
    let filtered = allDailyCaseData;
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(d => d.region === selectedRegion);
    }
    if (selectedDisease !== 'all') {
      filtered = filtered.filter(d => d.disease === selectedDisease);
    }

    const aggregatedByDate = filtered.reduce((acc, curr) => {
      if (!acc[curr.date]) {
        acc[curr.date] = { date: format(new Date(curr.date), 'MMM d'), flu: 0, dengue: 0 };
      }
      acc[curr.date][curr.disease as 'flu' | 'dengue'] += curr.cases;
      return acc;
    }, {} as Record<string, {date: string, flu: number, dengue: number}>);
    
    return Object.values(aggregatedByDate).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedRegion, selectedDisease]);

  const hospitalOccupancyData = useMemo(() => {
     if (selectedRegion !== 'all') {
        return allHospitalOccupancyData.filter(d => d.region === selectedRegion);
     }
     return allHospitalOccupancyData;
  }, [selectedRegion]);
  
  const ageDemographicsData = useMemo(() => {
    return allAgeDemographicsData[selectedRegion] || [];
  }, [selectedRegion]);

  const handleDownload = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Header
    csvContent += `Health Analytics Report\n`;
    csvContent += `Region: ${selectedRegion},Disease: ${selectedDisease}\n`;
    csvContent += `Generated on: ${format(new Date(), 'yyyy-MM-dd')}\n\n`;

    // Daily Trends
    csvContent += "Daily Disease Trends (Last 30 Days)\n";
    csvContent += "Date,Flu Cases,Dengue Cases\n";
    dailyCaseData.forEach(row => {
        csvContent += `${row.date},${row.flu},${row.dengue}\n`;
    });
    csvContent += "\n";

    // Hospital Occupancy
    csvContent += "Hospital Bed Occupancy\n";
    csvContent += "Region,Occupied,Total,Occupancy (%)\n";
    hospitalOccupancyData.forEach(row => {
        const occupancy = (row.occupied / row.total) * 100;
        csvContent += `${row.region},${row.occupied},${row.total},${occupancy.toFixed(1)}\n`;
    });
    csvContent += "\n";

    // Age Demographics
    csvContent += "Patient Demographics by Age\n";
    csvContent += "Age Group,Value\n";
    ageDemographicsData.forEach(row => {
        csvContent += `${row.name},${row.value}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `health_analytics_report_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map(r => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedDisease} onValueChange={setSelectedDisease}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Disease" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Diseases</SelectItem>
              {diseases.map(d => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={handleDownload} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Daily Disease Trends (Last 30 Days)
          </CardTitle>
          <CardDescription>
            Reported cases over time for selected diseases.
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
              {(selectedDisease === 'all' || selectedDisease === 'flu') && (
                 <Line
                    type="monotone"
                    dataKey="flu"
                    stroke="var(--color-flu)"
                    strokeWidth={2}
                    dot={false}
                  />
              )}
              {(selectedDisease === 'all' || selectedDisease === 'dengue') && (
                 <Line
                    type="monotone"
                    dataKey="dengue"
                    stroke="var(--color-dengue)"
                    strokeWidth={2}
                    dot={false}
                  />
              )}
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
                data={hospitalOccupancyData.map(d => ({...d, occupancy: (d.occupied / d.total) * 100, region: d.region.charAt(0).toUpperCase() + d.region.slice(1)}))}
                layout="vertical"
                 margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
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
             <ChartContainer config={ageChartConfig} className="mx-auto aspect-square h-full max-h-[288px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ageDemographicsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                        if (percent === 0) return null;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                        return (
                          <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
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
