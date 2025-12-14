'use client';

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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Video, Building } from 'lucide-react';
import Link from 'next/link';

// Mock data for all appointments in the system
const allAppointments = [
  {
    id: 'appt-1',
    doctor: 'Dr. Priya Singh',
    patient: 'Aarav Sharma',
    time: '10:30 AM',
    type: 'Video',
  },
  {
    id: 'appt-2',
    doctor: 'Dr. Anjali Sharma', // Different doctor
    patient: 'Riya Patel',
    time: '10:45 AM',
    type: 'Video',
  },
  {
    id: 'appt-3',
    doctor: 'Dr. Priya Singh',
    patient: 'Sunita Devi',
    time: '11:00 AM',
    type: 'In-Person',
  },
  {
    id: 'appt-4',
    doctor: 'Dr. Priya Singh',
    patient: 'Rohan Verma',
    time: '11:30 AM',
    type: 'Video',
  },
   {
    id: 'appt-5',
    doctor: 'Dr. Arun Verma', // Different doctor
    patient: 'Amit Kumar',
    time: '12:00 PM',
    type: 'In-Person',
  },
  {
    id: 'appt-6',
    doctor: 'Dr. Priya Singh',
    patient: 'Neha Gupta',
    time: '12:30 PM',
    type: 'In-Person',
  },
];

// Assuming the logged-in doctor is Dr. Priya Singh
const loggedInDoctorName = 'Dr. Priya Singh';

const doctorAppointments = allAppointments.filter(
  (appt) => appt.doctor === loggedInDoctorName
);

const onlineAppointments = doctorAppointments.filter(
  (appt) => appt.type === 'Video'
);
const inPersonAppointments = doctorAppointments.filter(
  (appt) => appt.type === 'In-Person'
);

export default function DoctorAppointmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Today's Appointments</h1>
        <p className="text-muted-foreground">
          Here is your schedule for today, {loggedInDoctorName}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Online Consultations</CardTitle>
          <CardDescription>
            Video calls scheduled for today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {onlineAppointments.length > 0 ? (
                onlineAppointments.map((consult) => (
                  <TableRow key={consult.id}>
                    <TableCell className="font-medium">
                      {consult.patient}
                    </TableCell>
                    <TableCell>{consult.time}</TableCell>
                    <TableCell>
                      <Badge variant="default">Upcoming</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Link href="/dashboard/doctor/consultations" passHref>
                        <Button variant="outline" size="sm">
                          <Video className="mr-2 h-4 w-4" />
                          Start Call
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                 <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No online consultations scheduled for today.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>In-Person Appointments</CardTitle>
           <CardDescription>
            Physical appointments at the clinic today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inPersonAppointments.length > 0 ? (
                inPersonAppointments.map((consult) => (
                  <TableRow key={consult.id}>
                    <TableCell className="font-medium">
                      {consult.patient}
                    </TableCell>
                    <TableCell>{consult.time}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Upcoming</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No in-person appointments scheduled for today.
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
