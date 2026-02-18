'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { NavBarWrapper } from '@/components/admin/navbar-wrapper';
import { SkillBadge } from '@/components/portfolio/skill-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GraduationCap, Calendar } from 'lucide-react';
import { formatDate, getDateRange } from '@/lib/utils/portfolio-helpers';
import { Education, Skill } from '@/lib/models/portfolio';

interface EducationDetailClientProps {
  id: string;
}

export function EducationDetailClient({ id }: EducationDetailClientProps) {
  const [edu, setEdu] = useState<Education | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => {
        const found = data.education?.find((e: Education) => String(e.id) === id);
        if (!found) { setNotFound(true); setLoading(false); return; }
        setEdu(found);
        setSkills(data.skills || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <main className="min-h-screen">
      <NavBarWrapper />
      <div className="max-w-5xl mx-auto px-4 py-12 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    </main>
  );

  if (notFound || !edu) return (
    <main className="min-h-screen">
      <NavBarWrapper />
      <div className="max-w-5xl mx-auto px-4 py-12 text-center space-y-4">
        <h1 className="text-3xl font-bold">Education Not Found</h1>
        <p className="text-muted-foreground">This education entry doesn't exist or has been removed.</p>
        <Button asChild><Link href="/education"><ArrowLeft className="mr-2 h-4 w-4" />Back to Education</Link></Button>
      </div>
    </main>
  );

  const eduSkills = skills.filter((s) => edu.skill_ids?.includes(s.id));

  return (
    <main className="min-h-screen">
      <NavBarWrapper />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/education"><ArrowLeft className="mr-2 h-4 w-4" />Back to Education</Link>
        </Button>

        <div className="mb-8">
          {edu.is_current && (
            <Badge variant="outline" className="text-green-600 border-green-600 mb-4">Currently Studying</Badge>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            {edu.degree}{edu.field_of_study ? ` in ${edu.field_of_study}` : ''}
          </h1>
          <p className="text-xl text-muted-foreground mb-4">{edu.institution}</p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {getDateRange(edu.start_date, edu.end_date, edu.is_current)}
            </span>
            {edu.grade && <span>Grade: {edu.grade}</span>}
          </div>
        </div>

        {edu.description && (
          <div className="border rounded-lg p-5 mb-8 bg-muted/30">
            <p className="text-muted-foreground leading-relaxed">{edu.description}</p>
          </div>
        )}

        {eduSkills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {eduSkills.map((skill) => <SkillBadge key={skill.id} skill={skill} size="md" />)}
            </div>
          </div>
        )}

        {edu.body_html && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Details</h2>
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: edu.body_html }} />
          </div>
        )}
      </div>
    </main>
  );
}
