import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '../supabase-client';
import type {
  Profile,
  Project,
  Skill,
  SkillCategory,
  ProjectCategory,
  Certification,
  Education,
  Experience,
  Testimonial,
  McpApiKeyListItem,
} from '../models/portfolio';
import {
  ProfileInput,
  ProjectCreateInput,
  ProjectUpdateInput,
  SkillCreateInput,
  SkillUpdateInput,
  CertificationCreateInput,
  CertificationUpdateInput,
  EducationCreateInput,
  EducationUpdateInput,
  ExperienceCreateInput,
  ExperienceUpdateInput,
  TestimonialCreateInput,
  TestimonialUpdateInput,
  profileSchema,
  projectCreateSchema,
  projectUpdateSchema,
  skillCreateSchema,
  skillUpdateSchema,
  certificationCreateSchema,
  certificationUpdateSchema,
  educationCreateSchema,
  educationUpdateSchema,
  experienceCreateSchema,
  experienceUpdateSchema,
  testimonialCreateSchema,
  testimonialUpdateSchema,
  imageMetadataSchema,
} from '../schemas/portfolio';
import { z } from 'zod';

// Default single-user profile id
export const DEFAULT_PROFILE_ID = '00000000-0000-0000-0000-000000000000';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

class SupabaseNotConfiguredError extends Error {
  constructor() {
    super(
      'Supabase admin client is not configured. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.'
    );
  }
}

function getClient(): SupabaseClient {
  if (!supabaseAdmin) throw new SupabaseNotConfiguredError();
  return supabaseAdmin;
}

/** Generic junction-table sync: delete existing rows, insert new ones. */
async function syncJunction(
  table: string,
  fkColumn: string,
  fkValue: number,
  relColumn: string,
  relValues: number[] | undefined
) {
  if (relValues === undefined) return;
  const client = getClient();
  await client.from(table).delete().eq(fkColumn, fkValue);
  if (relValues.length > 0) {
    await client
      .from(table)
      .insert(relValues.map((v) => ({ [fkColumn]: fkValue, [relColumn]: v })));
  }
}

async function syncProjectRelations(
  projectId: number,
  {
    skill_ids,
    category_ids,
    images,
  }: { skill_ids?: number[]; category_ids?: number[]; images?: z.infer<typeof imageMetadataSchema>[] }
) {
  const client = getClient();
  await syncJunction('project_skills', 'project_id', projectId, 'skill_id', skill_ids);
  await syncJunction(
    'project_categories_junction',
    'project_id',
    projectId,
    'category_id',
    category_ids
  );

  if (images) {
    await client.from('project_images').delete().eq('project_id', projectId);
    if (images.length > 0) {
      await client.from('project_images').insert(
        images.map((img) => ({
          project_id: projectId,
          cloudinary_public_id: img.cloudinary_public_id,
          url: img.url,
          alt_text: img.alt_text,
          width: img.width,
          height: img.height,
          format: img.format,
          position: img.position ?? 0,
        }))
      );
    }
  }
}

// ---------------------------------------------------------------------------
// PROFILE
// ---------------------------------------------------------------------------

export async function getProfile(): Promise<Profile | null> {
  const client = getClient();
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', DEFAULT_PROFILE_ID)
    .single();
  if (error && error.code !== 'PGRST116') throw new Error(`Failed to fetch profile: ${error.message}`);
  return (data as Profile) ?? null;
}

export async function upsertProfile(input: ProfileInput): Promise<Profile> {
  const client = getClient();
  const payload = profileSchema.parse(input);
  const { data, error } = await client
    .from('profiles')
    .upsert({ ...payload, id: DEFAULT_PROFILE_ID, updated_at: new Date().toISOString() })
    .select('*')
    .single();
  if (error) throw new Error(`Failed to upsert profile: ${error.message}`);
  return data as Profile;
}

// ---------------------------------------------------------------------------
// PROJECTS
// ---------------------------------------------------------------------------

