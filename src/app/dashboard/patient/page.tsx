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
  ArrowRight,
  HeartPulse,
  Pill,
  Stethoscope,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export default function PatientDashboardPage() {
  const doctorImage = PlaceHolderImages.find((img) => img.id === 'doctor-1');

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Welcome back, Aarav!</h1>
        <p className="text-muted-foreground">
          Here's a summary of your health dashboard.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col justify-between transition-transform hover:scale-105 hover:shadow-xl lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className='space-y-1.5'>
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
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Video Consultation
                </p>
                <p className="text-sm text-muted-foreground">
                  Tomorrow, 10:30 AM
                </p>
              </div>
              <Button>
                <Video className="mr-2 h-4 w-4" /> Join Call
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-center bg-primary/20 text-center transition-transform hover:scale-105 hover:shadow-xl">
          <CardHeader>
            <CardTitle>AI Symptom Checker</CardTitle>
            <CardDescription>Concerned about a symptom?</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/patient/symptom-checker" passHref>
              <Button size="lg" className="w-full">
                <Stethoscope className="mr-2 h-5 w-5" /> Start Check
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="transition-transform hover:scale-105 hover:shadow-xl">
          <CardHeader>
            <CardTitle>My Health Records</CardTitle>
            <CardDescription>Access your complete medical history.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="#" passHref>
              <Button variant="outline" className="w-full">
                <HeartPulse className="mr-2 h-4 w-4" /> View Records
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="transition-transform hover:scale-105 hover:shadow-xl">
          <CardHeader>
            <CardTitle>Medicine Availability</CardTitle>
            <CardDescription>Check stock at your local pharmacy.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="#" passHref>
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
