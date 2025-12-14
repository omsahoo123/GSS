'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FileText, UserSearch } from 'lucide-react';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';
import { allPatients } from '@/lib/patients-data';


const remotePatients = allPatients.filter((p) => p.type === 'Remote');
const inClinicPatients = allPatients.filter((p) => p.type === 'In-Clinic');

function PatientsPageComponent() {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('search') || '';
    const [searchTerm, setSearchTerm] = useState(initialSearch);

    useEffect(() => {
      setSearchTerm(initialSearch);
    }, [initialSearch]);

    const filterPatients = (patients: typeof allPatients) => {
        if (!searchTerm) return patients;
        return patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Manage Patients</h1>
          <p className="text-muted-foreground">
            View patient records and manage their medical history.
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <UserSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for a patient by name..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Remote Patients</CardTitle>
          <CardDescription>
            Patients who primarily consult via video calls.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filterPatients(remotePatients).map((patient) => {
                const patientAvatar = PlaceHolderImages.find(img => img.id === patient.avatarId);
                return (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            {patientAvatar && <AvatarImage src={patientAvatar.imageUrl} alt={patient.name} data-ai-hint={patientAvatar.imageHint}/>}
                            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{patient.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.lastVisit}</TableCell>
                    <TableCell className="text-right">
                       <Link href={`/dashboard/doctor/patients/${patient.id}`} passHref>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" /> View History
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>In-Clinic Patients</CardTitle>
          <CardDescription>
            Patients who primarily visit the clinic in person.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filterPatients(inClinicPatients).map((patient) => {
                const patientAvatar = PlaceHolderImages.find(img => img.id === patient.avatarId);
                return (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            {patientAvatar && <AvatarImage src={patientAvatar.imageUrl} alt={patient.name} data-ai-hint={patientAvatar.imageHint}/>}
                            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{patient.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.lastVisit}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/doctor/patients/${patient.id}`} passHref>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" /> View History
                        </Button>
                      </Link>
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

export default function PatientsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PatientsPageComponent />
    </Suspense>
  )
}

    