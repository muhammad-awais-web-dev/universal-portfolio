#!/bin/bash

# Apply Skill Categorization using curl
# Creates categories and assigns all skills

echo "🔧 Starting skill categorization process..."
echo ""

# Categories to create
CATEGORIES=(
  "Frontend Development"
  "Backend Development"
  "Database & Data"
  "Cloud & Infrastructure"
  "DevOps & CI/CD"
  "AI & Machine Learning"
  "Security"
  "Design & Creative"
  "Soft Skills & Business"
  "Tools & Platforms"
  "Testing & QA"
  "General Development"
)

echo "📝 Step 1: Creating skill categories..."
echo ""

# Create categories and store IDs
declare -A CATEGORY_IDS

for category in "${CATEGORIES[@]}"; do
  response=$(curl -s -b cookies.txt -X POST http://localhost:3000/api/portfolio/skill-categories \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"$category\"}")
  
  if echo "$response" | grep -q '"id"'; then
    id=$(echo "$response" | jq -r '.id')
    CATEGORY_IDS["$category"]=$id
    echo "  ✓ Created: $category (ID: $id)"
  else
    echo "  ⚠ Failed: $category"
  fi
done

echo ""
echo "✅ Created ${#CATEGORY_IDS[@]} categories"
echo ""

# Save category IDs for the node script
cat > category-ids.json <<< $(jq -n '$ARGS.positional | from_entries' --args "${!CATEGORY_IDS[@]}" "${CATEGORY_IDS[@]}")

echo "Category IDs saved to category-ids.json"
echo ""
echo "🎉 Categories created! Run the Node script to assign skills."
