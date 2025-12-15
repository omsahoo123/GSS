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
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BedDouble, Ambulance, Users } from 'lucide-react';
import type { RegionalData } from '../data-entry-operator/page';
import { REGIONAL_DATA_KEY } from '../data-entry-operator/regional-data/page';


const getOccupancyStatus = (occupancy: number) => {
  if (occupancy >= 95) return { text: 'Critical', variant: 'destructive' as const };
  if (occupancy >= 80) return { text: 'Strained', variant: 'default' as const };
  return { text: 'Stable', variant: 'secondary' as const };
};


export default function ResourcesPage() {
    const [resourceData, setResourceData] = useState<RegionalData[]>([]);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(REGIONAL_DATA_KEY);
            if (storedData) {
                setResourceData(JSON.parse(storedData));
            }
        } catch (error) {
            console.error("Failed to load regional data from localStorage", error);
        }
    }, []);
    
    const totalBeds = resourceData.reduce((sum, r) => sum + r.beds.total, 0);
    const totalAmbulances = resourceData.reduce((sum, r) => sum + r.ambulances, 0);
    const totalStaff = resourceData.reduce((sum, r) => sum + r.staff.doctors + r.staff.nurses, 0);


  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Resource Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage healthcare resources across all districts.
        </p>
      </div>

       <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Hospital Beds
            </CardTitle>
            <BedDouble className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBeds.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {resourceData.length} districts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Ambulances
            </CardTitle>
            <Ambulance className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAmbulances}</div>
             <p className="text-xs text-muted-foreground">
              Ready for dispatch
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Medical Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Doctors and nurses on duty
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>District Resource Overview</CardTitle>
          <CardDescription>
            A detailed breakdown of resources in each district.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>District</TableHead>
                <TableHead className="w-[300px]">Bed Occupancy</TableHead>
                <TableHead>Ambulances</TableHead>
                <TableHead>Doctors</TableHead>
                <TableHead>Nurses</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resourceData.map((res) => {
                const occupancy = res.beds.total > 0 ? (res.beds.occupied / res.beds.total) * 100 : 0;
                const status = getOccupancyStatus(occupancy);
                return (
                  <TableRow key={res.district}>
                    <TableCell className="font-medium">{res.district}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Progress value={occupancy} className="w-full" />
                        <span className="text-xs text-muted-foreground font-mono">
                          {res.beds.occupied}/{res.beds.total}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{res.ambulances}</TableCell>
                    <TableCell>{res.staff.doctors}</TableCell>
                    <TableCell>{res.staff.nurses}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={status.variant}>{status.text}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
