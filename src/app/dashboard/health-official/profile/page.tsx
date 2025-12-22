'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import { LOGGED_IN_USER_KEY } from '@/app/login/page';
import { PROFESSIONAL_ACCOUNT_KEY } from '@/app/signup/professional/page';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  userId: z.string().readonly(),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit phone number.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function HealthOfficialProfilePage() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem(LOGGED_IN_USER_KEY) || '{}');
      const professionalAccount = JSON.parse(localStorage.getItem(`${PROFESSIONAL_ACCOUNT_KEY}${loggedInUser.userId}`) || '{}');
      
      if(professionalAccount.userId) {
        setCurrentUser(professionalAccount);
        form.reset(professionalAccount);
      }
    } catch(e) {
      console.error('Failed to load user data', e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load your profile data.' });
    }
  }, [form, toast]);

  const onSubmit = (data: ProfileFormValues) => {
    if(!currentUser) return;
    try {
      const professionalData = {
        ...currentUser,
        ...data,
      };

      localStorage.setItem(`${PROFESSIONAL_ACCOUNT_KEY}${currentUser.userId}`, JSON.stringify(professionalData));
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(professionalData));
      
      toast({
        title: 'Profile Updated!',
        description: 'Your profile has been successfully updated.',
      });
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
          View and update your professional information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Your Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="e.g., Aditi Singh" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User ID</FormLabel>
                      <FormControl><Input {...field} readOnly className="text-muted-foreground" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
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
