
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Camera } from 'lucide-react';
import { Logo } from '@/components/icons';
import Link from 'next/link';

export const PATIENT_ACCOUNT_KEY = 'patientAccount_';
export const PATIENT_PHOTO_KEY = 'patientPhoto_';


const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  age: z.coerce.number().min(1, 'Age must be a positive number.').max(120),
  gender: z.string().min(1, 'Please select a gender.'),
  phone: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit phone number.'),
  address: z.string().min(5, 'Address is required.'),
  photo: z.any().optional(),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function PatientSignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      gender: '',
      phone: '',
      address: '',
      age: 0,
      photo: null,
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        form.setValue('photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: SignupFormValues) => {
    try {
      const existingAccount = localStorage.getItem(`${PATIENT_ACCOUNT_KEY}${data.phone}`);
      if (existingAccount) {
        toast({
          variant: 'destructive',
          title: 'Account Exists',
          description: 'An account with this phone number already exists.',
          action: <Button variant="secondary" size="sm" onClick={() => router.push('/login/patient')}>Login</Button>,
        });
        return;
      }
      
      const patientData = {
        name: data.name,
        age: data.age,
        gender: data.gender,
        address: data.address,
        phone: data.phone,
      };

      // Store main data and photo separately
      localStorage.setItem(`${PATIENT_ACCOUNT_KEY}${data.phone}`, JSON.stringify(patientData));
      if (data.photo) {
        localStorage.setItem(`${PATIENT_PHOTO_KEY}${data.phone}`, data.photo);
      }
      
      toast({
        title: 'Account Created!',
        description: 'Your account has been created successfully. Please log in.',
      });
      router.push('/login/patient');
    } catch (error) {
       if (error instanceof DOMException && error.name === 'QuotaExceededError') {
         toast({
            variant: 'destructive',
            title: 'Image Too Large',
            description: 'The profile picture is too large. Please choose a smaller file.',
        });
       } else {
        toast({
            variant: 'destructive',
            title: 'Signup Failed',
            description: 'Something went wrong. Please try again.',
        });
       }
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary py-12 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <Logo className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">Grameen Swasthya Setu</span>
          </Link>
          <CardTitle>Create Patient Account</CardTitle>
          <CardDescription>Enter your details to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                </label>
                <Input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                <FormMessage>{form.formState.errors.photo?.message as string}</FormMessage>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="e.g., Anil Kumar" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input type="tel" placeholder="10-digit mobile number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 35" {...field} /></FormControl>
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Address</FormLabel>
                    <FormControl><Input placeholder="e.g., Village, Post, District" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                <UserPlus className="mr-2 h-4 w-4" /> Create Account
              </Button>
            </form>
          </Form>
          <div className="text-center text-sm text-muted-foreground pt-4">
            Already have an account?{' '}
            <Link href="/login/patient" className="text-primary underline">
              Log In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
