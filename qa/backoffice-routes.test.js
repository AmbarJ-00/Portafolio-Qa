/**
 * Backoffice Route Audit — Vercel Configurations and Route Guards
 * 
 * Inspects vercel.json, api/index.js, server.js, and AdminRoute.jsx to verify Vercel routing.
 * 
 * Execution: node qa/backoffice-routes.test.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VERCEL_JSON_PATH = path.resolve(__dirname, '../vercel.json');
const SERVER_JS_PATH = path.resolve(__dirname, '../server.js');
const API_INDEX_PATH = path.resolve(__dirname, '../api/index.js');
const ADMIN_ROUTE_PATH = path.resolve(__dirname, '../src/admin/AdminRoute.jsx');

console.log('==================================================');
console.log('🧪 RUNNING BACKOFFICE ROUTES & VERCEL HOOKS TESTS');
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
  // 1. Audit vercel.json rewrites
  if (fs.existsSync(VERCEL_JSON_PATH)) {
    const vercelConfig = JSON.parse(fs.readFileSync(VERCEL_JSON_PATH, 'utf8'));
    const rewrites = vercelConfig.rewrites || [];
    
    const apiRewrite = rewrites.find(r => r.source === '/api/:path*' && r.destination === '/api/index.js');
    const spaRewrite = rewrites.find(r => r.source === '/((?!api).*)/?' && r.destination === '/index.html');
    
    assert(apiRewrite !== undefined, 'vercel.json: peticiones `/api/*` se redirigen a la función serverless `/api/index.js` correctamente');
    assert(spaRewrite !== undefined, 'vercel.json: peticiones del SPA excluyen `/api` y caen en `/index.html` para React Router');
  } else {
    assert(false, 'Archivo vercel.json no existe en el root del proyecto');
  }

  // 2. Audit api/index.js exists and exports app
  if (fs.existsSync(API_INDEX_PATH)) {
    const apiIndexContent = fs.readFileSync(API_INDEX_PATH, 'utf8');
    assert(apiIndexContent.includes("import app from '../server.js';") && apiIndexContent.includes('export default app;'), 'api/index.js: exporta por defecto la app Express');
  } else {
    assert(false, 'Punto de entrada api/index.js no existe en el proyecto');
  }

  // 3. Audit server.js conditional app.listen and export
  if (fs.existsSync(SERVER_JS_PATH)) {
    const serverJsContent = fs.readFileSync(SERVER_JS_PATH, 'utf8');
    const hasListenCheck = serverJsContent.includes("process.env.VERCEL !== '1'") && serverJsContent.includes('app.listen');
    const hasExport = serverJsContent.includes('export default app;');
    
    assert(hasListenCheck, 'server.js: el listener de Express está envuelto en un chequeo del entorno VERCEL');
    assert(hasExport, 'server.js: exporta la app Express al final de la ejecución');
  } else {
    assert(false, 'Archivo server.js no existe en el root del proyecto');
  }

  // 4. Audit AdminRoute.jsx loadingAuth
  if (fs.existsSync(ADMIN_ROUTE_PATH)) {
    const adminRouteContent = fs.readFileSync(ADMIN_ROUTE_PATH, 'utf8');
    const hasLoadingAuthCheck = adminRouteContent.includes('loadingAuth') && adminRouteContent.includes('Verificando sesión...');
    assert(hasLoadingAuthCheck, 'AdminRoute.jsx: evalúa la bandera loadingAuth antes de decidir redirigir al Login');
  } else {
    assert(false, 'Archivo AdminRoute.jsx no existe');
  }

} catch (err) {
  console.error('Critical error executing backoffice routes tests:', err.message);
  failures++;
}

console.log('\n==================================================');
if (failures === 0) {
  console.log(`🎉 SUCCESS: Todos los ${passes} tests de enrutamiento pasaron exitosamente.`);
  console.log('==================================================');
  process.exit(0);
} else {
  console.error(`❌ FAILURE: Se encontraron ${failures} fallos en los tests de enrutamiento.`);
  console.log('==================================================');
  process.exit(1);
}
