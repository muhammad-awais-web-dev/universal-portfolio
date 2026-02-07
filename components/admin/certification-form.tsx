"use client";

import { useState } from "react";
import { usePortfolio } from "./portfolio-context";
import { CertificationFormData } from "@/lib/models/portfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CertificationForm() {
  const { addCertification, certifications, deleteCertification, skills, projects } =
    usePortfolio();
  const [formData, setFormData] = useState<CertificationFormData>({
    title: "",
    authority: "",
    credential_url: "",
    issued_date: "",
    expiration_date: null,
    featured_image: "",
    is_active: true,
    skill_ids: [],
    project_ids: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.featured_image) {
      alert("Certification title and Featured Image are required");
      return;
    }
    addCertification(formData);
    setFormData({
      title: "",
      authority: "",
      credential_url: "",
      issued_date: "",
      expiration_date: null,
      featured_image: "",
      is_active: true,
      skill_ids: [],
      project_ids: [],
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Certification</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cert-title">Certification Title *</Label>
              <Input
                id="cert-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="AWS Certified Solutions Architect"
                required
              />
            </div>

            <div>
              <Label htmlFor="featured_image_cert">Featured Image URL *</Label>
              <Input
                id="featured_image_cert"
                type="url"
                value={formData.featured_image}
                onChange={(e) =>
                  setFormData({ ...formData, featured_image: e.target.value })
                }
                placeholder="https://res.cloudinary.com/..."
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload certificate/badge image to Cloudinary
              </p>
            </div>

            <div>
              <Label htmlFor="authority">Issuing Authority</Label>
              <Input
                id="authority"
                value={formData.authority}
                onChange={(e) => setFormData({ ...formData, authority: e.target.value })}
                placeholder="Amazon Web Services"
              />
            </div>

            <div>
              <Label htmlFor="credential_url">Credential URL</Label>
              <Input
                id="credential_url"
                type="url"
                value={formData.credential_url}
                onChange={(e) =>
                  setFormData({ ...formData, credential_url: e.target.value })
                }
                placeholder="https://www.credly.com/..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issued_date">Issued Date</Label>
                <Input
                  id="issued_date"
                  type="date"
                  value={formData.issued_date}
                  onChange={(e) =>
                    setFormData({ ...formData, issued_date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="expiration_date">Expiration Date</Label>
                <Input
                  id="expiration_date"
                  type="date"
                  value={formData.expiration_date || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expiration_date: e.target.value || null,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <Label>Related Skills</Label>
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
              Add Certification
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Certifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Certifications ({certifications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {certifications.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No certifications yet. Add your first certification above.
            </p>
          ) : (
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{cert.title}</h3>
                    {cert.authority && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {cert.authority}
                      </p>
                    )}
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      {cert.issued_date && (
                        <span>
                          Issued:{" "}
                          {new Date(cert.issued_date).toLocaleDateString()}
                        </span>
                      )}
                      {cert.expiration_date && (
                        <span>
                          Expires:{" "}
                          {new Date(cert.expiration_date).toLocaleDateString()}
                        </span>
                      )}
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          View Credential
                        </a>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCertification(cert.id)}
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
