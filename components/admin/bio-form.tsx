"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePortfolio } from "./portfolio-context";
import { ProfileFormData } from "@/lib/models/portfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";

export function BioForm() {
  const { profile, updateProfile } = usePortfolio();
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: "",
    tagline: "",
    bio: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    avatar_url: "",
    github: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    youtube: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        tagline: profile.tagline || "",
        bio: profile.bio || "",
        email: profile.email || "",
        phone: profile.phone || "",
        location: profile.location || "",
        website: profile.website || "",
        avatar_url: profile.avatar_url || "",
        github: profile.github || "",
        linkedin: profile.linkedin || "",
        twitter: profile.twitter || "",
        instagram: profile.instagram || "",
        youtube: profile.youtube || "",
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) =>
                      setFormData({ ...formData, tagline: e.target.value })
                    }
                    placeholder="Full Stack Developer & UI/UX Enthusiast"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="A passionate developer with expertise in..."
                  className="w-full min-h-[120px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                />
              </div>

              <div>
                <Label htmlFor="avatar">Avatar Image</Label>
                <ImageUpload
                  value={formData.avatar_url}
                  onChange={(url, _publicId) => {
                    setFormData({ ...formData, avatar_url: url });
                  }}
                  onDelete={() => {
                    setFormData({ ...formData, avatar_url: "" });
                  }}
                  folder="portfolio/avatars"
                  publicIdPrefix="avatar"
                  aspectRatio="1:1"
                  maxSize={5}
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website/Portfolio</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    placeholder="https://johndoe.com"
                  />
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Social Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={formData.github}
                    onChange={(e) =>
                      setFormData({ ...formData, github: e.target.value })
                    }
                    placeholder="https://github.com/johndoe"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin}
                    onChange={(e) =>
                      setFormData({ ...formData, linkedin: e.target.value })
                    }
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="twitter">Twitter/X</Label>
                  <Input
                    id="twitter"
                    value={formData.twitter}
                    onChange={(e) =>
                      setFormData({ ...formData, twitter: e.target.value })
                    }
                    placeholder="https://twitter.com/johndoe"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) =>
                      setFormData({ ...formData, instagram: e.target.value })
                    }
                    placeholder="https://instagram.com/johndoe"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="youtube">YouTube</Label>
                <Input
                  id="youtube"
                  value={formData.youtube}
                  onChange={(e) =>
                    setFormData({ ...formData, youtube: e.target.value })
                  }
                  placeholder="https://youtube.com/@johndoe"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Profile Preview */}
      {profile && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.avatar_url && (
                <div className="flex justify-center">
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name || "Avatar"}
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-full object-contain border-4"
                    unoptimized
                  />
                </div>
              )}
              {profile.full_name && (
                <h2 className="text-2xl font-bold text-center">
                  {profile.full_name}
                </h2>
              )}
              {profile.tagline && (
                <p className="text-lg text-center text-muted-foreground">
                  {profile.tagline}
                </p>
              )}
              {profile.bio && (
                <p className="text-sm text-center">{profile.bio}</p>
              )}
              <div className="flex flex-wrap gap-3 justify-center pt-4">
                {profile.email && (
                  <span className="text-xs bg-secondary px-3 py-1 rounded-full">
                    📧 {profile.email}
                  </span>
                )}
                {profile.phone && (
                  <span className="text-xs bg-secondary px-3 py-1 rounded-full">
                    📱 {profile.phone}
                  </span>
                )}
                {profile.location && (
                  <span className="text-xs bg-secondary px-3 py-1 rounded-full">
                    📍 {profile.location}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs hover:underline"
                  >
                    GitHub
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs hover:underline"
                  >
                    LinkedIn
                  </a>
                )}
                {profile.twitter && (
                  <a
                    href={profile.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs hover:underline"
                  >
                    Twitter
                  </a>
                )}
                {profile.instagram && (
                  <a
                    href={profile.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs hover:underline"
                  >
                    Instagram
                  </a>
                )}
                {profile.youtube && (
                  <a
                    href={profile.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs hover:underline"
                  >
                    YouTube
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
