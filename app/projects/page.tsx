import { getCachedPortfolio } from '@/lib/cache/portfolio-cache';
import { ProjectsPageClient } from '@/components/portfolio/projects-page-client';

export const metadata = {
  title: 'Projects',
  description: 'Browse my portfolio of projects — web apps, tools, and more.',
};

export default async function ProjectsPage() {
  const data = await getCachedPortfolio();
  const initialProjects = (data?.projects || []).filter((p) => p.is_published);
  const initialSkills = data?.skills || [];
  const initialCategories = data?.projectCategories || [];
  return <ProjectsPageClient initialProjects={initialProjects} initialSkills={initialSkills} initialCategories={initialCategories} />;
}
