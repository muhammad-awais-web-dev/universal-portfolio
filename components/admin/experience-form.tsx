"use client";

import { useState } from "react";
import { usePortfolio } from "./portfolio-context";
import { ExperienceFormData } from "@/lib/models/portfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ExperienceForm() {
  const { addExperience, experiences, deleteExperience, skills, projects } =
    usePortfolio();
  const [formData, setFormData] = useState<ExperienceFormData>({
    company: "",
    title: "",
    start_date: "",
    end_date: null,
    location: "",
    description: "",
    is_current: false,
    skill_ids: [],
    project_ids: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.title) {
      alert("Company and Job Title are required");
      return;
    }
    addExperience(formData);
    setFormData({
      company: "",
      title: "",
      start_date: "",
      end_date: null,
      location: "",
      description: "",
      is_current: false,
      skill_ids: [],
      project_ids: [],
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Acme Inc."
                  required
                />
              </div>
              <div>
                <Label htmlFor="exp-title">Job Title *</Label>
                <Input
                  id="exp-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Senior Software Engineer"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="San Francisco, CA"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value || null })
                  }
                  disabled={formData.is_current}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_current"
                checked={formData.is_current}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    is_current: checked === true,
                    end_date: checked ? null : formData.end_date,
                  })
                }
              />
              <Label htmlFor="is_current" className="cursor-pointer">
                I currently work here
              </Label>
            </div>

            <div>
              <Label htmlFor="exp-description">Description</Label>
              <textarea
                id="exp-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Key responsibilities and achievements..."
                className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
              />
            </div>

            <div>
              <Label>Skills Used</Label>
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

            <Button type="submit" className="w-full">
              Add Experience
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Experience List */}
      <Card>
        <CardHeader>
          <CardTitle>Experience ({experiences.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {experiences.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No experience entries yet. Add your first one above.
            </p>
          ) : (
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{exp.title}</h3>
                      {exp.is_current && (
                        <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mt-1">
                      {exp.company}
                      {exp.location && ` • ${exp.location}`}
                    </p>
                    {(exp.start_date || exp.end_date) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {exp.start_date && new Date(exp.start_date).toLocaleDateString()}
                        {" - "}
                        {exp.is_current
                          ? "Present"
                          : exp.end_date
                          ? new Date(exp.end_date).toLocaleDateString()
                          : ""}
                      </p>
                    )}
                    {exp.description && (
                      <p className="text-sm mt-2 text-muted-foreground">
                        {exp.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteExperience(exp.id)}
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
