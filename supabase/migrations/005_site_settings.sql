-- Migration 005: Site settings table
-- Stores all configurable site settings (dev_mode, logo, favicon, etc.)

CREATE TABLE IF NOT EXISTS public.site_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.site_settings (key, value) VALUES
  ('dev_mode',             'false'),
  ('maintenance_mode',     'false'),
  ('contact_form_enabled', 'true'),
  ('mcp_enabled',          'true'),
  ('website_name',         '"My Portfolio"'),
  ('favicon_url',          'null'),
  ('logo',                 '{"url":null,"style":"rounded","layout":"image-text-side","text":null,"size":"md"}')
ON CONFLICT (key) DO NOTHING;
