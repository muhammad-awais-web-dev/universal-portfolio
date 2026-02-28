import { Profile } from '@/lib/models/portfolio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Github, Linkedin, Twitter, Instagram, Youtube, Globe, Mail, MapPin } from 'lucide-react';

interface HeroSectionProps {
  profile: Profile | null;
}

export function HeroSection({ profile }: HeroSectionProps) {
  const initials = profile?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  const socialLinks = [
    { icon: Github, url: profile?.github, label: 'GitHub' },
    { icon: Linkedin, url: profile?.linkedin, label: 'LinkedIn' },
    { icon: Twitter, url: profile?.twitter, label: 'Twitter' },
    { icon: Instagram, url: profile?.instagram, label: 'Instagram' },
    { icon: Youtube, url: profile?.youtube, label: 'YouTube' },
    { icon: Globe, url: profile?.website, label: 'Website' },
  ].filter((link) => link.url);

  return (
    <section className="relative py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-primary/20">
            <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || 'Profile'} />
            <AvatarFallback className="text-4xl font-bold">{initials}</AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3">
              {profile?.full_name || 'Portfolio'}
            </h1>
            {profile?.tagline && (
              <p className="text-xl md:text-2xl text-muted-foreground mb-4">
                {profile?.tagline}
              </p>
            )}
            
            {/* Location and Email */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6 text-sm text-muted-foreground">
              {profile?.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profile?.location}</span>
                </div>
              )}
              {profile?.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${profile?.email}`} className="hover:text-foreground transition-colors">
                    {profile?.email}
                  </a>
                </div>
              )}
            </div>

            {/* Bio */}
            {profile?.bio && (
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-6">
                {profile?.bio}
              </p>
            )}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 justify-center md:justify-start">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg border bg-card hover:bg-accent transition-colors"
                      aria-label={link.label}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
