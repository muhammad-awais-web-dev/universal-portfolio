// MCP Tool Schemas
// Defines all available MCP tools for AI agents

import { MCPTool } from './types';

export const MCP_TOOLS: MCPTool[] = [
  {
    name: 'get_profile',
    description: 'Get the portfolio owner\'s profile information including name, bio, contact details, and social links',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'list_projects',
    description: 'List all published projects with optional filtering by category or skill. Supports pagination.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by project category name',
        },
        skill: {
          type: 'string',
          description: 'Filter by skill name',
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
          minimum: 1,
        },
        limit: {
          type: 'number',
          description: 'Number of results per page (default: 10, max: 50)',
          minimum: 1,
          maximum: 50,
        },
      },
    },
  },
  {
    name: 'get_project',
    description: 'Get detailed information about a specific project by ID or slug, including description, images, technologies used, and related skills',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Project ID',
        },
        slug: {
          type: 'string',
          description: 'Project slug (URL-friendly identifier)',
        },
      },
    },
  },
  {
    name: 'list_skills',
    description: 'List all skills with optional category filtering. Supports pagination.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by skill category name',
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
          minimum: 1,
        },
        limit: {
          type: 'number',
          description: 'Number of results per page (default: 20, max: 100)',
          minimum: 1,
          maximum: 100,
        },
      },
    },
  },
  {
    name: 'get_skill',
    description: 'Get detailed information about a specific skill by ID or name',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Skill ID',
        },
        name: {
          type: 'string',
          description: 'Skill name',
        },
      },
    },
  },
  {
    name: 'list_certifications',
    description: 'List all active certifications with details about issuing authority and dates',
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
          minimum: 1,
        },
        limit: {
          type: 'number',
          description: 'Number of results per page (default: 10, max: 50)',
          minimum: 1,
          maximum: 50,
        },
      },
    },
  },
  {
    name: 'get_certification',
    description: 'Get detailed information about a specific certification by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Certification ID',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'list_education',
    description: 'List education history with institution, degree, and field of study information',
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
          minimum: 1,
        },
        limit: {
          type: 'number',
          description: 'Number of results per page (default: 10, max: 50)',
          minimum: 1,
          maximum: 50,
        },
      },
    },
  },
  {
    name: 'get_education',
    description: 'Get detailed information about a specific education entry by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Education ID',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'list_experience',
    description: 'List work experience history with company, role, and duration information',
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
          minimum: 1,
        },
        limit: {
          type: 'number',
          description: 'Number of results per page (default: 10, max: 50)',
          minimum: 1,
          maximum: 50,
        },
      },
    },
  },
  {
    name: 'get_experience',
    description: 'Get detailed information about a specific work experience entry by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Experience ID',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'list_testimonials',
    description: 'List active testimonials from clients and colleagues',
    inputSchema: {
      type: 'object',
      properties: {
        featured: {
          type: 'boolean',
          description: 'Filter for featured testimonials only',
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
          minimum: 1,
        },
        limit: {
          type: 'number',
          description: 'Number of results per page (default: 10, max: 50)',
          minimum: 1,
          maximum: 50,
        },
      },
    },
  },
  {
    name: 'get_testimonial',
    description: 'Get detailed information about a specific testimonial by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Testimonial ID',
        },
      },
      required: ['id'],
    },
  },
];
