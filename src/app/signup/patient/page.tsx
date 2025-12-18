
'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/icons';
import Image from 'next/image';
import { User } from 'lucide-react';

export const PATIENT_ACCOUNT_KEY = 'patientAccountData';
export const LOGGED_IN_PATIENT_KEY = 'loggedInPatientData';


const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  age: z.coerce.number().min(1, 'Age must be at least 1.').max(120, 'Age seems unlikely.'),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Please select a gender.' }),
  phone: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit phone number.'),
  address: z.string().min(10, 'Address must be at least 10 characters.'),
  photo: z.any().optional(),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function PatientSignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      gender: 'male',
      phone: '',
      address: '',
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        form.setValue('photo', reader.result as string); // Save as base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: SignupFormValues) => {
    setIsLoading(true);
    console.log('Signup Data:', data);
    
    // Simulate API call for signup
    setTimeout(() => {
      try {
        localStorage.setItem(PATIENT_ACCOUNT_KEY, JSON.stringify(data));
        setIsLoading(false);
        toast({
          title: 'Account Created Successfully!',
          description: 'You can now log in with your phone number.',
        });
        router.push('/login/patient');
      } catch (error) {
        console.error("Failed to save to localStorage", error);
        toast({
          variant: 'destructive',
          title: 'Signup Failed',
          description: 'Could not create your account. Please try again.',
        });
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 py-12">
      <div className="w-full max-w-lg space-y-6">
         <div className="flex flex-col items-center text-center">
            <Logo className="mb-4 h-12 w-12 text-primary" />
            <h1 className="font-headline text-3xl font-bold">Create Patient Account</h1>
            <p className="text-muted-foreground">Join our network to access digital healthcare.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>
              Please fill in your details to create an account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <div className="group h-24 w-24 rounded-full border-2 border-dashed border-primary flex items-center justify-center">
                       {photoPreview ? (
                            <Image src={photoPreview} alt="Profile preview" fill className="rounded-full object-cover"/>
                        ) : (
                            <User className="h-10 w-10 text-muted-foreground"/>
                        )}
                        <Input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            onChange={handlePhotoChange}
                        />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Profile Photo</h3>
                    <p className="text-sm text-muted-foreground">Upload a clear photo. This helps doctors recognize you.</p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sunita Devi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 45" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex items-center space-x-4 pt-2"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl><RadioGroupItem value="male" /></FormControl>
                              <FormLabel className="font-normal">Male</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl><RadioGroupItem value="female" /></FormControl>
                              <FormLabel className="font-normal">Female</FormLabel>
                            </FormItem>
                             <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl><RadioGroupItem value="other" /></FormControl>
                              <FormLabel className="font-normal">Other</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                 <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="10-digit mobile number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Village, Post Office, District, State, Pincode"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
         <div className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/login/patient" className="font-semibold text-primary underline">
                Log in
            </Link>
        </div>
      </div>
    </div>
  );
}
