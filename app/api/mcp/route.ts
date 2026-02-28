// MCP Router Endpoint
// GET /api/mcp - Get available tools
// POST /api/mcp - Routes tool calls to appropriate endpoints

import { NextRequest } from 'next/server';
import { withAuth, withWriteAuth } from '@/lib/mcp/auth';
import {
  getProfile,
  listProjects,
  getProject,
  listSkills,
  getSkill,
  listCertifications,
  getCertification,
  listEducation,
  getEducation,
  listExperience,
  getExperience,
  listTestimonials,
  getTestimonial,
  // Write operations
  updateProfile,
  createProject,
  updateProject,
  deleteProject,
  createSkill,
  updateSkill,
  deleteSkill,
  createCertification,
  updateCertification,
  deleteCertification,
  createEducation,
  updateEducation,
  deleteEducation,
  createExperience,
  updateExperience,
  deleteExperience,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  mcpResponse,
} from '@/lib/mcp/service';

interface ToolCallRequest {
  tool: string;
  parameters?: Record<string, unknown>;
}

// Define available tools with their metadata
const AVAILABLE_TOOLS = [
  {
    name: 'get_profile',
    description: 'Get the portfolio owner\'s profile information including name, bio, contact details, and social links',
    parameters: {},
    required: []
  },
  {
    name: 'list_projects',
    description: 'List all published projects with optional filtering by category or skill. Supports pagination.',
    parameters: {
      category: 'string (optional) - Filter by category name',
      skill: 'string (optional) - Filter by skill name',
      page: 'number (optional) - Page number (default: 1)',
      limit: 'number (optional) - Results per page (default: 10, max: 50)'
    },
    required: []
  },
  {
    name: 'get_project',
    description: 'Get detailed information about a specific project by ID or slug',
    parameters: {
      id: 'string or number (required) - Project ID or slug'
    },
    required: ['id']
  },
  {
    name: 'list_skills',
    description: 'List all skills with optional category filtering. Supports pagination.',
    parameters: {
      category: 'string (optional) - Filter by category name',
      page: 'number (optional) - Page number (default: 1)',
      limit: 'number (optional) - Results per page (default: 20, max: 100)'
    },
    required: []
  },
  {
    name: 'get_skill',
    description: 'Get detailed information about a specific skill by ID or name',
    parameters: {
      id: 'string or number (required) - Skill ID or name'
    },
    required: ['id']
  },
  {
    name: 'list_certifications',
    description: 'List all active certifications with details about issuing authority and dates',
    parameters: {
      page: 'number (optional) - Page number (default: 1)',
      limit: 'number (optional) - Results per page (default: 10, max: 50)'
    },
    required: []
  },
  {
    name: 'get_certification',
    description: 'Get detailed information about a specific certification by ID',
    parameters: {
      id: 'number (required) - Certification ID'
    },
    required: ['id']
  },
  {
    name: 'list_education',
    description: 'List education history with institution, degree, and field of study information',
    parameters: {
      page: 'number (optional) - Page number (default: 1)',
      limit: 'number (optional) - Results per page (default: 10, max: 50)'
    },
    required: []
  },
  {
    name: 'get_education',
    description: 'Get detailed information about a specific education entry by ID',
    parameters: {
      id: 'number (required) - Education ID'
    },
    required: ['id']
  },
  {
    name: 'list_experience',
    description: 'List work experience history with company, role, and duration information',
    parameters: {
      page: 'number (optional) - Page number (default: 1)',
      limit: 'number (optional) - Results per page (default: 10, max: 50)'
    },
    required: []
  },
  {
    name: 'get_experience',
    description: 'Get detailed information about a specific work experience entry by ID',
    parameters: {
      id: 'number (required) - Experience ID'
    },
    required: ['id']
  },
  {
    name: 'list_testimonials',
    description: 'List active testimonials from clients and colleagues',
    parameters: {
      featured: 'boolean (optional) - Filter for featured testimonials only',
      page: 'number (optional) - Page number (default: 1)',
      limit: 'number (optional) - Results per page (default: 10, max: 50)'
    },
    required: []
  },
  {
    name: 'get_testimonial',
    description: 'Get detailed information about a specific testimonial by ID',
    parameters: {
      id: 'number (required) - Testimonial ID'
    },
    required: ['id']
  },
  // ── Write tools (require API key with can_write = true) ──────────────────
  {
    name: 'update_profile',
    description: 'Update the portfolio owner profile (name, bio, email, social links, etc.)',
    parameters: {
      full_name: 'string (optional)', tagline: 'string (optional)', bio: 'string (optional)',
      email: 'string (optional)', phone: 'string (optional)', location: 'string (optional)',
      website: 'string (optional)', avatar_url: 'string (optional)',
      github: 'string (optional)', linkedin: 'string (optional)',
      twitter: 'string (optional)', instagram: 'string (optional)', youtube: 'string (optional)'
    },
    required: [], requiresWrite: true
  },
  {
    name: 'create_project',
    description: 'Create a new project',
    parameters: {
      title: 'string (required)', slug: 'string (required)',
      short_description: 'string (optional)', description: 'string (optional)',
      live_url: 'string (optional)', repo_url: 'string (optional)',
      featured_image: 'string (optional)', is_published: 'boolean (optional)',
      skill_ids: 'number[] (optional)', category_ids: 'number[] (optional)'
    },
    required: ['title', 'slug'], requiresWrite: true
  },
  {
    name: 'update_project',
    description: 'Update an existing project by ID',
    parameters: { id: 'number (required)', '...': 'same fields as create_project (all optional)' },
    required: ['id'], requiresWrite: true
  },
  {
    name: 'delete_project',
    description: 'Permanently delete a project by ID',
    parameters: { id: 'number (required)' },
    required: ['id'], requiresWrite: true
  },
  {
    name: 'create_skill',
    description: 'Create a new skill',
    parameters: { name: 'string (required)', logo_url: 'string (optional)', body_html: 'string (optional)', category_ids: 'number[] (optional)' },
    required: ['name'], requiresWrite: true
  },
  {
    name: 'update_skill',
    description: 'Update an existing skill by ID',
    parameters: { id: 'number (required)', '...': 'same fields as create_skill (all optional)' },
    required: ['id'], requiresWrite: true
  },
  {
    name: 'delete_skill',
    description: 'Permanently delete a skill by ID',
    parameters: { id: 'number (required)' },
    required: ['id'], requiresWrite: true
  },
  {
    name: 'create_certification',
    description: 'Create a new certification',
    parameters: {
      title: 'string (required)', authority: 'string (optional)',
      credential_url: 'string (optional)', issued_date: 'string YYYY-MM-DD (optional)',
      expiration_date: 'string YYYY-MM-DD (optional)', is_active: 'boolean (optional)',
      skill_ids: 'number[] (optional)'
    },
    required: ['title'], requiresWrite: true
  },
  {
    name: 'update_certification',
    description: 'Update an existing certification by ID',
    parameters: { id: 'number (required)', '...': 'same fields as create_certification (all optional)' },
    required: ['id'], requiresWrite: true
  },
  {
    name: 'delete_certification',
    description: 'Permanently delete a certification by ID',
    parameters: { id: 'number (required)' },
    required: ['id'], requiresWrite: true
  },
  {
    name: 'create_education',
    description: 'Create a new education entry',
    parameters: {
      institution: 'string (required)', degree: 'string (optional)',
      field_of_study: 'string (optional)', start_date: 'string YYYY-MM-DD (optional)',
      end_date: 'string YYYY-MM-DD (optional)', is_current: 'boolean (optional)',
      grade: 'string (optional)', description: 'string (optional)', skill_ids: 'number[] (optional)'
    },
    required: ['institution'], requiresWrite: true
  },
  {
    name: 'update_education',
    description: 'Update an existing education entry by ID',
    parameters: { id: 'number (required)', '...': 'same fields as create_education (all optional)' },
    required: ['id'], requiresWrite: true
  },
  {
    name: 'delete_education',
    description: 'Permanently delete an education entry by ID',
    parameters: { id: 'number (required)' },
    required: ['id'], requiresWrite: true
  },
  {
    name: 'create_experience',
    description: 'Create a new work experience entry',
    parameters: {
      title: 'string (required)', company: 'string (required)',
      start_date: 'string YYYY-MM-DD (required)', end_date: 'string YYYY-MM-DD (optional)',
      is_current: 'boolean (optional)', location: 'string (optional)',
      description: 'string (optional)', skill_ids: 'number[] (optional)'
    },
    required: ['title', 'company', 'start_date'], requiresWrite: true
  },
  {
    name: 'update_experience',
    description: 'Update an existing work experience entry by ID',
    parameters: { id: 'number (required)', '...': 'same fields as create_experience (all optional)' },
    required: ['id'], requiresWrite: true
  },
  {
    name: 'delete_experience',
    description: 'Permanently delete a work experience entry by ID',
    parameters: { id: 'number (required)' },
    required: ['id'], requiresWrite: true
  },
  {
    name: 'create_testimonial',
    description: 'Create a new testimonial',
    parameters: {
      name: 'string (required)', position: 'string (required)',
      comment: 'string (required)', company: 'string (optional)',
      image_url: 'string (optional)', platform_name: 'string (optional)',
      testimonial_date: 'string YYYY-MM (optional)',
      is_featured: 'boolean (optional)', is_active: 'boolean (optional)'
    },
    required: ['name', 'position', 'comment'], requiresWrite: true
  },
  {
    name: 'update_testimonial',
    description: 'Update an existing testimonial by ID',
    parameters: { id: 'number (required)', '...': 'same fields as create_testimonial (all optional)' },
    required: ['id'], requiresWrite: true
  },
  {
    name: 'delete_testimonial',
    description: 'Permanently delete a testimonial by ID',
    parameters: { id: 'number (required)' },
    required: ['id'], requiresWrite: true
  }
];

