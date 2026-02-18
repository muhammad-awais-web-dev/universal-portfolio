'use client';

import { useEffect, useState } from 'react';
import { HeroSection } from '@/components/portfolio/hero-section';
import { SectionOverview } from '@/components/portfolio/section-overview';
import { ContactForm } from '@/components/portfolio/contact-form';
import { PortfolioData, filterPublishedData } from '@/lib/utils/portfolio-helpers';
import { Briefcase, GraduationCap, Award, FolderGit2 } from 'lucide-react';
import { NavBarWrapper } from '@/components/admin/navbar-wrapper';

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
        const filtered = filterPublishedData(portfolioData, isAdmin);
        setData(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load portfolio:', err);
        setLoading(false);
      });
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
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load portfolio data.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <NavBarWrapper />
      
      {/* Hero Section */}
      <HeroSection profile={data.profile} />

      {/* Overview Sections */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Projects - Only show if there are projects */}
          {data.projects && data.projects.length > 0 && (
            <SectionOverview
              title="Projects"
              description="Explore my portfolio of projects showcasing development skills and innovation."
              icon={FolderGit2}
              count={data.projects.length}
              href="/projects"
              items={
                <div className="space-y-2">
                  {data.projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="text-sm">
                      <p className="font-medium truncate">{project.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {project.short_description}
                      </p>
                    </div>
                  ))}
                </div>
              }
            />
          )}

          {/* Skills section removed as per requirements */}

          {/* Experience - Only show if there are experiences */}
          {data.experiences && data.experiences.length > 0 && (
            <SectionOverview
              title="Experience"
              description="My professional work experience and career journey."
              icon={Briefcase}
              count={data.experiences.length}
              href="/experience"
              items={
                <div className="space-y-2">
                  {data.experiences.slice(0, 2).map((exp) => (
                    <div key={exp.id} className="text-sm">
                      <p className="font-medium truncate">{exp.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{exp.company}</p>
                    </div>
                  ))}
                </div>
              }
            />
          )}

          {/* Education - Only show if there is education */}
          {data.education && data.education.length > 0 && (
            <SectionOverview
              title="Education"
              description="My educational background and academic achievements."
              icon={GraduationCap}
              count={data.education.length}
              href="/education"
              items={
                <div className="space-y-2">
                  {data.education.slice(0, 2).map((edu) => (
                    <div key={edu.id} className="text-sm">
                      <p className="font-medium truncate">{edu.degree}</p>
                      <p className="text-xs text-muted-foreground truncate">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              }
            />
          )}

          {/* Certifications - Only show if there are certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <SectionOverview
              title="Certifications"
              description="Professional certifications and credentials that validate my expertise."
              icon={Award}
              count={data.certifications.length}
              href="/certifications"
              items={
                <div className="space-y-2">
                  {data.certifications.slice(0, 2).map((cert) => (
                    <div key={cert.id} className="text-sm">
                      <p className="font-medium truncate">{cert.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{cert.authority}</p>
                    </div>
                  ))}
                </div>
              }
            />
          )}
        </div>
      </section>

      {/* Contact Form - Only show if email is configured */}
      {isEmailConfigured && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <ContactForm />
        </section>
      )}

      {/* Footer with Contact CTA - Only show if contact form is not available */}
      {!isEmailConfigured && data.profile?.email && (
        <section className="bg-muted/30 py-16 mt-12">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Let's Work Together</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Interested in collaboration or have a project in mind?
            </p>
            <a
              href={`mailto:${data.profile.email}`}
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </section>
      )}
    </main>
  );
}
