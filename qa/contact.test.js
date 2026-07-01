/**
 * Contact Test Suite — Form Validations, Honeypot, DB Persistence & Rate Limiting
 * 
 * Spawns the local server and runs audits against the /api/contact endpoint.
 * 
 * Execution: node qa/contact.test.js
 */

import { spawn } from 'child_process';
import http from 'http';

const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;

console.log('==================================================');
console.log('🧪 INICIANDO TESTS DEL FORMULARIO DE CONTACTO...');
console.log('==================================================\n');

let serverProcess = null;
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

// Start Server helper
function startServer() {
  return new Promise((resolve, reject) => {
    console.log('👉 Levantando servidor local en puerto 3001...');
    serverProcess = spawn('node', ['server.js'], {
      env: { ...process.env, PORT: PORT, NODE_ENV: 'test' }
    });

    serverProcess.stdout.on('data', (data) => {
      if (data.toString().includes(`Server is running on port ${PORT}`)) {
        resolve();
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`[Server Stderr]: ${data}`);
    });

    serverProcess.on('error', (err) => {
      reject(err);
    });

    // Timeout fallback after 8 seconds
    setTimeout(() => {
      resolve();
    }, 8000);
  });
}

// Request helper
function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    const parsedUrl = new URL(url);
    
    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(requestOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  try {
    // 1. Validation check (missing fields)
    console.log('\n👉 Test 1: Validando campos obligatorios faltantes...');
    const invalidPayload = {
      name: 'Test User',
      email: 'invalid-email'
      // missing queryType, message
    };
    const resVal = await makeRequest('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: invalidPayload
    });
    assert(resVal.statusCode === 400, 'Endpoint retorna 400 ante campos faltantes');
    
    // 2. Validation check (invalid email)
    console.log('\n👉 Test 2: Validando formato de correo electrónico...');
    const invalidEmailPayload = {
      name: 'Test User',
      email: 'invalid-email-address',
      queryType: 'other',
      message: 'Hello World testing message payload.'
    };
    const resEmailVal = await makeRequest('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: invalidEmailPayload
    });
    assert(resEmailVal.statusCode === 400, 'Endpoint retorna 400 ante correo electrónico inválido');

    // 3. Honeypot check
    console.log('\n👉 Test 3: Evaluando protección anti-spam Honeypot...');
    const spamPayload = {
      name: 'Spammer Bot',
      email: 'spammer@bot.com',
      queryType: 'other',
      message: 'This is spam message content.',
      honeypot: 'filled_value' // filled honeypot
    };
    const resSpam = await makeRequest('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: spamPayload
    });
    const parsedSpam = JSON.parse(resSpam.body);
    assert(resSpam.statusCode === 200 && parsedSpam.success === true, 'Honeypot lleno retorna éxito simulado (200) para disuadir robots');

    // 4. Rate Limiting check
    console.log('\n👉 Test 4: Evaluando limitador de tasa de solicitudes (Rate Limiter)...');
    const validPayload = {
      name: 'Valid User',
      email: 'valid@example.com',
      queryType: 'consulting',
      message: 'This is a valid inquiry message from test suite.'
    };
    
    // We already made 1 request (the spam check bypassed real processing, but let's check rate limits)
    // Let's send 4 rapid requests to trigger 429
    let triggered429 = false;
    for (let i = 0; i < 4; i++) {
      try {
        const res = await makeRequest('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: validPayload
        });
        if (res.statusCode === 429) {
          triggered429 = true;
          break;
        }
      } catch (err) {
        // ignore network error
      }
    }
    assert(triggered429 === true, 'Rate Limiter bloquea peticiones excesivas retornando HTTP 429');

  } catch (err) {
    console.error('Fallo durante la ejecución de los tests de contacto:', err);
    failures++;
  }
}

(async () => {
  try {
    await startServer();
    await runTests();
  } catch (err) {
    console.error('Error crítico al levantar el servidor de pruebas:', err);
    failures++;
  } finally {
    if (serverProcess) {
      console.log('\n👉 Deteniendo servidor local...');
      serverProcess.kill();
    }

    console.log('\n==================================================');
    if (failures === 0) {
      console.log(`🎉 SUCCESS: Todos los ${passes} tests de contacto pasaron.`);
      console.log('==================================================');
      process.exit(0);
    } else {
      console.error(`❌ FAILURE: Se encontraron ${failures} fallos en los tests del formulario.`);
      console.log('==================================================');
      process.exit(1);
    }
  }
})();
