'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Video, Building } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { LOGGED_IN_USER_KEY } from '@/app/login/page';
import { type Appointment } from '../../doctor/appointments/page';
import { PROFESSIONAL_ACCOUNT_KEY } from '@/app/signup/professional/page';

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  department: string;
  imageId: string;
}

const departments = ['Cardiology', 'General Medicine', 'Dermatology'];

const availableTimeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM",
];

const appointmentSchema = z.object({
  department: z.string().min(1, 'Please select a department.'),
  doctorId: z.string().min(1, 'Please select a doctor.'),
  appointmentDate: z.string().min(1, 'Please select a date.'),
  appointmentTime: z.string().min(1, 'Please select a time slot.'),
  consultationType: z.enum(['Video', 'In-Person'], { required_error: 'Please select a consultation type.' }),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export default function AppointmentsPage() {
  const [isBooking, setIsBooking] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [patientName, setPatientName] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    try {
      const patientAccount = JSON.parse(localStorage.getItem(LOGGED_IN_USER_KEY) || '{}');
      if (patientAccount.name) {
        setPatientName(patientAccount.name);
      }

      // Dynamically load doctors from localStorage
      const allKeys = Object.keys(localStorage);
      const doctorKeys = allKeys.filter(key => key.startsWith(PROFESSIONAL_ACCOUNT_KEY));
      const availableDoctors = doctorKeys.map(key => {
        const docData = JSON.parse(localStorage.getItem(key)!);
        if (docData.role === 'doctor') {
          return {
            id: docData.userId,
            name: docData.name,
            specialty: docData.specialization || 'Doctor',
            department: docData.specialization || 'General Medicine', // Assuming specialization can map to department
            imageId: 'avatar-doctor' // Default image
          };
        }
        return null;
      }).filter(Boolean) as Doctor[];

      setDoctors(availableDoctors);
      
    } catch (e) {
      console.error("Could not load initial data", e);
    }
  }, []);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      consultationType: 'Video',
      department: '',
      doctorId: '',
      appointmentDate: format(new Date(), 'yyyy-MM-dd'),
      appointmentTime: '',
    },
  });

  const onSubmit = (data: AppointmentFormValues) => {
    setIsBooking(true);
    
    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      doctor: doctors.find(d => d.name === data.doctorId)?.name || 'Unknown Doctor',
      patient: patientName,
      date: new Date(data.appointmentDate),
      time: data.appointmentTime,
      type: data.consultationType,
      status: 'Upcoming',
      notes: '',
    };

    setTimeout(() => {
      try {
        const allAppointments: Appointment[] = JSON.parse(localStorage.getItem('allAppointmentsData') || '[]').map((appt: any) => ({
            ...appt,
            date: parseISO(appt.date)
        }));
        allAppointments.push(newAppointment);
        localStorage.setItem('allAppointmentsData', JSON.stringify(allAppointments));

        toast({
          title: 'Appointment Booked!',
          description: `Your ${data.consultationType} consultation with ${newAppointment.doctor} is confirmed for ${format(newAppointment.date, 'PPP')} at ${data.appointmentTime}.`,
        });
        form.reset();
        form.setValue('consultationType', 'Video');
        form.setValue('appointmentDate', format(new Date(), 'yyyy-MM-dd'));
        setSelectedDepartment('');
      } catch (e) {
        console.error("Failed to save appointment", e);
        toast({ variant: 'destructive', title: "Booking Failed", description: "Could not save your appointment."})
      } finally {
        setIsBooking(false);
      }
    }, 1500);
  };
  
  const selectedDoctorId = form.watch('doctorId');
  const selectedDoctor = doctors.find(d => d.name === selectedDoctorId);
  const doctorImage = PlaceHolderImages.find(p => p.id === selectedDoctor?.imageId);

  const filteredDoctors = selectedDepartment ? doctors.filter(d => d.department.toLowerCase().includes(selectedDepartment.toLowerCase())) : [];
  const uniqueDepartments = [...new Set(doctors.map(d => d.department))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Book an Appointment</h1>
        <p className="text-muted-foreground">
          Choose your preferred doctor, date, and time for your consultation.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>New Appointment Details</CardTitle>
          <CardDescription>Fill out the form below to schedule your next visit.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-8">
                   <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Department/Specialization</FormLabel>
                        <Select onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedDepartment(value);
                          form.setValue('doctorId', '');
                        }} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a specialization..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {uniqueDepartments.map(dept => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="doctorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Doctor</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedDepartment}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={selectedDepartment ? "Choose a doctor..." : "Select a specialization first"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredDoctors.map(doctor => (
                              <SelectItem key={doctor.id} value={doctor.name}>
                                {doctor.name} - {doctor.specialty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedDoctor && doctorImage && (
                     <div className="flex items-center gap-4 rounded-lg border p-4">
                       <Image src={doctorImage.imageUrl} alt={selectedDoctor.name} width={80} height={80} className="rounded-full" data-ai-hint={doctorImage.imageHint} />
                       <div>
                         <h3 className="font-bold">{selectedDoctor.name}</h3>
                         <p className="text-sm text-muted-foreground">{selectedDoctor.specialty}</p>
                       </div>
                     </div>
                   )}
                </div>

                <div className="space-y-8">
                   <FormField
                    control={form.control}
                    name="consultationType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Consultation Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Video" />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center gap-2">
                                <Video className="h-4 w-4" /> Video Consultation
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="In-Person" />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center gap-2">
                                <Building className="h-4 w-4" /> In-Person Visit
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="appointmentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Appointment Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} min={format(new Date(), 'yyyy-MM-dd')} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="appointmentTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available Time Slots</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                             {availableTimeSlots.map(time => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" disabled={isBooking || !patientName} size="lg">
                {isBooking ? 'Booking...' : 'Confirm Appointment'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
