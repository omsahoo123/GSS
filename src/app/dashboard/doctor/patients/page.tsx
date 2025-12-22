
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
import { format, parseISO } from 'date-fns';
import { type Appointment } from '../appointments/page';
import { LOGGED_IN_USER_KEY } from '@/app/login/page';

type PatientSummary = {
    id: string;
    name: string;
    age: number;
    lastVisit: string;
    type: 'Video' | 'In-Person';
    avatarId: string;
}

function PatientsPageComponent() {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('search') || '';
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [allPatients, setAllPatients] = useState<PatientSummary[]>([]);
    const [loggedInDoctorName, setLoggedInDoctorName] = useState('');

    useEffect(() => {
        const fetchData = () => {
            try {
                const doctorData = JSON.parse(localStorage.getItem(LOGGED_IN_USER_KEY) || '{}');
                const doctorName = doctorData.name || '';
                setLoggedInDoctorName(doctorName);
                
                const allAppointments: Appointment[] = JSON.parse(localStorage.getItem('allAppointmentsData') || '[]').map((appt: any) => ({...appt, date: parseISO(appt.date)}));
                const doctorAppointments = allAppointments.filter(appt => appt.doctor === doctorName);

                const uniquePatients = new Map<string, PatientSummary>();

                doctorAppointments.forEach(appt => {
                    const lastVisit = format(appt.date, 'yyyy-MM-dd');
                    const age = (appt.patient.length * 3) % 40 + 20; // Generate a mock age based on name
                    
                    const existingPatient = uniquePatients.get(appt.patient);
                    if (!existingPatient || lastVisit > existingPatient.lastVisit) {
                        uniquePatients.set(appt.patient, {
                            id: `pat-${appt.patient.replace(/\s+/g, '-').toLowerCase()}`,
                            name: appt.patient,
                            age: age,
                            lastVisit: lastVisit,
                            type: appt.type,
                            avatarId: 'avatar-patient', // Default avatar
                        });
                    }
                });
                setAllPatients(Array.from(uniquePatients.values()));
            } catch (e) {
                console.error("Failed to load patient data", e);
            }
        };

        fetchData();
        window.addEventListener('focus', fetchData);
        return () => {
            window.removeEventListener('focus', fetchData);
        };
    }, []);

    useEffect(() => {
      setSearchTerm(initialSearch);
    }, [initialSearch]);

    const filterPatients = (patients: PatientSummary[]) => {
        if (!searchTerm) return patients;
        return patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    };
    
    const remotePatients = allPatients.filter((p) => p.type === 'Video');
    const inClinicPatients = allPatients.filter((p) => p.type === 'In-Person');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Manage Patients</h1>
          <p className="text-muted-foreground">
            View patient records for {loggedInDoctorName}.
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
                            <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{patient.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{format(parseISO(patient.lastVisit), 'PPP')}</TableCell>
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
              {filterPatients(remotePatients).length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">No remote patients found.</TableCell>
                </TableRow>
              )}
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
                            <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{patient.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{format(parseISO(patient.lastVisit), 'PPP')}</TableCell>
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
               {filterPatients(inClinicPatients).length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">No in-clinic patients found.</TableCell>
                </TableRow>
              )}
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
