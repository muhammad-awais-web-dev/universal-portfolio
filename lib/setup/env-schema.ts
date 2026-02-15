// Environment Variable Schema
// Defines all required and optional environment variables

export interface EnvVariable {
  key: string;
  required: boolean;
  category: 'database' | 'auth' | 'media' | 'mcp';
  description: string;
  setupUrl?: string;
  instructions: string;
}

export const ENV_VARIABLES: EnvVariable[] = [
  // Database (Supabase)
  {
    key: 'SUPABASE_URL',
    required: true,
    category: 'database',
    description: 'Supabase project URL',
    setupUrl: 'https://supabase.com/dashboard',
    instructions: 'Go to Supabase Dashboard → Project Settings → API → Project URL',
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    required: true,
    category: 'database',
    description: 'Supabase service role secret key',
    setupUrl: 'https://supabase.com/dashboard',
    instructions: 'Go to Supabase Dashboard → Project Settings → API → service_role secret',
  },
  
  // Authentication
  {
    key: 'ADMIN_PASSPHRASE',
    required: true,
    category: 'auth',
    description: 'Admin login passphrase (125+ characters)',
    instructions: 'Generate a strong 125-character passphrase. Use: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'base64\'))"',
  },
  
  // MCP Server
  {
    key: 'MCP_API_KEY',
    required: false,
    category: 'mcp',
    description: 'Fallback MCP API key (optional if using database keys)',
    instructions: 'Generate with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))" or create via Settings page',
  },
  
  // Cloudinary (Optional)
  {
    key: 'CLOUDINARY_CLOUD_NAME',
    required: false,
    category: 'media',
    description: 'Cloudinary cloud name',
    setupUrl: 'https://console.cloudinary.com/',
    instructions: 'Go to Cloudinary Dashboard → Account Details → Cloud name',
  },
  {
    key: 'CLOUDINARY_API_KEY',
    required: false,
    category: 'media',
    description: 'Cloudinary API key',
    setupUrl: 'https://console.cloudinary.com/',
    instructions: 'Go to Cloudinary Dashboard → Account Details → API Key',
  },
  {
    key: 'CLOUDINARY_API_SECRET',
    required: false,
    category: 'media',
    description: 'Cloudinary API secret',
    setupUrl: 'https://console.cloudinary.com/',
    instructions: 'Go to Cloudinary Dashboard → Account Details → API Secret',
  },
  {
    key: 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
    required: false,
    category: 'media',
    description: 'Cloudinary cloud name (client-side)',
    instructions: 'Same as CLOUDINARY_CLOUD_NAME - used for client-side uploads',
  },
];

export const CATEGORY_INFO = {
  database: {
    name: 'Database',
    description: 'Supabase PostgreSQL database connection',
  },
  auth: {
    name: 'Authentication',
    description: 'Admin access control',
  },
  media: {
    name: 'Media Storage',
    description: 'Cloudinary image hosting (optional)',
  },
  mcp: {
    name: 'MCP Server',
    description: 'Model Context Protocol API for AI agents',
  },
} as const;
