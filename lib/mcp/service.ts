// MCP Service Layer
// Business logic for MCP operations with Supabase

import { supabaseAdmin } from '@/lib/supabase-client';
import { ProjectFilters, SkillFilters, PaginationParams } from './types';

// Helper to create MCP response
export function mcpResponse<T>(data: T, success = true, error?: string) {
  return {
    success,
    data: success ? data : undefined,
    error: error || undefined,
    timestamp: new Date().toISOString(),
  };
}

// Profile operations
export async function getProfile() {
  if (!supabaseAdmin) {
    throw new Error('Supabase client not initialized');
  }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

// Project operations
export async function listProjects(filters: ProjectFilters = {}) {
  if (!supabaseAdmin) {
    throw new Error('Supabase client not initialized');
  }

  const page = filters.page || 1;
  const limit = Math.min(filters.limit || 10, 50);
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('projects')
    .select(`
      *,
      project_skills(skill:skills(id, name, logo_url)),
      project_categories_junction(category:project_categories(id, name))
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  // Apply category filter if provided
  if (filters.category) {
    query = query.contains('project_categories_junction.category.name', [filters.category]);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    projects: data,
    pagination: {
      page,
      limit,
      total: count || 0,
      hasMore: count ? offset + limit < count : false,
    },
  };
}

export async function getProject(idOrSlug: number | string) {
  if (!supabaseAdmin) {
    throw new Error('Supabase client not initialized');
  }

  const isId = typeof idOrSlug === 'number';
  
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select(`
      *,
      project_images(*),
      project_skills(skill:skills(id, name, logo_url, body_html)),
      project_categories_junction(category:project_categories(id, name))
    `)
    .eq('is_published', true)
    .eq(isId ? 'id' : 'slug', idOrSlug)
    .single();

  if (error) throw error;
  return data;
}

// Skill operations
export async function listSkills(filters: SkillFilters = {}) {
  if (!supabaseAdmin) {
    throw new Error('Supabase client not initialized');
  }

  const page = filters.page || 1;
  const limit = Math.min(filters.limit || 20, 100);
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('skills')
    .select(`
      *,
      skill_categories_junction(category:skill_categories(id, name))
    `)
    .order('name', { ascending: true })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    skills: data,
    pagination: {
      page,
      limit,
      total: count || 0,
      hasMore: count ? offset + limit < count : false,
    },
  };
}

export async function getSkill(idOrName: number | string) {
  if (!supabaseAdmin) {
    throw new Error('Supabase client not initialized');
  }

  const isId = typeof idOrName === 'number';
  
  const { data, error } = await supabaseAdmin
    .from('skills')
    .select(`
      *,
      skill_categories_junction(category:skill_categories(id, name))
    `)
    .eq(isId ? 'id' : 'name', idOrName)
    .single();

  if (error) throw error;
  return data;
}

// Certification operations
export async function listCertifications(params: PaginationParams = {}) {
  if (!supabaseAdmin) {
    throw new Error('Supabase client not initialized');
  }

  const page = params.page || 1;
  const limit = Math.min(params.limit || 10, 50);
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabaseAdmin
    .from('certifications')
    .select(`
      *,
      certification_skills(skill:skills(id, name, logo_url))
    `)
    .eq('is_active', true)
    .order('issued_date', { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return {
    certifications: data,
    pagination: {
      page,
      limit,
      total: count || 0,
      hasMore: count ? offset + limit < count : false,
    },
  };
}

export async function getCertification(id: number) {
  if (!supabaseAdmin) {
    throw new Error('Supabase client not initialized');
  }

  const { data, error } = await supabaseAdmin
    .from('certifications')
    .select(`
      *,
      certification_skills(skill:skills(id, name, logo_url, body_html)),
      certification_projects(project:projects(id, title, slug))
    `)
    .eq('is_active', true)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Education operations
export async function listEducation(params: PaginationParams = {}) {
  if (!supabaseAdmin) {
    throw new Error('Supabase client not initialized');
  }

  const page = params.page || 1;
  const limit = Math.min(params.limit || 10, 50);
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabaseAdmin
    .from('education')
    .select(`
      *,
      education_skills(skill:skills(id, name, logo_url))
    `)
    .order('start_date', { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return {
    education: data,
    pagination: {
      page,
      limit,
      total: count || 0,
      hasMore: count ? offset + limit < count : false,
    },
  };
}

export async function getEducation(id: number) {
  if (!supabaseAdmin) {
    throw new Error('Supabase client not initialized');
  }

  const { data, error } = await supabaseAdmin
    .from('education')
    .select(`
      *,
      education_skills(skill:skills(id, name, logo_url, body_html)),
      education_projects(project:projects(id, title, slug))
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Experience operations
export async function listExperience(params: PaginationParams = {}) {
  if (!supabaseAdmin) {
    throw new Error('Supabase client not initialized');
  }

  const page = params.page || 1;
  const limit = Math.min(params.limit || 10, 50);
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabaseAdmin
    .from('experience')
    .select(`
      *,
      experience_skills(skill:skills(id, name, logo_url))
    `)
    .order('start_date', { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return {
    experience: data,
    pagination: {
      page,
      limit,
      total: count || 0,
      hasMore: count ? offset + limit < count : false,
    },
  };
}

export async function getExperience(id: number) {
  if (!supabaseAdmin) {
    throw new Error('Supabase client not initialized');
  }

  const { data, error } = await supabaseAdmin
    .from('experience')
    .select(`
      *,
      experience_skills(skill:skills(id, name, logo_url, body_html)),
      experience_projects(project:projects(id, title, slug))
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Testimonial operations
export async function listTestimonials(params: PaginationParams & { featured?: boolean } = {}) {
  if (!supabaseAdmin) {
    throw new Error('Supabase client not initialized');
  }

  const page = params.page || 1;
  const limit = Math.min(params.limit || 10, 50);
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('testimonials')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .order('testimonial_date', { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (params.featured !== undefined) {
    query = query.eq('is_featured', params.featured);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    testimonials: data,
    pagination: {
      page,
      limit,
      total: count || 0,
      hasMore: count ? offset + limit < count : false,
    },
  };
}

export async function getTestimonial(id: number) {
  if (!supabaseAdmin) {
    throw new Error('Supabase client not initialized');
  }

  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}
