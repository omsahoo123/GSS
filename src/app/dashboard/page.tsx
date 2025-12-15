import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Briefcase, HeartPulse, Hospital, Syringe } from 'lucide-react';

const roles = [
  { name: 'Patient', href: '/dashboard/patient', icon: HeartPulse },
  { name: 'Doctor', href: '/dashboard/doctor', icon: Hospital },
  { name: 'Pharmacist', href: '/dashboard/pharmacist', icon: Syringe },
  { name: 'Health Official', href: '/dashboard/health-official', icon: Briefcase },
];

export default function DashboardHub() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">Select a Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {roles.map((role) => (
              <Link href={role.href} key={role.name} passHref>
                <Button variant="outline" className="h-20 w-full justify-start gap-4 p-4 text-left">
                  <role.icon className="h-8 w-8 text-primary" />
                  <span className="text-lg font-semibold">{role.name}</span>
                  <ArrowRight className="ml-auto h-5 w-5" />
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