async function handleGET(_request: NextRequest) {
  return Response.json(
    mcpResponse({
      name: 'Universal Portfolio MCP Router',
      version: '1.0.0',
      description: 'Dynamic router for accessing portfolio data. POST to this endpoint with {tool, parameters} to call any available tool.',
      totalTools: AVAILABLE_TOOLS.length,
      tools: AVAILABLE_TOOLS,
      usage: {
        method: 'POST',
        contentType: 'application/json',
        body: {
          tool: 'string (required) - Tool name from the list above',
          parameters: 'object (optional) - Tool-specific parameters'
        },
        example: {
          tool: 'list_projects',
          parameters: {
            category: 'Web',
            limit: 5
          }
        }
      }
    })
  );
}

async function handlePOST(request: NextRequest) {
  try {
    const body: ToolCallRequest = await request.json();
    const { tool, parameters = {} } = body;

    let result;

    switch (tool) {
      case 'get_profile':
        result = await getProfile();
        break;

      case 'list_projects':
        result = await listProjects(parameters);
        break;

      case 'get_project':
        if (!parameters.id) {
          throw new Error('Project ID is required');
        }
        result = await getProject(Number(parameters.id));
        break;

      case 'list_skills':
        result = await listSkills(parameters);
        break;

      case 'get_skill':
        if (!parameters.id) {
          throw new Error('Skill ID is required');
        }
        result = await getSkill(Number(parameters.id));
        break;

      case 'list_certifications':
        result = await listCertifications(parameters);
        break;

      case 'get_certification':
        if (!parameters.id) {
          throw new Error('Certification ID is required');
        }
        result = await getCertification(Number(parameters.id));
        break;

      case 'list_education':
        result = await listEducation(parameters);
        break;

      case 'get_education':
        if (!parameters.id) {
          throw new Error('Education ID is required');
        }
        result = await getEducation(Number(parameters.id));
        break;

      case 'list_experience':
        result = await listExperience(parameters);
        break;

      case 'get_experience':
        if (!parameters.id) {
          throw new Error('Experience ID is required');
        }
        result = await getExperience(Number(parameters.id));
        break;

      case 'list_testimonials':
        result = await listTestimonials(parameters);
        break;

      case 'get_testimonial':
        if (!parameters.id) {
          throw new Error('Testimonial ID is required');
        }
        result = await getTestimonial(Number(parameters.id));
        break;

      default:
        return Response.json(
          mcpResponse(null, false, `Unknown tool: ${tool}`),
          { status: 400 }
        );
    }

    return Response.json(mcpResponse(result));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const status = message.includes('not found') ? 404 : 500;
    return Response.json(
      mcpResponse(null, false, message),
      { status }
    );
  }
}

