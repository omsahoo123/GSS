
'use client';

import { useState, useMemo, useEffect } from 'react';
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
import { format, subDays, parseISO, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { DISEASE_DATA_KEY, type DistrictDiseaseData } from '../../data-entry-operator/disease-data/page';
import { REGIONAL_DATA_KEY } from '../../data-entry-operator/regional-data/page';
import type { RegionalData } from '../../data-entry-operator/page';
import { Input } from '@/components/ui/input';


const regions = ['rampur', 'sitapur', 'aligarh', 'bareilly', 'meerut'];

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


const PIE_CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const LINE_CHART_COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
];


const occupancyChartConfig = {
  occupancy: { label: 'Occupancy', color: 'hsl(var(--destructive))' },
};

const ageChartConfig = {
    "0-18": { label: '0-18', color: PIE_CHART_COLORS[0] },
    "19-45": { label: '19-45', color: PIE_CHART_COLORS[1] },
    "46-65": { label: '46-65', color: PIE_CHART_COLORS[2] },
    "65+": { label: '65+', color: PIE_CHART_COLORS[3] },
};

export default function HealthAnalyticsPage() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [diseaseData, setDiseaseData] = useState<DistrictDiseaseData[]>([]);
  const [regionalData, setRegionalData] = useState<RegionalData[]>([]);
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 29),
    to: new Date()
  });

  useEffect(() => {
    try {
        const storedDiseaseData = localStorage.getItem(DISEASE_DATA_KEY);
        if (storedDiseaseData) {
            setDiseaseData(JSON.parse(storedDiseaseData));
        }
        const storedRegionalData = localStorage.getItem(REGIONAL_DATA_KEY);
        if(storedRegionalData) {
            setRegionalData(JSON.parse(storedRegionalData));
        }
    } catch (error) {
        console.error("Failed to load data from localStorage", error);
    }
  }, []);

  const availableDiseases = useMemo(() => {
    const all = new Set(diseaseData.flatMap(d => d.entries.map(e => e.diseaseName)))
    return Array.from(all).filter(Boolean); // Filter out empty strings
  }, [diseaseData]);
  
  const diseaseChartConfig = useMemo(() => {
    return availableDiseases.reduce((config, diseaseName, index) => {
        const key = diseaseName.replace(/\s+/g, '-').toLowerCase();
        config[key] = {
            label: diseaseName,
            color: LINE_CHART_COLORS[index % LINE_CHART_COLORS.length],
        };
        return config;
    }, {} as Record<string, {label: string, color: string}>)
  }, [availableDiseases]);

  const dailyCaseData = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return [];

    let filteredByRegion = diseaseData;
    if (selectedRegion !== 'all') {
      filteredByRegion = filteredByRegion.filter(d => d.district.toLowerCase() === selectedRegion);
    }

    const intervalDays = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });

    return intervalDays.map(date => {
        const dailyData: {[key: string]: any} = { date: format(date, 'MMM d') };

        availableDiseases.forEach(diseaseName => {
            const key = diseaseName.replace(/\s+/g, '-').toLowerCase();
            const totalCasesForDay = filteredByRegion.reduce((sum, district) => {
                const dayEntries = district.entries.filter(e => 
                    e.diseaseName === diseaseName &&
                    format(parseISO(e.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                );
                return sum + dayEntries.reduce((entrySum, entry) => entrySum + entry.caseCount, 0);
            }, 0);
            dailyData[key] = totalCasesForDay;
        });
        return dailyData;
    });
  }, [selectedRegion, diseaseData, availableDiseases, dateRange]);

  const hospitalOccupancyData = useMemo(() => {
     if (selectedRegion !== 'all') {
        return regionalData.filter(d => d.district.toLowerCase() === selectedRegion);
     }
     return regionalData;
  }, [selectedRegion, regionalData]);
  
  const ageDemographicsData = useMemo(() => {
    return allAgeDemographicsData[selectedRegion] || [];
  }, [selectedRegion]);

  const handleDownload = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    csvContent += `Health Analytics Report\n`;
    csvContent += `Region: ${selectedRegion}\n`;
    csvContent += `Period: ${format(dateRange.from, 'yyyy-MM-dd')} to ${format(dateRange.to, 'yyyy-MM-dd')}\n`;
    csvContent += `Generated on: ${format(new Date(), 'yyyy-MM-dd')}\n\n`;

    csvContent += "Daily Disease Trends\n";
    csvContent += "Date," + availableDiseases.join(',') + '\n';
    dailyCaseData.forEach(row => {
        const rowData = [row.date, ...availableDiseases.map(d => row[d.replace(/\s+/g, '-').toLowerCase()] || 0)];
        csvContent += rowData.join(',') + '\n';
    });
    csvContent += "\n";

    csvContent += "Hospital Bed Occupancy\n";
    csvContent += "Region,Occupied,Total,Occupancy (%)\n";
    hospitalOccupancyData.forEach(row => {
        const occupancy = row.beds.total > 0 ? (row.beds.occupied / row.beds.total) * 100 : 0;
        csvContent += `${row.district},${row.beds.occupied},${row.beds.total},${occupancy.toFixed(1)}\n`;
    });
    csvContent += "\n";

    csvContent += "Patient Demographics by Age (Sample Data)\n";
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
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'from' | 'to') => {
      const newDate = e.target.value ? parseISO(e.target.value) : (field === 'from' ? subDays(new Date(), 29) : new Date());
      setDateRange(prev => ({ ...prev, [field]: newDate }));
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
        <div className="flex flex-wrap items-center gap-4">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map(r => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Input type="date" value={format(dateRange.from, 'yyyy-MM-dd')} onChange={(e) => handleDateChange(e, 'from')} />
             <span className="text-muted-foreground">to</span>
            <Input type="date" value={format(dateRange.to, 'yyyy-MM-dd')} onChange={(e) => handleDateChange(e, 'to')} />
          </div>
          <Button onClick={handleDownload} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Report
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Daily Disease Trends
          </CardTitle>
          <CardDescription>
            Reported cases over the selected date range.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={diseaseChartConfig} className="h-72 w-full">
            <LineChart
              accessibilityLayer
              data={dailyCaseData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
              <Legend />
              {availableDiseases.map((disease) => {
                const key = disease.replace(/\s+/g, '-').toLowerCase();
                return <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={`var(--color-${key})`}
                    strokeWidth={2}
                    dot={false}
                    name={disease}
                />
              })}
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
                data={hospitalOccupancyData.map(d => ({...d, occupancy: d.beds.total > 0 ? (d.beds.occupied / d.beds.total) * 100 : 0, region: d.district}))}
                layout="vertical"
                 margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
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
              Patient Demographics by Age (Sample Data)
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
                        <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
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
