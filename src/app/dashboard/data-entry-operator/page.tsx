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
import { Users, Building, Truck, Server } from 'lucide-react';
import Link from 'next/link';
import { REGIONAL_DATA_KEY, type RegionalData } from './regional-data/page';
import { LOGGED_IN_USER_KEY } from '@/app/login/page';

export default function DataEntryOperatorDashboardPage() {
  const [regionalData, setRegionalData] = useState<RegionalData[]>([]);
  const [userName, setUserName] = useState('Operator');

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(REGIONAL_DATA_KEY);
      if (storedData) {
        setRegionalData(JSON.parse(storedData));
      }
      const userData = localStorage.getItem(LOGGED_IN_USER_KEY);
      if (userData) {
        setUserName(JSON.parse(userData).name);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  const totalPopulation = regionalData.reduce((sum, r) => sum + (r.population || 0), 0);
  const totalHospitals = regionalData.length;
  const totalAmbulances = regionalData.reduce((sum, r) => sum + (r.ambulances || 0), 0);
  const districtsWithMissingData = regionalData.filter(r => !r.population || !r.beds.total).length;

  const getOccupancyStatus = (occupancy: number) => {
    if (occupancy >= 95) return { text: 'Critical', variant: 'destructive' as const };
    if (occupancy >= 80) return { text: 'Strained', variant: 'default' as const };
    return { text: 'Stable', variant: 'secondary' as const };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">
          Data Entry Operator Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome, {userName}. Manage and update regional health metrics.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Population Covered
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalPopulation / 1_000_000).toFixed(2)}M</div>
            <p className="text-xs text-muted-foreground">
              Across all monitored districts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monitored Districts
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHospitals}</div>
            <p className="text-xs text-muted-foreground">
              Total districts with data entries
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Ambulances
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAmbulances}</div>
            <p className="text-xs text-muted-foreground">
              Available for dispatch
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Data Quality
            </CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{districtsWithMissingData > 0 ? <span className="text-destructive">{districtsWithMissingData}</span> : 'Good'}</div>
            <p className="text-xs text-muted-foreground">
                {districtsWithMissingData > 0 ? 'Districts with missing data' : 'All districts have data'}
            </p>
          </CardContent>
        </Card>
      </div>
      
       <Card>
            <CardHeader>
                <CardTitle>Regional Data Overview</CardTitle>
                <CardDescription>
                    A summary of the latest data for each district. <Link href="/dashboard/data-entry-operator/regional-data" className="text-primary underline">Update this data</Link>.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>District</TableHead>
                            <TableHead>Population</TableHead>
                            <TableHead>Bed Occupancy</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {regionalData.length > 0 ? regionalData.map(res => {
                             const occupancy = res.beds.total > 0 ? (res.beds.occupied / res.beds.total) * 100 : 0;
                             const status = getOccupancyStatus(occupancy);
                             return (
                                <TableRow key={res.district}>
                                    <TableCell className="font-medium">{res.district}</TableCell>
                                    <TableCell>{res.population > 0 ? res.population.toLocaleString() : <span className="text-muted-foreground">No data</span>}</TableCell>
                                    <TableCell>{res.beds.total > 0 ? `${res.beds.occupied}/${res.beds.total}`: <span className="text-muted-foreground">No data</span>}</TableCell>
                                    <TableCell>
                                        <Badge variant={status.variant}>{status.text}</Badge>
                                    </TableCell>
                                </TableRow>
                             )
                        }) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                    <p className="font-semibold">No data entered yet.</p>
                                    <p className="text-muted-foreground text-sm">Please go to the <Link href="/dashboard/data-entry-operator/regional-data" className="text-primary underline">Regional Data</Link> page to begin.</p>
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
