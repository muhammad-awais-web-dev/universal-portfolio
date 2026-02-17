-- Project Categorization SQL Script
-- Creates comprehensive project categories and assigns projects

-- ============================================================================
-- PART 1: Create Project Categories
-- ============================================================================

-- Insert project categories (will skip if they already exist due to unique constraint)
INSERT INTO project_categories (name) VALUES
  ('Web Applications'),
  ('Mobile Applications'),
  ('Browser Extensions'),
  ('Developer Tools'),
  ('Open Source'),
  ('AI & Machine Learning'),
  ('E-Commerce'),
  ('Social Media'),
  ('Productivity Tools'),
  ('Educational Projects'),
  ('Portfolio & Personal'),
  ('API & Backend Services'),
  ('Data Visualization'),
  ('Gaming'),
  ('IoT & Hardware'),
  ('Security Tools'),
  ('Content Management'),
  ('Real-time Applications'),
  ('Automation Tools'),
  ('Full-Stack Applications')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- PART 2: Clear Existing Project-Category Assignments (Optional)
-- ============================================================================

-- Uncomment the line below if you want to reset all project categorizations
-- DELETE FROM project_categories_junction;

-- ============================================================================
-- PART 3: Auto-Categorize Projects Based on Keywords
-- ============================================================================

-- Web Applications
INSERT INTO project_categories_junction (project_id, category_id)
SELECT p.id, pc.id 
FROM projects p
CROSS JOIN project_categories pc
WHERE pc.name = 'Web Applications'
AND NOT EXISTS (
  SELECT 1 FROM project_categories_junction pcj 
  WHERE pcj.project_id = p.id AND pcj.category_id = pc.id
)
AND (
  LOWER(p.title) LIKE ANY(ARRAY['%web app%', '%website%', '%web portal%', '%dashboard%', '%web platform%'])
  OR LOWER(p.short_description) LIKE ANY(ARRAY['%web app%', '%website%', '%web development%', '%responsive%'])
  OR LOWER(p.description) LIKE ANY(ARRAY['%web application%', '%web-based%', '%browser-based%'])
);

-- Mobile Applications
INSERT INTO project_categories_junction (project_id, category_id)
SELECT p.id, pc.id 
FROM projects p
CROSS JOIN project_categories pc
WHERE pc.name = 'Mobile Applications'
AND NOT EXISTS (
  SELECT 1 FROM project_categories_junction pcj 
  WHERE pcj.project_id = p.id AND pcj.category_id = pc.id
)
AND (
  LOWER(p.title) LIKE ANY(ARRAY['%mobile%', '%ios%', '%android%', '%react native%', '%flutter%'])
  OR LOWER(p.short_description) LIKE ANY(ARRAY['%mobile app%', '%smartphone%', '%tablet%'])
  OR LOWER(p.description) LIKE ANY(ARRAY['%mobile application%', '%cross-platform%', '%native app%'])
);

-- Browser Extensions  
INSERT INTO project_categories_junction (project_id, category_id)
SELECT p.id, pc.id 
FROM projects p
CROSS JOIN project_categories pc
WHERE pc.name = 'Browser Extensions'
AND NOT EXISTS (
  SELECT 1 FROM project_categories_junction pcj 
  WHERE pcj.project_id = p.id AND pcj.category_id = pc.id
)
AND (
  LOWER(p.title) LIKE ANY(ARRAY['%extension%', '%chrome%', '%firefox%', '%browser%'])
  OR LOWER(p.short_description) LIKE ANY(ARRAY['%extension%', '%chrome%', '%browser tool%', '%add-on%'])
  OR LOWER(p.description) LIKE ANY(ARRAY['%browser extension%', '%chrome extension%', '%manifest%'])
);

-- Developer Tools
INSERT INTO project_categories_junction (project_id, category_id)
SELECT p.id, pc.id 
FROM projects p
CROSS JOIN project_categories pc
WHERE pc.name = 'Developer Tools'
AND NOT EXISTS (
  SELECT 1 FROM project_categories_junction pcj 
  WHERE pcj.project_id = p.id AND pcj.category_id = pc.id
)
AND (
  LOWER(p.title) LIKE ANY(ARRAY['%cli%', '%tool%', '%utility%', '%framework%', '%library%', '%sdk%'])
  OR LOWER(p.short_description) LIKE ANY(ARRAY['%developer%', '%development tool%', '%build tool%', '%testing%'])
  OR LOWER(p.description) LIKE ANY(ARRAY['%for developers%', '%dev tool%', '%code generation%', '%linter%'])
);

