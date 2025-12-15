
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  ArrowRight,
  Briefcase,
  HeartPulse,
  Hospital,
  Syringe,
  Database,
} from 'lucide-react';
import { Logo } from '@/components/icons';

const roles = [
  {
    name: 'Patient',
    icon: HeartPulse,
    href: '/dashboard/patient',
    description: 'Access your health records and consult with doctors.',
  },
  {
    name: 'Doctor',
    icon: Hospital,
    href: '/dashboard/doctor',
    description: 'Manage patient consultations and records.',
  },
  {
    name: 'Pharmacist',
    icon: Syringe,
    href: '/dashboard/pharmacist',
    description: 'Manage medicine inventory and prescriptions.',
  },
  {
    name: 'Health Official',
    icon: Briefcase,
    href: '/dashboard/health-official',
    description: 'Monitor public health analytics and reports.',
  },
  {
    name: 'Data Entry Operator',
    icon: Database,
    href: '/dashboard/data-entry-operator',
    description: 'Input and manage regional health data.',
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

  return (
    <div className="relative min-h-screen w-full">
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
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center text-center">
          <Logo className="mb-4 h-16 w-16 text-primary" />
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Grameen Swasthya Setu
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Bridging the Gap in Rural Healthcare. Accessible, reliable, and
            intelligent healthcare for everyone.
          </p>
        </div>

        <Card className="mt-12 w-full max-w-2xl animate-fade-in-up shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold">
              Choose Your Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {roles.map((role) => (
                <div key={role.name}>
                  <Link href={role.href} passHref>
                    <Button
                      variant="outline"
                      className="h-auto w-full justify-start p-4 text-left transition-transform hover:scale-105 hover:bg-accent/50"
                    >
                      <div className="flex w-full items-center gap-4">
                        <div className="rounded-lg bg-primary/20 p-3">
                          <role.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            {role.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {role.description}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
