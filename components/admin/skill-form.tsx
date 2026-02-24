"use client";

import { useState, useMemo } from "react";
import { usePortfolio } from "./portfolio-context";
import { SkillFormData } from "@/lib/models/portfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, Pencil, Search } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

export function SkillForm() {
  const { 
    addSkill, 
    updateSkill, 
    skills, 
    deleteSkill, 
    skillCategories, 
    addSkillCategory,
    projects,
    certifications,
    education,
    experiences
  } = usePortfolio();
  const [formData, setFormData] = useState<SkillFormData>({
    name: "",
    category_ids: [],
    logo_url: "",
    body_html: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleSkillsCount, setVisibleSkillsCount] = useState(10);

  // Calculate skill usage counts
  const skillUsageCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    
    skills.forEach(skill => {
      counts[skill.id] = 0;
      
      // Count in projects
      projects.forEach(project => {
        if (project.skill_ids?.includes(skill.id)) {
          counts[skill.id]++;
        }
      });
      
      // Count in certifications
      certifications.forEach(cert => {
        if (cert.skill_ids?.includes(skill.id)) {
          counts[skill.id]++;
        }
      });
      
      // Count in education
      education.forEach(edu => {
        if (edu.skill_ids?.includes(skill.id)) {
          counts[skill.id]++;
        }
      });
      
      // Count in experiences
      experiences.forEach(exp => {
        if (exp.skill_ids?.includes(skill.id)) {
          counts[skill.id]++;
        }
      });
    });
    
    return counts;
  }, [skills, projects, certifications, education, experiences]);

  // Sort skills by usage count (highest first)
  const sortedAllSkills = useMemo(() => {
    return [...skills]
      .sort((a, b) => (skillUsageCounts[b.id] || 0) - (skillUsageCounts[a.id] || 0));
  }, [skills, skillUsageCounts]);

  // Get visible skills based on current count
  const visibleSortedSkills = useMemo(() => {
    return sortedAllSkills.slice(0, visibleSkillsCount);
  }, [sortedAllSkills, visibleSkillsCount]);

  // Filter skills by search query
  const filteredSkills = useMemo(() => {
    if (!searchQuery.trim()) return visibleSortedSkills;
    
    const query = searchQuery.toLowerCase().trim();
    return sortedAllSkills.filter(skill => 
      skill.name.toLowerCase().includes(query)
    );
  }, [sortedAllSkills, visibleSortedSkills, searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Skill name is required");
      return;
    }
    
    // Check for duplicate skill name (case-insensitive)
    const normalizedName = formData.name.trim().toLowerCase();
    const duplicate = skills.find(
      s => s.name.toLowerCase() === normalizedName && s.id !== editingId
    );
    
    if (duplicate) {
      alert(`A skill named "${duplicate.name}" already exists. Please use a different name.`);
      return;
    }
    
    if (editingId) {
      await updateSkill(editingId, formData);
      setEditingId(null);
    } else {
      await addSkill(formData);
    }
    setFormData({ name: "", category_ids: [], logo_url: "", body_html: "" });
  };

  const handleEdit = (skill: typeof skills[0]) => {
    setFormData({
      name: skill.name,
      category_ids: skill.category_ids || [],
      logo_url: skill.logo_url || "",
      body_html: skill.body_html || "",
    });
    setEditingId(skill.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setFormData({ name: "", category_ids: [], logo_url: "", body_html: "" });
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

  const handleAddNewCategory = async () => {
    if (newCategoryName.trim()) {
      await addSkillCategory({ name: newCategoryName.trim() });
      setNewCategoryName("");
      setShowNewCategory(false);
    }
  };

  // Get category names for a skill
  const getCategoryNames = (categoryIds?: number[]) => {
    if (!categoryIds || categoryIds.length === 0) return ["Uncategorized"];
    return categoryIds
      .map((id) => skillCategories.find((c) => c.id === id)?.name)
      .filter(Boolean) as string[];
  };

  // Group filtered skills by their categories
  const skillsByCategory = filteredSkills.reduce((acc, skill) => {
    const categories = getCategoryNames(skill.category_ids);
    categories.forEach((cat) => {
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
    });
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Skill" : "Add New Skill"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="skill-name">Skill Name *</Label>
              <Input
                id="skill-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="React"
                required
              />
            </div>

            <div>
              <Label>Categories (select multiple)</Label>
              <div className="border rounded-md p-4 space-y-2 mt-2">
                {skillCategories.length === 0 && !showNewCategory && (
                  <p className="text-sm text-muted-foreground">
                    No categories yet. Add one below.
                  </p>
                )}
                {skillCategories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={formData.category_ids?.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
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
              <Label htmlFor="logo_url">Skill Logo (optional)</Label>
              <ImageUpload
                value={formData.logo_url}
                onChange={(url, _publicId) => {
                  setFormData({ ...formData, logo_url: url });
                }}
                onDelete={() => {
                  setFormData({ ...formData, logo_url: "" });
                }}
                folder="portfolio/skills"
                publicIdPrefix={formData.name ? `skill_${formData.name.toLowerCase().replace(/\s+/g, '_')}` : "skill"}
                aspectRatio="1:1"
                maxSize={2}
              />
            </div>

            <div>
              <Label htmlFor="body_html">Body HTML (optional)</Label>
              <textarea
                id="body_html"
                value={formData.body_html}
                onChange={(e) => setFormData({ ...formData, body_html: e.target.value })}
                placeholder="<p>Detailed description with HTML...</p>"
                className="w-full min-h-[120px] px-3 py-2 text-sm rounded-md border border-input bg-background font-mono"
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

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? "Update Skill" : "Add Skill"}
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

      {/* Skills List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Skills ({skills.length} total, showing {searchQuery ? filteredSkills.length : visibleSkillsCount})
            </CardTitle>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredSkills.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {searchQuery ? "No skills found matching your search." : "No skills yet. Add your first skill above."}
            </p>
          ) : (
            <div className="space-y-6">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div key={category}>
                  <h3 className="font-semibold mb-3 text-lg">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => {
                      const usageCount = skillUsageCounts[skill.id] || 0;
                      return (
                        <div key={skill.id} className="group relative">
                          <Badge
                            variant="secondary"
                            className="px-3 py-1.5 pr-20 text-sm"
                          >
                            {skill.logo_url && (
                              <img
                                src={skill.logo_url}
                                alt=""
                                className="w-4 h-4 mr-2 inline-block"
                              />
                            )}
                            {skill.name}
                            <span className="ml-2 text-xs text-muted-foreground font-medium">
                              ({usageCount})
                            </span>
                            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEdit(skill)}
                                className="h-6 w-6 rounded-sm flex items-center justify-center hover:bg-background/80 transition-colors"
                                title="Edit skill"
                              >
                                <Pencil className="h-3 w-3" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (usageCount > 0) {
                                    if (!confirm(`This skill is used in ${usageCount} item(s). Are you sure you want to delete it?`)) {
                                      return;
                                    }
                                  }
                                  await deleteSkill(skill.id);
                                }}
                                className="h-6 w-6 rounded-sm flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                title="Delete skill"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Show More Button */}
          {!searchQuery && sortedAllSkills.length > visibleSkillsCount && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={() => setVisibleSkillsCount(prev => prev + 10)}
              >
                Show More Skills ({sortedAllSkills.length - visibleSkillsCount} remaining)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