-- Open Source
INSERT INTO project_categories_junction (project_id, category_id)
SELECT p.id, pc.id 
FROM projects p
CROSS JOIN project_categories pc
WHERE pc.name = 'Open Source'
AND NOT EXISTS (
  SELECT 1 FROM project_categories_junction pcj 
  WHERE pcj.project_id = p.id AND pcj.category_id = pc.id
)
AND (
  LOWER(p.title) LIKE '%open source%'
  OR LOWER(p.short_description) LIKE ANY(ARRAY['%open source%', '%open-source%', '%oss%', '%mit license%', '%public%'])
  OR LOWER(p.description) LIKE ANY(ARRAY['%open source%', '%contribute%', '%community%'])
  OR p.repo_url IS NOT NULL
);

-- AI & Machine Learning
INSERT INTO project_categories_junction (project_id, category_id)
SELECT p.id, pc.id 
FROM projects p
CROSS JOIN project_categories pc
WHERE pc.name = 'AI & Machine Learning'
AND NOT EXISTS (
  SELECT 1 FROM project_categories_junction pcj 
  WHERE pcj.project_id = p.id AND pcj.category_id = pc.id
)
AND (
  LOWER(p.title) LIKE ANY(ARRAY['%ai%', '%ml%', '%machine learning%', '%neural%', '%gpt%', '%llm%'])
  OR LOWER(p.short_description) LIKE ANY(ARRAY['%ai%', '%artificial intelligence%', '%machine learning%', '%chatgpt%', '%openai%', '%claude%', '%gemini%'])
  OR LOWER(p.description) LIKE ANY(ARRAY['%ai-powered%', '%ai integration%', '%language model%', '%natural language%'])
);

-- E-Commerce
INSERT INTO project_categories_junction (project_id, category_id)
SELECT p.id, pc.id 
FROM projects p
CROSS JOIN project_categories pc
WHERE pc.name = 'E-Commerce'
AND NOT EXISTS (
  SELECT 1 FROM project_categories_junction pcj 
  WHERE pcj.project_id = p.id AND pcj.category_id = pc.id
)
AND (
  LOWER(p.title) LIKE ANY(ARRAY['%shop%', '%store%', '%cart%', '%e-commerce%', '%ecommerce%', '%marketplace%'])
  OR LOWER(p.short_description) LIKE ANY(ARRAY['%online store%', '%shopping%', '%payment%', '%checkout%', '%product%'])
  OR LOWER(p.description) LIKE ANY(ARRAY['%e-commerce%', '%buy%', '%sell%', '%stripe%', '%paypal%'])
);

-- Social Media
INSERT INTO project_categories_junction (project_id, category_id)
SELECT p.id, pc.id 
FROM projects p
CROSS JOIN project_categories pc
WHERE pc.name = 'Social Media'
AND NOT EXISTS (
  SELECT 1 FROM project_categories_junction pcj 
  WHERE pcj.project_id = p.id AND pcj.category_id = pc.id
)
AND (
  LOWER(p.title) LIKE ANY(ARRAY['%social%', '%chat%', '%messaging%', '%forum%', '%community%', '%linkedin%', '%twitter%', '%facebook%'])
  OR LOWER(p.short_description) LIKE ANY(ARRAY['%social network%', '%social media%', '%feed%', '%post%', '%comment%', '%share%'])
  OR LOWER(p.description) LIKE ANY(ARRAY['%social platform%', '%user interaction%', '%followers%', '%engagement%'])
);

