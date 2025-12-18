
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, KeyRound } from 'lucide-react';
import { Logo } from '@/components/icons';
import { PATIENT_ACCOUNT_KEY } from '../signup/patient/page';

export default function PatientLoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Phone Number',
        description: 'Please enter a valid 10-digit phone number.',
      });
      return;
    }
    
    setIsLoading(true);
    
    // Check if phone number is registered
    try {
        const storedAccount = localStorage.getItem(PATIENT_ACCOUNT_KEY);
        const account = storedAccount ? JSON.parse(storedAccount) : null;

        if (!account || account.phone !== phone) {
            toast({
                variant: 'destructive',
                title: 'Unregistered Number',
                description: 'This phone number is not registered. Please sign up first.',
            });
            setIsLoading(false);
            return;
        }

    } catch (error) {
        console.error("Failed to read from localStorage", error);
        toast({
            variant: 'destructive',
            title: 'An Error Occurred',
            description: 'Could not verify your phone number. Please try again.',
        });
        setIsLoading(false);
        return;
    }

    // Simulate sending OTP
    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
      toast({
        title: 'OTP Sent',
        description: 'An OTP has been sent to your phone number (mocked as 123456).',
      });
    }, 1000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '123456') { // Mock OTP check
        toast({
            variant: 'destructive',
            title: 'Invalid OTP',
            description: 'The OTP you entered is incorrect.',
        });
        return;
    }

    setIsLoading(true);
    // Simulate successful login
    setTimeout(() => {
        toast({
            title: 'Login Successful',
            description: 'Redirecting to your dashboard...',
        });
        router.push('/dashboard/patient');
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
            <Logo className="mb-4 h-12 w-12 text-primary" />
            <h1 className="font-headline text-3xl font-bold">Patient Login</h1>
            <p className="text-muted-foreground">Welcome back to Grameen Swasthya Setu.</p>
        </div>
        <Card>
          <form onSubmit={otpSent ? handleLogin : handleSendOtp}>
            <CardHeader>
              <CardTitle>{otpSent ? 'Enter OTP' : 'Enter Phone Number'}</CardTitle>
              <CardDescription>
                {otpSent
                  ? `We've sent a 6-digit OTP to ${phone}.`
                  : 'We will send a one-time password to your mobile number.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!otpSent ? (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your 10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="otp">One-Time Password (OTP)</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter the 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? 'Processing...'
                  : otpSent
                  ? 'Login'
                  : 'Send OTP'}
              </Button>
              {otpSent && (
                <Button variant="link" size="sm" onClick={() => { setOtpSent(false); setOtp(''); }}>
                    Entered wrong number?
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
        <div className="text-center text-sm">
            Don't have an account?{' '}
            <Link href="/signup/patient" className="font-semibold text-primary underline">
                Sign up
            </Link>
        </div>
      </div>
    </div>
  );
}
