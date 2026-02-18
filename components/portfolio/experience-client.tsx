'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { NavBarWrapper } from '@/components/admin/navbar-wrapper';
import { SkillBadge } from '@/components/portfolio/skill-badge';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { getDateRange } from '@/lib/utils/portfolio-helpers';
import { Experience, Skill } from '@/lib/models/portfolio';

export function ExperienceClient() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => {
        const sorted = (data.experiences || []).sort((a: Experience, b: Experience) => {
          if (a.is_current && !b.is_current) return -1;
          if (!a.is_current && b.is_current) return 1;
          return new Date(b.start_date || 0).getTime() - new Date(a.start_date || 0).getTime();
        });
        setExperiences(sorted);
        setSkills(data.skills || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <main className="min-h-screen">
      <NavBarWrapper />
      <div className="max-w-5xl mx-auto px-4 py-12 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading experience...</p>
        </div>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen">
      <NavBarWrapper />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Experience</h1>
          <p className="text-lg text-muted-foreground">Professional work experience and career journey.</p>
        </div>

        {experiences.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No experience entries yet.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {experiences.map((exp) => {
                const expSkills = skills.filter((s) => exp.skill_ids?.includes(s.id)).slice(0, 6);
                return (
                  <Link key={exp.id} href={`/experience/${exp.id}`}
                    className="group flex gap-6 relative">
                    <div className="relative z-10 shrink-0 w-8 h-8 rounded-full border-2 border-foreground bg-background flex items-center justify-center mt-1">
                      <Briefcase className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 border rounded-lg p-5 bg-card hover:border-foreground/30 transition-colors pb-6">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h2 className="font-semibold text-lg group-hover:underline leading-tight">{exp.title}</h2>
                        {exp.is_current && (
                          <Badge variant="outline" className="text-green-600 border-green-600 shrink-0 text-xs">Current</Badge>
                        )}
                      </div>
                      <p className="text-base text-muted-foreground mb-2">{exp.company}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {getDateRange(exp.start_date, exp.end_date, exp.is_current)}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {exp.location}
                          </span>
                        )}
                      </div>
                      {exp.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{exp.description}</p>
                      )}
                      {expSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {expSkills.map((s) => <SkillBadge key={s.id} skill={s} size="sm" />)}
                          {(exp.skill_ids?.length || 0) > 6 && (
                            <span className="text-xs text-muted-foreground self-center">+{(exp.skill_ids?.length || 0) - 6} more</span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
