'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/icons';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Heart, Users, Stethoscope } from 'lucide-react';
import { PROFESSIONAL_ACCOUNT_KEY } from './signup/professional/page';

export default function LandingPage() {
  const router = useRouter();
  const [patientCount, setPatientCount] = useState(0);
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

  useEffect(() => {
    // Simulate fetching the number of patients from localStorage
    const patientKeys = Object.keys(localStorage).filter(key => key.startsWith('patientAccount_'));
    setPatientCount(patientKeys.length);

    // Seed administrative accounts if they don't exist
    const seedAdminAccounts = () => {
      const accountsToSeed = [
        {
          name: 'Aditi Singh',
          userId: 'health01',
          email: 'aditi.singh@gov.in',
          phone: '9876543210',
          password: 'password123',
          role: 'health-official',
        },
        {
          name: 'Ravi Kumar',
          userId: 'dataop01',
          email: 'ravi.kumar@gov.in',
          phone: '9876543211',
          password: 'password123',
          role: 'data-entry-operator',
        }
      ];

      accountsToSeed.forEach(account => {
        const accountKey = `${PROFESSIONAL_ACCOUNT_KEY}${account.userId}`;
        if (!localStorage.getItem(accountKey)) {
          localStorage.setItem(accountKey, JSON.stringify(account));
        }
      });
    };

    seedAdminAccounts();

  }, []);

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">Grameen Swasthya Setu</span>
          </div>
          <Button onClick={handleGetStarted}>
            Login / Signup <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative h-[60vh] w-full">
           {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Bridging the Gap in Rural Healthcare
            </h1>
            <p className="mt-4 max-w-2xl text-lg">
              Accessible, reliable, and intelligent healthcare for everyone, everywhere.
            </p>
          </div>
        </section>

        <section className="py-12 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <Card>
                <CardHeader>
                  <Users className="mx-auto h-12 w-12 text-primary" />
                  <CardTitle className="mt-4">{patientCount > 0 ? `${patientCount}+` : '0'}</CardTitle>
                  <CardDescription>Patients Registered</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Stethoscope className="mx-auto h-12 w-12 text-primary" />
                  <CardTitle>5+</CardTitle>
                  <CardDescription>Healthcare Roles</CardDescription>
                </CardHeader>
              </Card>
               <Card>
                <CardHeader>
                  <Heart className="mx-auto h-12 w-12 text-primary" />
                  <CardTitle>24/7</CardTitle>
                  <CardDescription>Access to Services</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
        
        <section id="get-started" className="py-16">
            <div className="container mx-auto px-4 flex flex-col items-center text-center">
                <h2 className="text-3xl font-bold">Your Health Journey Starts Here</h2>
                <p className="mt-2 text-muted-foreground max-w-xl">
                    Connect with doctors, manage your health records, and access essential services with a few simple clicks.
                </p>
                <Button onClick={handleGetStarted} size="lg" className="mt-8">
                    Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </section>

      </main>

       <footer className="py-6 border-t bg-background">
          <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Grameen Swasthya Setu. All rights reserved.
          </div>
      </footer>
    </div>
  );
}
