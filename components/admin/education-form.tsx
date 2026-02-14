"use client";

import { useState } from "react";
import { usePortfolio } from "./portfolio-context";
import { EducationFormData } from "@/lib/models/portfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, X } from "lucide-react";

export function EducationForm() {
  const { addEducation, updateEducation, education, deleteEducation, skills, projects } = usePortfolio();
  const [formData, setFormData] = useState<EducationFormData>({
    institution: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: null,
    is_current: false,
    grade: "",
    description: "",
    body_html: "",
    skill_ids: [],
    project_ids: [],
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.institution) {
      alert("Institution is required");
      return;
    }
    if (editingId) {
      await updateEducation(editingId, formData);
      setEditingId(null);
    } else {
      await addEducation(formData);
    }
    setFormData({
      institution: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: null,
      is_current: false,
      grade: "",
      description: "",
      body_html: "",
      skill_ids: [],
      project_ids: [],
    });
  };

  const handleEdit = (edu: typeof education[0]) => {
    setFormData({
      institution: edu.institution,
      degree: edu.degree || "",
      field_of_study: edu.field_of_study || "",
      start_date: edu.start_date || "",
      end_date: edu.end_date || null,
      is_current: edu.is_current,
      grade: edu.grade || "",
      description: edu.description || "",
      body_html: edu.body_html || "",
      skill_ids: edu.skill_ids || [],
      project_ids: edu.project_ids || [],
    });
    setEditingId(edu.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setFormData({
      institution: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: null,
      is_current: false,
      grade: "",
      description: "",
      body_html: "",
      skill_ids: [],
      project_ids: [],
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Education" : "Add New Education"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="institution">Institution *</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) =>
                  setFormData({ ...formData, institution: e.target.value })
                }
                placeholder="Stanford University"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="degree">Degree</Label>
                <Input
                  id="degree"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="Bachelor of Science"
                />
              </div>
              <div>
                <Label htmlFor="field_of_study">Field of Study</Label>
                <Input
                  id="field_of_study"
                  value={formData.field_of_study}
                  onChange={(e) =>
                    setFormData({ ...formData, field_of_study: e.target.value })
                  }
                  placeholder="Computer Science"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edu-start_date">Start Date</Label>
                <Input
                  id="edu-start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edu-end_date">End Date</Label>
                <Input
                  id="edu-end_date"
                  type="date"
                  value={formData.end_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value || null })
                  }
                  disabled={formData.is_current}
                />
              </div>
              <div>
                <Label htmlFor="grade">Grade/GPA</Label>
                <Input
                  id="grade"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  placeholder="3.8/4.0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_current_edu"
                checked={formData.is_current}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    is_current: checked === true,
                    end_date: checked ? null : formData.end_date,
                  })
                }
              />
              <Label htmlFor="is_current_edu" className="cursor-pointer">
                Currently studying here
              </Label>
            </div>

            <div>
              <Label htmlFor="edu_body_html">Body HTML</Label>
              <textarea
                id="edu_body_html"
                value={formData.body_html}
                onChange={(e) =>
                  setFormData({ ...formData, body_html: e.target.value })
                }
                placeholder="<p>Detailed education information with HTML...</p>"
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

            <div>
              <Label>Skills Learned</Label>
              <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[60px]">
                {skills.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No skills available. Add skills first.
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

            <div>
              <Label>Related Projects</Label>
              <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[60px]">
                {projects.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No projects available. Add projects first.
                  </p>
                ) : (
                  projects.map((project) => (
                    <label
                      key={project.id}
                      className="flex items-center gap-2 px-3 py-1.5 border rounded-full cursor-pointer hover:bg-accent"
                    >
                      <Checkbox
                        checked={formData.project_ids?.includes(project.id)}
                        onCheckedChange={(checked) => {
                          const currentProjects = formData.project_ids || [];
                          setFormData({
                            ...formData,
                            project_ids: checked
                              ? [...currentProjects, project.id]
                              : currentProjects.filter((id) => id !== project.id),
                          });
                        }}
                      />
                      <span className="text-sm">{project.title}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? "Update Education" : "Add Education"}
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

      {/* Education List */}
      <Card>
        <CardHeader>
          <CardTitle>Education ({education.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {education.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No education entries yet. Add your first one above.
            </p>
          ) : (
            <div className="space-y-3">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="group relative flex items-start justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{edu.institution}</h3>
                    <p className="text-sm font-medium text-muted-foreground mt-1">
                      {edu.degree}
                      {edu.degree && edu.field_of_study && " in "}
                      {edu.field_of_study}
                    </p>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      {(edu.start_date || edu.end_date) && (
                        <span>
                          {edu.start_date &&
                            new Date(edu.start_date).toLocaleDateString()}
                          {" - "}
                          {edu.is_current
                            ? "Present"
                            : edu.end_date
                            ? new Date(edu.end_date).toLocaleDateString()
                            : ""}
                        </span>
                      )}
                      {edu.grade && <span>Grade: {edu.grade}</span>}
                    </div>
                    {edu.skill_ids && edu.skill_ids.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {edu.skill_ids.map((skillId) => {
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
                    {edu.description && (
                      <p className="text-sm mt-2 text-muted-foreground">
                        {edu.description}
                      </p>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(edu)}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => await deleteEducation(edu.id)}
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
