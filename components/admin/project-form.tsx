"use client";

import { useState } from "react";
import { usePortfolio } from "./portfolio-context";
import { ProjectFormData } from "@/lib/models/portfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Pencil } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { MultipleImageUpload } from "@/components/ui/multiple-image-upload";

export function ProjectForm() {
  const { addProject, updateProject, projects, deleteProject, skills, projectCategories, addProjectCategory } = usePortfolio();
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    slug: "",
    short_description: "",
    description: "",
    body_html: "",
    live_url: "",
    repo_url: "",
    featured_image: "",
    image_gallery: [],
    is_published: false,
    skill_ids: [],
    category_ids: [],
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.featured_image) {
      alert("Title, Slug, and Featured Image are required");
      return;
    }
    if (editingId) {
      updateProject(editingId, formData);
      setEditingId(null);
    } else {
      addProject(formData);
    }
    // Reset form
    setFormData({
      title: "",
      slug: "",
      short_description: "",
      description: "",
      body_html: "",
      live_url: "",
      repo_url: "",
      featured_image: "",
      image_gallery: [],
      is_published: false,
      skill_ids: [],
      category_ids: [],
    });
    setImagePreview(null);
  };

  const handleEdit = (project: typeof projects[0]) => {
    setFormData({
      title: project.title,
      slug: project.slug,
      short_description: project.short_description || "",
      description: project.description || "",
      body_html: project.body_html || "",
      live_url: project.live_url || "",
      repo_url: project.repo_url || "",
      featured_image: project.featured_image,
      image_gallery: project.image_gallery || [],
      is_published: project.is_published,
      skill_ids: project.skill_ids || [],
      category_ids: project.category_ids || [],
    });
    setImagePreview(project.featured_image);
    setEditingId(project.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setFormData({
      title: "",
      slug: "",
      short_description: "",
      description: "",
      body_html: "",
      live_url: "",
      repo_url: "",
      featured_image: "",
      image_gallery: [],
      is_published: false,
      skill_ids: [],
      category_ids: [],
    });
    setImagePreview(null);
    setEditingId(null);
  };

  const toggleCategory = (categoryId: number) => {
    const currentIds = formData.category_ids || [];
    if (currentIds.includes(categoryId)) {
      setFormData({
        ...formData,
        category_ids: currentIds.filter((id) => id !== categoryId),
      });
    } else {
      setFormData({
        ...formData,
        category_ids: [...currentIds, categoryId],
      });
    }
  };

  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      addProjectCategory({ name: newCategoryName.trim() });
      setNewCategoryName("");
      setShowNewCategory(false);
    }
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
          <CardTitle>{editingId ? "Edit Project" : "Add New Project"}</CardTitle>
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
              <Label htmlFor="featured_image">Featured Image *</Label>
              <ImageUpload
                value={formData.featured_image}
                onChange={(url, publicId) => {
                  setFormData({ ...formData, featured_image: url });
                }}
                onDelete={() => {
                  setFormData({ ...formData, featured_image: "" });
                }}
                folder="portfolio/projects"
                publicIdPrefix={formData.slug ? `project_${formData.slug}` : "project"}
                aspectRatio="16:9"
                maxSize={10}
              />
            </div>

            <div>
              <Label htmlFor="image_gallery">Image Gallery (Optional)</Label>
              <MultipleImageUpload
                images={formData.image_gallery || []}
                onChange={(images) => setFormData({ ...formData, image_gallery: images })}
                folder="portfolio/projects/gallery"
                publicIdPrefix={formData.slug ? `project_${formData.slug}_gallery` : "project_gallery"}
                maxImages={10}
              />
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
              <Label htmlFor="body_html">Body HTML</Label>
              <textarea
                id="body_html"
                value={formData.body_html}
                onChange={(e) =>
                  setFormData({ ...formData, body_html: e.target.value })
                }
                placeholder="<p>Detailed project description with HTML...</p>"
                className="w-full min-h-[150px] px-3 py-2 text-sm rounded-md border border-input bg-background font-mono"
              />
              {formData.body_html && (
                <div className="mt-2">
                  <Label className="text-xs text-muted-foreground">Live Preview:</Label>
                  <div
                    className="mt-1 p-3 border rounded-md bg-muted/30 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: formData.body_html }}
                  />
                </div>
              )}
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
              <Label>Categories (select multiple)</Label>
              <div className="border rounded-md p-4 space-y-2 mt-2">
                {projectCategories.length === 0 && !showNewCategory && (
                  <p className="text-sm text-muted-foreground">
                    No categories yet. Add one below.
                  </p>
                )}
                {projectCategories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`proj-category-${category.id}`}
                      checked={formData.category_ids?.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <Label
                      htmlFor={`proj-category-${category.id}`}
                      className="cursor-pointer font-normal"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
                
                {showNewCategory ? (
                  <div className="flex items-center gap-2 pt-2">
                    <Input
                      placeholder="New category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddNewCategory();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddNewCategory}
                    >
                      Add
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setShowNewCategory(false);
                        setNewCategoryName("");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewCategory(true)}
                    className="w-full mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                )}
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

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? "Update Project" : "Add Project"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              )}
            </div>
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
                  className="group relative flex items-start gap-4 p-4 border rounded-lg hover:border-primary/50 transition-colors"
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
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(project)}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteProject(project.id)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
