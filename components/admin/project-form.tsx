"use client";

import { useState } from "react";
import { usePortfolio } from "./portfolio-context";
import { ProjectFormData } from "@/lib/models/portfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProjectForm() {
  const { addProject, projects, deleteProject, skills } = usePortfolio();
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    slug: "",
    short_description: "",
    description: "",
    live_url: "",
    repo_url: "",
    featured_image: "",
    is_published: false,
    skill_ids: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.featured_image) {
      alert("Title, Slug, and Featured Image are required");
      return;
    }
    addProject(formData);
    // Reset form
    setFormData({
      title: "",
      slug: "",
      short_description: "",
      description: "",
      live_url: "",
      repo_url: "",
      featured_image: "",
      is_published: false,
      skill_ids: [],
    });
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData({ ...formData, slug });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="My Awesome Project"
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug *</Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="my-awesome-project"
                    required
                  />
                  <Button type="button" onClick={generateSlug} variant="outline">
                    Generate
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="featured_image">Featured Image URL *</Label>
              <Input
                id="featured_image"
                type="url"
                value={formData.featured_image}
                onChange={(e) =>
                  setFormData({ ...formData, featured_image: e.target.value })
                }
                placeholder="https://res.cloudinary.com/..."
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload to Cloudinary and paste the URL here
              </p>
            </div>

            <div>
              <Label htmlFor="short_description">Short Description</Label>
              <Input
                id="short_description"
                value={formData.short_description}
                onChange={(e) =>
                  setFormData({ ...formData, short_description: e.target.value })
                }
                placeholder="A brief tagline for the project"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Detailed project description..."
                className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="live_url">Live URL</Label>
                <Input
                  id="live_url"
                  type="url"
                  value={formData.live_url}
                  onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label htmlFor="repo_url">Repository URL</Label>
                <Input
                  id="repo_url"
                  type="url"
                  value={formData.repo_url}
                  onChange={(e) => setFormData({ ...formData, repo_url: e.target.value })}
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>

            <div>
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[80px]">
                {skills.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No skills available. Add skills first in the Skills tab.
                  </p>
                ) : (
                  skills.map((skill) => (
                    <label
                      key={skill.id}
                      className="flex items-center gap-2 px-3 py-1.5 border rounded-full cursor-pointer hover:bg-accent"
                    >
                      <Checkbox
                        checked={formData.skill_ids?.includes(skill.id)}
                        onCheckedChange={(checked) => {
                          const currentSkills = formData.skill_ids || [];
                          setFormData({
                            ...formData,
                            skill_ids: checked
                              ? [...currentSkills, skill.id]
                              : currentSkills.filter((id) => id !== skill.id),
                          });
                        }}
                      />
                      <span className="text-sm">{skill.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_published: checked === true })
                }
              />
              <Label htmlFor="is_published" className="cursor-pointer">
                Published
              </Label>
            </div>

            <Button type="submit" className="w-full">
              Add Project
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Projects List */}
      <Card>
        <CardHeader>
          <CardTitle>Projects ({projects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No projects yet. Add your first project above.
            </p>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-start gap-4 p-4 border rounded-lg"
                >
                  {project.featured_image && (
                    <img
                      src={project.featured_image}
                      alt={project.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{project.title}</h3>
                      {project.is_published && (
                        <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                          Published
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.short_description}
                    </p>
                    {project.skill_ids && project.skill_ids.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.skill_ids.map((skillId) => {
                          const skill = skills.find((s) => s.id === skillId);
                          return skill ? (
                            <span
                              key={skillId}
                              className="px-2 py-0.5 text-xs bg-secondary rounded-full"
                            >
                              {skill.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Live Demo
                        </a>
                      )}
                      {project.repo_url && (
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Repository
                        </a>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteProject(project.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
