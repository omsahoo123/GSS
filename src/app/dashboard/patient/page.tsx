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

const appointmentTime = new Date();
appointmentTime.setDate(appointmentTime.getDate() + 1);
appointmentTime.setHours(10, 30, 0, 0); // Tomorrow at 10:30 AM

export default function PatientDashboardPage() {
  const [canJoin, setCanJoin] = useState(false);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = appointmentTime.getTime() - now.getTime();

      const joinWindowStart = appointmentTime.getTime() - 15 * 60 * 1000; // 15 mins before
      const joinWindowEnd = appointmentTime.getTime() + 60 * 60 * 1000; // 1 hour after

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
        setCountdown(`Join in: ${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setCountdown('Appointment time has passed.');
      }
    };
    
    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(interval);

  }, []);


  const doctorImage = PlaceHolderImages.find((img) => img.id === 'doctor-1');
  const healthyHabitsImages = PlaceHolderImages.filter((img) =>
    img.id.startsWith('healthy-habit-')
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Welcome back, Aarav!</h1>
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
            <CardDescription>with Dr. Anjali Sharma</CardDescription>
          </div>
          {doctorImage && (
            <Image
              src={doctorImage.imageUrl}
              alt="Dr. Anjali Sharma"
              width={64}
              height={64}
              className="rounded-full border-2 border-primary"
              data-ai-hint={doctorImage.imageHint}
            />
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4 rounded-md border p-4">
            <div className="flex flex-1 items-center justify-between">
              <div>
                  <p className="text-sm font-medium leading-none">
                  Video Consultation
                  </p>
                  <p className="text-sm text-muted-foreground">
                  Tomorrow, 10:30 AM
                  </p>
              </div>
              <Link href="/dashboard/patient/consultation?doctor=Dr.+Anjali+Sharma&time=Tomorrow,+10:30+AM" passHref>
                  <Button disabled={!canJoin}>
                  <Video className="mr-2 h-4 w-4" /> Join Call
                  </Button>
              </Link>
            </div>
             <div className="text-center text-sm font-medium text-primary">
              {countdown}
            </div>
          </div>
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
