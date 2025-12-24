
'use client';

import { useState, useEffect } from 'react';
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
import { Save, Camera } from 'lucide-react';
import { LOGGED_IN_USER_KEY } from '@/app/login/page';
import { PATIENT_ACCOUNT_KEY, PATIENT_PHOTO_KEY } from '@/app/signup/patient/page';


const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  age: z.coerce.number().min(1, 'Age must be a positive number.').max(120),
  gender: z.string().min(1, 'Please select a gender.'),
  phone: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit phone number.').readonly(),
  address: z.string().min(5, 'Address is required.'),
  photo: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function PatientProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      gender: '',
      phone: '',
      address: '',
      age: 0,
      photo: null,
    },
  });

  useEffect(() => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem(LOGGED_IN_USER_KEY) || '{}');
      const patientAccount = JSON.parse(localStorage.getItem(`${PATIENT_ACCOUNT_KEY}${loggedInUser.phone}`) || '{}');
      
      if(patientAccount.phone) {
        const patientPhoto = localStorage.getItem(`${PATIENT_PHOTO_KEY}${loggedInUser.phone}`);
        const fullAccount = { ...patientAccount, photo: patientPhoto };
        setCurrentUser(fullAccount);
        form.reset(fullAccount);
        if(patientPhoto) {
            setPhotoPreview(patientPhoto);
        }
      }
    } catch(e) {
      console.error('Failed to load user data', e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load your profile data.' });
    }
  }, [form, toast]);


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

  const onSubmit = (data: ProfileFormValues) => {
    if(!currentUser) return;
    try {
      const patientData = {
        name: data.name,
        age: data.age,
        gender: data.gender,
        address: data.address,
        phone: data.phone,
      };

      localStorage.setItem(`${PATIENT_ACCOUNT_KEY}${currentUser.phone}`, JSON.stringify(patientData));
      if (data.photo) {
          localStorage.setItem(`${PATIENT_PHOTO_KEY}${currentUser.phone}`, data.photo);
      }
      
      // Update the session data, but without the large photo string
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify({ role: 'patient', ...patientData }));
      
      toast({
        title: 'Profile Updated!',
        description: 'Your profile has been successfully updated.',
      });
       // Force a re-render or reload to see sidebar changes
      window.location.reload();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Something went wrong. Please try again.',
      });
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
       <div>
        <h1 className="font-headline text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          View and update your personal information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Your Details</CardTitle>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <FormControl><Input type="tel" placeholder="10-digit mobile number" {...field} readOnly className="text-muted-foreground" /></FormControl>
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
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Full Address</FormLabel>
                      <FormControl><Input placeholder="e.g., Village, Post, District" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full md:w-auto">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
