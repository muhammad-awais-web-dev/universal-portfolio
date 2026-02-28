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

  // ── Write tools (require can_write API key permission) ─────────────────────
  {
    name: 'update_profile',
    description: 'Update the portfolio owner profile. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: {
        full_name: { type: 'string', description: 'Full name' },
        title: { type: 'string', description: 'Professional title' },
        bio: { type: 'string', description: 'Biography / about text' },
        email: { type: 'string', description: 'Contact email' },
        phone: { type: 'string', description: 'Phone number' },
        location: { type: 'string', description: 'Location / city' },
        website: { type: 'string', description: 'Personal website URL' },
        github_url: { type: 'string', description: 'GitHub profile URL' },
        linkedin_url: { type: 'string', description: 'LinkedIn profile URL' },
        twitter_url: { type: 'string', description: 'Twitter/X profile URL' },
        avatar_url: { type: 'string', description: 'Avatar image URL' },
        resume_url: { type: 'string', description: 'Resume/CV file URL' },
        years_of_experience: { type: 'number', description: 'Years of professional experience' },
        is_available: { type: 'boolean', description: 'Available for new opportunities' },
      },
    },
  },
  {
    name: 'create_project',
    description: 'Create a new portfolio project. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Project title' },
        description: { type: 'string', description: 'Project description' },
        short_description: { type: 'string', description: 'Short summary' },
        category: { type: 'string', description: 'Project category' },
        status: { type: 'string', enum: ['draft', 'published', 'archived'] },
        start_date: { type: 'string', description: 'Start date YYYY-MM-DD' },
        end_date: { type: 'string', description: 'End date YYYY-MM-DD' },
        is_featured: { type: 'boolean' },
        github_url: { type: 'string' },
        live_url: { type: 'string' },
        thumbnail_url: { type: 'string' },
        skill_ids: { type: 'array', items: { type: 'number' }, description: 'Related skill IDs' },
      },
      required: ['title'],
    },
  },
  {
    name: 'update_project',
    description: 'Update an existing project by ID. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number', description: 'Project ID' } },
      required: ['id'],
    },
  },
  {
    name: 'delete_project',
    description: 'Permanently delete a project by ID. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number', description: 'Project ID' } },
      required: ['id'],
    },
  },
  {
    name: 'create_skill',
    description: 'Create a new skill entry. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Skill name' },
        category: { type: 'string', description: 'Skill category' },
        proficiency_level: { type: 'number', minimum: 1, maximum: 5 },
        years_of_experience: { type: 'number' },
        is_featured: { type: 'boolean' },
        icon_url: { type: 'string' },
      },
      required: ['name'],
    },
  },
  {
    name: 'update_skill',
    description: 'Update an existing skill by ID. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number', description: 'Skill ID' } },
      required: ['id'],
    },
  },
  {
    name: 'delete_skill',
    description: 'Permanently delete a skill by ID. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number', description: 'Skill ID' } },
      required: ['id'],
    },
  },
  {
    name: 'create_certification',
    description: 'Create a new certification entry. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Certification name' },
        issuing_organization: { type: 'string' },
        issue_date: { type: 'string', description: 'Issue date YYYY-MM-DD' },
        expiry_date: { type: 'string', description: 'Expiry date YYYY-MM-DD' },
        credential_id: { type: 'string' },
        credential_url: { type: 'string' },
        is_active: { type: 'boolean' },
      },
      required: ['name', 'issuing_organization', 'issue_date'],
    },
  },
  {
    name: 'update_certification',
    description: 'Update an existing certification by ID. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number', description: 'Certification ID' } },
      required: ['id'],
    },
  },
  {
    name: 'delete_certification',
    description: 'Permanently delete a certification by ID. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number', description: 'Certification ID' } },
      required: ['id'],
    },
  },
  {
    name: 'create_education',
    description: 'Create a new education entry. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: {
        institution: { type: 'string' },
        degree: { type: 'string' },
        field_of_study: { type: 'string' },
        start_date: { type: 'string', description: 'YYYY-MM-DD' },
        end_date: { type: 'string', description: 'YYYY-MM-DD' },
        is_current: { type: 'boolean' },
        gpa: { type: 'string' },
        description: { type: 'string' },
      },
      required: ['institution', 'degree', 'start_date'],
    },
  },
  {
    name: 'update_education',
    description: 'Update an existing education entry by ID. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number', description: 'Education ID' } },
      required: ['id'],
    },
  },
  {
    name: 'delete_education',
    description: 'Permanently delete an education entry by ID. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number', description: 'Education ID' } },
      required: ['id'],
    },
  },
  {
    name: 'create_experience',
    description: 'Create a new work experience entry. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Job title' },
        company: { type: 'string' },
        start_date: { type: 'string', description: 'YYYY-MM-DD' },
        end_date: { type: 'string', description: 'YYYY-MM-DD' },
        is_current: { type: 'boolean' },
        location: { type: 'string' },
        description: { type: 'string' },
        skill_ids: { type: 'array', items: { type: 'number' } },
      },
      required: ['title', 'company', 'start_date'],
    },
  },
  {
    name: 'update_experience',
    description: 'Update an existing work experience entry by ID. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number', description: 'Experience ID' } },
      required: ['id'],
    },
  },
  {
    name: 'delete_experience',
    description: 'Permanently delete a work experience entry by ID. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number', description: 'Experience ID' } },
      required: ['id'],
    },
  },
  {
    name: 'create_testimonial',
    description: 'Create a new testimonial. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Reviewer name' },
        position: { type: 'string' },
        comment: { type: 'string' },
        company: { type: 'string' },
        image_url: { type: 'string' },
        platform_name: { type: 'string' },
        testimonial_date: { type: 'string', description: 'YYYY-MM' },
        is_featured: { type: 'boolean' },
        is_active: { type: 'boolean' },
      },
      required: ['name', 'position', 'comment'],
    },
  },
  {
    name: 'update_testimonial',
    description: 'Update an existing testimonial by ID. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number', description: 'Testimonial ID' } },
      required: ['id'],
    },
  },
  {
    name: 'delete_testimonial',
    description: 'Permanently delete a testimonial by ID. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number', description: 'Testimonial ID' } },
      required: ['id'],
    },
  },
];
