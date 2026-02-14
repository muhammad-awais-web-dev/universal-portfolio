"use client";

import { useState } from "react";
import { usePortfolio } from "./portfolio-context";
import { CertificationFormData } from "@/lib/models/portfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, X } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { MultipleImageUpload } from "@/components/ui/multiple-image-upload";

export function CertificationForm() {
  const { addCertification, updateCertification, certifications, deleteCertification, skills, projects } =
    usePortfolio();
  const [formData, setFormData] = useState<CertificationFormData>({
    title: "",
    authority: "",
    credential_url: "",
    issued_date: "",
    expiration_date: null,
    featured_image: "",
    image_gallery: [],
    body_html: "",
    is_active: true,
    skill_ids: [],
    project_ids: [],
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.featured_image) {
      alert("Certification title and Featured Image are required");
      return;
    }
    if (editingId) {
      await updateCertification(editingId, formData);
      setEditingId(null);
    } else {
      await addCertification(formData);
    }
    setFormData({
      title: "",
      authority: "",
      credential_url: "",
      issued_date: "",
      expiration_date: null,
      featured_image: "",
      image_gallery: [],
      body_html: "",
      is_active: true,
      skill_ids: [],
      project_ids: [],
    });
  };

  const handleEdit = (cert: typeof certifications[0]) => {
    setFormData({
      title: cert.title,
      authority: cert.authority || "",
      credential_url: cert.credential_url || "",
      issued_date: cert.issued_date || "",
      expiration_date: cert.expiration_date || null,
      featured_image: cert.featured_image,
      image_gallery: cert.image_gallery || [],
      body_html: cert.body_html || "",
      is_active: cert.is_active,
      skill_ids: cert.skill_ids || [],
      project_ids: cert.project_ids || [],
    });
    setEditingId(cert.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setFormData({
      title: "",
      authority: "",
      credential_url: "",
      issued_date: "",
      expiration_date: null,
      featured_image: "",
      image_gallery: [],
      body_html: "",
      is_active: true,
      skill_ids: [],
      project_ids: [],
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Certification" : "Add New Certification"}</CardTitle>
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
              <Label htmlFor="featured_image_cert">Certificate Image *</Label>
              <ImageUpload
                value={formData.featured_image}
                onChange={(url, publicId) => {
                  setFormData({ ...formData, featured_image: url });
                }}
                onDelete={() => {
                  setFormData({ ...formData, featured_image: "" });
                }}
                folder="portfolio/certifications"
                publicIdPrefix={formData.title ? `cert_${formData.title.toLowerCase().replace(/\s+/g, '_')}` : "certification"}
                aspectRatio="16:9"
                maxSize={5}
              />
            </div>

            <div>
              <Label htmlFor="image_gallery">Image Gallery (Optional)</Label>
              <MultipleImageUpload
                images={formData.image_gallery || []}
                onChange={(images) => setFormData({ ...formData, image_gallery: images })}
                folder="portfolio/certifications/gallery"
                publicIdPrefix={formData.title ? `cert_${formData.title.toLowerCase().replace(/\s+/g, '_')}_gallery` : "cert_gallery"}
                maxImages={5}
              />
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
              <Label htmlFor="body_html_cert">Body HTML (optional)</Label>
              <textarea
                id="body_html_cert"
                value={formData.body_html}
                onChange={(e) => setFormData({ ...formData, body_html: e.target.value })}
                placeholder="<p>Detailed certification information with HTML...</p>"
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

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? "Update Certification" : "Add Certification"}
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
                  className="group relative flex items-start justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors"
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
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(cert)}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => await deleteCertification(cert.id)}
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