export async function listProjects(ownerId?: string): Promise<Project[]> {
  const client = getClient();
  let query = client.from('projects').select('*').order('created_at', { ascending: false });
  if (ownerId) query = query.eq('owner_id', ownerId);
  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch projects: ${error.message}`);
  
  // Hydrate skill_ids and category_ids for each project
  const projects = data as Project[];
  await Promise.all(
    projects.map(async (project) => {
      // Fetch skill_ids
      const { data: skillData } = await client
        .from('project_skills')
        .select('skill_id')
        .eq('project_id', project.id);
      project.skill_ids = skillData?.map((s) => s.skill_id) || [];
      
      // Fetch category_ids
      const { data: categoryData } = await client
        .from('project_categories_junction')
        .select('category_id')
        .eq('project_id', project.id);
      project.category_ids = categoryData?.map((c) => c.category_id) || [];
    })
  );
  
  return projects;
}

export async function getProject(projectId: number): Promise<Project | null> {
  const client = getClient();
  const { data, error } = await client.from('projects').select('*').eq('id', projectId).single();
  if (error && error.code !== 'PGRST116') throw new Error(`Failed to fetch project: ${error.message}`);
  return (data as Project) ?? null;
}

export async function createProject(input: ProjectCreateInput): Promise<Project> {
  const client = getClient();
  const payload = projectCreateSchema.parse(input);
  const { skill_ids, category_ids, images, ...values } = payload;
  const { data, error } = await client.from('projects').insert(values).select('*').single();
  if (error) throw new Error(`Failed to create project: ${error.message}`);
  await syncProjectRelations(data.id, { skill_ids, category_ids, images });
  return data as Project;
}

export async function updateProject(input: ProjectUpdateInput): Promise<Project> {
  const client = getClient();
  const payload = projectUpdateSchema.parse(input);
  const { id, skill_ids, category_ids, images, ...values } = payload;
  const { data, error } = await client
    .from('projects')
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(`Failed to update project: ${error.message}`);
  await syncProjectRelations(id, { skill_ids, category_ids, images });
  return data as Project;
}

export async function deleteProject(projectId: number): Promise<void> {
  const client = getClient();
  const { error } = await client.from('projects').delete().eq('id', projectId);
  if (error) throw new Error(`Failed to delete project: ${error.message}`);
}

// ---------------------------------------------------------------------------
// PROJECT CATEGORIES
// ---------------------------------------------------------------------------

export async function listProjectCategories(): Promise<ProjectCategory[]> {
  const client = getClient();
  const { data, error } = await client.from('project_categories').select('*').order('name');
  if (error) throw new Error(`Failed to fetch project categories: ${error.message}`);
  return data as ProjectCategory[];
}

export async function createProjectCategory(name: string): Promise<ProjectCategory> {
  const client = getClient();
  const { data, error } = await client
    .from('project_categories')
    .insert({ name: name.trim() })
    .select('*')
    .single();
  if (error) throw new Error(`Failed to create project category: ${error.message}`);
  return data as ProjectCategory;
}

export async function updateProjectCategory(id: number, name: string): Promise<ProjectCategory> {
  const client = getClient();
  const { data, error } = await client
    .from('project_categories')
    .update({ name: name.trim() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(`Failed to update project category: ${error.message}`);
  return data as ProjectCategory;
}

export async function deleteProjectCategory(id: number): Promise<void> {
  const client = getClient();
  const { error } = await client.from('project_categories').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete project category: ${error.message}`);
}

// ---------------------------------------------------------------------------
// SKILLS
// ---------------------------------------------------------------------------

export async function listSkills(): Promise<Skill[]> {
  const client = getClient();
  const { data, error } = await client.from('skills').select('*').order('name');
  if (error) throw new Error(`Failed to fetch skills: ${error.message}`);
  
  // Hydrate category_ids for each skill
  const skills = data as Skill[];
  await Promise.all(
    skills.map(async (skill) => {
      const { data: categoryData } = await client
        .from('skill_categories_junction')
        .select('category_id')
        .eq('skill_id', skill.id);
      skill.category_ids = categoryData?.map((c) => c.category_id) || [];
    })
  );
  
  return skills;
}

