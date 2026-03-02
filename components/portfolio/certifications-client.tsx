'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavBarWrapper } from '@/components/admin/navbar-wrapper';
import { SkillBadge } from '@/components/portfolio/skill-badge';
import { Badge } from '@/components/ui/badge';
import { Award, Calendar, Search } from 'lucide-react';
import { formatDate } from '@/lib/utils/portfolio-helpers';
import { Certification, Skill } from '@/lib/models/portfolio';
import { Input } from '@/components/ui/input';

export function CertificationsClient({ initialCertifications, initialSkills }: { initialCertifications: Certification[]; initialSkills: Skill[] }) {
  const [search, setSearch] = useState('');

  const filtered = initialCertifications.filter(
    (c) =>
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.authority?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen">
      <NavBarWrapper />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Certifications</h1>
          <p className="text-lg text-muted-foreground">Professional certifications and credentials.</p>
        </div>

        {initialCertifications.length > 0 && (
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search certifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">{search ? 'No certifications match your search.' : 'No certifications yet.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((cert) => {
              const certSkills = initialSkills.filter((s) => cert.skill_ids?.includes(s.id)).slice(0, 4);
              const isExpired = cert.expiration_date && new Date(cert.expiration_date) < new Date();
              return (
                <Link key={cert.id} href={`/certifications/${cert.id}`}
                  className="group border rounded-lg overflow-hidden hover:border-foreground/30 transition-colors bg-card">
                  {cert.featured_image && (
                    <div className="relative h-40 bg-muted">
                      <Image src={cert.featured_image} alt={cert.title} fill className="object-contain p-4" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h2 className="font-semibold text-base group-hover:underline leading-tight">{cert.title}</h2>
                      {cert.is_active !== false && !isExpired ? (
                        <Badge variant="outline" className="text-green-600 border-green-600 shrink-0 text-xs">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground shrink-0 text-xs">Expired</Badge>
                      )}
                    </div>
                    {cert.authority && <p className="text-sm text-muted-foreground mb-3">{cert.authority}</p>}
                    {cert.issued_date && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                        <Calendar className="h-3 w-3" />
                        {formatDate(cert.issued_date, { year: 'numeric', month: 'short' })}
                        {cert.expiration_date && ` – ${isExpired ? 'Expired' : 'Expires'} ${formatDate(cert.expiration_date, { year: 'numeric', month: 'short' })}`}
                      </p>
                    )}
                    {certSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {certSkills.map((s) => <SkillBadge key={s.id} skill={s} size="sm" />)}
                        {(cert.skill_ids?.length || 0) > 4 && (
                          <span className="text-xs text-muted-foreground self-center">+{(cert.skill_ids?.length || 0) - 4} more</span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