-- Productivity Tools
INSERT INTO project_categories_junction (project_id, category_id)
SELECT p.id, pc.id 
FROM projects p
CROSS JOIN project_categories pc
WHERE pc.name = 'Productivity Tools'
AND NOT EXISTS (
  SELECT 1 FROM project_categories_junction pcj 
  WHERE pcj.project_id = p.id AND pcj.category_id = pc.id
)
AND (
  LOWER(p.title) LIKE ANY(ARRAY['%task%', '%todo%', '%note%', '%calendar%', '%reminder%', '%organize%', '%planner%'])
  OR LOWER(p.short_description) LIKE ANY(ARRAY['%productivity%', '%task management%', '%time tracking%', '%workflow%'])
  OR LOWER(p.description) LIKE ANY(ARRAY['%boost productivity%', '%efficiency%', '%organization%'])
);

-- Educational Projects
INSERT INTO project_categories_junction (project_id, category_id)
SELECT p.id, pc.id 
FROM projects p
CROSS JOIN project_categories pc
WHERE pc.name = 'Educational Projects'
AND NOT EXISTS (
  SELECT 1 FROM project_categories_junction pcj 
  WHERE pcj.project_id = p.id AND pcj.category_id = pc.id
)
AND (
  LOWER(p.title) LIKE ANY(ARRAY['%learn%', '%tutorial%', '%course%', '%education%', '%training%', '%quiz%', '%capstone%'])
  OR LOWER(p.short_description) LIKE ANY(ARRAY['%learning%', '%educational%', '%teach%', '%student%', '%certification%'])
  OR LOWER(p.description) LIKE ANY(ARRAY['%educational project%', '%learning platform%', '%teaching%'])
);

-- Portfolio & Personal
INSERT INTO project_categories_junction (project_id, category_id)
SELECT p.id, pc.id 
FROM projects p
CROSS JOIN project_categories pc
WHERE pc.name = 'Portfolio & Personal'
AND NOT EXISTS (
  SELECT 1 FROM project_categories_junction pcj 
  WHERE pcj.project_id = p.id AND pcj.category_id = pc.id
)
AND (
  LOWER(p.title) LIKE ANY(ARRAY['%portfolio%', '%personal%', '%blog%', '%resume%', '%cv%'])
  OR LOWER(p.short_description) LIKE ANY(ARRAY['%portfolio%', '%personal website%', '%showcase%'])
  OR LOWER(p.description) LIKE ANY(ARRAY['%personal project%', '%my portfolio%'])
);

-- API & Backend Services
INSERT INTO project_categories_junction (project_id, category_id)
SELECT p.id, pc.id 
FROM projects p
CROSS JOIN project_categories pc
WHERE pc.name = 'API & Backend Services'
AND NOT EXISTS (
  SELECT 1 FROM project_categories_junction pcj 
  WHERE pcj.project_id = p.id AND pcj.category_id = pc.id
)
AND (
  LOWER(p.title) LIKE ANY(ARRAY['%api%', '%backend%', '%service%', '%server%', '%rest%', '%graphql%'])
  OR LOWER(p.short_description) LIKE ANY(ARRAY['%api%', '%backend%', '%microservice%', '%endpoint%', '%rest api%'])
  OR LOWER(p.description) LIKE ANY(ARRAY['%api service%', '%backend system%', '%server-side%'])
);

-- Data Visualization
INSERT INTO project_categories_junction (project_id, category_id)
SELECT p.id, pc.id 
FROM projects p
CROSS JOIN project_categories pc
WHERE pc.name = 'Data Visualization'
AND NOT EXISTS (
  SELECT 1 FROM project_categories_junction pcj 
  WHERE pcj.project_id = p.id AND pcj.category_id = pc.id
)
AND (
  LOWER(p.title) LIKE ANY(ARRAY['%chart%', '%graph%', '%visualization%', '%analytics%', '%dashboard%'])
  OR LOWER(p.short_description) LIKE ANY(ARRAY['%data viz%', '%visualization%', '%chart%', '%d3%', '%analytics%'])
  OR LOWER(p.description) LIKE ANY(ARRAY['%data visualization%', '%visual analytics%', '%interactive charts%'])
);

