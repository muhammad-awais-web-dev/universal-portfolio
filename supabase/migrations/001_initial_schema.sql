-- Universal Portfolio Database Schema
-- Migration 001: Initial schema for profiles, projects, skills, certifications, education, experience
-- Generated: 2026-02-09

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- Single-user portfolio: stores owner's personal information
-- ============================================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT,
    tagline TEXT,
    bio TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    website TEXT,
    avatar_url TEXT,
    github TEXT,
    linkedin TEXT,
    twitter TEXT,
    instagram TEXT,
    youtube TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CATEGORIES
-- ============================================================================
CREATE TABLE project_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE skill_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SKILLS TABLE
-- ============================================================================
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    body_html TEXT, -- Rich HTML content for skill details
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PROJECTS TABLE
-- ============================================================================
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT,
    description TEXT,
    body_html TEXT, -- Rich HTML content
    live_url TEXT,
    repo_url TEXT,
    featured_image TEXT NOT NULL, -- Required Cloudinary URL
    image_gallery TEXT[], -- Array of Cloudinary URLs
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_is_published ON projects(is_published);

-- ============================================================================
-- PROJECT IMAGES TABLE
-- Stores detailed Cloudinary image metadata with alt text for accessibility
-- ============================================================================
CREATE TABLE project_images (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    cloudinary_public_id TEXT NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT, -- Accessibility
    width INTEGER,
    height INTEGER,
    format TEXT,
    position INTEGER DEFAULT 0, -- Display order
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_project_images_project_id ON project_images(project_id);
CREATE INDEX idx_project_images_position ON project_images(project_id, position);

-- ============================================================================
-- CERTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE certifications (
    id SERIAL PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    authority TEXT,
    credential_url TEXT,
    issued_date DATE,
    expiration_date DATE,
    featured_image TEXT NOT NULL, -- Required Cloudinary URL
    image_gallery TEXT[], -- Array of Cloudinary URLs
    is_active BOOLEAN DEFAULT true,
    body_html TEXT, -- Rich HTML content
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_certifications_profile_id ON certifications(profile_id);
CREATE INDEX idx_certifications_is_active ON certifications(is_active);

-- ============================================================================
-- EDUCATION TABLE
-- ============================================================================
CREATE TABLE education (
    id SERIAL PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    institution TEXT NOT NULL,
    degree TEXT,
    field_of_study TEXT,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    grade TEXT,
    description TEXT,
    body_html TEXT, -- Rich HTML content
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_education_profile_id ON education(profile_id);
CREATE INDEX idx_education_is_current ON education(is_current);

-- ============================================================================
-- EXPERIENCE TABLE
-- ============================================================================
CREATE TABLE experience (
    id SERIAL PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    title TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    location TEXT,
    description TEXT,
    body_html TEXT, -- Rich HTML content
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_experience_profile_id ON experience(profile_id);
CREATE INDEX idx_experience_is_current ON experience(is_current);

-- ============================================================================
-- JUNCTION TABLES (Many-to-Many Relationships)
-- ============================================================================

-- Projects <-> Skills
CREATE TABLE project_skills (
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, skill_id)
);

CREATE INDEX idx_project_skills_project_id ON project_skills(project_id);
CREATE INDEX idx_project_skills_skill_id ON project_skills(skill_id);

-- Projects <-> Categories
CREATE TABLE project_categories_junction (
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES project_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

CREATE INDEX idx_project_categories_project_id ON project_categories_junction(project_id);
CREATE INDEX idx_project_categories_category_id ON project_categories_junction(category_id);

-- Skills <-> Categories
CREATE TABLE skill_categories_junction (
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (skill_id, category_id)
);

CREATE INDEX idx_skill_categories_skill_id ON skill_categories_junction(skill_id);
CREATE INDEX idx_skill_categories_category_id ON skill_categories_junction(category_id);

-- Certifications <-> Skills
CREATE TABLE certification_skills (
    certification_id INTEGER NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (certification_id, skill_id)
);

CREATE INDEX idx_certification_skills_cert_id ON certification_skills(certification_id);
CREATE INDEX idx_certification_skills_skill_id ON certification_skills(skill_id);

-- Certifications <-> Projects
CREATE TABLE certification_projects (
    certification_id INTEGER NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    PRIMARY KEY (certification_id, project_id)
);

CREATE INDEX idx_certification_projects_cert_id ON certification_projects(certification_id);
CREATE INDEX idx_certification_projects_project_id ON certification_projects(project_id);

-- Education <-> Skills
CREATE TABLE education_skills (
    education_id INTEGER NOT NULL REFERENCES education(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (education_id, skill_id)
);

CREATE INDEX idx_education_skills_education_id ON education_skills(education_id);
CREATE INDEX idx_education_skills_skill_id ON education_skills(skill_id);

-- Education <-> Projects
CREATE TABLE education_projects (
    education_id INTEGER NOT NULL REFERENCES education(id) ON DELETE CASCADE,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    PRIMARY KEY (education_id, project_id)
);

CREATE INDEX idx_education_projects_education_id ON education_projects(education_id);
CREATE INDEX idx_education_projects_project_id ON education_projects(project_id);

-- Experience <-> Skills
CREATE TABLE experience_skills (
    experience_id INTEGER NOT NULL REFERENCES experience(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (experience_id, skill_id)
);

CREATE INDEX idx_experience_skills_experience_id ON experience_skills(experience_id);
CREATE INDEX idx_experience_skills_skill_id ON experience_skills(skill_id);

-- Experience <-> Projects
CREATE TABLE experience_projects (
    experience_id INTEGER NOT NULL REFERENCES experience(id) ON DELETE CASCADE,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    PRIMARY KEY (experience_id, project_id)
);

CREATE INDEX idx_experience_projects_experience_id ON experience_projects(experience_id);
CREATE INDEX idx_experience_projects_project_id ON experience_projects(project_id);

-- ============================================================================
-- TRIGGERS: Auto-update timestamps
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Enable RLS on all tables; service_role bypasses RLS by default
-- For future: add policies if exposing direct client access
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_categories_junction ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories_junction ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_projects ENABLE ROW LEVEL SECURITY;

-- Public read access policies (for future public portfolio site)
-- Admin writes are handled server-side via service_role key (bypasses RLS)

CREATE POLICY "Public can read published projects" ON projects
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read profile" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Public can read skills" ON skills
    FOR SELECT USING (true);

CREATE POLICY "Public can read skill categories" ON skill_categories
    FOR SELECT USING (true);

CREATE POLICY "Public can read project categories" ON project_categories
    FOR SELECT USING (true);

CREATE POLICY "Public can read project images" ON project_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_images.project_id 
            AND projects.is_published = true
        )
    );

CREATE POLICY "Public can read active certifications" ON certifications
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read education" ON education
    FOR SELECT USING (true);

CREATE POLICY "Public can read experience" ON experience
    FOR SELECT USING (true);

-- Junction table policies (public read for related data)
CREATE POLICY "Public can read project skills" ON project_skills
    FOR SELECT USING (true);

CREATE POLICY "Public can read project categories junction" ON project_categories_junction
    FOR SELECT USING (true);

CREATE POLICY "Public can read skill categories junction" ON skill_categories_junction
    FOR SELECT USING (true);

CREATE POLICY "Public can read certification skills" ON certification_skills
    FOR SELECT USING (true);

CREATE POLICY "Public can read certification projects" ON certification_projects
    FOR SELECT USING (true);

CREATE POLICY "Public can read education skills" ON education_skills
    FOR SELECT USING (true);

CREATE POLICY "Public can read education projects" ON education_projects
    FOR SELECT USING (true);

CREATE POLICY "Public can read experience skills" ON experience_skills
    FOR SELECT USING (true);

CREATE POLICY "Public can read experience projects" ON experience_projects
    FOR SELECT USING (true);

-- ============================================================================
-- SEED DATA: Create default profile row
-- ============================================================================
INSERT INTO profiles (id, full_name) 
VALUES ('00000000-0000-0000-0000-000000000000', 'Portfolio Owner')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE profiles IS 'Single-user portfolio owner profile';
COMMENT ON TABLE projects IS 'Portfolio projects with rich content and images';
COMMENT ON TABLE project_images IS 'Detailed Cloudinary image metadata with alt text';
COMMENT ON TABLE skills IS 'Technical and soft skills';
COMMENT ON TABLE certifications IS 'Professional certifications and credentials';
COMMENT ON TABLE education IS 'Educational background';
COMMENT ON TABLE experience IS 'Work experience history';
