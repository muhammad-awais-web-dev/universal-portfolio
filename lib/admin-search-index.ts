import {
  LayoutDashboard,
  User,
  FolderOpen,
  Zap,
  Award,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Image as ImageIcon,
  Plug,
  Settings,
  Link as LinkIcon,
  FileText,
  BookOpen,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface SearchEntry {
  label: string;
  href: string;
  category: string;
  icon: LucideIcon;
  keywords?: string[];
}

export const ADMIN_SEARCH_INDEX: SearchEntry[] = [
  // Navigation
  {
    label: 'Dashboard',
    href: '/protected',
    category: 'Navigation',
    icon: LayoutDashboard,
    keywords: ['home', 'overview'],
  },
  {
    label: 'Media Library',
    href: '/protected/media-library',
    category: 'Navigation',
    icon: ImageIcon,
    keywords: ['images', 'uploads', 'files', 'photos'],
  },
  {
    label: 'Integrations',
    href: '/protected/integrations',
    category: 'Navigation',
    icon: Plug,
    keywords: ['cloudinary', 'resend', 'email', 'cdn'],
  },

  // Content
  {
    label: 'Bio & Profile',
    href: '/protected/manage?section=bio',
    category: 'Content',
    icon: User,
    keywords: ['about', 'bio', 'avatar', 'social', 'profile'],
  },
  {
    label: 'Projects',
    href: '/protected/manage?section=projects',
    category: 'Content',
    icon: FolderOpen,
    keywords: ['work', 'portfolio', 'apps'],
  },
  {
    label: 'Skills',
    href: '/protected/manage?section=skills',
    category: 'Content',
    icon: Zap,
    keywords: ['technologies', 'tools', 'stack'],
  },
  {
    label: 'Certifications',
    href: '/protected/manage?section=certifications',
    category: 'Content',
    icon: Award,
    keywords: ['certificates', 'badges', 'credentials'],
  },
  {
    label: 'Experience',
    href: '/protected/manage?section=experience',
    category: 'Content',
    icon: Briefcase,
    keywords: ['jobs', 'work history', 'employment'],
  },
  {
    label: 'Education',
    href: '/protected/manage?section=education',
    category: 'Content',
    icon: GraduationCap,
    keywords: ['university', 'degree', 'school', 'college'],
  },
  {
    label: 'Testimonials',
    href: '/protected/manage?section=testimonials',
    category: 'Content',
    icon: MessageSquare,
    keywords: ['reviews', 'feedback', 'recommendations'],
  },

  // Settings
  {
    label: 'General Settings',
    href: '/protected/settings?tab=general',
    category: 'Settings',
    icon: Settings,
    keywords: ['site name', 'logo', 'favicon', 'theme', 'general'],
  },
  {
    label: 'API Keys',
    href: '/protected/settings?tab=api-keys',
    category: 'Settings',
    icon: LinkIcon,
    keywords: ['mcp', 'token', 'access', 'key', 'api'],
  },
  {
    label: 'Credentials',
    href: '/protected/settings?tab=credentials',
    category: 'Settings',
    icon: Award,
    keywords: ['password', 'email', 'login', 'auth'],
  },
  {
    label: 'Database',
    href: '/protected/settings?tab=database',
    category: 'Settings',
    icon: FileText,
    keywords: ['supabase', 'sql', 'backup', 'data'],
  },

  // Docs
  {
    label: 'Documentation',
    href: '/protected/docs',
    category: 'Help',
    icon: BookOpen,
    keywords: ['help', 'guide', 'getting started', 'how to', 'mcp', 'reference'],
  },
];

export function searchIndex(query: string): SearchEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return ADMIN_SEARCH_INDEX.filter(
    (entry) =>
      entry.label.toLowerCase().includes(q) ||
      entry.category.toLowerCase().includes(q) ||
      entry.keywords?.some((k) => k.includes(q))
  );
}
