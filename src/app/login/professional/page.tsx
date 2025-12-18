'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { KeyRound } from 'lucide-react';
import { Logo } from '@/components/icons';
import Link from 'next/link';
import { LOGGED_IN_USER_KEY } from '../page';

export const PROFESSIONAL_ACCOUNT_KEY = 'professionalAccount_';

export default function ProfessionalLoginPage() {
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
        action: <Button variant="secondary" size="sm" onClick={() => router.push(`/signup/professional?role=${role}`)}>Sign Up</Button>,
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
      role: accountData.role,
      name: accountData.name,
      userId: accountData.userId,
    }));

    toast({ title: 'Login Successful!', description: `Welcome back, ${accountData.name}!` });
    router.push(`/dashboard/${accountData.role}`);
  };

  const roleLabel = role.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

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
          <div className="text-center text-sm text-muted-foreground pt-4">
            Don't have an account?{' '}
            <Link href={`/signup/professional?role=${role}`} className="text-primary underline">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