export async function getSkill(skillId: number): Promise<Skill | null> {
  const client = getClient();
  const { data, error } = await client.from('skills').select('*').eq('id', skillId).single();
  if (error && error.code !== 'PGRST116') throw new Error(`Failed to fetch skill: ${error.message}`);
  return (data as Skill) ?? null;
}

export async function createSkill(input: SkillCreateInput): Promise<Skill> {
  const client = getClient();
  const payload = skillCreateSchema.parse(input);
  const { category_ids, ...values } = payload;
  const { data, error } = await client.from('skills').insert(values).select('*').single();
  if (error) throw new Error(`Failed to create skill: ${error.message}`);
  await syncJunction('skill_categories_junction', 'skill_id', data.id, 'category_id', category_ids);
  return data as Skill;
}

export async function updateSkill(input: SkillUpdateInput): Promise<Skill> {
  const client = getClient();
  const payload = skillUpdateSchema.parse(input);
  const { id, category_ids, ...values } = payload;
  const { data, error } = await client.from('skills').update(values).eq('id', id).select('*').single();
  if (error) throw new Error(`Failed to update skill: ${error.message}`);
  await syncJunction('skill_categories_junction', 'skill_id', id, 'category_id', category_ids);
  return data as Skill;
}

export async function deleteSkill(skillId: number): Promise<void> {
  const client = getClient();
  const { error } = await client.from('skills').delete().eq('id', skillId);
  if (error) throw new Error(`Failed to delete skill: ${error.message}`);
}

// ---------------------------------------------------------------------------
// SKILL CATEGORIES
// ---------------------------------------------------------------------------

export async function listSkillCategories(): Promise<SkillCategory[]> {
  const client = getClient();
  const { data, error } = await client.from('skill_categories').select('*').order('name');
  if (error) throw new Error(`Failed to fetch skill categories: ${error.message}`);
  return data as SkillCategory[];
}

export async function createSkillCategory(name: string): Promise<SkillCategory> {
  const client = getClient();
  const { data, error } = await client
    .from('skill_categories')
    .insert({ name: name.trim() })
    .select('*')
    .single();
  if (error) throw new Error(`Failed to create skill category: ${error.message}`);
  return data as SkillCategory;
}

