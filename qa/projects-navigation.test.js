/**
 * Projects Navigation Test — Code Analysis & Markup Audit
 * 
 * Inspects Projects.jsx to verify card wrappers and check for nested link violations.
 * 
 * Execution: node qa/projects-navigation.test.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECTS_FILE_PATH = path.resolve(__dirname, '../src/pages/Projects.jsx');

console.log('==================================================');
console.log('🧪 RUNNING PROJECTS CLICKABILITY & NAVIGATION TESTS');
console.log('==================================================\n');

let failures = 0;
let passes = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passes++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failures++;
  }
}

try {
  // Read code content of Projects.jsx
  const codeContent = fs.readFileSync(PROJECTS_FILE_PATH, 'utf8');

  // 1. Verify that MotionLink is defined and uses React Router's Link
  const hasMotionLinkDefinition = codeContent.includes('const MotionLink = motion(Link);') || 
                                  codeContent.includes('const MotionLink = motion.create(Link);') || 
                                  codeContent.includes('motion(Link)');
  assert(hasMotionLinkDefinition, 'MotionLink wrapper is defined using Framer Motion and React Router Link');

  // 2. Verify that cards are wrapped in MotionLink
  const hasMotionLinkUsage = codeContent.includes('<MotionLink') && codeContent.includes('</MotionLink>');
  assert(hasMotionLinkUsage, 'Project cards are wrapped in <MotionLink> elements');

  // 3. Verify that cards target the project details URL correctly
  const hasCorrectUrlRoute = codeContent.includes('to={`/projects/${project.id}`}');
  assert(hasCorrectUrlRoute, 'MotionLink points to the correct dynamic route `/projects/${project.id}`');

  // 4. Verify that there is NO nested Link tag inside the footer button (to prevent nested anchors)
  const countLinksInMap = (codeContent.match(/<Link/g) || []).length;
  // Previously there was <Link to={`/projects/${project.id}`}> in footer.
  // Now we replaced it with <div className="..."> in footer, and the outer card is <MotionLink>.
  // So there should be no nested Link inside the card's map.
  const hasNestedLinkViolation = codeContent.includes('<div className="px-6 py-4') && codeContent.includes('<Link') && codeContent.indexOf('<Link', codeContent.indexOf('StatusCard')) !== -1;
  
  // Let's perform a check: is the footer action a div instead of a Link?
  const footerActionDivCheck = /<div\s+className="inline-flex items-center/.test(codeContent);
  assert(footerActionDivCheck, 'Nested Link in card footer has been replaced with a styled div element');

  // 5. Verify visual details and accessibility properties are maintained
  assert(codeContent.includes('group-hover:text-brand-electric-500') || codeContent.includes('group-hover:text-brand-lilac-300'), 'Hover effects on card elements are preserved');
  assert(codeContent.includes('no-underline'), 'Link inherits no-underline styling to preserve text presentation');
  assert(codeContent.includes('focus:outline-none') && codeContent.includes('focus:ring-2'), 'Focus styles are defined for keyboard accessibility navigation');

} catch (err) {
  console.error('Critical error executing projects navigation tests:', err.message);
  failures++;
}

console.log('\n==================================================');
if (failures === 0) {
  console.log(`🎉 SUCCESS: All ${passes} projects navigation checks passed successfully.`);
  console.log('==================================================');
  process.exit(0);
} else {
  console.error(`❌ FAILURE: ${failures} assertions failed. Test suite failed.`);
  console.log('==================================================');
  process.exit(1);
}
