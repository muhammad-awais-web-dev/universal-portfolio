'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  User,
  FolderOpen,
  Zap,
  Award,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Image as ImageIcon,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  Link as LinkIcon,
  Plug,
} from 'lucide-react';
import type { Profile } from '@/lib/models/portfolio';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  param?: { key: string; value: string };
}

interface NavGroup {
  label: string;
  icon: React.ElementType;
  items: NavItem[];
}

type SidebarEntry = { type: 'link'; item: NavItem } | { type: 'group'; group: NavGroup };

const NAV: SidebarEntry[] = [
  {
    type: 'link',
    item: { label: 'Dashboard', href: '/protected', icon: LayoutDashboard },
  },
  {
    type: 'group',
    group: {
      label: 'Content',
      icon: FileText,
      items: [
        { label: 'Bio & Profile', href: '/protected/manage', icon: User, param: { key: 'section', value: 'bio' } },
        { label: 'Projects', href: '/protected/manage', icon: FolderOpen, param: { key: 'section', value: 'projects' } },
        { label: 'Skills', href: '/protected/manage', icon: Zap, param: { key: 'section', value: 'skills' } },
        { label: 'Certifications', href: '/protected/manage', icon: Award, param: { key: 'section', value: 'certifications' } },
        { label: 'Experience', href: '/protected/manage', icon: Briefcase, param: { key: 'section', value: 'experience' } },
        { label: 'Education', href: '/protected/manage', icon: GraduationCap, param: { key: 'section', value: 'education' } },
        { label: 'Testimonials', href: '/protected/manage', icon: MessageSquare, param: { key: 'section', value: 'testimonials' } },
      ],
    },
  },
  {
    type: 'link',
    item: { label: 'Media Library', href: '/protected/media-library', icon: ImageIcon },
  },
  {
    type: 'link',
    item: { label: 'Integrations', href: '/protected/integrations', icon: Plug },
  },
  {
    type: 'group',
    group: {
      label: 'Settings',
      icon: Settings,
      items: [
        { label: 'General', href: '/protected/settings', icon: Settings, param: { key: 'tab', value: 'general' } },
        { label: 'API Keys', href: '/protected/settings', icon: LinkIcon, param: { key: 'tab', value: 'api-keys' } },
        { label: 'Credentials', href: '/protected/settings', icon: Award, param: { key: 'tab', value: 'credentials' } },
        { label: 'Database', href: '/protected/settings', icon: FileText, param: { key: 'tab', value: 'database' } },
      ],
    },
  },
];

function buildHref(href: string, param?: { key: string; value: string }) {
  return param ? `${href}?${param.key}=${param.value}` : href;
}

interface Props {
  profile: Profile | null;
  onLogout: () => void;
}

export function AdminSidebar({ profile, onLogout }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine which groups start open: open if a child is active
  const isItemActive = (item: NavItem) => {
    if (item.param) {
      return pathname === item.href && searchParams.get(item.param.key) === item.param.value;
    }
    return pathname === item.href;
  };

  const isGroupActive = (group: NavGroup) => group.items.some(isItemActive);

  // Default open state: open if group has active child OR it's the Content group (default open)
  const initOpen = (group: NavGroup) =>
    isGroupActive(group) || group.label === 'Content';

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {};
    NAV.forEach((entry) => {
      if (entry.type === 'group') state[entry.group.label] = initOpen(entry.group);
    });
    return state;
  });

  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  const isSingleLinkActive = (item: NavItem) => {
    if (item.href === '/protected') return pathname === '/protected';
    if (item.href === '/protected/media-library') return pathname === '/protected/media-library';
    return pathname === item.href;
  };

  return (
    <aside className="w-60 shrink-0 flex flex-col h-screen border-r bg-background overflow-y-auto">
      {/* Brand */}
      <div className="h-14 flex items-center px-4 border-b shrink-0">
        <Link href="/protected" className="font-semibold text-sm tracking-tight">
          Admin Panel
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {NAV.map((entry) => {
          if (entry.type === 'link') {
            const { item } = entry;
            const Icon = item.icon;
            const active = isSingleLinkActive(item);
            return (
              <Link key={item.href + item.label} href={buildHref(item.href, item.param)}>
                <span
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer',
                    active
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </span>
              </Link>
            );
          }

          // Group
          const { group } = entry;
          const GroupIcon = group.icon;
          const groupActive = isGroupActive(group);
          const isOpen = openGroups[group.label] ?? false;

          return (
            <div key={group.label}>
              <button
                onClick={() => toggleGroup(group.label)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors',
                  groupActive
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <GroupIcon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{group.label}</span>
                {isOpen ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>

              {isOpen && (
                <div className="mt-0.5 ml-3 pl-3 border-l space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isItemActive(item);
                    return (
                      <Link key={item.label} href={buildHref(item.href, item.param)}>
                        <span
                          className={cn(
                            'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition-colors cursor-pointer',
                            active
                              ? 'bg-primary text-primary-foreground font-medium'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                          )}
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-3 space-y-2 shrink-0">
        <div className="flex items-center gap-2 px-1">
          <Avatar className="h-7 w-7 shrink-0">
            {profile?.avatar_url && (
              <AvatarImage src={profile.avatar_url} alt={profile.full_name || 'Admin'} />
            )}
            <AvatarFallback className="text-xs">
              {profile?.full_name?.charAt(0) ?? 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{profile?.full_name || 'Admin'}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="flex-1 justify-start gap-2 text-xs h-8 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </Button>
          <ThemeSwitcher />
        </div>
      </div>
    </aside>
  );
}
