'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeroSection } from '@/components/portfolio/hero-section';
import { ContactForm } from '@/components/portfolio/contact-form';
import { SkillBadge } from '@/components/portfolio/skill-badge';
import { PortfolioData, filterPublishedData, getDateRange, formatDate } from '@/lib/utils/portfolio-helpers';
import { NavBarWrapper } from '@/components/admin/navbar-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';

const VISIBLE_LIMIT = 6;

interface PublishedPortfolioProps {
  isAdmin: boolean;
  isEmailConfigured?: boolean;
}

export function PublishedPortfolio({ isAdmin, isEmailConfigured = false }: PublishedPortfolioProps) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((portfolioData) => {
        setData(filterPublishedData(portfolioData, isAdmin));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAdmin]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load portfolio data.</p>
      </main>
    );
  }

  const projects = data.projects || [];
  const experiences = data.experiences || [];
  const education = data.education || [];
  const certifications = data.certifications || [];
  const testimonials = data.testimonials || [];

  return (
    <main className="min-h-screen flex flex-col">
      <NavBarWrapper />

      {/* Hero */}
      <HeroSection profile={data.profile} />

      <div className="flex-1">

        {/* ── Projects ──────────────────────────────────────────── */}
        {projects.length > 0 && (
          <section className="border-t">
            <div className="max-w-5xl mx-auto px-4 py-16">
              <SectionHeader title="Projects" count={projects.length} href="/projects" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
                {projects.slice(0, VISIBLE_LIMIT).map((project) => {
                  const cats = (data.projectCategories || []).filter((c) => project.category_ids?.includes(c.id));
                  return (
                    <Link key={project.id} href={`/projects/${project.slug}`}
                      className="group border rounded-lg overflow-hidden hover:border-foreground/30 transition-colors bg-card flex flex-col">
                      {project.featured_image && (
                        <div className="relative h-44 bg-muted shrink-0">
                          <Image src={project.featured_image} alt={project.title} fill className="object-cover" />
                        </div>
                      )}
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {cats.slice(0, 2).map((c) => (
                            <Badge key={c.id} variant="outline" className="text-xs">{c.name}</Badge>
                          ))}
                        </div>
                        <h3 className="font-semibold group-hover:underline mb-1 leading-snug">{project.title}</h3>
                        {project.short_description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{project.short_description}</p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
              {projects.length > VISIBLE_LIMIT && (
                <div className="mt-8 text-center">
                  <Button asChild variant="outline">
                    <Link href="/projects">View all {projects.length} projects <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Experience ────────────────────────────────────────── */}
        {experiences.length > 0 && (
          <section className="border-t bg-muted/20">
            <div className="max-w-5xl mx-auto px-4 py-16">
              <SectionHeader title="Experience" count={experiences.length} href="/experience" />
              <div className="mt-8 space-y-4">
                {experiences.slice(0, VISIBLE_LIMIT).map((exp) => {
                  const expSkills = (data.skills || []).filter((s) => exp.skill_ids?.includes(s.id)).slice(0, 5);
                  return (
                    <Link key={exp.id} href={`/experience/${exp.id}`}
                      className="group flex gap-4 border rounded-lg p-5 bg-card hover:border-foreground/30 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <p className="font-semibold group-hover:underline">{exp.title}</p>
                            <p className="text-sm text-muted-foreground">{exp.company}</p>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                            {exp.is_current && <Badge variant="outline" className="text-green-600 border-green-600 text-xs">Current</Badge>}
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{getDateRange(exp.start_date, exp.end_date, exp.is_current)}</span>
                            {exp.location && <span className="hidden sm:flex items-center gap-1"><MapPin className="h-3 w-3" />{exp.location}</span>}
                          </div>
                        </div>
                        {expSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {expSkills.map((s) => <SkillBadge key={s.id} skill={s} size="sm" />)}
                            {(exp.skill_ids?.length || 0) > 5 && <span className="text-xs text-muted-foreground self-center">+{(exp.skill_ids?.length || 0) - 5}</span>}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
              {experiences.length > VISIBLE_LIMIT && (
                <div className="mt-8 text-center">
                  <Button asChild variant="outline">
                    <Link href="/experience">View all {experiences.length} experience entries <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Education ─────────────────────────────────────────── */}
        {education.length > 0 && (
          <section className="border-t">
            <div className="max-w-5xl mx-auto px-4 py-16">
              <SectionHeader title="Education" count={education.length} href="/education" />
              <div className="mt-8 space-y-4">
                {education.slice(0, VISIBLE_LIMIT).map((edu) => (
                  <Link key={edu.id} href={`/education/${edu.id}`}
                    className="group flex items-start justify-between gap-4 border rounded-lg p-5 bg-card hover:border-foreground/30 transition-colors">
                    <div>
                      <p className="font-semibold group-hover:underline">
                        {edu.degree}{edu.field_of_study ? ` in ${edu.field_of_study}` : ''}
                      </p>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {edu.is_current && <Badge variant="outline" className="text-green-600 border-green-600 text-xs">Current</Badge>}
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />{getDateRange(edu.start_date, edu.end_date, edu.is_current)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              {education.length > VISIBLE_LIMIT && (
                <div className="mt-8 text-center">
                  <Button asChild variant="outline">
                    <Link href="/education">View all {education.length} education entries <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Certifications ────────────────────────────────────── */}
        {certifications.length > 0 && (
          <section className="border-t bg-muted/20">
            <div className="max-w-5xl mx-auto px-4 py-16">
              <SectionHeader title="Certifications" count={certifications.length} href="/certifications" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
                {certifications.slice(0, VISIBLE_LIMIT).map((cert) => {
                  const isExpired = cert.expiration_date && new Date(cert.expiration_date) < new Date();
                  return (
                    <Link key={cert.id} href={`/certifications/${cert.id}`}
                      className="group border rounded-lg p-5 bg-card hover:border-foreground/30 transition-colors flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold group-hover:underline text-sm leading-snug">{cert.title}</h3>
                        {cert.is_active !== false && !isExpired
                          ? <Badge variant="outline" className="text-green-600 border-green-600 text-xs shrink-0">Active</Badge>
                          : <Badge variant="outline" className="text-muted-foreground text-xs shrink-0">Expired</Badge>
                        }
                      </div>
                      {cert.authority && <p className="text-xs text-muted-foreground">{cert.authority}</p>}
                      {cert.issued_date && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(cert.issued_date, { year: 'numeric', month: 'short' })}
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
              {certifications.length > VISIBLE_LIMIT && (
                <div className="mt-8 text-center">
                  <Button asChild variant="outline">
                    <Link href="/certifications">View all {certifications.length} certifications <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Testimonials ──────────────────────────────────────── */}
        {testimonials.length > 0 && (
          <section className="border-t">
            <div className="max-w-5xl mx-auto px-4 py-16">
              <div className="flex items-end justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Testimonials</h2>
                  <p className="text-sm text-muted-foreground mt-1">{testimonials.length} {testimonials.length === 1 ? 'testimonial' : 'testimonials'}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {testimonials.map((t) => (
                  <div key={t.id} className="border rounded-lg p-5 bg-card flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">&ldquo;{t.comment}&rdquo;</p>
                    <div className="flex items-center gap-3 pt-2 border-t">
                      {t.image_url ? (
                        <Image src={t.image_url} alt={t.name} width={36} height={36} className="rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0 text-sm font-semibold">
                          {t.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{t.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {t.position}{t.company ? `, ${t.company}` : ''}
                        </p>
                      </div>
                      {t.platform_name && (
                        <span className="ml-auto shrink-0 text-xs text-muted-foreground">{t.platform_name}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Contact ───────────────────────────────────────────── */}
        {isEmailConfigured && (
          <section className="border-t">
            <div className="max-w-3xl mx-auto px-4 py-16">
              <ContactForm />
            </div>
          </section>
        )}

        {!isEmailConfigured && data.profile?.email && (
          <section className="border-t bg-muted/20">
            <div className="max-w-3xl mx-auto px-4 py-16 text-center">
              <h2 className="text-3xl font-bold mb-4">Let&apos;s Work Together</h2>
              <p className="text-lg text-muted-foreground mb-6">Interested in collaboration or have a project in mind?</p>
              <Button asChild size="lg">
                <a href={`mailto:${data.profile.email}`}>Get in Touch</a>
              </Button>
            </div>
          </section>
        )}
      </div>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t py-6 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-muted-foreground">
            {data.profile?.full_name || 'Portfolio'} &copy; {new Date().getFullYear()}
          </p>
          <p className="text-xs text-muted-foreground/60">
            Built with{' '}
            <a
              href="https://github.com/muhammad-awais-web-dev/universal-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-3 hover:text-muted-foreground transition-colors"
            >
              universal-portfolio
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}

function SectionHeader({ title, count, href }: { title: string; count: number; href: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{count} {count === 1 ? title.slice(0, -1) : title.toLowerCase()}</p>
      </div>
      <Link href={href} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors shrink-0">
        View all <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
