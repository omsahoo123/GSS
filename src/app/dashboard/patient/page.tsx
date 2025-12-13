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
import { ArrowRight, HeartPulse, Pill, Stethoscope, Video } from 'lucide-react';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export default function PatientDashboardPage() {
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

      <Card className="col-span-1 lg:col-span-3">
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col justify-between transition-transform hover:scale-105 hover:shadow-xl lg:col-span-2">
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
