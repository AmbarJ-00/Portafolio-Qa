import dotenv from 'dotenv';
import { query, checkDatabaseConnection } from '../../src/config/db.js';

dotenv.config();

console.log('==================================================');
console.log('🧪 RUNNING ADMIN AUTH CREDENTIALS TESTS');
console.log('==================================================\n');

let failures = 0;
let passes = 0;

function reportFailure(testName, variable, cause, fix) {
  failures++;
  console.error('\n❌ ADMIN AUTH ERROR REPORT');
  console.error(`* Test Name: ${testName}`);
  console.error('* Failed Module: Credentials Configuration');
  console.error('* Failed File: src/config/db.js or Database Users Table');
  console.error(`* Variable / Function: ${variable}`);
  console.error(`* Possible Cause: ${cause}`);
  console.error(`* Recommended Fix: ${fix}`);
  console.error('--------------------------------------------------');
}

async function run() {
  try {
    await checkDatabaseConnection();
    
    // Check if the default admin exists in the database
    const [rows] = await query('SELECT * FROM users WHERE username = ?', ['MGadmin07']);
    
    if (rows.length === 0) {
      reportFailure(
        'Admin Username Presence',
        'MGadmin07',
        'User "MGadmin07" not found in the database "users" table',
        'Initialize the database migration or manually insert the admin user with appropriate password hash.'
      );
    } else {
      console.log('✅ PASS: Admin user "MGadmin07" exists in the database.');
      passes++;
    }
  } catch (err) {
    // If DB is offline, verify fallback credentials existence
    console.warn('⚠️ WARNING: Database is offline/inaccessible during credentials test. Verifying fallback credentials.');
    if (!process.env.ADMIN_FALLBACK_USER || !process.env.ADMIN_FALLBACK_PASS) {
      reportFailure(
        'Fallback Credentials Validation',
        'ADMIN_FALLBACK_USER / ADMIN_FALLBACK_PASS',
        'Database is offline, and env fallback credentials are not defined or empty',
        'Ensure database is running or set ADMIN_FALLBACK_USER and ADMIN_FALLBACK_PASS in .env file.'
      );
    } else {
      console.log('✅ PASS: Fallback credentials are set and will be used as a fallback.');
      passes++;
    }
  }

  console.log('\n==================================================');
  if (failures === 0) {
    console.log(`🎉 SUCCESS: All ${passes} credentials tests passed.`);
    process.exit(0);
  } else {
    console.error(`❌ FAILURE: ${failures} errors found in credentials verification.`);
    process.exit(1);
  }
}

run();
