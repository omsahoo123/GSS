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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, Users, Video } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const upcomingAppointments = [
  {
    id: 'appt-1',
    patient: 'Aarav Sharma',
    time: '10:30 AM',
    type: 'Video',
    avatarId: 'avatar-patient',
  },
  {
    id: 'appt-2',
    patient: 'Sunita Devi',
    time: '11:00 AM',
    type: 'In-Person',
    avatarId: 'doctor-1', // Using a placeholder for another patient
  },
  {
    id: 'appt-3',
    patient: 'Rohan Verma',
    time: '11:30 AM',
    type: 'Video',
    avatarId: 'doctor-2', // Using a placeholder for another patient
  },
];

const recentActivity = [
  {
    id: 'act-1',
    description: 'Aarav Sharma sent a new message regarding his prescription.',
    time: '2 hours ago',
  },
  {
    id: 'act-2',
    description: 'New lab results uploaded for Sunita Devi.',
    time: '5 hours ago',
  },
  {
    id: 'act-3',
    description: 'Rohan Verma scheduled a follow-up appointment.',
    time: '1 day ago',
  },
];

export default function DoctorDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Doctor Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, Dr. Priya Singh. Here is your daily overview.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Appointments
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingAppointments.filter(a => a.type === 'Video').length} video consultations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">
              +5 new this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>
            Here are your scheduled appointments for today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingAppointments.map((appt) => {
                const patientAvatar = PlaceHolderImages.find(img => img.id === appt.avatarId);
                return (
                  <TableRow key={appt.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          {patientAvatar && (
                            <AvatarImage src={patientAvatar.imageUrl} alt={appt.patient} data-ai-hint={patientAvatar.imageHint} />
                          )}
                          <AvatarFallback>{appt.patient.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{appt.patient}</div>
                      </div>
                    </TableCell>
                    <TableCell>{appt.time}</TableCell>
                    <TableCell>
                      <Badge variant={appt.type === 'Video' ? 'default' : 'secondary'}>
                        {appt.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Link href="/dashboard/doctor/consultations" passHref>
                          <Button variant="outline" size="sm" disabled={appt.type !== 'Video'}>
                            <Video className="mr-2 h-4 w-4" />
                            Join Call
                          </Button>
                       </Link>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest updates from your patients.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
