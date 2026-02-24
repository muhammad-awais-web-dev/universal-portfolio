"use client";

import { useState } from "react";
import { usePortfolio } from "./portfolio-context";
import { TestimonialFormData } from "@/lib/models/portfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Pencil, Star } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";

export function TestimonialForm() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = usePortfolio();
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: "",
    position: "",
    company: "",
    image_url: "",
    platform_name: "",
    platform_logo_url: "",
    comment: "",
    testimonial_date: "",
    is_featured: false,
    is_active: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.position || !formData.comment) {
      alert("Name, position, and comment are required");
      return;
    }
    
    try {
      if (editingId) {
        await updateTestimonial(editingId, formData);
        setEditingId(null);
      } else {
        await addTestimonial(formData);
      }
      // Reset form
      setFormData({
        name: "",
        position: "",
        company: "",
        image_url: "",
        platform_name: "",
        platform_logo_url: "",
        comment: "",
        testimonial_date: "",
        is_featured: false,
        is_active: true,
      });
    } catch (error) {
      console.error("Error saving testimonial:", error);
      alert("Failed to save testimonial. Please try again.");
    }
  };

  const handleEdit = (testimonial: typeof testimonials[0]) => {
    setFormData({
      name: testimonial.name,
      position: testimonial.position,
      company: testimonial.company || "",
      image_url: testimonial.image_url || "",
      platform_name: testimonial.platform_name || "",
      platform_logo_url: testimonial.platform_logo_url || "",
      comment: testimonial.comment,
      testimonial_date: testimonial.testimonial_date || "",
      is_featured: testimonial.is_featured || false,
      is_active: testimonial.is_active !== false,
    });
    setEditingId(testimonial.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setFormData({
      name: "",
      position: "",
      company: "",
      image_url: "",
      platform_name: "",
      platform_logo_url: "",
      comment: "",
      testimonial_date: "",
      is_featured: false,
      is_active: true,
    });
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      await deleteTestimonial(id);
    }
  };

  // Sort testimonials: featured first, then by date
  const sortedTestimonials = [...testimonials].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    if (a.testimonial_date && b.testimonial_date) {
      return b.testimonial_date.localeCompare(a.testimonial_date);
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Testimonial" : "Add New Testimonial"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Person Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Person Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="CEO at Company"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company">Company/Organization (optional)</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company Name"
                />
              </div>

              <div>
                <Label htmlFor="image_url">Profile Photo</Label>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  onDelete={() => setFormData({ ...formData, image_url: "" })}
                  folder="portfolio/testimonials"
                  publicIdPrefix={formData.name ? `testimonial_${formData.name.toLowerCase().replace(/\s+/g, '_')}` : "testimonial"}
                  aspectRatio="1:1"
                  maxSize={2}
                />
              </div>
            </div>

            {/* Platform Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Platform Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform_name">Platform Name (optional)</Label>
                  <Input
                    id="platform_name"
                    value={formData.platform_name}
                    onChange={(e) => setFormData({ ...formData, platform_name: e.target.value })}
                    placeholder="LinkedIn, Fiverr, Upwork, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="platform_logo_url">Platform Logo URL (optional)</Label>
                  <Input
                    id="platform_logo_url"
                    value={formData.platform_logo_url}
                    onChange={(e) => setFormData({ ...formData, platform_logo_url: e.target.value })}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Testimonial</h3>
              <div>
                <Label htmlFor="comment">Comment *</Label>
                <textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="The testimonial text goes here..."
                  className="w-full min-h-[150px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                  required
                />
              </div>

              <div>
                <Label htmlFor="testimonial_date">Date (Month/Year)</Label>
                <Input
                  id="testimonial_date"
                  type="month"
                  value={formData.testimonial_date}
                  onChange={(e) => setFormData({ ...formData, testimonial_date: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  When was this testimonial given?
                </p>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_featured: checked === true })
                    }
                  />
                  <Label htmlFor="is_featured" className="cursor-pointer font-normal">
                    Feature this testimonial (highlight on portfolio)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_active: checked === true })
                    }
                  />
                  <Label htmlFor="is_active" className="cursor-pointer font-normal">
                    Active (show on portfolio)
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? "Update Testimonial" : "Add Testimonial"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Testimonials List */}
      <Card>
        <CardHeader>
          <CardTitle>Testimonials ({testimonials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {testimonials.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No testimonials yet. Add your first testimonial above.
            </p>
          ) : (
            <div className="space-y-4">
              {sortedTestimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className={`${testimonial.is_featured ? "border-primary" : ""} ${
                    testimonial.is_active === false ? "opacity-50" : ""
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      {/* Profile Image */}
                      {testimonial.image_url && (
                        <div className="flex-shrink-0">
                          <img
                            src={testimonial.image_url}
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{testimonial.name}</h4>
                              {testimonial.is_featured && (
                                <Badge variant="default" className="text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                              {testimonial.is_active === false && (
                                <Badge variant="secondary" className="text-xs">
                                  Inactive
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {testimonial.position}
                              {testimonial.company && ` • ${testimonial.company}`}
                            </p>
                            {testimonial.platform_name && (
                              <div className="flex items-center gap-1 mt-1">
                                {testimonial.platform_logo_url && (
                                  <img
                                    src={testimonial.platform_logo_url}
                                    alt={testimonial.platform_name}
                                    className="w-4 h-4"
                                  />
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {testimonial.platform_name}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(testimonial)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(testimonial.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Comment */}
                        <p className="text-sm italic border-l-2 border-primary pl-3 py-1">
                          &ldquo;{testimonial.comment}&rdquo;
                        </p>

                        {/* Date */}
                        {testimonial.testimonial_date && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(testimonial.testimonial_date + "-01").toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
