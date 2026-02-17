#!/usr/bin/env node

/**
 * Apply Skill Categorization
 * Creates categories and assigns all skills to appropriate categories
 */

import { readFileSync } from 'fs';

const CATEGORIES_TO_CREATE = [
  'Frontend Development',
  'Backend Development',
  'Database & Data',
  'Cloud & Infrastructure',
  'DevOps & CI/CD',
  'AI & Machine Learning',
  'Security',
  'Design & Creative',
  'Soft Skills & Business',
  'Tools & Platforms',
  'Testing & QA',
  'General Development'
];

async function applyCategorization() {
  console.log('🔧 Starting skill categorization process...\n');
  
  // Read the categorization plan
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
  
  console.log('📝 Step 1: Creating skill categories...\n');
  
  const categoryMap = {};
  
  // Create all categories
  for (const categoryName of CATEGORIES_TO_CREATE) {
    try {
      const response = await fetch('http://localhost:3000/api/portfolio/skill-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookieHeader
        },
        body: JSON.stringify({ name: categoryName })
      });
      
      if (response.ok) {
        const category = await response.json();
        categoryMap[categoryName] = category.id;
        console.log(`  ✓ Created: ${categoryName} (ID: ${category.id})`);
      } else {
        const error = await response.text();
        console.log(`  ⚠ ${categoryName}: ${error}`);
      }
    } catch (error) {
      console.log(`  ✗ Error creating ${categoryName}:`, error.message);
    }
  }
  
  console.log(`\n✅ Created ${Object.keys(categoryMap).length} categories\n`);
  console.log('📊 Step 2: Assigning skills to categories...\n');
  
  // Assign skills to categories
  let successCount = 0;
  let errorCount = 0;
  
  for (const skill of plan.categorized) {
    let categoryName = skill.suggestedCategory;
    
    // Map 'Uncategorized' to 'General Development'
    if (categoryName === 'Uncategorized') {
      categoryName = 'General Development';
    }
    
    // Map 'Soft Skills' to 'Soft Skills & Business'
    if (categoryName === 'Soft Skills') {
      categoryName = 'Soft Skills & Business';
    }
    
    const categoryId = categoryMap[categoryName];
    
    if (!categoryId) {
      console.log(`  ⚠ No category found for ${skill.name} (${categoryName})`);
      errorCount++;
      continue;
    }
    
    try {
      const response = await fetch(`http://localhost:3000/api/portfolio/skills/${skill.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookieHeader
        },
        body: JSON.stringify({
          category_ids: [categoryId]
        })
      });
      
      if (response.ok) {
        successCount++;
        if (successCount % 20 === 0) {
          console.log(`  ✓ Processed ${successCount} skills...`);
        }
      } else {
        errorCount++;
        if (errorCount < 5) {
          console.log(`  ✗ Failed to update ${skill.name}`);
        }
      }
    } catch (error) {
      errorCount++;
    }
  }
  
  console.log(`\n✅ Categorization complete!`);
  console.log(`   - Successfully categorized: ${successCount} skills`);
  console.log(`   - Errors: ${errorCount}`);
  console.log(`\n🎉 All done! Your skills are now organized into categories.`);
}

applyCategorization().catch(console.error);
