
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
import { TrendingUp, BedDouble, Users, Download, ChevronDown, Hospital } from 'lucide-react';
import { format, subDays, parseISO, eachDayOfInterval } from 'date-fns';
import { HOSPITAL_CASE_DATA_KEY } from '../../data-entry-operator/hospital-data/page';
import { REGIONAL_DATA_KEY } from '../../data-entry-operator/regional-data/page';
import type { RegionalData } from '../../data-entry-operator/page';
import { Input } from '@/components/ui/input';
import { PATIENT_ACCOUNT_KEY } from '@/app/signup/patient/page';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { type LabReport } from '../../doctor/lab-reports/page';
import { type Prescription } from '../../doctor/prescriptions/page';


const PIE_CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const LINE_CHART_COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
];

type HospitalCaseData = {
  district: string;
  hospitalName: string;
  entries: {
    date: string;
    diseaseName: string;
    caseCount: number;
  }[];
}

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
  const [selectedHospital, setSelectedHospital] = useState('all');
  const [diseaseData, setDiseaseData] = useState<HospitalCaseData[]>([]);
  const [regionalData, setRegionalData] = useState<RegionalData[]>([]);
  const [allPatients, setAllPatients] = useState<any[]>([]);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 29),
    to: new Date()
  });
  
  const availableDiseases = useMemo(() => {
    if(!diseaseData) return [];
    const all = new Set(diseaseData.flatMap(d => d.entries.map(e => e.diseaseName)))
    return Array.from(all).filter(Boolean); // Filter out empty strings
  }, [diseaseData]);
  
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>(availableDiseases);

  useEffect(() => {
    setSelectedDiseases(availableDiseases);
  }, [availableDiseases]);


  const fetchData = () => {
    try {
        const storedDiseaseData = localStorage.getItem(HOSPITAL_CASE_DATA_KEY);
        if (storedDiseaseData) {
            setDiseaseData(JSON.parse(storedDiseaseData));
        }
        const storedRegionalData = localStorage.getItem(REGIONAL_DATA_KEY);
        if(storedRegionalData) {
            setRegionalData(JSON.parse(storedRegionalData));
        }
        const allPatientKeys = Object.keys(localStorage).filter(k => k.startsWith(PATIENT_ACCOUNT_KEY));
        const patientAccounts = allPatientKeys.map(k => JSON.parse(localStorage.getItem(k)!));
        setAllPatients(patientAccounts);
        
        const allLabReports = localStorage.getItem('allLabReports');
        if(allLabReports) {
            setLabReports(JSON.parse(allLabReports));
        }
        const allPrescriptions = localStorage.getItem('allPrescriptions');
        if(allPrescriptions) {
            setPrescriptions(JSON.parse(allPrescriptions));
        }
    } catch (error) {
        console.error("Failed to load data from localStorage", error);
    }
  };
  
  const regions = useMemo(() => {
    return ['all', ...[...new Set(regionalData.map(d => d.district.toLowerCase()))]];
  }, [regionalData]);

  const availableHospitals = useMemo(() => {
    let hospitals = regionalData;
    if (selectedRegion !== 'all') {
      hospitals = hospitals.filter(h => h.district.toLowerCase() === selectedRegion);
    }
    const hospitalOptions = hospitals.map(h => ({
      label: h.hospitalName,
      value: h.hospitalName
    }));
    return [{label: 'All Hospitals', value: 'all'}, ...hospitalOptions];
  }, [regionalData, selectedRegion]);

  useEffect(() => {
    fetchData();
    window.addEventListener('focus', fetchData);
    return () => {
        window.removeEventListener('focus', fetchData);
    };
  }, []);

  useEffect(() => {
    // Reset hospital selection when region changes
    setSelectedHospital('all');
  }, [selectedRegion]);
  
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
    if (!dateRange.from || !dateRange.to || !diseaseData) return [];

    let filteredByRegion = diseaseData;
    if (selectedRegion !== 'all') {
      filteredByRegion = filteredByRegion.filter(d => d.district.toLowerCase() === selectedRegion);
    }

    let filteredByHospital = filteredByRegion;
    if (selectedHospital !== 'all') {
      filteredByHospital = filteredByHospital.filter(d => d.hospitalName === selectedHospital);
    }

    const intervalDays = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });

    return intervalDays.map(date => {
        const dailyData: {[key: string]: any} = { date: format(date, 'MMM d') };

        selectedDiseases.forEach(diseaseName => {
            const key = diseaseName.replace(/\s+/g, '-').toLowerCase();
            const totalCasesForDay = filteredByHospital.reduce((sum, hospital) => {
                const dayEntries = hospital.entries.filter(e => 
                    e.diseaseName === diseaseName &&
                    format(parseISO(e.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                );
                return sum + dayEntries.reduce((entrySum, entry) => entrySum + entry.caseCount, 0);
            }, 0);
            dailyData[key] = totalCasesForDay;
        });
        return dailyData;
    });
  }, [selectedRegion, selectedHospital, diseaseData, selectedDiseases, dateRange]);

  const hospitalOccupancyData = useMemo(() => {
     if (selectedRegion !== 'all') {
        return regionalData.filter(d => d.district.toLowerCase() === selectedRegion);
     }
     // When 'all' regions selected, maybe group by district instead of showing all hospitals?
     // For now, let's just show all hospitals as before, but this can be changed.
     const districtSummary = regionalData.reduce((acc, curr) => {
        if (!acc[curr.district]) {
            acc[curr.district] = { district: curr.district, beds: { occupied: 0, total: 0 }, hospitalName: curr.district };
        }
        acc[curr.district].beds.occupied += curr.beds.occupied;
        acc[curr.district].beds.total += curr.beds.total;
        return acc;
     }, {} as Record<string, any>);
     return Object.values(districtSummary);
  }, [selectedRegion, regionalData]);
  
  const ageDemographicsData = useMemo(() => {
    const patientAges = allPatients.map(p => p.age).filter(age => age > 0);
    const ageGroups: { [key: string]: number } = {
        '0-18': 0,
        '19-45': 0,
        '46-65': 0,
        '65+': 0,
    };
    patientAges.forEach(age => {
        if (age <= 18) ageGroups['0-18']++;
        else if (age <= 45) ageGroups['19-45']++;
        else if (age <= 65) ageGroups['46-65']++;
        else ageGroups['65+']++;
    });

    return Object.entries(ageGroups).map(([name, value]) => ({ name, value }));
  }, [allPatients]);

  const handleDownload = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    csvContent += `Health Analytics Report\n`;
    csvContent += `Region: ${selectedRegion}\n`;
    csvContent += `Period: ${format(dateRange.from, 'yyyy-MM-dd')} to ${format(dateRange.to, 'yyyy-MM-dd')}\n`;
    csvContent += `Generated on: ${format(new Date(), 'yyyy-MM-dd')}\n\n`;

    csvContent += "Daily Disease Trends\n";
    csvContent += "Date," + selectedDiseases.join(',') + '\n';
    dailyCaseData.forEach(row => {
        const rowData = [row.date, ...selectedDiseases.map(d => row[d.replace(/\s+/g, '-').toLowerCase()] || 0)];
        csvContent += rowData.join(',') + '\n';
    });
    csvContent += "\n";

    csvContent += "Hospital Bed Occupancy\n";
    csvContent += "Hospital,District,Occupied,Total,Occupancy (%)\n";
    hospitalOccupancyData.forEach(row => {
        const occupancy = row.beds.total > 0 ? (row.beds.occupied / row.beds.total) * 100 : 0;
        csvContent += `${row.hospitalName},${row.district},${row.beds.occupied},${row.beds.total},${occupancy.toFixed(1)}\n`;
    });
    csvContent += "\n";

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
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'from' | 'to') => {
      const newDate = e.target.value ? parseISO(e.target.value) : (field === 'from' ? subDays(new Date(), 29) : new Date());
      setDateRange(prev => ({ ...prev, [field]: newDate }));
  };

  const handleDiseaseSelectionChange = (diseaseName: string) => {
    setSelectedDiseases(prev => {
      if (prev.includes(diseaseName)) {
        return prev.filter(d => d !== diseaseName);
      } else {
        return [...prev, diseaseName];
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">Health Analytics</h1>
          <p className="text-muted-foreground">
            In-depth analysis of public health data and trends.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(r => <SelectItem key={r} value={r} className="capitalize">{r === 'all' ? 'All Regions' : r}</SelectItem>)}
            </SelectContent>
          </Select>
          
           <Select value={selectedHospital} onValueChange={setSelectedHospital}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select Hospital" />
            </SelectTrigger>
            <SelectContent>
              {availableHospitals.map(h => <SelectItem key={h.value} value={h.value} className="capitalize">{h.label}</SelectItem>)}
            </SelectContent>
          </Select>

           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-40">
                Diseases <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Show Diseases</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableDiseases.map(disease => (
                 <DropdownMenuCheckboxItem
                    key={disease}
                    checked={selectedDiseases.includes(disease)}
                    onCheckedChange={() => handleDiseaseSelectionChange(disease)}
                 >
                    {disease}
                 </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
           </DropdownMenu>

          <div className="flex w-full items-center gap-2 sm:w-auto flex-1 min-w-[280px]">
            <Input type="date" value={format(dateRange.from, 'yyyy-MM-dd')} onChange={(e) => handleDateChange(e, 'from')} className="w-full sm:w-auto"/>
             <span className="text-muted-foreground">to</span>
            <Input type="date" value={format(dateRange.to, 'yyyy-MM-dd')} onChange={(e) => handleDateChange(e, 'to')} className="w-full sm:w-auto"/>
          </div>
          <Button onClick={handleDownload} variant="outline" className="w-full sm:w-auto">
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
            Reported cases for {selectedHospital === 'all' ? 'all selected hospitals' : selectedHospital} in {selectedRegion === 'all' ? 'all regions' : selectedRegion}.
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
              {selectedDiseases.map((disease) => {
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
              Hospital Bed Occupancy
            </CardTitle>
            <CardDescription>
              Percentage of occupied beds in {selectedRegion === 'all' ? 'all regions (grouped by district)' : selectedRegion}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={occupancyChartConfig} className="h-72 w-full">
              <BarChart
                accessibilityLayer
                data={hospitalOccupancyData.map(d => ({...d, occupancy: d.beds.total > 0 ? (d.beds.occupied / d.beds.total) * 100 : 0, name: d.hospitalName}))}
                layout="vertical"
                 margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="capitalize"
                  width={100}
                  interval={0}
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
              Distribution of registered patients across different age groups.
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
