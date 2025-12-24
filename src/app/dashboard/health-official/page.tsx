
'use client';

import { useState, useEffect } from 'react';
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
  Building,
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import Link from 'next/link';
import { REGIONAL_DATA_KEY } from '../data-entry-operator/regional-data/page';
import { HOSPITAL_CASE_DATA_KEY } from '../data-entry-operator/hospital-data/page';
import { LOGGED_IN_USER_KEY } from '@/app/login/page';

const chartConfig = {
  cases: {
    label: 'Cases',
    color: 'hsl(var(--destructive))',
  },
};

const HEALTH_ALERTS_STORAGE_KEY = 'healthOfficialAlerts';

type Alert = {
    id: string;
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    status: string;
    date: string;
};

type HospitalCaseData = {
  district: string;
  hospitalName: string;
  entries: {
    date: string;
    diseaseName: string;
    caseCount: number;
  }[];
}

type DistrictData = {
  districtName: string;
  hospitals: {
    population: number;
    beds: {
        occupied: number;
        total: number;
    };
    ambulances: number;
  }[]
}

type SummarizedRegionalData = {
  district: string;
  population: number;
  beds: {
    occupied: number;
    total: number;
  };
  ambulances: number;
};


export default function HealthOfficialDashboardPage() {
    const [alertData, setAlertData] = useState<Alert[]>([]);
    const [regionalData, setRegionalData] = useState<SummarizedRegionalData[]>([]);
    const [diseaseData, setDiseaseData] = useState<HospitalCaseData[]>([]);
    const [userName, setUserName] = useState('Official');
    
    const fetchData = () => {
        try {
            const userData = localStorage.getItem(LOGGED_IN_USER_KEY);
            if (userData) {
                setUserName(JSON.parse(userData).name);
            }
            const storedAlerts = localStorage.getItem(HEALTH_ALERTS_STORAGE_KEY);
            if (storedAlerts) {
                setAlertData(JSON.parse(storedAlerts));
            }
            const storedRegionalData = localStorage.getItem(REGIONAL_DATA_KEY);
            if(storedRegionalData) {
                 const parsedData: DistrictData[] = JSON.parse(storedRegionalData);
                 const summarizedData = parsedData.map(district => {
                    const districtTotals = district.hospitals.reduce((acc, hospital) => {
                      acc.population += Number(hospital.population) || 0;
                      acc.beds.occupied += Number(hospital.beds?.occupied) || 0;
                      acc.beds.total += Number(hospital.beds?.total) || 0;
                      acc.ambulances += Number(hospital.ambulances) || 0;
                      return acc;
                    }, { population: 0, beds: { occupied: 0, total: 0 }, ambulances: 0 });
          
                    return {
                      district: district.districtName,
                      ...districtTotals
                    }
                  });
                  setRegionalData(summarizedData);
            }
            const storedDiseaseData = localStorage.getItem(HOSPITAL_CASE_DATA_KEY);
            if(storedDiseaseData) {
                setDiseaseData(JSON.parse(storedDiseaseData));
            }
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
        }
    };

    useEffect(() => {
        fetchData();
        window.addEventListener('focus', fetchData);
        return () => {
            window.removeEventListener('focus', fetchData);
        };
    }, []);
    
    const formattedDiseaseData = regionalData.map(region => {
        const regionCases = diseaseData
            .filter(d => d.district === region.district)
            .reduce((total, hospital) => {
                return total + (hospital.entries?.reduce((sum, entry) => sum + Number(entry.caseCount), 0) || 0);
            }, 0);
        return {
            region: region.district,
            cases: regionCases
        };
    });


    const getPriorityVariant = (priority: string) => {
        switch(priority) {
            case 'High': return 'destructive' as const;
            case 'Medium': return 'default' as const;
            case 'Low': return 'secondary' as const;
            default: return 'outline' as const;
        }
    }

    const activeAlertsCount = alertData.filter(a => a.status === 'Active').length;
    const totalPopulation = regionalData.reduce((sum, r) => sum + (r.population || 0), 0);
    const districtsAtCapacity = regionalData.filter(r => r.beds.total > 0 && (r.beds.occupied / r.beds.total) >= 0.95).length;


  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">
          Public Health Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome, {userName}. Monitor regional health trends and resource
          allocation.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Population Coverage
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalPopulation / 1_000_000).toFixed(2)}M</div>
            <p className="flex items-center text-xs text-muted-foreground">
              Across all monitored districts
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
            <div className="text-2xl font-bold">{activeAlertsCount}</div>
            <p className="text-xs text-muted-foreground">
                Total active alerts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Districts At Capacity
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{districtsAtCapacity}/{regionalData.length}</div>
            <p className="text-xs text-muted-foreground">
              Districts with high occupancy
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Disease Incidence by Region</CardTitle>
                <CardDescription>Total reported communicable disease cases.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <BarChart accessibilityLayer data={formattedDiseaseData}>
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
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {regionalData.length > 0 ? regionalData.map(res => {
                            const occupancy = res.beds.total > 0 ? (res.beds.occupied / res.beds.total) * 100 : 0;
                            const status = occupancy >= 95 ? 'Critical' : 'Stable';
                            return (
                                <TableRow key={res.district}>
                                    <TableCell className="font-medium">{res.district}</TableCell>
                                    <TableCell>{res.beds.occupied}/{res.beds.total}</TableCell>
                                    <TableCell>
                                        <Badge variant={status === 'Critical' ? 'destructive' : 'secondary'}>{status}</Badge>
                                    </TableCell>
                                </TableRow>
                            );
                        }) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">No data available.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>Public Health Alerts</CardTitle>
                <CardDescription>
                    Active alerts and advisories issued. <Link href="/dashboard/health-official/alerts" className="text-primary underline">Manage all alerts</Link>.
                </CardDescription>
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
                       {alertData.length > 0 ? alertData.slice(0, 3).map(alert => (
                         <TableRow key={alert.id}>
                            <TableCell className="font-medium">{alert.title}</TableCell>
                            <TableCell>
                                <Badge variant={getPriorityVariant(alert.priority)}>{alert.priority}</Badge>
                            </TableCell>
                            <TableCell>{alert.date}</TableCell>
                            <TableCell>{alert.status}</TableCell>
                         </TableRow>
                       )) : (
                           <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                                No active alerts.
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

    
