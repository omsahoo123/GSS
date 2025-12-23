'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Calendar,
  HeartPulse,
  Home,
  LogOut,
  Pill,
  User,
  Video,
  Bot,
} from 'lucide-react';
import { Logo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './ui/button';
import React, { useEffect, useState } from 'react';
import { LOGGED_IN_USER_KEY } from '@/app/login/page';

const menuItems = [
  { href: '/dashboard/patient', label: 'Dashboard', icon: Home, exact: true },
  { href: '/dashboard/patient/appointments', label: 'Appointments', icon: Calendar },
  { href: '/dashboard/patient/virtual-assistant', label: 'Virtual Assistant', icon: Bot },
  { href: '/dashboard/patient/records', label: 'Health Records', icon: HeartPulse },
  { href: '/dashboard/patient/pharmacy-stock', label: 'Pharmacy Stock', icon: Pill },
  { href: '/dashboard/patient/consultation', label: 'Video Consultation', icon: Video },
  { href: '/dashboard/patient/profile', label: 'Profile', icon: User },
];

type PatientData = {
  name: string;
  photo?: string;
};

export function PatientSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [patientData, setPatientData] = useState<PatientData | null>(null);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOGGED_IN_USER_KEY);
      if (storedData) {
        setPatientData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to load patient data from localStorage", error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(LOGGED_IN_USER_KEY);
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="text-lg font-semibold">G.S. Setu</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  isActive={item.exact ? pathname === item.href : pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-10 w-10">
            {patientData?.photo && (
              <AvatarImage src={patientData.photo} alt={patientData.name} />
            )}
            <AvatarFallback>
              {patientData ? getInitials(patientData.name) : 'P'}
            </AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="truncate font-semibold">{patientData?.name || 'Patient'}</p>
            <p className="truncate text-xs text-muted-foreground">Patient</p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Log out" onClick={handleLogout}>
            <LogOut />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
