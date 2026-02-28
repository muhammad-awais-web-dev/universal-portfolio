export const migration_001_initial_schema = `
-- Universal Portfolio Database Schema
-- Migration 001: Initial schema for profiles, projects, skills, certifications, education, experience

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS profiles (
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

CREATE TABLE IF NOT EXISTS project_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skill_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    body_html TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT,
    description TEXT,
    body_html TEXT,
    live_url TEXT,
    repo_url TEXT,
    featured_image TEXT NOT NULL,
    image_gallery TEXT[],
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_is_published ON projects(is_published);

CREATE TABLE IF NOT EXISTS project_images (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    cloudinary_public_id TEXT NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT,
    width INTEGER,
    height INTEGER,
    format TEXT,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_position ON project_images(project_id, position);

CREATE TABLE IF NOT EXISTS certifications (
    id SERIAL PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    authority TEXT,
    credential_url TEXT,
    issued_date DATE,
    expiration_date DATE,
    featured_image TEXT NOT NULL,
    image_gallery TEXT[],
    is_active BOOLEAN DEFAULT true,
    body_html TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certifications_profile_id ON certifications(profile_id);
CREATE INDEX IF NOT EXISTS idx_certifications_is_active ON certifications(is_active);

CREATE TABLE IF NOT EXISTS education (
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
    body_html TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_education_profile_id ON education(profile_id);
CREATE INDEX IF NOT EXISTS idx_education_is_current ON education(is_current);

CREATE TABLE IF NOT EXISTS experience (
    id SERIAL PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    title TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    location TEXT,
    description TEXT,
    body_html TEXT,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_experience_profile_id ON experience(profile_id);
CREATE INDEX IF NOT EXISTS idx_experience_is_current ON experience(is_current);

CREATE TABLE IF NOT EXISTS project_skills (
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, skill_id)
);

CREATE TABLE IF NOT EXISTS project_categories_junction (
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES project_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

CREATE TABLE IF NOT EXISTS skill_categories_junction (
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (skill_id, category_id)
);

CREATE TABLE IF NOT EXISTS certification_skills (
    certification_id INTEGER NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (certification_id, skill_id)
);

CREATE TABLE IF NOT EXISTS certification_projects (
    certification_id INTEGER NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    PRIMARY KEY (certification_id, project_id)
);

CREATE TABLE IF NOT EXISTS education_skills (
    education_id INTEGER NOT NULL REFERENCES education(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (education_id, skill_id)
);

CREATE TABLE IF NOT EXISTS education_projects (
    education_id INTEGER NOT NULL REFERENCES education(id) ON DELETE CASCADE,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    PRIMARY KEY (education_id, project_id)
);

CREATE TABLE IF NOT EXISTS experience_skills (
    experience_id INTEGER NOT NULL REFERENCES experience(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (experience_id, skill_id)
);

CREATE TABLE IF NOT EXISTS experience_projects (
    experience_id INTEGER NOT NULL REFERENCES experience(id) ON DELETE CASCADE,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    PRIMARY KEY (experience_id, project_id)
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Public can read published projects') THEN
    CREATE POLICY "Public can read published projects" ON projects FOR SELECT USING (is_published = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Public can read profile') THEN
    CREATE POLICY "Public can read profile" ON profiles FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'skills' AND policyname = 'Public can read skills') THEN
    CREATE POLICY "Public can read skills" ON skills FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'skill_categories' AND policyname = 'Public can read skill categories') THEN
    CREATE POLICY "Public can read skill categories" ON skill_categories FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_categories' AND policyname = 'Public can read project categories') THEN
    CREATE POLICY "Public can read project categories" ON project_categories FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'certifications' AND policyname = 'Public can read active certifications') THEN
    CREATE POLICY "Public can read active certifications" ON certifications FOR SELECT USING (is_active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'education' AND policyname = 'Public can read education') THEN
    CREATE POLICY "Public can read education" ON education FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'experience' AND policyname = 'Public can read experience') THEN
    CREATE POLICY "Public can read experience" ON experience FOR SELECT USING (true);
  END IF;
END $$;

INSERT INTO profiles (id, full_name)
VALUES ('00000000-0000-0000-0000-000000000000', 'Portfolio Owner')
ON CONFLICT (id) DO NOTHING;
`;
