-- Testimonials Migration
-- Migration 002: Add testimonials table
-- Created: 2026-02-13

-- ============================================================================
-- TESTIMONIALS TABLE
-- Stores client/colleague testimonials and recommendations
-- ============================================================================
CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    company TEXT,
    image_url TEXT,
    platform_name TEXT,
    platform_logo_url TEXT,
    comment TEXT NOT NULL,
    testimonial_date DATE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_testimonials_profile_id ON testimonials(profile_id);
CREATE INDEX idx_testimonials_is_featured ON testimonials(is_featured);
CREATE INDEX idx_testimonials_is_active ON testimonials(is_active);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active testimonials
CREATE POLICY "Public testimonials are viewable by everyone"
    ON testimonials FOR SELECT
    USING (true);

-- Policy: Authenticated users can insert their own testimonials
CREATE POLICY "Users can insert their own testimonials"
    ON testimonials FOR INSERT
    WITH CHECK (true);

-- Policy: Authenticated users can update their own testimonials
CREATE POLICY "Users can update their own testimonials"
    ON testimonials FOR UPDATE
    USING (true);

-- Policy: Authenticated users can delete their own testimonials
CREATE POLICY "Users can delete their own testimonials"
    ON testimonials FOR DELETE
    USING (true);

-- ============================================================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
