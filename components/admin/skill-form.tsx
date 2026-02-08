"use client";

import { useState } from "react";
import { usePortfolio } from "./portfolio-context";
import { SkillFormData } from "@/lib/models/portfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, Pencil } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

export function SkillForm() {
  const { addSkill, updateSkill, skills, deleteSkill, skillCategories, addSkillCategory } = usePortfolio();
  const [formData, setFormData] = useState<SkillFormData>({
    name: "",
    category_ids: [],
    logo_url: "",
    body_html: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Skill name is required");
      return;
    }
    if (editingId) {
      updateSkill(editingId, formData);
      setEditingId(null);
    } else {
      addSkill(formData);
    }
    setFormData({ name: "", category_ids: [], logo_url: "", body_html: "" });
    setLogoPreview(null);
  };

  const handleEdit = (skill: typeof skills[0]) => {
    setFormData({
      name: skill.name,
      category_ids: skill.category_ids || [],
      logo_url: skill.logo_url || "",
      body_html: skill.body_html || "",
    });
    setLogoPreview(skill.logo_url || null);
    setEditingId(skill.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setFormData({ name: "", category_ids: [], logo_url: "", body_html: "" });
    setLogoPreview(null);
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
      addSkillCategory({ name: newCategoryName.trim() });
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

  // Group skills by their categories
  const skillsByCategory = skills.reduce((acc, skill) => {
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
                onChange={(url, publicId) => {
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
          <CardTitle>Skills ({skills.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {skills.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No skills yet. Add your first skill above.
            </p>
          ) : (
            <div className="space-y-6">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div key={category}>
                  <h3 className="font-semibold mb-3 text-lg">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="group relative">
                        <Badge
                          variant="secondary"
                          className="px-3 py-1.5 pr-16 text-sm"
                        >
                          {skill.logo_url && (
                            <img
                              src={skill.logo_url}
                              alt=""
                              className="w-4 h-4 mr-2 inline-block"
                            />
                          )}
                          {skill.name}
                          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(skill)}
                              className="h-6 w-6 rounded-sm flex items-center justify-center hover:bg-background/80 transition-colors"
                              title="Edit skill"
                            >
                              <Pencil className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => deleteSkill(skill.id)}
                              className="h-6 w-6 rounded-sm flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                              title="Delete skill"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </Badge>
                      </div>
                    ))}
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
