'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Home, LogOut, Database, PenSquare, Bug } from 'lucide-react';
import { Logo } from '@/components/icons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { LOGGED_IN_USER_KEY } from '@/app/page';

const menuItems = [
  { href: '/dashboard/data-entry-operator', label: 'Dashboard', icon: Home },
  { href: '/dashboard/data-entry-operator/regional-data', label: 'Regional Data', icon: PenSquare },
  { href: '/dashboard/data-entry-operator/disease-data', label: 'Disease Data', icon: Bug },
];

export function DataEntryOperatorSidebar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState('Operator');

  useEffect(() => {
      try {
        const userData = localStorage.getItem(LOGGED_IN_USER_KEY);
        if (userData) {
            setUserName(JSON.parse(userData).name);
        }
      } catch (e) {
          console.error("Could not load user data", e);
      }
  }, []);

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
            <AvatarFallback>{userName.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="truncate font-semibold">{userName}</p>
            <p className="truncate text-xs text-muted-foreground">Data Entry Operator</p>
          </div>
          <Link href="/" className="ml-auto" passHref>
            <Button variant="ghost" size="icon" aria-label="Log out">
              <LogOut />
            </Button>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
