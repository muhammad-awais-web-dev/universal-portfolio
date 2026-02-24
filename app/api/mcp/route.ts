// MCP Router Endpoint
// GET /api/mcp - Get available tools
// POST /api/mcp - Routes tool calls to appropriate endpoints

import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/mcp/auth';
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

export const GET = withAuth(handleGET);
export const POST = withAuth(handlePOST);
