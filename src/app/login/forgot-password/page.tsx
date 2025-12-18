'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, KeyRound, CheckCircle } from 'lucide-react';
import { Logo } from '@/components/icons';
import Link from 'next/link';
import { PROFESSIONAL_ACCOUNT_KEY } from '@/app/signup/professional/page';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleFindAccount = () => {
    if (!userId) {
      toast({ variant: 'destructive', title: 'User ID Required', description: 'Please enter your User ID.' });
      return;
    }
    const account = localStorage.getItem(`${PROFESSIONAL_ACCOUNT_KEY}${userId}`);
    if (!account) {
      toast({ variant: 'destructive', title: 'Account Not Found', description: 'No professional account exists with this User ID.' });
      return;
    }
    toast({ title: 'OTP Sent!', description: 'A verification OTP has been sent. (It\'s 123456)' });
    setStep(2);
  };

  const handleVerifyOtp = () => {
    if (otp !== '123456') {
      toast({ variant: 'destructive', title: 'Invalid OTP', description: 'The OTP you entered is incorrect.' });
      return;
    }
    setStep(3);
  };

  const handleResetPassword = () => {
    if (newPassword.length < 6) {
      toast({ variant: 'destructive', title: 'Password Too Short', description: 'Password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Passwords Do Not Match', description: 'Please ensure both passwords are the same.' });
      return;
    }

    try {
      const accountKey = `${PROFESSIONAL_ACCOUNT_KEY}${userId}`;
      const accountDataString = localStorage.getItem(accountKey);
      if (accountDataString) {
        const accountData = JSON.parse(accountDataString);
        accountData.password = newPassword;
        localStorage.setItem(accountKey, JSON.stringify(accountData));
        toast({ title: 'Password Updated!', description: 'Your password has been successfully reset.' });
        router.push(`/login/professional?role=${accountData.role}`);
      } else {
        throw new Error('Account data not found during reset.');
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not update your password. Please try again.' });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardDescription>Enter your User ID to find your account.</CardDescription>
            <Input
              type="text"
              placeholder="Your User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-4"
            />
            <Button onClick={handleFindAccount} className="w-full mt-4">
              Find Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <CardDescription>Enter the 6-digit OTP we sent to you.</CardDescription>
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="mt-4"
            />
            <Button onClick={handleVerifyOtp} className="w-full mt-4">
              Verify OTP <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          </>
        );
      case 3:
        return (
          <>
            <CardDescription>Create a new secure password.</CardDescription>
            <div className="mt-4 space-y-4">
              <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleResetPassword} className="w-full mt-4">
              Reset Password <KeyRound className="ml-2 h-4 w-4" />
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <Logo className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">Grameen Swasthya Setu</span>
          </Link>
          <CardTitle>Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
          <div className="text-center text-sm text-muted-foreground pt-4">
            Remember your password?{' '}
            <Link href="/login" className="text-primary underline">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
