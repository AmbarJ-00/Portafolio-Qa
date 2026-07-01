import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

console.log('==================================================');
console.log('🧪 RUNNING ADMIN AUTH ENVIRONMENT TESTS');
console.log('==================================================\n');

let failures = 0;
let passes = 0;

function reportFailure(testName, variable, cause, fix) {
  failures++;
  console.error('\n❌ ADMIN AUTH ERROR REPORT');
  console.error(`* Test Name: ${testName}`);
  console.error('* Failed Module: Environment Configuration');
  console.error('* Failed File: .env');
  console.error(`* Variable / Function: ${variable}`);
  console.error(`* Possible Cause: ${cause}`);
  console.error(`* Recommended Fix: ${fix}`);
  console.error('--------------------------------------------------');
}

// 1. Verify JWT_SECRET is loaded and is not default/insecure
if (!process.env.JWT_SECRET) {
  reportFailure(
    'JWT_SECRET existence',
    'JWT_SECRET',
    'JWT_SECRET environment variable is missing or undefined',
    'Add JWT_SECRET to your .env file or Vercel Environment Variables.'
  );
} else if (process.env.JWT_SECRET === 'claveJWTseguraGenerada') {
  console.warn('⚠️ WARNING: JWT_SECRET is using the default placeholder value.');
  passes++;
} else {
  console.log('✅ PASS: JWT_SECRET loaded and customized.');
  passes++;
}

// 2. Verify fallback credentials are set
if (!process.env.ADMIN_FALLBACK_USER) {
  reportFailure(
    'ADMIN_FALLBACK_USER existence',
    'ADMIN_FALLBACK_USER',
    'ADMIN_FALLBACK_USER is missing or undefined in environment',
    'Add ADMIN_FALLBACK_USER to .env file to enable login fallback when database is offline.'
  );
} else {
  console.log('✅ PASS: ADMIN_FALLBACK_USER is available.');
  passes++;
}

if (!process.env.ADMIN_FALLBACK_PASS) {
  reportFailure(
    'ADMIN_FALLBACK_PASS existence',
    'ADMIN_FALLBACK_PASS',
    'ADMIN_FALLBACK_PASS is missing or undefined in environment',
    'Add ADMIN_FALLBACK_PASS to .env file to enable login fallback when database is offline.'
  );
} else {
  console.log('✅ PASS: ADMIN_FALLBACK_PASS is available.');
  passes++;
}

console.log('\n==================================================');
if (failures === 0) {
  console.log(`🎉 SUCCESS: All ${passes} environment tests passed.`);
  process.exit(0);
} else {
  console.error(`❌ FAILURE: ${failures} errors found in environment verification.`);
  process.exit(1);
}
