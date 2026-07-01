import { exec } from 'child_process';
import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

console.log('==================================================');
console.log('🧪 RUNNING ADMIN AUTH INTEGRATION TESTS');
console.log('==================================================\n');

let failures = 0;
let passes = 0;

function reportFailure(testName, variable, cause, fix) {
  failures++;
  console.error('\n❌ ADMIN AUTH ERROR REPORT');
  console.error(`* Test Name: ${testName}`);
  console.error('* Failed Module: Authentication Integration Flow');
  console.error('* Failed File: server.js / AdminAuthContext.jsx');
  console.error(`* Variable / Function: ${variable}`);
  console.error(`* Possible Cause: ${cause}`);
  console.error(`* Recommended Fix: ${fix}`);
  console.error('--------------------------------------------------');
}

// Spin up server, test simulated POST to login, then shut down
let serverProcess;

function startServer() {
  return new Promise((resolve, reject) => {
    // Force DB offline to test fallback auth integration
    serverProcess = exec('node server.js', {
      env: { ...process.env, DB_HOST: 'offline_host_trigger_fallback', PORT: '3001' }
    });
    
    serverProcess.stderr.on('data', (data) => {
      // Console out DB failure messages is normal since we bypassed it
    });

    // Wait 2 seconds for server to start
    setTimeout(resolve, 2000);
  });
}

function stopServer() {
  if (serverProcess) {
    serverProcess.kill();
  }
}

async function run() {
  try {
    await startServer();
    
    // Perform POST login request simulation using http module
    const user = process.env.ADMIN_FALLBACK_USER || 'admin';
    const pass = process.env.ADMIN_FALLBACK_PASS || 'AdminQA#2026';

    const loginData = JSON.stringify({ username: user, password: pass });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    };

    const loginPromise = () => new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, data: JSON.parse(body) }));
      });
      req.on('error', reject);
      req.write(loginData);
      req.end();
    });

    const response = await loginPromise();

    if (response.statusCode !== 200 || !response.data.token) {
      reportFailure(
        'Simulated Fallback Login Integration',
        'POST /api/auth/login',
        `Received unexpected status code ${response.statusCode} or empty token. Response: ${JSON.stringify(response.data)}`,
        'Verify express body-parser configuration and fallback logic implementation inside server.js.'
      );
    } else {
      console.log('✅ PASS: Simulated login succeeds using fallback credentials when database is offline.');
      passes++;
    }

  } catch (err) {
    reportFailure(
      'Server Connection Integration',
      'server.js app listener',
      `Could not establish connection to local backend test instance: ${err.message}`,
      'Check if port 3001 is available and backend starts correctly using node server.js.'
    );
  } finally {
    stopServer();
  }

  console.log('\n==================================================');
  if (failures === 0) {
    console.log(`🎉 SUCCESS: All ${passes} integration tests passed.`);
    process.exit(0);
  } else {
    console.error(`❌ FAILURE: ${failures} errors found in integration verification.`);
    process.exit(1);
  }
}

run();
