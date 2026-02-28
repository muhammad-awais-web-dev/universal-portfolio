export type IntegrationKey = 'cloudinary' | 'resend' | 'github';
export type IntegrationStatus = 'connected' | 'disconnected' | 'error';

export interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

export interface ResendConfig {
  api_key: string;
  contact_email: string;
}

export interface GitHubConfig {
  username: string;
  token?: string; // optional — public repos work without it
  repo?: string;  // optional default repo
  // Feature toggles
  show_commit_chart: boolean;
  show_top_languages: boolean;
  show_contribution_graph: boolean;
  show_pinned_repos: boolean;
  show_stats: boolean;
}

export type IntegrationConfig = CloudinaryConfig | ResendConfig | GitHubConfig | Record<string, string | boolean>;

export interface Integration {
  key: IntegrationKey;
  config: IntegrationConfig;
  status: IntegrationStatus;
  error_message: string | null;
  connected_at: string | null;
  updated_at: string;
}

/** Safe version returned to the client — credentials are masked */
export interface IntegrationPublic {
  key: IntegrationKey;
  status: IntegrationStatus;
  error_message: string | null;
  connected_at: string | null;
  updated_at: string;
  /** Masked config fields, e.g. { api_key: 're_****...abc' } */
  masked: Record<string, string>;
}
