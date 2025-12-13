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
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Home,
  LogOut,
  BarChart,
  ClipboardList,
  Siren,
  Truck,
} from 'lucide-react';
import { Logo } from '@/components/icons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from './ui/button';

const menuItems = [
  { href: '/dashboard/health-official', label: 'Dashboard', icon: Home },
  { href: '/dashboard/health-official/analytics', label: 'Analytics', icon: BarChart },
  { href: '/dashboard/health-official/resources', label: 'Resources', icon: Truck },
  { href: '/dashboard/health-official/reports', label: 'Reports', icon: ClipboardList },
  { href: '/dashboard/health-official/alerts', label: 'Alerts', icon: Siren },
];

export function HealthOfficialSidebar() {
  const pathname = usePathname();

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
            <AvatarFallback>SV</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="truncate font-semibold">Sunita Verma</p>
            <p className="truncate text-xs text-muted-foreground">Health Official</p>
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
