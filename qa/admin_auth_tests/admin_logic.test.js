import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('==================================================');
console.log('🧪 RUNNING ADMIN AUTH LOGIC & FLOW TESTS');
console.log('==================================================\n');

let failures = 0;
let passes = 0;

function reportFailure(testName, file, variable, cause, fix) {
  failures++;
  console.error('\n❌ ADMIN AUTH ERROR REPORT');
  console.error(`* Test Name: ${testName}`);
  console.error('* Failed Module: Authentication Logic');
  console.error(`* Failed File: ${file}`);
  console.error(`* Variable / Function: ${variable}`);
  console.error(`* Possible Cause: ${cause}`);
  console.error(`* Recommended Fix: ${fix}`);
  console.error('--------------------------------------------------');
}

// 1. Audit AdminAuthContext.jsx for verifySession and state updates
const CONTEXT_PATH = path.resolve(__dirname, '../../src/context/AdminAuthContext.jsx');
if (fs.existsSync(CONTEXT_PATH)) {
  const content = fs.readFileSync(CONTEXT_PATH, 'utf8');

  // Verify fetch payload and methods in verifySession
  const hasVerifySession = content.includes('/api/auth/verify');
  const hasVerifyPost = content.includes("method: 'POST'") && content.includes("'Authorization': `Bearer ${token}`");

  if (!hasVerifySession) {
    reportFailure(
      'Verify Session API Call',
      'src/context/AdminAuthContext.jsx',
      'verifySession()',
      '/api/auth/verify is not requested inside verifySession hook.',
      'Call the authentication token verification endpoint during AdminAuthContext initialization.'
    );
  } else if (!hasVerifyPost) {
    reportFailure(
      'Verify Session Parameters',
      'src/context/AdminAuthContext.jsx',
      'verifySession() fetch config',
      'Bearer token or POST method is missing from auth verification fetch call.',
      'Configure fetch request to include POST method and the Authorization header with Bearer token.'
    );
  } else {
    console.log('✅ PASS: verifySession makes correct POST request with Authorization header.');
    passes++;
  }

  // Verify login method
  const hasLoginAction = content.includes('/api/auth/login');
  const hasLoginBody = content.includes('JSON.stringify({ username, password })');

  if (!hasLoginAction) {
    reportFailure(
      'Login Action API Endpoint',
      'src/context/AdminAuthContext.jsx',
      'login() action',
      '/api/auth/login endpoint is not targeted in login action.',
      'Perform a POST fetch to "/api/auth/login" with sanitized credential variables.'
    );
  } else if (!hasLoginBody) {
    reportFailure(
      'Login Action Request Body',
      'src/context/AdminAuthContext.jsx',
      'login() fetch parameters',
      'Request body does not serialize both username and password parameters.',
      'Serialize username and password values in login request body.'
    );
  } else {
    console.log('✅ PASS: login action passes username and password properties correctly.');
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
  console.log(`🎉 SUCCESS: All ${passes} logic tests passed.`);
  process.exit(0);
} else {
  console.error(`❌ FAILURE: ${failures} errors found in logic verification.`);
  process.exit(1);
}
