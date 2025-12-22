
'use client';

import { useState, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { format, parseISO } from 'date-fns';
import { Video, FileText } from 'lucide-react';
import Link from 'next/link';
import { LOGGED_IN_USER_KEY } from '@/app/login/page';

const APPOINTMENTS_KEY = 'allAppointmentsData';

export type Appointment = {
    id: string;
    doctor: string;
    patient: string;
    date: Date;
    time: string;
    type: 'Video' | 'In-Person';
    status: 'Upcoming' | 'Completed' | 'Cancelled';
    notes: string;
};

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [noteText, setNoteText] = useState('');
  const [loggedInDoctorName, setLoggedInDoctorName] = useState('');

  const fetchAppointments = () => {
    try {
        const doctorData = JSON.parse(localStorage.getItem(LOGGED_IN_USER_KEY) || '{}');
        const doctorName = doctorData.name || '';
        setLoggedInDoctorName(doctorName);
      
        const storedData = localStorage.getItem(APPOINTMENTS_KEY);
        if (storedData) {
            const parsedData: Appointment[] = JSON.parse(storedData).map((appt: any) => ({
                ...appt,
                date: parseISO(appt.date)
            }));
            const doctorAppointments = parsedData.filter(appt => appt.doctor === doctorName);
            setAppointments(doctorAppointments);
        }
    } catch (e) {
      console.error("Error loading appointments", e);
    }
  };
  
  useEffect(() => {
    fetchAppointments();
    window.addEventListener('focus', fetchAppointments);
    return () => {
      window.removeEventListener('focus', fetchAppointments);
    };
  }, []);

  const saveAllAppointments = (updatedAppointments: Appointment[]) => {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updatedAppointments));
    fetchAppointments(); // Refetch to get the filtered list for the current doctor
  };
  
  const handleStatusChange = (appointmentId: string, status: string) => {
    const allAppointments: Appointment[] = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]').map((appt: any) => ({ ...appt, date: parseISO(appt.date) }));
    const updatedAllAppointments = allAppointments.map((appt) =>
        appt.id === appointmentId ? { ...appt, status: status as Appointment['status'] } : appt
    );
    saveAllAppointments(updatedAllAppointments);
  };
  
  const openNotesDialog = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setNoteText(appointment.notes);
    setIsNotesDialogOpen(true);
  };
  
  const handleSaveNote = () => {
    if (currentAppointment) {
       const allAppointments: Appointment[] = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]').map((appt: any) => ({ ...appt, date: parseISO(appt.date) }));
      const updatedAllAppointments = allAppointments.map((appt) =>
          appt.id === currentAppointment.id ? { ...appt, notes: noteText } : appt
        );
      saveAllAppointments(updatedAllAppointments);
    }
    setIsNotesDialogOpen(false);
    setCurrentAppointment(null);
    setNoteText('');
  };

  const filteredAppointments = appointments.filter(
    (appt) => selectedDate && format(appt.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const onlineAppointments = filteredAppointments.filter((appt) => appt.type === 'Video');
  const inPersonAppointments = filteredAppointments.filter((appt) => appt.type === 'In-Person');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold">Today's Appointments</h1>
            <p className="text-muted-foreground">
            Here is your schedule for {selectedDate ? format(selectedDate, "PPP") : 'today'}, {loggedInDoctorName}.
            </p>
        </div>
        <div className="relative">
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(parseISO(e.target.value))}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 md:w-auto"
          />
        </div>
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
                  <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
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
                  <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
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
