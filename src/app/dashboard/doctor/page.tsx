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
import { CalendarCheck, Users, Video, Search, CheckSquare } from 'lucide-react';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';
import { PatientDemographicsChart } from '@/components/patient-demographics-chart';
import { Checkbox } from '@/components/ui/checkbox';

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

const pendingTasks = [
  {
    id: 'task-1',
    description: 'Review new lab results for Sunita Devi',
    completed: false,
  },
  {
    id: 'task-2',
    description: 'Follow up with Rohan Verma about his medication',
    completed: true,
  },
  {
    id: 'task-3',
    description: 'Sign prescription renewal for Aarav Sharma',
    completed: false,
  },
];

export default function DoctorDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Doctor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome, Dr. Priya Singh. Here is your daily overview.
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for a patient..."
            className="pl-9"
          />
        </div>
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
            <div className="text-2xl font-bold">
              {upcomingAppointments.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {
                upcomingAppointments.filter((a) => a.type === 'Video').length
              }{' '}
              video consultations
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
            <p className="text-xs text-muted-foreground">+5 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingTasks.filter((t) => !t.completed).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingTasks.length} total tasks
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Patient Demographics</CardTitle>
            <CardDescription>
              A breakdown of your patient population by age group.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PatientDemographicsChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
            <CardDescription>
              Actionable items that need your attention.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex items-start space-x-3">
                <Checkbox
                  id={`task-${task.id}`}
                  className="mt-1"
                  defaultChecked={task.completed}
                />
                <label
                  htmlFor={`task-${task.id}`}
                  className={`flex-1 text-sm leading-snug ${
                    task.completed ? 'text-muted-foreground line-through' : ''
                  }`}
                >
                  {task.description}
                </label>
              </div>
            ))}
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
                const patientAvatar = PlaceHolderImages.find(
                  (img) => img.id === appt.avatarId
                );
                return (
                  <TableRow key={appt.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          {patientAvatar && (
                            <AvatarImage
                              src={patientAvatar.imageUrl}
                              alt={appt.patient}
                              data-ai-hint={patientAvatar.imageHint}
                            />
                          )}
                          <AvatarFallback>
                            {appt.patient.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{appt.patient}</div>
                      </div>
                    </TableCell>
                    <TableCell>{appt.time}</TableCell>
                    <TableCell>
                      <Badge
                        variant={appt.type === 'Video' ? 'default' : 'secondary'}
                      >
                        {appt.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href="/dashboard/doctor/consultations" passHref>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={appt.type !== 'Video'}
                        >
                          <Video className="mr-2 h-4 w-4" />
                          Join Call
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
