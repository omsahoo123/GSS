'use client';

import { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Video, Building, Calendar as CalendarIcon, FileText } from 'lucide-react';
import Link from 'next/link';

// Mock data for all appointments in the system
const allAppointmentsData = [
  {
    id: 'appt-1',
    doctor: 'Dr. Priya Singh',
    patient: 'Aarav Sharma',
    date: new Date(),
    time: '10:30 AM',
    type: 'Video',
    status: 'Upcoming',
    notes: 'Patient reported mild headaches. Wants to discuss potential causes.',
  },
  {
    id: 'appt-2',
    doctor: 'Dr. Anjali Sharma',
    patient: 'Riya Patel',
    date: new Date(),
    time: '10:45 AM',
    type: 'Video',
    status: 'Upcoming',
    notes: '',
  },
  {
    id: 'appt-3',
    doctor: 'Dr. Priya Singh',
    patient: 'Sunita Devi',
    date: new Date(),
    time: '11:00 AM',
    type: 'In-Person',
    status: 'Upcoming',
    notes: '',
  },
  {
    id: 'appt-4',
    doctor: 'Dr. Priya Singh',
    patient: 'Rohan Verma',
    date: (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d; })(),
    time: '11:30 AM',
    type: 'Video',
    status: 'Upcoming',
    notes: '',
  },
   {
    id: 'appt-5',
    doctor: 'Dr. Arun Verma',
    patient: 'Amit Kumar',
    date: new Date(),
    time: '12:00 PM',
    type: 'In-Person',
    status: 'Completed',
    notes: 'Routine check-up. All vitals are normal.',
  },
  {
    id: 'appt-6',
    doctor: 'Dr. Priya Singh',
    patient: 'Neha Gupta',
    date: new Date(),
    time: '12:30 PM',
    type: 'In-Person',
    status: 'Cancelled',
    notes: 'Patient rescheduled for next week.',
  },
];

const loggedInDoctorName = 'Dr. Priya Singh';

type Appointment = typeof allAppointmentsData[0];

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState(allAppointmentsData);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [noteText, setNoteText] = useState('');
  
  const handleStatusChange = (appointmentId: string, status: string) => {
    setAppointments(
      appointments.map((appt) =>
        appt.id === appointmentId ? { ...appt, status } : appt
      )
    );
  };
  
  const openNotesDialog = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setNoteText(appointment.notes);
    setIsNotesDialogOpen(true);
  };
  
  const handleSaveNote = () => {
    if (currentAppointment) {
      setAppointments(
        appointments.map((appt) =>
          appt.id === currentAppointment.id ? { ...appt, notes: noteText } : appt
        )
      );
    }
    setIsNotesDialogOpen(false);
    setCurrentAppointment(null);
    setNoteText('');
  };

  const doctorAppointments = appointments.filter(
    (appt) => appt.doctor === loggedInDoctorName && selectedDate && format(appt.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const onlineAppointments = doctorAppointments.filter((appt) => appt.type === 'Video');
  const inPersonAppointments = doctorAppointments.filter((appt) => appt.type === 'In-Person');

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Upcoming': return 'default';
      case 'Completed': return 'secondary';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold">Today's Appointments</h1>
            <p className="text-muted-foreground">
            Here is your schedule for {selectedDate ? format(selectedDate, "PPP") : 'today'}, {loggedInDoctorName}.
            </p>
        </div>
        <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className="w-full justify-start text-left font-normal md:w-auto"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Online Consultations</CardTitle>
          <CardDescription>
            Video calls scheduled for the selected date.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                      <Select value={consult.status} onValueChange={(value) => handleStatusChange(consult.id, value)}>
                          <SelectTrigger className="w-32">
                              <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Upcoming">Upcoming</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="ghost" size="sm" onClick={() => openNotesDialog(consult)}>
                         <FileText className="mr-2 h-4 w-4" /> Notes
                       </Button>
                       <Link href="/dashboard/doctor/consultations" passHref>
                        <Button variant="outline" size="sm" disabled={consult.status !== 'Upcoming'}>
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
                    No online consultations scheduled for this date.
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
            Physical appointments at the clinic for the selected date.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                      <Select value={consult.status} onValueChange={(value) => handleStatusChange(consult.id, value)}>
                          <SelectTrigger className="w-32">
                              <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Upcoming">Upcoming</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                      </Select>
                    </TableCell>
                     <TableCell className="text-right">
                       <Button variant="ghost" size="sm" onClick={() => openNotesDialog(consult)}>
                         <FileText className="mr-2 h-4 w-4" /> Notes
                       </Button>
                     </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No in-person appointments scheduled for this date.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
       {/* Notes Dialog */}
      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notes for {currentAppointment?.patient}</DialogTitle>
            <DialogDescription>
              Add or edit notes for this appointment.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={6}
            placeholder="Type your notes here..."
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotesDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNote}>Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
