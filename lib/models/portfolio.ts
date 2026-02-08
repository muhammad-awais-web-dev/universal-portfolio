// Portfolio Data Models
// TypeScript interfaces for portfolio entities

export interface Profile {
  id: string;
  full_name?: string;
  tagline?: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  avatar_url?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectCategory {
  id: number;
  name: string;
  created_at?: string;
}

export interface Project {
  id: number;
  owner_id: string;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  body_html?: string; // Rich HTML content for detailed project description
  live_url?: string;
  repo_url?: string;
  featured_image: string; // Required featured image URL
  image_gallery?: string[]; // Array of image URLs for gallery
  is_published?: boolean;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
  // Relationships
  category_ids?: number[]; // Project categories
  skill_ids?: number[]; // Selected skills for this project
  images?: ProjectImage[]; // Additional optional images
}

export interface ProjectImage {
  id: number;
  project_id: number;
  cloudinary_public_id: string;
  url: string;
  alt_text?: string;
  width?: number;
  height?: number;
  format?: string;
  position?: number;
  created_at?: string;
}

export interface SkillCategory {
  id: number;
  name: string;
  created_at?: string;
}

export interface Skill {
  id: number;
  name: string;
  category_ids?: number[]; // Multiple categories
  logo_url?: string;
  body_html?: string; // Rich HTML content for skill description/details
  created_at?: string;
}

export interface ProjectSkill {
  project_id: number;
  skill_id: number;
}

export interface Certification {
  id: number;
  profile_id: string;
  title: string;
  authority?: string;
  credential_url?: string;
  issued_date?: string;
  expiration_date?: string | null;
  featured_image: string; // Required featured image URL
  image_gallery?: string[]; // Array of image URLs for gallery
  is_active?: boolean; // Currently active/valid
  body_html?: string; // Rich HTML content for certification details
  created_at?: string;
  // Relationships
  skill_ids?: number[]; // Skills related to this certification
  project_ids?: number[]; // Projects where this certification was applied
  images?: ProjectImage[]; // Additional optional images (reusing ProjectImage type)
}

export interface Education {
  id: number;
  profile_id: string;
  institution: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string | null;
  is_current?: boolean; // Currently studying
  grade?: string;
  description?: string;
  body_html?: string; // Rich HTML content for education details
  created_at?: string;
  // Relationships
  skill_ids?: number[]; // Skills learned/applied
  project_ids?: number[]; // Projects completed during education
}

export interface Experience {
  id: number;
  profile_id: string;
  company: string;
  title: string;
  start_date?: string;
  end_date?: string | null;
  location?: string;
  description?: string;
  body_html?: string; // Rich HTML content for detailed role description
  is_current?: boolean;
  created_at?: string;
  // Relationships
  skill_ids?: number[]; // Skills used in this role
  project_ids?: number[]; // Projects completed in this role
}

// Form types (for creation/updates without IDs)
export type ProjectFormData = Omit<Project, 'id' | 'owner_id' | 'created_at' | 'updated_at' | 'images'>;
export type SkillFormData = Omit<Skill, 'id' | 'created_at'>;
export type CertificationFormData = Omit<Certification, 'id' | 'profile_id' | 'created_at' | 'images'>;
export type EducationFormData = Omit<Education, 'id' | 'profile_id' | 'created_at'>;
export type ExperienceFormData = Omit<Experience, 'id' | 'profile_id' | 'created_at'>;
export type ProfileFormData = Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
export type SkillCategoryFormData = Omit<SkillCategory, 'id' | 'created_at'>;
export type ProjectCategoryFormData = Omit<ProjectCategory, 'id' | 'created_at'>;
