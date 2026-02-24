'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavBarWrapper } from '@/components/admin/navbar-wrapper';
import { SkillBadge } from '@/components/portfolio/skill-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Award, ExternalLink, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils/portfolio-helpers';
import { Certification, Skill } from '@/lib/models/portfolio';

interface CertificationDetailClientProps {
  id: string;
}

export function CertificationDetailClient({ id }: CertificationDetailClientProps) {
  const [cert, setCert] = useState<Certification | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => {
        const found = data.certifications?.find((c: Certification) => String(c.id) === id);
        if (!found) { setNotFound(true); setLoading(false); return; }
        setCert(found);
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

  if (notFound || !cert) return (
    <main className="min-h-screen">
      <NavBarWrapper />
      <div className="max-w-5xl mx-auto px-4 py-12 text-center space-y-4">
        <h1 className="text-3xl font-bold">Certification Not Found</h1>
        <p className="text-muted-foreground">This certification doesn&apos;t exist or has been removed.</p>
        <Button asChild><Link href="/certifications"><ArrowLeft className="mr-2 h-4 w-4" />Back to Certifications</Link></Button>
      </div>
    </main>
  );

  const certSkills = skills.filter((s) => cert.skill_ids?.includes(s.id));
  const isExpired = cert.expiration_date && new Date(cert.expiration_date) < new Date();

  return (
    <main className="min-h-screen">
      <NavBarWrapper />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/certifications"><ArrowLeft className="mr-2 h-4 w-4" />Back to Certifications</Link>
        </Button>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {cert.is_active !== false && !isExpired ? (
              <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">Expired</Badge>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-3">{cert.title}</h1>
          {cert.authority && <p className="text-xl text-muted-foreground mb-4">Issued by {cert.authority}</p>}

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
            {cert.issued_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Issued {formatDate(cert.issued_date, { year: 'numeric', month: 'long' })}
              </span>
            )}
            {cert.expiration_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {isExpired ? 'Expired' : 'Expires'} {formatDate(cert.expiration_date, { year: 'numeric', month: 'long' })}
              </span>
            )}
          </div>

          {cert.credential_url && (
            <Button asChild>
              <a href={cert.credential_url} target="_blank" rel="noopener noreferrer">
                <Award className="mr-2 h-4 w-4" />
                View Credential
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </div>

        {cert.featured_image && (
          <div className="relative h-72 rounded-lg overflow-hidden bg-muted mb-8">
            <Image src={cert.featured_image} alt={cert.title} fill className="object-contain p-4" />
          </div>
        )}

        {certSkills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Skills Covered</h2>
            <div className="flex flex-wrap gap-2">
              {certSkills.map((skill) => <SkillBadge key={skill.id} skill={skill} size="md" />)}
            </div>
          </div>
        )}

        {cert.body_html && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Details</h2>
            <div className="rich-content"
              dangerouslySetInnerHTML={{ __html: cert.body_html }} />
          </div>
        )}
      </div>
    </main>
  );
}