export async function updateSkillCategory(id: number, name: string): Promise<SkillCategory> {
  const client = getClient();
  const { data, error } = await client
    .from('skill_categories')
    .update({ name: name.trim() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(`Failed to update skill category: ${error.message}`);
  return data as SkillCategory;
}

export async function deleteSkillCategory(id: number): Promise<void> {
  const client = getClient();
  const { error } = await client.from('skill_categories').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete skill category: ${error.message}`);
}

// ---------------------------------------------------------------------------
// CERTIFICATIONS
// ---------------------------------------------------------------------------

export async function listCertifications(): Promise<Certification[]> {
  const client = getClient();
  const { data, error } = await client
    .from('certifications')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(`Failed to fetch certifications: ${error.message}`);
  
  // Hydrate skill_ids and project_ids for each certification
  const certifications = data as Certification[];
  await Promise.all(
    certifications.map(async (cert) => {
      // Fetch skill_ids
      const { data: skillData } = await client
        .from('certification_skills')
        .select('skill_id')
        .eq('certification_id', cert.id);
      cert.skill_ids = skillData?.map((s) => s.skill_id) || [];
      
      // Fetch project_ids
      const { data: projectData } = await client
        .from('certification_projects')
        .select('project_id')
        .eq('certification_id', cert.id);
      cert.project_ids = projectData?.map((p) => p.project_id) || [];
    })
  );
  
  return certifications;
}

export async function getCertification(id: number): Promise<Certification | null> {
  const client = getClient();
  const { data, error } = await client.from('certifications').select('*').eq('id', id).single();
  if (error && error.code !== 'PGRST116') throw new Error(`Failed to fetch certification: ${error.message}`);
  return (data as Certification) ?? null;
}

export async function createCertification(input: CertificationCreateInput): Promise<Certification> {
  const client = getClient();
  const payload = certificationCreateSchema.parse(input);
  const { skill_ids, project_ids, images: _images, ...values } = payload;
  const { data, error } = await client.from('certifications').insert(values).select('*').single();
  if (error) throw new Error(`Failed to create certification: ${error.message}`);
  await syncJunction('certification_skills', 'certification_id', data.id, 'skill_id', skill_ids);
  await syncJunction('certification_projects', 'certification_id', data.id, 'project_id', project_ids);
  return data as Certification;
}

export async function updateCertification(input: CertificationUpdateInput): Promise<Certification> {
  const client = getClient();
  const payload = certificationUpdateSchema.parse(input);
  const { id, skill_ids, project_ids, images: _images, ...values } = payload;
  const { data, error } = await client
    .from('certifications')
    .update(values)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(`Failed to update certification: ${error.message}`);
  await syncJunction('certification_skills', 'certification_id', id, 'skill_id', skill_ids);
  await syncJunction('certification_projects', 'certification_id', id, 'project_id', project_ids);
  return data as Certification;
}

export async function deleteCertification(id: number): Promise<void> {
  const client = getClient();
  const { error } = await client.from('certifications').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete certification: ${error.message}`);
}

// ---------------------------------------------------------------------------
// EDUCATION
// ---------------------------------------------------------------------------

export async function listEducation(): Promise<Education[]> {
  const client = getClient();
  const { data, error } = await client
    .from('education')
    .select('*')
    .order('start_date', { ascending: false });
  if (error) throw new Error(`Failed to fetch education: ${error.message}`);
  
  // Hydrate skill_ids and project_ids for each education entry
  const education = data as Education[];
  await Promise.all(
    education.map(async (edu) => {
      // Fetch skill_ids
      const { data: skillData } = await client
        .from('education_skills')
        .select('skill_id')
        .eq('education_id', edu.id);
      edu.skill_ids = skillData?.map((s) => s.skill_id) || [];
      
      // Fetch project_ids
      const { data: projectData } = await client
        .from('education_projects')
        .select('project_id')
        .eq('education_id', edu.id);
      edu.project_ids = projectData?.map((p) => p.project_id) || [];
    })
  );
  
  return education;
}

export async function getEducation(id: number): Promise<Education | null> {
  const client = getClient();
  const { data, error } = await client.from('education').select('*').eq('id', id).single();
  if (error && error.code !== 'PGRST116') throw new Error(`Failed to fetch education: ${error.message}`);
  return (data as Education) ?? null;
}

export async function createEducation(input: EducationCreateInput): Promise<Education> {
  const client = getClient();
  const payload = educationCreateSchema.parse(input);
  const { skill_ids, project_ids, ...values } = payload;
  const { data, error } = await client.from('education').insert(values).select('*').single();
  if (error) throw new Error(`Failed to create education: ${error.message}`);
  await syncJunction('education_skills', 'education_id', data.id, 'skill_id', skill_ids);
  await syncJunction('education_projects', 'education_id', data.id, 'project_id', project_ids);
  return data as Education;
}

export async function updateEducation(input: EducationUpdateInput): Promise<Education> {
  const client = getClient();
  const payload = educationUpdateSchema.parse(input);
  const { id, skill_ids, project_ids, ...values } = payload;
  const { data, error } = await client.from('education').update(values).eq('id', id).select('*').single();
  if (error) throw new Error(`Failed to update education: ${error.message}`);
  await syncJunction('education_skills', 'education_id', id, 'skill_id', skill_ids);
  await syncJunction('education_projects', 'education_id', id, 'project_id', project_ids);
  return data as Education;
}

export async function deleteEducation(id: number): Promise<void> {
  const client = getClient();
  const { error } = await client.from('education').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete education: ${error.message}`);
}

// ---------------------------------------------------------------------------
// EXPERIENCE
// ---------------------------------------------------------------------------

export async function listExperience(): Promise<Experience[]> {
  const client = getClient();
  const { data, error } = await client
    .from('experience')
    .select('*')
    .order('start_date', { ascending: false });
  if (error) throw new Error(`Failed to fetch experience: ${error.message}`);
  
  // Hydrate skill_ids and project_ids for each experience entry
  const experiences = data as Experience[];
  await Promise.all(
    experiences.map(async (exp) => {
      // Fetch skill_ids
      const { data: skillData } = await client
        .from('experience_skills')
        .select('skill_id')
        .eq('experience_id', exp.id);
      exp.skill_ids = skillData?.map((s) => s.skill_id) || [];
      
      // Fetch project_ids
      const { data: projectData } = await client
        .from('experience_projects')
        .select('project_id')
        .eq('experience_id', exp.id);
      exp.project_ids = projectData?.map((p) => p.project_id) || [];
    })
  );
  
  return experiences;
}

export async function getExperience(id: number): Promise<Experience | null> {
  const client = getClient();
  const { data, error } = await client.from('experience').select('*').eq('id', id).single();
  if (error && error.code !== 'PGRST116') throw new Error(`Failed to fetch experience: ${error.message}`);
  return (data as Experience) ?? null;
}

export async function createExperience(input: ExperienceCreateInput): Promise<Experience> {
  const client = getClient();
  const payload = experienceCreateSchema.parse(input);
  const { skill_ids, project_ids, ...values } = payload;
  const { data, error } = await client.from('experience').insert(values).select('*').single();
  if (error) throw new Error(`Failed to create experience: ${error.message}`);
  await syncJunction('experience_skills', 'experience_id', data.id, 'skill_id', skill_ids);
  await syncJunction('experience_projects', 'experience_id', data.id, 'project_id', project_ids);
  return data as Experience;
}

export async function updateExperience(input: ExperienceUpdateInput): Promise<Experience> {
  const client = getClient();
  const payload = experienceUpdateSchema.parse(input);
  const { id, skill_ids, project_ids, ...values } = payload;
  const { data, error } = await client
    .from('experience')
    .update(values)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(`Failed to update experience: ${error.message}`);
  await syncJunction('experience_skills', 'experience_id', id, 'skill_id', skill_ids);
  await syncJunction('experience_projects', 'experience_id', id, 'project_id', project_ids);
  return data as Experience;
}

export async function deleteExperience(id: number): Promise<void> {
  const client = getClient();
  const { error } = await client.from('experience').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete experience: ${error.message}`);
}

