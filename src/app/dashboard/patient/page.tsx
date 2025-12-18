'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { HeartPulse, Pill, Video } from 'lucide-react';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { LOGGED_IN_USER_KEY } from '@/app/login/page';
import { type Appointment } from '../doctor/appointments/page';
import { format, parseISO } from 'date-fns';

export default function PatientDashboardPage() {
  const [userName, setUserName] = useState('Patient');
  const [upcomingAppointment, setUpcomingAppointment] = useState<Appointment | null>(null);
  const [canJoin, setCanJoin] = useState(false);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem(LOGGED_IN_USER_KEY) || '{}');
      const patientName = userData.name || 'Patient';
      setUserName(patientName);

      const allAppointments: Appointment[] = JSON.parse(localStorage.getItem('allAppointmentsData') || '[]').map((appt: any) => ({
        ...appt,
        date: parseISO(appt.date)
      }));

      const now = new Date();
      const nextAppointment = allAppointments
        .filter(appt => appt.patient === patientName && appt.status === 'Upcoming' && new Date(appt.date).setHours(0,0,0,0) >= now.setHours(0,0,0,0))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
      
      setUpcomingAppointment(nextAppointment || null);
    } catch(e) {
      console.error("Error loading data", e);
    }
  }, []);

  useEffect(() => {
    if (!upcomingAppointment) return;

    const appointmentTime = new Date(`${format(upcomingAppointment.date, 'yyyy-MM-dd')}T${upcomingAppointment.time.replace(/(AM|PM)/, ' $1')}`);

    const updateCountdown = () => {
      const now = new Date();
      const diff = appointmentTime.getTime() - now.getTime();

      const joinWindowStart = appointmentTime.getTime() - 15 * 60 * 1000;
      const joinWindowEnd = appointmentTime.getTime() + 60 * 60 * 1000;

      if (now.getTime() >= joinWindowStart && now.getTime() <= joinWindowEnd) {
        setCanJoin(true);
        setCountdown('You can join the call now.');
        return;
      } else {
        setCanJoin(false);
      }
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setCountdown(`Join in: ${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m ${seconds}s`);
      } else {
        setCountdown('Appointment time has passed.');
      }
    };
    
    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(interval);

  }, [upcomingAppointment]);


  const doctorImage = PlaceHolderImages.find((img) => img.id === 'doctor-1');
  const healthyHabitsImages = PlaceHolderImages.filter((img) =>
    img.id.startsWith('healthy-habit-')
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Welcome back, {userName}!</h1>
        <p className="text-muted-foreground">
          Here's a summary of your health dashboard.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Healthy Habits Slideshow</CardTitle>
          <CardDescription>
            Swipe through for tips on how to stay healthy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {healthyHabitsImages.map((image) => (
                <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="relative aspect-video w-full">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="rounded-lg object-cover"
                      data-ai-hint={image.imageHint}
                    />
                     <div className="absolute inset-0 flex items-end rounded-lg bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="font-semibold text-white">{image.description}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-12" />
            <CarouselNext className="mr-12" />
          </Carousel>
        </CardContent>
      </Card>

      <Card className="transition-transform hover:scale-105 hover:shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle>Upcoming Appointment</CardTitle>
            <CardDescription>{upcomingAppointment ? `with ${upcomingAppointment.doctor}` : "No upcoming appointments."}</CardDescription>
          </div>
          {upcomingAppointment && doctorImage && (
            <Image
              src={doctorImage.imageUrl}
              alt={upcomingAppointment.doctor}
              width={64}
              height={64}
              className="rounded-full border-2 border-primary"
              data-ai-hint={doctorImage.imageHint}
            />
          )}
        </CardHeader>
        <CardContent>
          {upcomingAppointment ? (
              <div className="space-y-4 rounded-md border p-4">
                <div className="flex flex-1 items-center justify-between">
                  <div>
                      <p className="text-sm font-medium leading-none">
                      {upcomingAppointment.type} Consultation
                      </p>
                      <p className="text-sm text-muted-foreground">
                      {format(upcomingAppointment.date, 'PPP')} at {upcomingAppointment.time}
                      </p>
                  </div>
                   {upcomingAppointment.type === 'Video' && (
                      <Link href={`/dashboard/patient/consultation?doctor=${encodeURIComponent(upcomingAppointment.doctor)}&time=${encodeURIComponent(upcomingAppointment.time)}`} passHref>
                          <Button disabled={!canJoin}>
                          <Video className="mr-2 h-4 w-4" /> Join Call
                          </Button>
                      </Link>
                   )}
                </div>
                {upcomingAppointment.type === 'Video' && (
                  <div className="text-center text-sm font-medium text-primary">
                    {countdown}
                  </div>
                )}
              </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">
                <p>You have no appointments scheduled.</p>
                 <Link href="/dashboard/patient/appointments">
                    <Button variant="link">Book an Appointment</Button>
                 </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="transition-transform hover:scale-105 hover:shadow-xl">
          <CardHeader>
            <CardTitle>My Health Records</CardTitle>
            <CardDescription>
              Access your complete medical history.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/dashboard/patient/records" passHref>
              <Button variant="outline" className="w-full">
                <HeartPulse className="mr-2 h-4 w-4" /> View Records
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="transition-transform hover:scale-105 hover:shadow-xl">
          <CardHeader>
            <CardTitle>Medicine Availability</CardTitle>
            <CardDescription>
              Check stock at your local pharmacy.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/dashboard/patient/pharmacy-stock" passHref>
              <Button variant="outline" className="w-full">
                <Pill className="mr-2 h-4 w-4" /> Check Stock
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
