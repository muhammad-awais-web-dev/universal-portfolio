'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavBarWrapper } from '@/components/admin/navbar-wrapper';
import { SkillBadge } from '@/components/portfolio/skill-badge';
import { Project, Skill, ProjectCategory } from '@/lib/models/portfolio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { formatDate } from '@/lib/utils/portfolio-helpers';
import { SocialShare } from '@/components/portfolio/social-share';

interface ProjectData {
  project: Project | null;
  skills: Skill[];
  projectCategories: ProjectCategory[];
}

interface ProjectDetailClientProps {
  slug: string;
}

export function ProjectDetailClient({ slug }: ProjectDetailClientProps) {
  
  const [data, setData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((portfolioData) => {
        const project = portfolioData.projects.find(
          (p: Project) => p.slug === slug && p.is_published
        );

        if (!project) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setData({
          project,
          skills: portfolioData.skills,
          projectCategories: portfolioData.projectCategories,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load project:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen">
        <NavBarWrapper />
        <div className="max-w-5xl mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !data?.project) {
    return (
      <main className="min-h-screen">
        <NavBarWrapper />
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Project Not Found</h1>
            <p className="text-muted-foreground">The project you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Button asChild>
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const { project } = data;
  const projectSkills = data.skills.filter((s) => project.skill_ids?.includes(s.id));
  const projectCategories = data.projectCategories.filter((c) =>
    project.category_ids?.includes(c.id)
  );

  return (
    <main className="min-h-screen">
      <NavBarWrapper />
      
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {projectCategories.map((cat) => (
              <Badge key={cat.id} variant="outline">
                {cat.name}
              </Badge>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
          
          {project.short_description && (
            <p className="text-xl text-muted-foreground mb-6">{project.short_description}</p>
          )}

          {/* Action Buttons + Share */}
          <div className="flex flex-wrap items-center gap-3">
            {project.live_url && (
              <Button asChild>
                <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Live
                </a>
              </Button>
            )}
            {project.repo_url && (
              <Button asChild variant="outline">
                <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  View Source
                </a>
              </Button>
            )}
            <div className="ml-auto">
              <SocialShare title={project.title} />
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-96 rounded-lg overflow-hidden bg-muted mb-8">
          <Image
            src={project.featured_image}
            alt={project.title}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Skills Used */}
        {projectSkills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Technologies Used</h2>
            <div className="flex flex-wrap gap-2">
              {projectSkills.map((skill) => (
                <SkillBadge key={skill.id} skill={skill} size="md" />
              ))}
            </div>
          </div>
        )}

        {/* Description / Body */}
        {project.body_html && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">About This Project</h2>
            <div
              className="rich-content"
              dangerouslySetInnerHTML={{ __html: project.body_html }}
            />
          </div>
        )}

        {/* Image Gallery */}
        {project.image_gallery && project.image_gallery.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.image_gallery.map((imageUrl, index) => (
                <div key={index} className="relative h-64 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={imageUrl}
                    alt={`${project.title} screenshot ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        {project.published_at && (
          <div className="border-t pt-6 mt-8 text-sm text-muted-foreground">
            <p>Published on {formatDate(project.published_at)}</p>
          </div>
        )}
      </div>
    </main>
  );
}



