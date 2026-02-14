import { z } from 'zod';

const uuid = z.string().uuid();
const url = z.string().url();
const optionalUrl = url.optional().or(z.literal('').transform(() => undefined));
const optionalString = z.string().trim().optional().or(z.literal('').transform(() => undefined));

export const imageMetadataSchema = z.object({
  cloudinary_public_id: z.string().min(1),
  url,
  alt_text: optionalString,
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  format: optionalString,
  position: z.number().int().nonnegative().optional()
});

export const profileSchema = z.object({
  id: uuid.optional(),
  full_name: optionalString,
  tagline: optionalString,
  bio: optionalString,
  email: optionalString,
  phone: optionalString,
  location: optionalString,
  website: optionalUrl,
  avatar_url: optionalUrl,
  github: optionalUrl,
  linkedin: optionalUrl,
  twitter: optionalUrl,
  instagram: optionalUrl,
  youtube: optionalUrl
});

const baseProjectSchema = z.object({
  owner_id: uuid,
  title: z.string().min(1),
  slug: z.string().min(1),
  short_description: optionalString,
  description: optionalString,
  body_html: optionalString,
  live_url: optionalUrl,
  repo_url: optionalUrl,
  featured_image: url,
  image_gallery: z.array(url).optional(),
  is_published: z.boolean().optional(),
  published_at: z.string().datetime().nullable().optional(),
  category_ids: z.array(z.number().int().positive()).optional(),
  skill_ids: z.array(z.number().int().positive()).optional(),
  images: z.array(imageMetadataSchema).optional()
});

export const projectCreateSchema = baseProjectSchema;
export const projectUpdateSchema = baseProjectSchema.partial().extend({ id: z.number().int().positive() });

const skillBaseSchema = z.object({
  name: z.string().min(1),
  category_ids: z.array(z.number().int().positive()).optional(),
  logo_url: optionalUrl,
  body_html: optionalString
});

export const skillCreateSchema = skillBaseSchema;
export const skillUpdateSchema = skillBaseSchema.partial().extend({ id: z.number().int().positive() });

const certificationBaseSchema = z.object({
  profile_id: uuid,
  title: z.string().min(1),
  authority: optionalString,
  credential_url: optionalUrl,
  issued_date: optionalString,
  expiration_date: optionalString,
  featured_image: url,
  image_gallery: z.array(url).optional(),
  is_active: z.boolean().optional(),
  body_html: optionalString,
  skill_ids: z.array(z.number().int().positive()).optional(),
  project_ids: z.array(z.number().int().positive()).optional(),
  images: z.array(imageMetadataSchema).optional()
});

export const certificationCreateSchema = certificationBaseSchema;
export const certificationUpdateSchema = certificationBaseSchema.partial().extend({ id: z.number().int().positive() });

const educationBaseSchema = z.object({
  profile_id: uuid,
  institution: z.string().min(1),
  degree: optionalString,
  field_of_study: optionalString,
  start_date: optionalString,
  end_date: optionalString,
  is_current: z.boolean().optional(),
  grade: optionalString,
  description: optionalString,
  body_html: optionalString,
  skill_ids: z.array(z.number().int().positive()).optional(),
  project_ids: z.array(z.number().int().positive()).optional()
});

export const educationCreateSchema = educationBaseSchema;
export const educationUpdateSchema = educationBaseSchema.partial().extend({ id: z.number().int().positive() });

const experienceBaseSchema = z.object({
  profile_id: uuid,
  company: z.string().min(1),
  title: z.string().min(1),
  start_date: optionalString,
  end_date: optionalString,
  location: optionalString,
  description: optionalString,
  body_html: optionalString,
  is_current: z.boolean().optional(),
  skill_ids: z.array(z.number().int().positive()).optional(),
  project_ids: z.array(z.number().int().positive()).optional()
});

export const experienceCreateSchema = experienceBaseSchema;
export const experienceUpdateSchema = experienceBaseSchema.partial().extend({ id: z.number().int().positive() });

const testimonialBaseSchema = z.object({
  profile_id: uuid,
  name: z.string().min(1, "Name is required"),
  position: z.string().min(1, "Position is required"),
  company: optionalString,
  image_url: optionalUrl,
  platform_name: optionalString,
  platform_logo_url: optionalUrl,
  comment: z.string().min(1, "Comment is required"),
  testimonial_date: optionalString, // Format: YYYY-MM
  is_featured: z.boolean().optional(),
  is_active: z.boolean().optional()
});

export const testimonialCreateSchema = testimonialBaseSchema;
export const testimonialUpdateSchema = testimonialBaseSchema.partial().extend({ id: z.number().int().positive() });

export const migrationPayloadSchema = z.object({
  profile: profileSchema.optional(),
  projects: z.array(projectCreateSchema).optional(),
  skills: z.array(skillCreateSchema).optional(),
  certifications: z.array(certificationCreateSchema).optional(),
  education: z.array(educationCreateSchema).optional(),
  experience: z.array(experienceCreateSchema).optional(),
  testimonials: z.array(testimonialCreateSchema).optional()
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
export type SkillCreateInput = z.infer<typeof skillCreateSchema>;
export type SkillUpdateInput = z.infer<typeof skillUpdateSchema>;
export type CertificationCreateInput = z.infer<typeof certificationCreateSchema>;
export type CertificationUpdateInput = z.infer<typeof certificationUpdateSchema>;
export type EducationCreateInput = z.infer<typeof educationCreateSchema>;
export type EducationUpdateInput = z.infer<typeof educationUpdateSchema>;
export type ExperienceCreateInput = z.infer<typeof experienceCreateSchema>;
export type ExperienceUpdateInput = z.infer<typeof experienceUpdateSchema>;
export type TestimonialCreateInput = z.infer<typeof testimonialCreateSchema>;
export type TestimonialUpdateInput = z.infer<typeof testimonialUpdateSchema>;
export type MigrationPayload = z.infer<typeof migrationPayloadSchema>;
