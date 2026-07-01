import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('==================================================');
console.log('🧪 RUNNING ADMIN AUTH ROUTES & GUARDS TESTS');
console.log('==================================================\n');

let failures = 0;
let passes = 0;

function reportFailure(testName, file, variable, cause, fix) {
  failures++;
  console.error('\n❌ ADMIN AUTH ERROR REPORT');
  console.error(`* Test Name: ${testName}`);
  console.error('* Failed Module: Routes and Guards');
  console.error(`* Failed File: ${file}`);
  console.error(`* Variable / Function: ${variable}`);
  console.error(`* Possible Cause: ${cause}`);
  console.error(`* Recommended Fix: ${fix}`);
  console.error('--------------------------------------------------');
}

// 1. Audit App.jsx for route configurations
const APP_JSX_PATH = path.resolve(__dirname, '../../src/App.jsx');
if (fs.existsSync(APP_JSX_PATH)) {
  const content = fs.readFileSync(APP_JSX_PATH, 'utf8');
  
  // Verify backoffice routes
  const hasLoginRoute = content.includes('/backoffice/login');
  const hasBackofficeRoute = content.includes('/backoffice');
  const hasAdminRedirect = content.includes('/admin/login') || content.includes('/admin');

  if (!hasLoginRoute) {
    reportFailure(
      'Login Route Definition',
      'src/App.jsx',
      'Route /backoffice/login',
      'The login route "/backoffice/login" is missing from App.jsx routing configuration.',
      'Define <Route path="/backoffice/login" element={<AdminLogin />} /> in App.jsx.'
    );
  } else {
    console.log('✅ PASS: Route /backoffice/login is defined.');
    passes++;
  }

  if (!hasBackofficeRoute) {
    reportFailure(
      'Backoffice Route Definition',
      'src/App.jsx',
      'Route /backoffice',
      'The main backoffice route "/backoffice" is missing from App.jsx.',
      'Define <Route path="/backoffice" element={<AdminRoute><AdminLayout /></AdminRoute>}> in App.jsx.'
    );
  } else {
    console.log('✅ PASS: Route /backoffice is defined.');
    passes++;
  }
  
  if (!content.includes('AdminRoute')) {
    reportFailure(
      'AdminRoute Guard Usage',
      'src/App.jsx',
      'AdminRoute Guard Wrapper',
      'The backoffice routes are not protected by AdminRoute guard',
      'Wrap your admin sub-routes with <AdminRoute> guard in App.jsx.'
    );
  } else {
    console.log('✅ PASS: Backoffice routes are wrapped with AdminRoute guard.');
    passes++;
  }
} else {
  reportFailure(
    'App.jsx Existence',
    'src/App.jsx',
    'File App.jsx',
    'App.jsx file could not be found',
    'Restore src/App.jsx to correct the SPA structure.'
  );
}

console.log('\n==================================================');
if (failures === 0) {
  console.log(`🎉 SUCCESS: All ${passes} routing tests passed.`);
  process.exit(0);
} else {
  console.error(`❌ FAILURE: ${failures} errors found in routing verification.`);
  process.exit(1);
}
