// MCP Server Types
// Shared types for Model Context Protocol implementation

export interface MCPResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface MCPManifest {
  name: string;
  version: string;
  description: string;
  tools: MCPTool[];
}

// Filter and pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ProjectFilters extends PaginationParams {
  category?: string;
  skill?: string;
}

export interface SkillFilters extends PaginationParams {
  category?: string;
}
