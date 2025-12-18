
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/icons';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const LOGGED_IN_USER_KEY = 'loggedInUser';

const loginSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  role: z.string().min(1, 'Please select a role.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const roles = {
  patient: '/dashboard/patient',
  doctor: '/dashboard/doctor',
  pharmacist: '/dashboard/pharmacist',
  'health-official': '/dashboard/health-official',
  'data-entry-operator': '/dashboard/data-entry-operator',
};

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: '',
      role: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    try {
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(data));
      
      // If patient, create a separate patient account record
      if (data.role === 'patient') {
        const patientAccount = {
          fullName: data.name,
          age: 30, // Mock age
          gender: 'other',
          phone: '1234567890', // Mock phone
          address: '123, Mock Street', // Mock address
          photo: '', // Mock photo
        }
        localStorage.setItem(`patientAccount_${data.name}`, JSON.stringify(patientAccount));
      }

      toast({
        title: 'Login Successful',
        description: `Welcome, ${data.name}! Redirecting to your dashboard...`,
      });
      const path = roles[data.role as keyof typeof roles];
      router.push(path);
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Could not log you in. Please try again.',
      });
    }
  };

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

        <Card className="mt-12 w-full max-w-md animate-fade-in-up shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold">
              Select Role and Login
            </CardTitle>
            <CardDescription className="text-center">
              Enter your name and choose your role to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sunita Devi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(roles).map((role) => (
                            <SelectItem key={role} value={role} className="capitalize">
                              {role.replace(/-/g, ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Login to Dashboard
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
