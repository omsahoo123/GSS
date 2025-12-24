
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { KeyRound } from 'lucide-react';
import { Logo } from '@/components/icons';
import Link from 'next/link';
import { LOGGED_IN_USER_KEY } from '../page';
import { PROFESSIONAL_ACCOUNT_KEY } from '@/app/signup/professional/page';


function ProfessionalLoginComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const roleFromQuery = searchParams.get('role');
    if (roleFromQuery) {
      setRole(roleFromQuery);
    } else {
      router.push('/login');
    }

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

  }, [searchParams, router]);

  const handleLogin = () => {
    if (!userId || !password) {
      toast({ variant: 'destructive', title: 'Missing Fields', description: 'Please enter both User ID and password.' });
      return;
    }
    
    const accountKey = `${PROFESSIONAL_ACCOUNT_KEY}${userId}`;
    const accountDataString = localStorage.getItem(accountKey);

    if (!accountDataString) {
      toast({
        variant: 'destructive',
        title: 'Account Not Found',
        description: 'No account found with that User ID.',
        action: ['doctor', 'pharmacist'].includes(role) ? <Button variant="secondary" size="sm" onClick={() => router.push(`/signup/professional?role=${role}`)}>Sign Up</Button> : undefined,
      });
      return;
    }

    const accountData = JSON.parse(accountDataString);
    if (accountData.password !== password) {
      toast({ variant: 'destructive', title: 'Invalid Password', description: 'The password you entered is incorrect.' });
      return;
    }
    
    if (accountData.role !== role) {
        toast({ variant: 'destructive', title: 'Role Mismatch', description: `This account is for a ${accountData.role}, not a ${role}.` });
        return;
    }

    localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify({
      ...accountData,
    }));

    toast({ title: 'Login Successful!', description: `Welcome back, ${accountData.name}!` });
    router.push(`/dashboard/${accountData.role}`);
  };

  const roleLabel = role.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const canSignUp = ['doctor', 'pharmacist'].includes(role);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <Logo className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">Grameen Swasthya Setu</span>
          </Link>
          <CardTitle>{roleLabel} Login</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleLogin} className="w-full">
            Login <KeyRound className="ml-2 h-4 w-4" />
          </Button>
          <div className="text-center text-sm text-muted-foreground">
              <Link href="/login/forgot-password" className="text-primary underline">
                Forgot Password?
              </Link>
            </div>
          
          {canSignUp && (
            <div className="text-center text-sm text-muted-foreground pt-4">
              Don't have an account?{' '}
              <Link href={`/signup/professional?role=${role}`} className="text-primary underline">
                Sign Up
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfessionalLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfessionalLoginComponent />
    </Suspense>
  )
}
