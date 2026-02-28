'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavBarWrapper } from '@/components/admin/navbar-wrapper';
import { SkillBadge } from '@/components/portfolio/skill-badge';
import { Project, Skill, ProjectCategory } from '@/lib/models/portfolio';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

interface ProjectsData {
  projects: Project[];
  skills: Skill[];
  projectCategories: ProjectCategory[];
}

export function ProjectsPageClient() {
  const [data, setData] = useState<ProjectsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((portfolioData) => {
        setData({
          projects: portfolioData.projects.filter((p: Project) => p.is_published),
          skills: portfolioData.skills,
          projectCategories: portfolioData.projectCategories,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load projects:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen">
        <NavBarWrapper />
        <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen">
        <NavBarWrapper />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-center text-muted-foreground">Failed to load projects.</p>
        </div>
      </main>
    );
  }

  // Filter projects
  const filteredProjects = data.projects.filter((project) => {
    const matchesSearch =
      !searchQuery ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.short_description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory || project.category_ids?.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  // Filter categories to only show those that have projects
  const activeCategories = data.projectCategories.filter((category) =>
    data.projects.some((project) => project.category_ids?.includes(category.id))
  );

  // Count projects per category
  const categoryCounts = activeCategories.reduce((acc, category) => {
    acc[category.id] = data.projects.filter((project) =>
      project.category_ids?.includes(category.id)
    ).length;
    return acc;
  }, {} as Record<number, number>);

  return (
    <main className="min-h-screen">
      <NavBarWrapper />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects</h1>
          <p className="text-xl text-muted-foreground">
            Explore my portfolio of {data.projects.length} project{data.projects.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {activeCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All Projects ({data.projects.length})
              </Button>
              {activeCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name} ({categoryCounts[category.id]})
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const projectSkills = data.skills.filter((s) => project.skill_ids?.includes(s.id));
              const projectCategories = data.projectCategories.filter((c) =>
                project.category_ids?.includes(c.id)
              );

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group block rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Featured Image */}
                  <div className="relative h-48 bg-muted overflow-hidden">
                    <Image
                      src={project.featured_image}
                      alt={project.title}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      {project.short_description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.short_description}
                        </p>
                      )}
                    </div>

                    {/* Categories */}
                    {projectCategories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {projectCategories.map((cat) => (
                          <Badge key={cat.id} variant="outline" className="text-xs">
                            {cat.name}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Skills */}
                    {projectSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {projectSkills.slice(0, 5).map((skill) => (
                          <SkillBadge key={skill.id} skill={skill} size="sm" />
                        ))}
                        {projectSkills.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{projectSkills.length - 5} more
                          </Badge>
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
