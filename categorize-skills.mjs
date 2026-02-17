#!/usr/bin/env node

/**
 * Skill Categorization Script
 * Automatically categorizes all skills into logical categories
 */

import { readFileSync, writeFileSync } from 'fs';

const CATEGORIES = [
  { name: 'Frontend Development', keywords: ['react', 'html', 'css', 'javascript', 'typescript', 'next.js', 'vue', 'angular', 'ui', 'ux', 'frontend', 'front-end', 'web design', 'responsive', 'sass', 'tailwind', 'bootstrap', 'webpack', 'ajax', 'dom', 'browser', 'animations'] },
  { name: 'Backend Development', keywords: ['node', 'python', 'django', 'flask', 'express', 'backend', 'back-end', 'server', 'api', 'rest', 'graphql', 'microservices', 'serverless', 'fastapi', 'nest.js', 'php', 'ruby', 'java', 'spring', '.net', 'laravel'] },
  { name: 'Database & Data', keywords: ['sql', 'database', 'mongodb', 'postgresql', 'mysql', 'redis', 'data modeling', 'data structures', 'dataflow', 'nosql', 'firebase', 'supabase', 'data validation', 'orm', 'prisma', 'sequelize', 'query', 'schema'] },
  { name: 'Cloud & Infrastructure', keywords: ['cloud', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'container', 'infrastructure', 'hosting', 'deployment', 'serverless', 'lambda', 'ec2', 's3', 'cloudflare', 'netlify', 'vercel', 'heroku', 'paas', 'iaas'] },
  { name: 'DevOps & CI/CD', keywords: ['devops', 'ci/cd', 'git', 'github', 'gitlab', 'jenkins', 'continuous', 'deployment', 'integration', 'delivery', 'automation', 'pipeline', 'build', 'release', 'version control', 'monitoring'] },
  { name: 'AI & Machine Learning', keywords: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'neural', 'nlp', 'chatgpt', 'openai', 'gemini', 'claude', 'tensorflow', 'pytorch', 'data science', 'algorithms', 'classification', 'regression', 'model'] },
  { name: 'Security', keywords: ['security', 'authentication', 'authorization', 'oauth', 'jwt', 'encryption', 'https', 'ssl', 'firewall', 'penetration', 'vulnerability', 'compliance', 'privacy', 'devsecops', 'cors', 'csrf'] },
  { name: 'Design & Creative', keywords: ['design', 'ui', 'ux', 'figma', 'sketch', 'adobe', 'photoshop', 'illustrator', 'canva', 'color', 'typography', 'prototyping', 'wireframe', 'mockup', 'branding', 'creative', 'visual'] },
  { name: 'Soft Skills', keywords: ['communication', 'critical thinking', 'problem solving', 'leadership', 'teamwork', 'collaboration', 'agile', 'scrum', 'project management', 'business', 'writing', 'presentation', 'analytical', 'strategic'] },
  { name: 'Tools & Platforms', keywords: ['vscode', 'visual studio', 'chrome', 'extension', 'postman', 'insomnia', 'jira', 'slack', 'trello', 'confluence', 'notion', 'terminal', 'cli', 'bash', 'powershell', 'editor', 'ide'] },
  { name: 'Testing & QA', keywords: ['test', 'testing', 'qa', 'quality', 'jest', 'mocha', 'cypress', 'selenium', 'unit test', 'integration test', 'e2e', 'tdd', 'bdd', 'debugging', 'validation', 'assertion'] },
  { name: 'Methodologies & Practices', keywords: ['agile', 'scrum', 'kanban', 'methodology', 'practice', 'pattern', 'architecture', 'solid', 'clean code', 'refactoring', 'documentation', 'code review', 'pair programming', 'tdd', 'ddd'] }
];

async function categorizeSkills() {
  console.log('🔍 Fetching portfolio data...\n');
  
  const response = await fetch('http://localhost:3000/api/portfolio', {
    headers: {
      'Cookie': readFileSync('cookies.txt', 'utf8')
        .split('\n')
        .filter(line => line && !line.startsWith('#'))
        .map(line => {
          const parts = line.split('\t');
          if (parts.length >= 7) {
            return `${parts[5]}=${parts[6]}`;
          }
          return '';
        })
        .filter(Boolean)
        .join('; ')
    }
  });
  
  const data = await response.json();
  const skills = data.skills;
  
  console.log(`📊 Total skills: ${skills.length}\n`);
  
  // Categorize each skill
  const categorized = skills.map(skill => {
    const matchedCategories = [];
    const skillNameLower = skill.name.toLowerCase();
    
    CATEGORIES.forEach((category, index) => {
      const matches = category.keywords.filter(keyword => 
        skillNameLower.includes(keyword.toLowerCase())
      );
      
      if (matches.length > 0) {
        matchedCategories.push({
          category: category.name,
          categoryIndex: index,
          matchCount: matches.length,
          matches: matches
        });
      }
    });
    
    // Sort by match count, prioritize first match if tie
    matchedCategories.sort((a, b) => {
      if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
      return a.categoryIndex - b.categoryIndex;
    });
    
    return {
      ...skill,
      suggestedCategory: matchedCategories[0]?.category || 'Uncategorized',
      allMatches: matchedCategories
    };
  });
  
  // Group by category
  const byCategory = {};
  categorized.forEach(skill => {
    const cat = skill.suggestedCategory;
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(skill);
  });
  
  // Display summary
  console.log('📋 Categorization Summary:\n');
  Object.entries(byCategory)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([category, skills]) => {
      console.log(`${category}: ${skills.length} skills`);
    });
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Show samples from each category
  Object.entries(byCategory)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([category, skills]) => {
      console.log(`\n${category} (${skills.length}):`);
      skills.slice(0, 5).forEach(skill => {
        console.log(`  - ${skill.name}`);
      });
      if (skills.length > 5) {
        console.log(`  ... and ${skills.length - 5} more`);
      }
    });
  
  // Save categorization plan
  writeFileSync(
    'categorization-plan.json',
    JSON.stringify({ categories: CATEGORIES, categorized, byCategory }, null, 2)
  );
  
  console.log('\n\n✅ Categorization plan saved to: categorization-plan.json');
  console.log('\nNext steps:');
  console.log('1. Review the categorization');
  console.log('2. Run apply-skill-categories.mjs to apply changes to database');
}

categorizeSkills().catch(console.error);
