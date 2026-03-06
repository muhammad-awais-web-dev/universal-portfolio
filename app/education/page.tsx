export const dynamic = 'force-static';

import { getCachedPortfolio } from '@/lib/cache/portfolio-cache';
import { EducationClient } from '@/components/portfolio/education-client';
import { Education } from '@/lib/models/portfolio';

export const metadata = {
  title: 'Education',
  description: 'Academic background and educational achievements.',
};

export default async function EducationPage() {
  const data = await getCachedPortfolio();
  const initialEducation = (data?.education || []).sort((a: Education, b: Education) => {
    if (a.is_current && !b.is_current) return -1;
    if (!a.is_current && b.is_current) return 1;
    return new Date(b.start_date || 0).getTime() - new Date(a.start_date || 0).getTime();
  });
  const initialSkills = data?.skills || [];
  return <EducationClient initialEducation={initialEducation} initialSkills={initialSkills} />;
}
