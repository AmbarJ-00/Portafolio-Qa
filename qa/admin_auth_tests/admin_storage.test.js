import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('==================================================');
console.log('🧪 RUNNING ADMIN AUTH STORAGE & KEYS TESTS');
console.log('==================================================\n');

let failures = 0;
let passes = 0;

function reportFailure(testName, file, variable, cause, fix) {
  failures++;
  console.error('\n❌ ADMIN AUTH ERROR REPORT');
  console.error(`* Test Name: ${testName}`);
  console.error('* Failed Module: Storage and Persistence');
  console.error(`* Failed File: ${file}`);
  console.error(`* Variable / Function: ${variable}`);
  console.error(`* Possible Cause: ${cause}`);
  console.error(`* Recommended Fix: ${fix}`);
  console.error('--------------------------------------------------');
}

// Check session storage keys consistency in AdminAuthContext.jsx
const CONTEXT_PATH = path.resolve(__dirname, '../../src/context/AdminAuthContext.jsx');
if (fs.existsSync(CONTEXT_PATH)) {
  const content = fs.readFileSync(CONTEXT_PATH, 'utf8');
  
  const tokenKeyMatch = content.match(/ADMIN_TOKEN_KEY\s*=\s*['"]([^'"]+)['"]/);
  const userKeyMatch = content.match(/ADMIN_USER_KEY\s*=\s*['"]([^'"]+)['"]/);

  if (!tokenKeyMatch) {
    reportFailure(
      'ADMIN_TOKEN_KEY definition',
      'src/context/AdminAuthContext.jsx',
      'ADMIN_TOKEN_KEY',
      'ADMIN_TOKEN_KEY is not defined or not set as a string constant',
      'Ensure ADMIN_TOKEN_KEY is declared at the top of AdminAuthContext.jsx.'
    );
  } else {
    const tokenKey = tokenKeyMatch[1];
    console.log(`✅ PASS: ADMIN_TOKEN_KEY is defined as "${tokenKey}"`);
    passes++;
  }

  if (!userKeyMatch) {
    reportFailure(
      'ADMIN_USER_KEY definition',
      'src/context/AdminAuthContext.jsx',
      'ADMIN_USER_KEY',
      'ADMIN_USER_KEY is not defined or not set as a string constant',
      'Ensure ADMIN_USER_KEY is declared at the top of AdminAuthContext.jsx.'
    );
  } else {
    const userKey = userKeyMatch[1];
    console.log(`✅ PASS: ADMIN_USER_KEY is defined as "${userKey}"`);
    passes++;
  }

  // Check if session storage is cleaned up during logout
  const cleansToken = content.includes('sessionStorage.removeItem(ADMIN_TOKEN_KEY)');
  const cleansUser = content.includes('sessionStorage.removeItem(ADMIN_USER_KEY)');

  if (!cleansToken || !cleansUser) {
    reportFailure(
      'Session Storage Cleanup',
      'src/context/AdminAuthContext.jsx',
      'logout() function',
      'Logout function does not clean up authentication keys in sessionStorage',
      'Make sure both token and user keys are removed using removeItem() in the logout function.'
    );
  } else {
    console.log('✅ PASS: Logout function cleans up both token and user session keys.');
    passes++;
  }
} else {
  reportFailure(
    'AdminAuthContext Existence',
    'src/context/AdminAuthContext.jsx',
    'File AdminAuthContext.jsx',
    'Auth context file is missing',
    'Recreate the auth context provider file in src/context/AdminAuthContext.jsx.'
  );
}

console.log('\n==================================================');
if (failures === 0) {
  console.log(`🎉 SUCCESS: All ${passes} storage tests passed.`);
  process.exit(0);
} else {
  console.error(`❌ FAILURE: ${failures} errors found in storage verification.`);
  process.exit(1);
}
