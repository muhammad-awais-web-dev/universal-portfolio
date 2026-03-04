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
        tagline: { type: 'string', description: 'Professional tagline' },
        bio: { type: 'string', description: 'Biography / about text' },
        email: { type: 'string', description: 'Contact email' },
        phone: { type: 'string', description: 'Phone number' },
        location: { type: 'string', description: 'Location / city' },
        website: { type: 'string', description: 'Personal website URL' },
        avatar_url: { type: 'string', description: 'Avatar image URL' },
        github: { type: 'string', description: 'GitHub profile URL' },
        linkedin: { type: 'string', description: 'LinkedIn profile URL' },
        twitter: { type: 'string', description: 'Twitter/X profile URL' },
        instagram: { type: 'string', description: 'Instagram profile URL' },
        youtube: { type: 'string', description: 'YouTube channel URL' },
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
        slug: { type: 'string', description: 'URL-friendly identifier' },
        short_description: { type: 'string', description: 'Short summary' },
        description: { type: 'string', description: 'Plain text description' },
        body_html: { type: 'string', description: 'Full rich HTML description' },
        live_url: { type: 'string', description: 'Live demo URL' },
        repo_url: { type: 'string', description: 'Source repository URL' },
        featured_image: { type: 'string', description: 'Featured image URL' },
        image_gallery: { type: 'array', items: { type: 'string' }, description: 'Array of gallery image URLs' },
        is_published: { type: 'boolean', description: 'Whether the project is publicly visible' },
        published_at: { type: 'string', description: 'Publish date (ISO 8601)' },
        skill_ids: { type: 'array', items: { type: 'number' }, description: 'Related skill IDs' },
        category_ids: { type: 'array', items: { type: 'number' }, description: 'Project category IDs' },
      },
      required: ['title', 'slug'],
    },
  },
  {
    name: 'update_project',
    description: 'Update an existing project by ID. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Project ID' },
        title: { type: 'string', description: 'Project title' },
        slug: { type: 'string', description: 'URL-friendly identifier' },
        short_description: { type: 'string', description: 'Short summary' },
        description: { type: 'string', description: 'Plain text description' },
        body_html: { type: 'string', description: 'Full rich HTML description' },
        live_url: { type: 'string', description: 'Live demo URL' },
        repo_url: { type: 'string', description: 'Source repository URL' },
        featured_image: { type: 'string', description: 'Featured image URL' },
        image_gallery: { type: 'array', items: { type: 'string' }, description: 'Array of gallery image URLs' },
        is_published: { type: 'boolean', description: 'Whether the project is publicly visible' },
        published_at: { type: 'string', description: 'Publish date (ISO 8601)' },
        skill_ids: { type: 'array', items: { type: 'number' }, description: 'Related skill IDs' },
        category_ids: { type: 'array', items: { type: 'number' }, description: 'Project category IDs' },
      },
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
        logo_url: { type: 'string', description: 'Logo image URL' },
        body_html: { type: 'string', description: 'Rich HTML description of the skill' },
        category_ids: { type: 'array', items: { type: 'number' }, description: 'Skill category IDs' },
      },
      required: ['name'],
    },
  },
  {
    name: 'update_skill',
    description: 'Update an existing skill by ID. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Skill ID' },
        name: { type: 'string', description: 'Skill name' },
        logo_url: { type: 'string', description: 'Logo image URL' },
        body_html: { type: 'string', description: 'Rich HTML description of the skill' },
        category_ids: { type: 'array', items: { type: 'number' }, description: 'Skill category IDs' },
      },
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
        title: { type: 'string', description: 'Certification title' },
        authority: { type: 'string', description: 'Issuing authority / organization' },
        credential_url: { type: 'string', description: 'URL to verify the credential' },
        issued_date: { type: 'string', description: 'Issue date YYYY-MM-DD' },
        expiration_date: { type: 'string', description: 'Expiry date YYYY-MM-DD' },
        is_active: { type: 'boolean', description: 'Whether the certification is currently active' },
        body_html: { type: 'string', description: 'Rich HTML description' },
        skill_ids: { type: 'array', items: { type: 'number' }, description: 'Related skill IDs' },
        project_ids: { type: 'array', items: { type: 'number' }, description: 'Related project IDs' },
      },
      required: ['title'],
    },
  },
  {
    name: 'update_certification',
    description: 'Update an existing certification by ID. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Certification ID' },
        title: { type: 'string', description: 'Certification title' },
        authority: { type: 'string', description: 'Issuing authority / organization' },
        credential_url: { type: 'string', description: 'URL to verify the credential' },
        issued_date: { type: 'string', description: 'Issue date YYYY-MM-DD' },
        expiration_date: { type: 'string', description: 'Expiry date YYYY-MM-DD' },
        is_active: { type: 'boolean', description: 'Whether the certification is currently active' },
        body_html: { type: 'string', description: 'Rich HTML description' },
        skill_ids: { type: 'array', items: { type: 'number' }, description: 'Related skill IDs' },
        project_ids: { type: 'array', items: { type: 'number' }, description: 'Related project IDs' },
      },
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
        institution: { type: 'string', description: 'Institution name' },
        degree: { type: 'string', description: 'Degree or qualification' },
        field_of_study: { type: 'string', description: 'Field or major' },
        start_date: { type: 'string', description: 'Start date YYYY-MM-DD' },
        end_date: { type: 'string', description: 'End date YYYY-MM-DD' },
        is_current: { type: 'boolean', description: 'Currently enrolled' },
        grade: { type: 'string', description: 'Grade or GPA' },
        description: { type: 'string', description: 'Plain text description' },
        body_html: { type: 'string', description: 'Rich HTML description' },
        skill_ids: { type: 'array', items: { type: 'number' }, description: 'Related skill IDs' },
        project_ids: { type: 'array', items: { type: 'number' }, description: 'Related project IDs' },
      },
      required: ['institution'],
    },
  },
  {
    name: 'update_education',
    description: 'Update an existing education entry by ID. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Education ID' },
        institution: { type: 'string', description: 'Institution name' },
        degree: { type: 'string', description: 'Degree or qualification' },
        field_of_study: { type: 'string', description: 'Field or major' },
        start_date: { type: 'string', description: 'Start date YYYY-MM-DD' },
        end_date: { type: 'string', description: 'End date YYYY-MM-DD' },
        is_current: { type: 'boolean', description: 'Currently enrolled' },
        grade: { type: 'string', description: 'Grade or GPA' },
        description: { type: 'string', description: 'Plain text description' },
        body_html: { type: 'string', description: 'Rich HTML description' },
        skill_ids: { type: 'array', items: { type: 'number' }, description: 'Related skill IDs' },
        project_ids: { type: 'array', items: { type: 'number' }, description: 'Related project IDs' },
      },
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
        company: { type: 'string', description: 'Company name' },
        start_date: { type: 'string', description: 'Start date YYYY-MM-DD' },
        end_date: { type: 'string', description: 'End date YYYY-MM-DD' },
        is_current: { type: 'boolean', description: 'Currently in this role' },
        location: { type: 'string', description: 'Work location' },
        description: { type: 'string', description: 'Plain text description' },
        body_html: { type: 'string', description: 'Rich HTML description' },
        skill_ids: { type: 'array', items: { type: 'number' }, description: 'Related skill IDs' },
        project_ids: { type: 'array', items: { type: 'number' }, description: 'Related project IDs' },
      },
      required: ['title', 'company', 'start_date'],
    },
  },
  {
    name: 'update_experience',
    description: 'Update an existing work experience entry by ID. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Experience ID' },
        title: { type: 'string', description: 'Job title' },
        company: { type: 'string', description: 'Company name' },
        start_date: { type: 'string', description: 'Start date YYYY-MM-DD' },
        end_date: { type: 'string', description: 'End date YYYY-MM-DD' },
        is_current: { type: 'boolean', description: 'Currently in this role' },
        location: { type: 'string', description: 'Work location' },
        description: { type: 'string', description: 'Plain text description' },
        body_html: { type: 'string', description: 'Rich HTML description' },
        skill_ids: { type: 'array', items: { type: 'number' }, description: 'Related skill IDs' },
        project_ids: { type: 'array', items: { type: 'number' }, description: 'Related project IDs' },
      },
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
        position: { type: 'string', description: 'Reviewer position / title' },
        comment: { type: 'string', description: 'Testimonial text' },
        company: { type: 'string', description: 'Reviewer company' },
        image_url: { type: 'string', description: 'Reviewer avatar URL' },
        platform_name: { type: 'string', description: 'Platform the testimonial came from' },
        testimonial_date: { type: 'string', description: 'Date YYYY-MM' },
        is_featured: { type: 'boolean', description: 'Show as featured testimonial' },
        is_active: { type: 'boolean', description: 'Whether the testimonial is visible' },
      },
      required: ['name', 'position', 'comment'],
    },
  },
  {
    name: 'update_testimonial',
    description: 'Update an existing testimonial by ID. Requires write permission.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Testimonial ID' },
        name: { type: 'string', description: 'Reviewer name' },
        position: { type: 'string', description: 'Reviewer position / title' },
        comment: { type: 'string', description: 'Testimonial text' },
        company: { type: 'string', description: 'Reviewer company' },
        image_url: { type: 'string', description: 'Reviewer avatar URL' },
        platform_name: { type: 'string', description: 'Platform the testimonial came from' },
        testimonial_date: { type: 'string', description: 'Date YYYY-MM' },
        is_featured: { type: 'boolean', description: 'Show as featured testimonial' },
        is_active: { type: 'boolean', description: 'Whether the testimonial is visible' },
      },
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
