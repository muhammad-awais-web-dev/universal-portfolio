export const dynamic = 'force-static';

import { getCachedPortfolio } from '@/lib/cache/portfolio-cache';
import { CertificationsClient } from '@/components/portfolio/certifications-client';

export const metadata = {
  title: 'Certifications',
  description: 'Professional certifications and credentials.',
};

export default async function CertificationsPage() {
  const data = await getCachedPortfolio();
  const initialCertifications = data?.certifications || [];
  const initialSkills = data?.skills || [];
  return <CertificationsClient initialCertifications={initialCertifications} initialSkills={initialSkills} />;
}