/** Handle write tool calls — requires can_write permission */
async function handleWritePOST(request: NextRequest) {
  try {
    const body: ToolCallRequest = await request.json();
    const { tool, parameters = {} } = body;

    let result;

    switch (tool) {
      case 'update_profile':
        result = await updateProfile(parameters);
        break;

      case 'create_project':
        result = await createProject(parameters);
        break;

      case 'update_project':
        if (!parameters.id) throw new Error('Project ID is required');
        result = await updateProject(parameters);
        break;

      case 'delete_project':
        if (!parameters.id) throw new Error('Project ID is required');
        result = await deleteProject(Number(parameters.id));
        break;

      case 'create_skill':
        result = await createSkill(parameters);
        break;

      case 'update_skill':
        if (!parameters.id) throw new Error('Skill ID is required');
        result = await updateSkill(parameters);
        break;

      case 'delete_skill':
        if (!parameters.id) throw new Error('Skill ID is required');
        result = await deleteSkill(Number(parameters.id));
        break;

      case 'create_certification':
        result = await createCertification(parameters);
        break;

      case 'update_certification':
        if (!parameters.id) throw new Error('Certification ID is required');
        result = await updateCertification(parameters);
        break;

      case 'delete_certification':
        if (!parameters.id) throw new Error('Certification ID is required');
        result = await deleteCertification(Number(parameters.id));
        break;

      case 'create_education':
        result = await createEducation(parameters);
        break;

      case 'update_education':
        if (!parameters.id) throw new Error('Education ID is required');
        result = await updateEducation(parameters);
        break;

      case 'delete_education':
        if (!parameters.id) throw new Error('Education ID is required');
        result = await deleteEducation(Number(parameters.id));
        break;

      case 'create_experience':
        result = await createExperience(parameters);
        break;

      case 'update_experience':
        if (!parameters.id) throw new Error('Experience ID is required');
        result = await updateExperience(parameters);
        break;

      case 'delete_experience':
        if (!parameters.id) throw new Error('Experience ID is required');
        result = await deleteExperience(Number(parameters.id));
        break;

      case 'create_testimonial':
        result = await createTestimonial(parameters);
        break;

      case 'update_testimonial':
        if (!parameters.id) throw new Error('Testimonial ID is required');
        result = await updateTestimonial(parameters);
        break;

      case 'delete_testimonial':
        if (!parameters.id) throw new Error('Testimonial ID is required');
        result = await deleteTestimonial(Number(parameters.id));
        break;

      default:
        return Response.json(
          mcpResponse(null, false, `Unknown write tool: ${tool}`),
          { status: 400 }
        );
    }

    return Response.json(mcpResponse(result));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const isValidation = message.toLowerCase().includes('invalid') || message.toLowerCase().includes('required');
    return Response.json(
      mcpResponse(null, false, message),
      { status: isValidation ? 422 : 500 }
    );
  }
}

/**
 * Route POST based on whether the tool is a read or write tool.
 * Read tools: any valid API key.
 * Write tools: API key with can_write = true.
 */
const READ_TOOLS = new Set([
  'get_profile', 'list_projects', 'get_project', 'list_skills', 'get_skill',
  'list_certifications', 'get_certification', 'list_education', 'get_education',
  'list_experience', 'get_experience', 'list_testimonials', 'get_testimonial',
]);

async function routePOST(request: NextRequest) {
  // Clone the request so we can read the body twice
  const cloned = request.clone();
  let tool: string | undefined;
  try {
    const body = await cloned.json();
    tool = body?.tool;
  } catch {
    // will fail in the handler with a better error
  }

  if (tool && READ_TOOLS.has(tool)) {
    return withAuth(handlePOST)(request, {});
  }
  return withWriteAuth(handleWritePOST)(request, {});
}

export const GET = withAuth(handleGET);
export const POST = routePOST;
