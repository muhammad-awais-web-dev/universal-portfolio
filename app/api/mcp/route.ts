// MCP Router Endpoint
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
  parameters?: Record<string, any>;
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
        result = await getProject(parameters.id);
        break;

      case 'list_skills':
        result = await listSkills(parameters);
        break;

      case 'get_skill':
        if (!parameters.id) {
          throw new Error('Skill ID is required');
        }
        result = await getSkill(parameters.id);
        break;

      case 'list_certifications':
        result = await listCertifications(parameters);
        break;

      case 'get_certification':
        if (!parameters.id) {
          throw new Error('Certification ID is required');
        }
        result = await getCertification(parameters.id);
        break;

      case 'list_education':
        result = await listEducation(parameters);
        break;

      case 'get_education':
        if (!parameters.id) {
          throw new Error('Education ID is required');
        }
        result = await getEducation(parameters.id);
        break;

      case 'list_experience':
        result = await listExperience(parameters);
        break;

      case 'get_experience':
        if (!parameters.id) {
          throw new Error('Experience ID is required');
        }
        result = await getExperience(parameters.id);
        break;

      case 'list_testimonials':
        result = await listTestimonials(parameters);
        break;

      case 'get_testimonial':
        if (!parameters.id) {
          throw new Error('Testimonial ID is required');
        }
        result = await getTestimonial(parameters.id);
        break;

      default:
        return Response.json(
          mcpResponse(null, false, `Unknown tool: ${tool}`),
          { status: 400 }
        );
    }

    return Response.json(mcpResponse(result));
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : 500;
    return Response.json(
      mcpResponse(null, false, error.message),
      { status }
    );
  }
}

export const POST = withAuth(handlePOST);
