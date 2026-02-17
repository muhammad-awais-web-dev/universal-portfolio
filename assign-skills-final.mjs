#!/usr/bin/env node

/**
 * Assign skills to categories based on categorization plan
 */

import { readFileSync } from 'fs';

// Map category names to IDs (from database)
const CATEGORY_MAP = {
  'Frontend Development': 1,
  'Backend Development': 2,
  'Database & Data': 3,
  'Cloud & Infrastructure': 4,
  'DevOps & CI/CD': 5,
  'AI & Machine Learning': 6,
  'Security': 7,
  'Design & Creative': 8,
  'Soft Skills & Business': 9,
  'Tools & Platforms': 10,
  'Testing & QA': 11,
  'General Development': 12,
  'Methodologies & Practices': 12, // Map to General Development
  'Soft Skills': 9, // Map to Soft Skills & Business
  'Uncategorized': 12 // Map to General Development
};

async function assignSkills() {
  console.log('📊 Assigning skills to categories...\n');
  
  const plan = JSON.parse(readFileSync('categorization-plan.json', 'utf8'));
  const cookieHeader = readFileSync('cookies.txt', 'utf8')
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
    .join('; ');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const skill of plan.categorized) {
    const categoryName = skill.suggestedCategory;
    const categoryId = CATEGORY_MAP[categoryName];
    
    if (!categoryId) {
      console.log(`⚠ No mapping for category: ${categoryName}`);
      errorCount++;
      continue;
    }
    
    try {
      const response = await fetch(`http://localhost:3000/api/portfolio/skills/${skill.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookieHeader
        },
        body: JSON.stringify({
          name: skill.name,
          category_ids: [categoryId]
        })
      });
      
      if (response.ok) {
        successCount++;
        if (successCount % 25 === 0) {
          console.log(`  ✓ Processed ${successCount}/${plan.categorized.length} skills...`);
        }
      } else {
        errorCount++;
      }
    } catch (error) {
      errorCount++;
    }
  }
  
  console.log(`\n✅ Assignment complete!`);
  console.log(`   - Successfully categorized: ${successCount} skills`);
  console.log(`   - Errors: ${errorCount}`);
  
  // Show final breakdown
  console.log(`\n📋 Final Category Distribution:\n`);
  const distribution = {};
  for (const skill of plan.categorized) {
    const cat = skill.suggestedCategory;
    distribution[cat] = (distribution[cat] || 0) + 1;
  }
  
  Object.entries(distribution)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      const mappedName = category === 'Uncategorized' ? 'General Development' : 
                         category === 'Soft Skills' ? 'Soft Skills & Business' :
                         category === 'Methodologies & Practices' ? 'General Development' :
                         category;
      console.log(`   ${mappedName}: ${count} skills`);
    });
}

assignSkills().catch(console.error);
