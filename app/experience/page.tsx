export const dynamic = 'force-static';

import { getCachedPortfolio } from '@/lib/cache/portfolio-cache';
import { ExperienceClient } from '@/components/portfolio/experience-client';
import { Experience } from '@/lib/models/portfolio';

export const metadata = {
  title: 'Experience',
  description: 'Professional work experience and career journey.',
};

export default async function ExperiencePage() {
  const data = await getCachedPortfolio();
  const initialExperiences = (data?.experiences || []).sort((a: Experience, b: Experience) => {
    if (a.is_current && !b.is_current) return -1;
    if (!a.is_current && b.is_current) return 1;
    return new Date(b.start_date || 0).getTime() - new Date(a.start_date || 0).getTime();
  });
  const initialSkills = data?.skills || [];
  return <ExperienceClient initialExperiences={initialExperiences} initialSkills={initialSkills} />;
}