// ---------------------------------------------------------------------------
// TESTIMONIALS
// ---------------------------------------------------------------------------

export async function listTestimonials(): Promise<Testimonial[]> {
  const client = getClient();
  const { data, error } = await client
    .from('testimonials')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('testimonial_date', { ascending: false });
  if (error) throw new Error(`Failed to fetch testimonials: ${error.message}`);
  return data as Testimonial[];
}

export async function getTestimonial(id: number): Promise<Testimonial | null> {
  const client = getClient();
  const { data, error } = await client.from('testimonials').select('*').eq('id', id).single();
  if (error && error.code !== 'PGRST116') throw new Error(`Failed to fetch testimonial: ${error.message}`);
  return (data as Testimonial) ?? null;
}

export async function createTestimonial(input: TestimonialCreateInput): Promise<Testimonial> {
  const client = getClient();
  const payload = testimonialCreateSchema.parse(input);
  const { data, error } = await client.from('testimonials').insert(payload).select('*').single();
  if (error) throw new Error(`Failed to create testimonial: ${error.message}`);
  return data as Testimonial;
}

export async function updateTestimonial(input: TestimonialUpdateInput): Promise<Testimonial> {
  const client = getClient();
  const payload = testimonialUpdateSchema.parse(input);
  const { id, ...values } = payload;
  const { data, error } = await client
    .from('testimonials')
    .update(values)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(`Failed to update testimonial: ${error.message}`);
  return data as Testimonial;
}

