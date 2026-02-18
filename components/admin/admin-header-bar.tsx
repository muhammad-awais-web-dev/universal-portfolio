'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { LogOut, Settings, LayoutDashboard, Home } from 'lucide-react';
import type { Profile } from '@/lib/models/portfolio';

interface AdminNavBarProps {
  profile: Profile | null;
  onLogout: () => void;
}

export function AdminNavBar({ profile, onLogout }: AdminNavBarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/protected/manage', label: 'Manage', icon: LayoutDashboard },
    { href: '/protected/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {profile?.avatar_url ? (
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile.avatar_url} alt={profile.full_name || 'Admin'} />
                <AvatarFallback>
                  {profile.full_name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-8 w-8">
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            )}
            <div className="hidden md:block">
              <p className="text-sm font-semibold leading-none">
                Welcome, {profile?.full_name || 'Admin'}
              </p>
              <p className="text-xs text-muted-foreground">Admin Mode</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
