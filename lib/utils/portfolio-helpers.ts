import { Project, Certification, Education, Experience, Skill, SkillCategory, ProjectCategory, Profile, Testimonial } from '@/lib/models/portfolio';

export interface PortfolioData {
  profile: Profile | null;
  projects: Project[];
  certifications: Certification[];
  education: Education[];
  experiences: Experience[];
  skills: Skill[];
  skillCategories: SkillCategory[];
  projectCategories: ProjectCategory[];
  testimonials: Testimonial[];
}

export function filterPublishedData(data: PortfolioData, isAdmin: boolean): PortfolioData {
  if (isAdmin) {
    return data; // Admins see everything
  }

  // Filter to only published items for visitors
  return {
    ...data,
    projects: data.projects?.filter((p) => p.is_published) || [],
    certifications: data.certifications?.filter((c) => c.is_active !== false) || [],
    education: data.education || [],
    experiences: data.experiences || [],
    skills: data.skills || [],
    skillCategories: data.skillCategories || [],
    projectCategories: data.projectCategories || [],
    testimonials: data.testimonials?.filter((t) => t.is_active !== false) || [],
  };
}

export function getSkillUsageCount(
  skillId: number,
  data: Pick<PortfolioData, 'projects' | 'certifications' | 'education' | 'experiences'>
): number {
  let count = 0;

  data.projects.forEach((p) => {
    if (p.skill_ids?.includes(skillId)) count++;
  });

  data.certifications.forEach((c) => {
    if (c.skill_ids?.includes(skillId)) count++;
  });

  data.education.forEach((e) => {
    if (e.skill_ids?.includes(skillId)) count++;
  });

  data.experiences.forEach((exp) => {
    if (exp.skill_ids?.includes(skillId)) count++;
  });

  return count;
}

export function formatDate(dateString?: string | null, options?: Intl.DateTimeFormatOptions): string {
  if (!dateString) return '';
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    ...options,
  };
  
  return new Date(dateString).toLocaleDateString('en-US', defaultOptions);
}

export function getDateRange(
  startDate?: string | null,
  endDate?: string | null,
  isCurrent?: boolean
): string {
  const start = formatDate(startDate, { year: 'numeric', month: 'short' });
  
  if (isCurrent) {
    return `${start} - Present`;
  }
  
  const end = formatDate(endDate, { year: 'numeric', month: 'short' });
  return end ? `${start} - ${end}` : start;
}
