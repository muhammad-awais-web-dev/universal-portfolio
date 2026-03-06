'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
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
  X,
  BookOpen,
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
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AdminSidebar({ profile, onLogout, mobileOpen = false, onMobileClose }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Determine which groups start open: open if a child is active
  const isItemActive = (item: NavItem) => {
    if (item.param) {
      return pathname === item.href && searchParams.get(item.param.key) === item.param.value;
    }
    return pathname === item.href;
  };

  const isGroupActive = (group: NavGroup) => group.items.some(isItemActive);

  // Only one temporary submenu open at a time; active group is always open.
  const [tempOpenGroup, setTempOpenGroup] = useState<string | null>(null);

  const toggleGroup = (label: string) => {
    const entry = NAV.find((e) => e.type === 'group' && e.group.label === label);
    if (!entry || entry.type !== 'group') return;
    if (isGroupActive(entry.group)) return; // active group stays open, cannot be closed
    setTempOpenGroup((prev) => (prev === label ? null : label));
  };

  const isSingleLinkActive = (item: NavItem) => {
    if (item.href === '/protected') return pathname === '/protected';
    return pathname === item.href;
  };

  // Close mobile menu on navigation
  const handleNavClick = (href: string) => {
    onMobileClose?.();
    router.push(href);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 sm:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          // Desktop: always visible, static in flow
          'sm:relative sm:flex sm:w-60 sm:translate-x-0 sm:z-auto',
          // Mobile: fixed full-screen, slide in/out
          'fixed inset-0 z-50 w-full flex flex-col sm:flex-col',
          'transition-transform duration-200 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0',
          'h-screen border-r bg-background overflow-y-auto shrink-0',
        )}
      >
      {/* Brand */}
      <div className="h-14 flex items-center justify-between px-4 border-b shrink-0">
        <button
          onClick={() => handleNavClick('/protected')}
          className="font-semibold text-sm tracking-tight hover:opacity-80 transition-opacity"
        >
          Admin Panel
        </button>
        {/* Close button — mobile only */}
        <button
          className="sm:hidden p-1.5 rounded-md hover:bg-accent text-muted-foreground"
          onClick={onMobileClose}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {NAV.map((entry) => {
          if (entry.type === 'link') {
            const { item } = entry;
            const Icon = item.icon;
            const active = isSingleLinkActive(item);
            return (
              <button
                key={item.href + item.label}
                onClick={() => handleNavClick(buildHref(item.href, item.param))}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </button>
            );
          }

          // Group
          const { group } = entry;
          const GroupIcon = group.icon;
          const groupActive = isGroupActive(group);
          const isOpen = isGroupActive(group) || tempOpenGroup === group.label;

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
                      <button
                        key={item.label}
                        onClick={() => handleNavClick(buildHref(item.href, item.param))}
                        className={cn(
                          'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition-colors',
                          active
                            ? 'bg-primary text-primary-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        )}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Documentation — nav link */}
        <button
          onClick={() => handleNavClick('/protected/docs')}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors',
            pathname === '/protected/docs'
              ? 'bg-primary text-primary-foreground font-medium'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          )}
        >
          <BookOpen className="h-4 w-4 shrink-0" />
          Documentation
        </button>
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
    </>
  );
}
