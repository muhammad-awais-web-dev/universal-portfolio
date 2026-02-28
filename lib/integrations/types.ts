export type IntegrationKey = 'cloudinary' | 'resend';
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

export type IntegrationConfig = CloudinaryConfig | ResendConfig | Record<string, string>;

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
