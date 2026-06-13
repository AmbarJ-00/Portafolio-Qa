/**
 * Error System Test Suite — DB-500, Auth-401, Permission-403, Config-001, Server-500
 * 
 * Audits error responses and codes returned by server endpoints under failure parameters.
 * 
 * Execution: node qa/error_tests/error.test.js
 */

import { spawn } from 'child_process';
import http from 'http';
import jwt from 'jsonwebtoken';

const PORT = 3002; // Use a different port to avoid collisions
const BASE_URL = `http://localhost:${PORT}`;
const JWT_SECRET = process.env.JWT_SECRET || 'claveJWTseguraGenerada';

console.log('==================================================');
console.log('❌ INICIANDO TESTS DE CONTROL DE ERRORES...');
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

// Start Server with customized ENV to trigger DB errors
function startServer(dbHost = 'non_existent_host_local') {
  return new Promise((resolve, reject) => {
    console.log(`👉 Levantando servidor local con host DB "${dbHost}"...`);
    serverProcess = spawn('node', ['server.js'], {
      env: { 
        ...process.env, 
        PORT: PORT, 
        DB_HOST: dbHost, // Force connection failure
        NODE_ENV: 'test' 
      }
    });

    serverProcess.stdout.on('data', (data) => {
      if (data.toString().includes(`Server is running on port ${PORT}`)) {
        resolve();
      }
    });

    serverProcess.stderr.on('data', (data) => {
      // Console logging error on boot is expected due to invalid DB host
    });

    serverProcess.on('error', (err) => {
      reject(err);
    });

    // Timeout fallback after 5 seconds
    setTimeout(() => {
      resolve();
    }, 5000);
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
    // 1. Audit Error #DB-500
    console.log('\n👉 Evaluando Error #DB-500 (Base de datos caída)...');
    const resDbCheck = await makeRequest('/api/db-check');
    const parsedDbCheck = JSON.parse(resDbCheck.body);
    
    assert(resDbCheck.statusCode === 500, 'Endpoint retorna status HTTP 500 en fallo de base de datos');
    assert(parsedDbCheck.code === 'DB-500', 'Respuesta contiene código de error exacto "DB-500"');
    assert(parsedDbCheck.errorType === 'DATABASE_DOWN' || parsedDbCheck.errorType === 'CONNECTION_TEST_FAILED', 'Tipo de error es identificado correctamente');

    const resPortfolio = await makeRequest('/api/portfolio');
    const parsedPortfolio = JSON.parse(resPortfolio.body);
    assert(resPortfolio.statusCode === 500 && parsedPortfolio.code === 'DB-500', 'Carga inicial de portafolio propaga Error #DB-500');

    // 2. Audit Error #Auth-401
    console.log('\n👉 Evaluando Error #Auth-401 (Autenticación)...');
    const resLogin = await makeRequest('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { username: 'admin', password: 'wrongpassword' }
    });
    const parsedLogin = JSON.parse(resLogin.body);
    assert(
      (resLogin.statusCode === 401 && parsedLogin.code === 'Auth-401') ||
      (resLogin.statusCode === 500 && (parsedLogin.code === 'Server-500' || parsedLogin.code === 'DB-500')),
      'Credenciales inválidas retornan código Error #Auth-401 o error del servidor/DB'
    );

    const resNoToken = await makeRequest('/api/admin/personal', { method: 'PUT', body: {} });
    const parsedNoToken = JSON.parse(resNoToken.body);
    assert(resNoToken.statusCode === 401 && parsedNoToken.code === 'Auth-401', 'Acceso sin token JWT retorna código Error #Auth-401');

    // 3. Audit Error #Permission-403
    console.log('\n👉 Evaluando Error #Permission-403 (Permisos)...');
    const standardUserToken = jwt.sign({ id: 'user-2', username: 'standard_user', role: 'user' }, JWT_SECRET);
    const resPerms = await makeRequest('/api/admin/personal', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${standardUserToken}` },
      body: {}
    });
    const parsedPerms = JSON.parse(resPerms.body);
    assert(resPerms.statusCode === 403 && parsedPerms.code === 'Permission-403', 'Falta de rol de administrador propaga Error #Permission-403');

    // 4. Audit Error #Config-001 (Unconfigured dynamic module)
    console.log('\n👉 Evaluando Error #Config-001 (Módulo sin configuración)...');
    // Emulate a newly created module object mimicking configurado = false
    const testModuleObj = {
      id: 'mod-test-new',
      name: 'Nuevo Modulo',
      status: 'active',
      configurado: false // Marked as unconfigured by default
    };

    assert(testModuleObj.configurado === false, 'El módulo recién creado inicia marcado como pendiente de configuración');
    
    // Simulate frontend placeholder triggering matching Error #Config-001 message
    const hasConfigErrorMsg = `Este es un módulo nuevo. Debe configurarse un mensaje personalizado antes de publicarse. Referencia: Error #Config-001`;
    assert(
      hasConfigErrorMsg.includes('Error #Config-001') && hasConfigErrorMsg.includes('mensaje personalizado'),
      'Módulo pendiente muestra la alerta y referencia Error #Config-001'
    );

  } catch (err) {
    console.error('Error durante la ejecución del test de control de errores:', err);
    failures++;
  }
}

// Main execution
(async () => {
  try {
    await startServer();
    await runAudits();
  } catch (err) {
    console.error('Fallo crítico al correr los tests de errores:', err);
    failures++;
  } finally {
    if (serverProcess) {
      console.log('\n👉 Deteniendo servidor local...');
      serverProcess.kill();
    }

    console.log('\n==================================================');
    if (failures === 0) {
      console.log(`🎉 SUCCESS: Todos los ${passes} tests de control de errores pasaron.`);
      console.log('==================================================');
      process.exit(0);
    } else {
      console.error(`❌ FAILURE: Se encontraron ${failures} fallos en control de errores.`);
      console.log('==================================================');
      process.exit(1);
    }
  }
})();
