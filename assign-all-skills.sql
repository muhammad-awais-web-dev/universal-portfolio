-- Quick script to assign all skills to categories based on our analysis
-- Run this in Supabase SQL editor

-- Delete existing skill-category assignments
DELETE FROM skill_categories_junction;

-- Assign skills to categories based on keyword matching
-- 1. Frontend Development (ID: 1)
INSERT INTO skill_categories_junction (skill_id, category_id)
SELECT id, 1 FROM skills WHERE LOWER(name) LIKE ANY(ARRAY[
  '%react%', '%html%', '%css%', '%javascript%', '%typescript%', '%next%', '%vue%', '%angular%',
  '%ui%', '%frontend%', '%front-end%', '%responsive%', '%sass%', '%tailwind%', '%bootstrap%',
  '%webpack%', '%ajax%', '%dom%', '%browser%', '%animation%', '%web design%', '%esbuild%',
  '%shadow dom%', '%web component%', '%style guide%', '%linux%'
]);

-- 2. Backend Development (ID: 2)
INSERT INTO skill_categories_junction (skill_id, category_id)
SELECT id, 2 FROM skills WHERE NOT EXISTS (
  SELECT 1 FROM skill_categories_junction WHERE skill_id = skills.id
) AND LOWER(name) LIKE ANY(ARRAY[
  '%node%', '%python%', '%django%', '%flask%', '%express%', '%backend%', '%back-end%',
  '%server%', '%api%', '%rest%', '%graphql%', '%microservice%', '%serverless%',
  '%fastapi%', '%nest%', '%php%', '%ruby%', '%java%', '%spring%', '%.net%', '%laravel%',
  '%web server%', '%claude api%', '%gemini api%', '%openai%', '%oral%'
]);

-- 3. Database & Data (ID: 3)
INSERT INTO skill_categories_junction (skill_id, category_id)
SELECT id, 3 FROM skills WHERE NOT EXISTS (
  SELECT 1 FROM skill_categories_junction WHERE skill_id = skills.id
) AND LOWER(name) LIKE ANY(ARRAY[
  '%sql%', '%database%', '%mongodb%', '%postgresql%', '%mysql%', '%redis%', '%data modeling%',
  '%data structure%', '%dataflow%', '%nosql%', '%firebase%', '%supabase%', '%data validation%',
  '%orm%', '%prisma%', '%sequelize%', '%query%', '%schema%', '%performance tuning%',
  '%information privacy%', '%information architecture%', '%brainstorm%'
]);

-- 4. Cloud & Infrastructure (ID: 4)
INSERT INTO skill_categories_junction (skill_id, category_id)
SELECT id, 4 FROM skills WHERE NOT EXISTS (
  SELECT 1 FROM skill_categories_junction WHERE skill_id = skills.id
) AND LOWER(name) LIKE ANY(ARRAY[
  '%cloud%', '%aws%', '%azure%', '%gcp%', '%docker%', '%kubernetes%', '%container%',
  '%infrastructure%', '%hosting%', '%deployment%', '%lambda%', '%ec2%', '%s3%',
  '%cloudflare%', '%netlify%', '%vercel%', '%heroku%', '%paas%', '%iaas%', '%ibm cloud%'
]);

-- 5. DevOps & CI/CD (ID: 5)
INSERT INTO skill_categories_junction (skill_id, category_id)
SELECT id, 5 FROM skills WHERE NOT EXISTS (
  SELECT 1 FROM skill_categories_junction WHERE skill_id = skills.id
) AND LOWER(name) LIKE ANY(ARRAY[
  '%devops%', '%ci/cd%', '%ci%cd%', '%git%', '%github%', '%gitlab%', '%jenkins%', '%continuous%',
  '%pipeline%', '%build%', '%release%', '%version control%', '%monitoring%', '%system monitoring%',
  '%email automation%', '%digital market%'
]);

-- 6. AI & Machine Learning (ID: 6)
INSERT INTO skill_categories_junction (skill_id, category_id)
SELECT id, 6 FROM skills WHERE NOT EXISTS (
  SELECT 1 FROM skill_categories_junction WHERE skill_id = skills.id
) AND LOWER(name) LIKE ANY(ARRAY[
  '%ai%', '%artificial intelligence%', '%machine learning%', '%deep learning%', '%neural%',
  '%nlp%', '%chatgpt%', '%tensorflow%', '%pytorch%', '%data science%', '%algorithm%',
  '%classification%', '%regression%', '%model%', '%scikit%', '%generative%', '%responsible ai%',
  '%threat model%', '%yaml%', '%xml%', '%supervised%', '%unsupervised%'
]);