-- Real-time Applications
INSERT INTO project_categories_junction (project_id, category_id)
SELECT p.id, pc.id 
FROM projects p
CROSS JOIN project_categories pc
WHERE pc.name = 'Real-time Applications'
AND NOT EXISTS (
  SELECT 1 FROM project_categories_junction pcj 
  WHERE pcj.project_id = p.id AND pcj.category_id = pc.id
)
AND (
  LOWER(p.title) LIKE ANY(ARRAY['%real-time%', '%realtime%', '%live%', '%socket%', '%websocket%'])
  OR LOWER(p.short_description) LIKE ANY(ARRAY['%real-time%', '%instant%', '%live updates%', '%websocket%'])
  OR LOWER(p.description) LIKE ANY(ARRAY['%real-time%', '%live data%', '%instant messaging%'])
);

-- Automation Tools
INSERT INTO project_categories_junction (project_id, category_id)
SELECT p.id, pc.id 
FROM projects p
CROSS JOIN project_categories pc
WHERE pc.name = 'Automation Tools'
AND NOT EXISTS (
  SELECT 1 FROM project_categories_junction pcj 
  WHERE pcj.project_id = p.id AND pcj.category_id = pc.id
)
AND (
  LOWER(p.title) LIKE ANY(ARRAY['%automat%', '%bot%', '%script%', '%scheduler%', '%cron%'])
  OR LOWER(p.short_description) LIKE ANY(ARRAY['%automat%', '%bot%', '%scheduled%', '%workflow%'])
  OR LOWER(p.description) LIKE ANY(ARRAY['%automation%', '%automated%', '%script%'])
);

-- Full-Stack Applications
INSERT INTO project_categories_junction (project_id, category_id)
SELECT p.id, pc.id 
FROM projects p
CROSS JOIN project_categories pc
WHERE pc.name = 'Full-Stack Applications'
AND NOT EXISTS (
  SELECT 1 FROM project_categories_junction pcj 
  WHERE pcj.project_id = p.id AND pcj.category_id = pc.id
)
AND (
  LOWER(p.title) LIKE ANY(ARRAY['%full-stack%', '%fullstack%', '%full stack%'])
  OR LOWER(p.short_description) LIKE ANY(ARRAY['%full-stack%', '%fullstack%', '%frontend and backend%', '%end-to-end%', '%comprehensive%'])
  OR LOWER(p.description) LIKE ANY(ARRAY['%full-stack%', '%complete application%', '%frontend and backend%'])
);

-- ============================================================================
-- PART 4: Manual Project Categorization Examples
-- ============================================================================

-- Example: Manually assign "Front-End Developer Capstone" to specific categories
-- UPDATE THIS SECTION based on your actual project IDs and desired categorizations

-- Front-End Developer Capstone → Web Applications + Educational Projects + Portfolio
INSERT INTO project_categories_junction (project_id, category_id)
SELECT 2, pc.id 
FROM project_categories pc
WHERE pc.name IN ('Web Applications', 'Educational Projects', 'Portfolio & Personal')
AND NOT EXISTS (
  SELECT 1 FROM project_categories_junction pcj 
  WHERE pcj.project_id = 2 AND pcj.category_id = pc.id
);

-- ============================================================================
-- PART 5: Verify Results
-- ============================================================================

-- Show categorization results
SELECT 
  pc.name as category,
  COUNT(pcj.project_id) as project_count,
  STRING_AGG(p.title, ', ' ORDER BY p.title) as projects
FROM project_categories pc
LEFT JOIN project_categories_junction pcj ON pc.id = pcj.category_id
LEFT JOIN projects p ON pcj.project_id = p.id
GROUP BY pc.id, pc.name
ORDER BY project_count DESC, pc.name;

-- Show uncategorized projects
SELECT 
  p.id,
  p.title,
  p.short_description
FROM projects p
WHERE NOT EXISTS (
  SELECT 1 FROM project_categories_junction pcj WHERE pcj.project_id = p.id
)
ORDER BY p.title;

-- Show all projects with their categories
SELECT 
  p.id,
  p.title,
  STRING_AGG(pc.name, ', ' ORDER BY pc.name) as categories
FROM projects p
LEFT JOIN project_categories_junction pcj ON p.id = pcj.project_id
LEFT JOIN project_categories pc ON pcj.category_id = pc.id
GROUP BY p.id, p.title
ORDER BY p.title;
