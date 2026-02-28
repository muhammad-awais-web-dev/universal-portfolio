// Site settings type definitions and defaults

export type LogoStyle = 'circle' | 'rounded' | 'square';
export type LogoLayout = 'image-only' | 'image-text-side' | 'image-text-below' | 'text-only';
export type LogoSize = 'sm' | 'md' | 'lg';

export interface LogoSettings {
  /** Uploaded image URL — null means no image (text-only) */
  url: string | null;
  /** Shape of the image */
  style: LogoStyle;
  /** Whether to show text, and where relative to the image */
  layout: LogoLayout;
  /** Custom brand text — null means use profile full_name */
  text: string | null;
  /** Image display size */
  size: LogoSize;
}

export interface SiteSettings {
  // ── Tier 1: never cached — affect what users see ──────────────────────────
  /** Shows coming-soon page to visitors (admin still sees banner) */
  dev_mode: boolean;
  /** Same as dev_mode but semantically "site is down for maintenance" */
  maintenance_mode: boolean;
  /** Show/hide the contact form on the homepage */
  contact_form_enabled: boolean;

  // ── Tier 2: short-cached (5 min) — public cosmetics ──────────────────────
  /** Portfolio brand/site name shown in navbar and <title> */
  website_name: string;
  /** Logo image + display options */
  logo: LogoSettings;
  /** Whether the MCP API is accessible */
  mcp_enabled: boolean;
}

export const DEFAULT_LOGO: LogoSettings = {
  url: null,
  style: 'rounded',
  layout: 'image-text-side',
  text: null,
  size: 'md',
};

export const DEFAULT_SETTINGS: SiteSettings = {
  dev_mode: false,
  maintenance_mode: false,
  contact_form_enabled: true,
  website_name: 'My Portfolio',
  logo: DEFAULT_LOGO,
  mcp_enabled: true,
};

/** Keys whose values are never cached (Tier 1) */
export const LIVE_SETTING_KEYS: (keyof SiteSettings)[] = [
  'dev_mode',
  'maintenance_mode',
  'contact_form_enabled',
];

/** Keys that are safe to short-cache for public consumption (Tier 2) */
export const CACHED_SETTING_KEYS: (keyof SiteSettings)[] = [
  'website_name',
  'logo',
  'mcp_enabled',
];
