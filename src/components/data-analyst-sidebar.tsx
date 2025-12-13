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
  Database,
  PieChart,
  FileText,
  BrainCircuit,
} from 'lucide-react';
import { Logo } from '@/components/icons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from './ui/button';

const menuItems = [
  { href: '/dashboard/data-analyst', label: 'Dashboard', icon: Home },
  { href: '/dashboard/data-analyst/queries', label: 'Data Queries', icon: Database },
  { href: '/dashboard/data-analyst/visualizations', label: 'Visualizations', icon: PieChart },
  { href: '/dashboard/data-analyst/reports', label: 'Reporting', icon: FileText },
  { href: '/dashboard/data-analyst/insights', label: 'AI Insights', icon: BrainCircuit },
];

export function DataAnalystSidebar() {
  const pathname = usePathname();

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
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="truncate font-semibold">Anil Joshi</p>
              <p className="truncate text-xs text-muted-foreground">Data Analyst</p>
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
