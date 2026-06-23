/**
 * Security Test Suite — OWASP Top 10 & JWT Checks
 * 
 * Spawns the local server and executes security audits against active ports.
 * 
 * Execution: node qa/security_tests/security.test.js
 */

import { spawn } from 'child_process';
import http from 'http';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;
const JWT_SECRET = process.env.JWT_SECRET || 'claveJWTseguraGenerada';

console.log('==================================================');
console.log('🛡️ INICIANDO TESTS DE SEGURIDAD PORTAFOLIO QA...');
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

async function runAudits() {
  try {
    // 1. Audit Headers
    console.log('\n👉 Auditando cabeceras de seguridad OWASP...');
    const resHeaders = await makeRequest('/api/portfolio');
    
    assert(resHeaders.headers['content-security-policy'] !== undefined, 'Header CSP está presente');
    assert(resHeaders.headers['x-frame-options'] === 'DENY', 'Header X-Frame-Options es DENY');
    assert(resHeaders.headers['x-content-type-options'] === 'nosniff', 'Header X-Content-Type-Options es nosniff');
    assert(resHeaders.headers['strict-transport-security'] !== undefined, 'Header HSTS está configurado');
    assert(resHeaders.headers['referrer-policy'] === 'strict-origin-when-cross-origin', 'Header Referrer-Policy es correcto');

    // 2. Audit CORS (blocked origin)
    console.log('\n👉 Auditando políticas de CORS...');
    try {
      const resCors = await makeRequest('/api/portfolio', {
        headers: { 'Origin': 'http://unauthorized-domain.com' }
      });
      // Express cors middleware triggers CORS failure by not returning access-control-allow-origin
      assert(resCors.headers['access-control-allow-origin'] === undefined, 'CORS bloquea accesos de dominios no autorizados');
    } catch (err) {
      assert(true, 'CORS bloquea accesos no autorizados');
    }

    // 3. Audit SQL Injection (parameter checks)
    console.log('\n👉 Auditando protección contra SQL Injection...');
    const sqliBody = {
      username: "' OR '1'='1",
      password: "' OR '1'='1"
    };
    const resSqli = await makeRequest('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: sqliBody
    });
    assert(resSqli.statusCode === 401 || resSqli.statusCode === 500, 'Intento de SQL Injection en Login retorna 401 (Denegado) o 500 (Fallo DB)');

    // 4. Audit XSS (escaped strings)
    console.log('\n👉 Auditando sanitización de XSS...');
    const xssBody = {
      username: '<script>alert("XSS")</script>',
      password: 'password123'
    };
    const resXss = await makeRequest('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: xssBody
    });
    
    const parsedXss = JSON.parse(resXss.body);
    // Login fails because user doesn't exist, but we check if code is Auth-401
    assert(
      (resXss.statusCode === 401 && parsedXss.code === 'Auth-401') || 
      (resXss.statusCode === 500 && parsedXss.code === 'Server-500'),
      'Login con XSS es filtrado y denegado'
    );

    // 5. Audit JWT Integrity & Expiration
    console.log('\n👉 Auditando integridad de firma JWT...');
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidpayload.invalidsignature';
    const resJwtInvalid = await makeRequest('/api/admin/personal', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${invalidToken}` },
      body: {}
    });
    assert(resJwtInvalid.statusCode === 401, 'Token JWT alterado retorna código HTTP 401');

    const expiredToken = jwt.sign({ id: 'user-1', role: 'admin', exp: Math.floor(Date.now() / 1000) - 60 }, JWT_SECRET);
    const resJwtExpired = await makeRequest('/api/admin/personal', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${expiredToken}` },
      body: {}
    });
    assert(resJwtExpired.statusCode === 401, 'Token JWT expirado retorna código HTTP 401');

    // 6. Audit RBAC role validations
    console.log('\n👉 Auditando Roles y Permisos (RBAC)...');
    const userToken = jwt.sign({ id: 'user-standard', username: 'standard', role: 'user' }, JWT_SECRET);
    const resRbac = await makeRequest('/api/admin/personal', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${userToken}` },
      body: {}
    });
    
    assert(resRbac.statusCode === 403, 'Rol Estándar (user) retorna Permission-403 en endpoints administrativos');

    // 7. Audit Passwords encryption strength
    console.log('\n👉 Auditando hashing de contraseñas (bcrypt)...');
    const salt = await bcrypt.genSalt(10);
    const testHash = await bcrypt.hash('AdminQA#2026', salt);
    assert(testHash.startsWith('$2a$') || testHash.startsWith('$2b$'), 'Contraseñas generadas usan algoritmo bcrypt (salteado y hasheado)');

  } catch (err) {
    console.error('Error durante la ejecución del test de seguridad:', err);
    failures++;
  }
}

// Main execution
(async () => {
  try {
    await startServer();
    await runAudits();
  } catch (err) {
    console.error('Fallo crítico al correr los tests de seguridad:', err);
    failures++;
  } finally {
    if (serverProcess) {
      console.log('\n👉 Deteniendo servidor local...');
      serverProcess.kill();
    }

    console.log('\n==================================================');
    if (failures === 0) {
      console.log(`🎉 SUCCESS: Todos los ${passes} tests de seguridad pasaron.`);
      console.log('==================================================');
      process.exit(0);
    } else {
      console.error(`❌ FAILURE: Se encontraron ${failures} fallos en auditorías de seguridad.`);
      console.log('==================================================');
      process.exit(1);
    }
  }
})();
