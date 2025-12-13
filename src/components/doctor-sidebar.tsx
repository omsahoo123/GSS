'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Calendar,
  Home,
  LogOut,
  Users,
  FileText,
  Video,
} from 'lucide-react';
import { Logo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from './ui/button';

const menuItems = [
  { href: '/dashboard/doctor', label: 'Dashboard', icon: Home },
  { href: '/dashboard/doctor/appointments', label: 'Appointments', icon: Calendar },
  { href: '/dashboard/doctor/patients', label: 'Patients', icon: Users },
  { href: '/dashboard/doctor/consultations', label: 'Consultations', icon: Video },
  { href: '/dashboard/doctor/prescriptions', label: 'Prescriptions', icon: FileText },
];

export function DoctorSidebar() {
  const pathname = usePathname();
  const doctorAvatar = PlaceHolderImages.find((img) => img.id === 'avatar-doctor');

  return (
    <>
      <div className="absolute left-4 top-4 z-20 md:hidden">
        <SidebarTrigger />
      </div>
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
                    isActive={pathname.startsWith(item.href)}
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
              {doctorAvatar && (
                <AvatarImage src={doctorAvatar.imageUrl} alt="Dr. Priya Singh" data-ai-hint={doctorAvatar.imageHint} />
              )}
              <AvatarFallback>PS</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="truncate font-semibold">Dr. Priya Singh</p>
              <p className="truncate text-xs text-muted-foreground">Doctor</p>
            </div>
            <Link href="/" className="ml-auto" passHref>
              <Button variant="ghost" size="icon" aria-label="Log out">
                <LogOut />
              </Button>
            </Link>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