export async function deleteTestimonial(id: number): Promise<void> {
  const client = getClient();
  const { error } = await client.from('testimonials').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete testimonial: ${error.message}`);
}

// ---------------------------------------------------------------------------
// FULL PORTFOLIO (combined read)
// ---------------------------------------------------------------------------

export async function getFullPortfolio() {
  const [
    profile,
    projects,
    skills,
    skillCategories,
    projectCategories,
    certifications,
    education,
    experience,
    testimonials,
  ] = await Promise.all([
    getProfile(),
    listProjects(),
    listSkills(),
    listSkillCategories(),
    listProjectCategories(),
    listCertifications(),
    listEducation(),
    listExperience(),
    listTestimonials(),
  ]);

  return {
    profile,
    projects,
    skills,
    skillCategories,
    projectCategories,
    certifications,
    education,
    experience,
    testimonials,
  };
}

// ---------------------------------------------------------------------------
// MCP API Keys Management
// ---------------------------------------------------------------------------

/**
 * Generate a new API key
 * Returns both the plain key (show only once) and the stored record
 */
export async function createMcpApiKey(
  name: string
): Promise<{ key: string; id: string; record: McpApiKeyListItem }> {
  const client = getClient();
  const crypto = await import('crypto');
  const bcrypt = await import('bcryptjs');

  // Generate random 32-byte key (64 hex characters)
  const plainKey = crypto.randomBytes(32).toString('hex');
  
  // Hash the key for storage (bcrypt with 10 salt rounds)
  const keyHash = await bcrypt.hash(plainKey, 10);

  const { data, error } = await client
    .from('mcp_api_keys')
    .insert({
      name,
      key_hash: keyHash,
      enabled: true,
    })
    .select('id, name, enabled, created_at, updated_at, last_used_at')
    .single();

  if (error) {
    throw new Error(`Failed to create API key: ${error.message}`);
  }

  return {
    key: plainKey,
    id: data.id,
    record: data,
  };
}

/**
 * List all API keys (without exposing the hash)
 */
export async function listMcpApiKeys() {
  const client = getClient();

  const { data, error } = await client
    .from('mcp_api_keys')
    .select('id, name, enabled, created_at, updated_at, last_used_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list API keys: ${error.message}`);
  }

  return data || [];
}

/**
 * Toggle an API key's enabled status
 */
export async function toggleMcpApiKey(id: string, enabled: boolean): Promise<void> {
  const client = getClient();

  const { error } = await client
    .from('mcp_api_keys')
    .update({ enabled })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to toggle API key: ${error.message}`);
  }
}

/**
 * Delete an API key
 */
export async function deleteMcpApiKey(id: string): Promise<void> {
  const client = getClient();

  const { error } = await client
    .from('mcp_api_keys')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete API key: ${error.message}`);
  }
}

/**
 * Validate an API key and update last_used_at
 * Returns true if valid and enabled
 */
export async function validateMcpApiKey(plainKey: string): Promise<boolean> {
  const client = getClient();
  const bcrypt = await import('bcryptjs');

  // Get all enabled keys
  const { data: keys, error } = await client
    .from('mcp_api_keys')
    .select('id, key_hash')
    .eq('enabled', true);

  if (error || !keys || keys.length === 0) {
    return false;
  }

  // Check each key hash
  for (const keyRecord of keys) {
    try {
      const isValid = await bcrypt.compare(plainKey, keyRecord.key_hash);
      if (isValid) {
        // Update last_used_at timestamp (fire and forget)
        void client
          .from('mcp_api_keys')
          .update({ last_used_at: new Date().toISOString() })
          .eq('id', keyRecord.id);

        return true;
      }
    } catch {
      // Continue checking other keys if comparison fails
      continue;
    }
  }

  return false;
}