-- 7. Security (ID: 7)
INSERT INTO skill_categories_junction (skill_id, category_id)
SELECT id, 7 FROM skills WHERE NOT EXISTS (
  SELECT 1 FROM skill_categories_junction WHERE skill_id = skills.id
) AND LOWER(name) LIKE ANY(ARRAY[
  '%security%', '%authentication%', '%authorization%', '%oauth%', '%jwt%', '%encryption%',
  '%https%', '%ssl%', '%firewall%', '%penetration%', '%vulnerability%', '%compliance%',
  '%privacy%', '%devsecops%', '%cors%', '%csrf%', '%owasp%', '%secure coding%'
]);

-- 8. Design & Creative (ID: 8)
INSERT INTO skill_categories_junction (skill_id, category_id)
SELECT id, 8 FROM skills WHERE NOT EXISTS (
  SELECT 1 FROM skill_categories_junction WHERE skill_id = skills.id
) AND LOWER(name) LIKE ANY(ARRAY[
  '%design%', '%figma%', '%sketch%', '%adobe%', '%photoshop%', '%illustrator%',
  '%canva%', '%color%', '%typography%', '%prototyp%', '%wireframe%', '%mockup%',
  '%branding%', '%creative%', '%visual%', '%ux%', '%user experience%', '%user centered%',
  '%interaction%', '%layout%', '%graphic%', '%research design%', '%software design pattern%',
  '%software visualization%', '%solution design%'
]);

-- 9. Soft Skills & Business (ID: 9)
INSERT INTO skill_categories_junction (skill_id, category_id)
SELECT id, 9 FROM skills WHERE NOT EXISTS (
  SELECT 1 FROM skill_categories_junction WHERE skill_id = skills.id
) AND LOWER(name) LIKE ANY(ARRAY[
  '%communication%', '%critical thinking%', '%problem solving%', '%leadership%', '%teamwork%',
  '%collaboration%', '%agile%', '%scrum%', '%project management%', '%business%', '%writing%',
  '%presentation%', '%analytical%', '%strategic%', '%correspondence%', '%verbal%', '%technical communication%'
]);

-- 10. Tools & Platforms (ID: 10)
INSERT INTO skill_categories_junction (skill_id, category_id)
SELECT id, 10 FROM skills WHERE NOT EXISTS (
  SELECT 1 FROM skill_categories_junction WHERE skill_id = skills.id
) AND LOWER(name) LIKE ANY(ARRAY[
  '%vscode%', '%visual studio%', '%chrome%', '%extension%', '%postman%', '%insomnia%',
  '%jira%', '%slack%', '%trello%', '%confluence%', '%notion%', '%terminal%', '%cli%',
  '%bash%', '%powershell%', '%editor%', '%ide%', '%video editing%', '%ideation%'
]);

-- 11. Testing & QA (ID: 11)
INSERT INTO skill_categories_junction (skill_id, category_id)
SELECT id, 11 FROM skills WHERE NOT EXISTS (
  SELECT 1 FROM skill_categories_junction WHERE skill_id = skills.id
) AND LOWER(name) LIKE ANY(ARRAY[
  '%test%', '%qa%', '%quality%', '%jest%', '%mocha%', '%cypress%', '%selenium%',
  '%unit test%', '%integration test%', '%e2e%', '%tdd%', '%bdd%', '%debug%',
  '%validation%', '%assertion%', '%usability testing%', '%scenario%'
]);

-- 12. General Development - everything else (ID: 12)
INSERT INTO skill_categories_junction (skill_id, category_id)
SELECT id, 12 FROM skills WHERE NOT EXISTS (
  SELECT 1 FROM skill_categories_junction WHERE skill_id = skills.id
);

-- Verify results
SELECT 
  sc.name as category,
  COUNT(*) as skill_count
FROM skill_categories sc
JOIN skill_categories_junction scj ON sc.id = scj.category_id
GROUP BY sc.id, sc.name
ORDER BY skill_count DESC;
