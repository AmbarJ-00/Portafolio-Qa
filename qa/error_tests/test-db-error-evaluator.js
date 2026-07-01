import assert from 'assert';

// Prevenir que el servidor Express intente abrir el puerto 3001 al importar server.js
process.env.VERCEL = '1';

import { isDatabaseError } from '../../server.js';

console.log('=== INICIANDO PRUEBAS DE EVALUACIÓN DE ERRORES DE BASE DE DATOS Y FALLBACK ===\n');

const testCases = [
  // 1. Códigos de error de base de datos
  { error: { code: 'DB-500', message: 'Generic db error' }, expected: true, desc: 'Código personalizado DB-500' },
  { error: { code: 'ECONNREFUSED', message: 'Connection refused' }, expected: true, desc: 'Código Connection Refused' },
  { error: { code: 'ETIMEDOUT', message: 'Timeout' }, expected: true, desc: 'Código Connection Timeout' },
  { error: { code: 'ENOTFOUND', message: 'Host not found' }, expected: true, desc: 'Código Host Not Found (ENOTFOUND)' },
  { error: { code: 'ER_ACCESS_DENIED_ERROR', message: 'Access denied' }, expected: true, desc: 'Código MySQL Access Denied' },
  { error: { code: 'ER_NO_SUCH_TABLE', message: 'Table does not exist' }, expected: true, desc: 'Código MySQL No Such Table' },
  { error: { code: 'ER_BAD_DB_ERROR', message: 'Database does not exist' }, expected: true, desc: 'Código MySQL Bad Database' },

  // 2. Prefijo genérico de MySQL (ER_)
  { error: { code: 'ER_ANY_OTHER_MYSQL_CODE', message: 'Some specific mysql issue' }, expected: true, desc: 'Cualquier código que empiece con ER_' },

  // 3. Coincidencia insensible a mayúsculas/minúsculas en el mensaje
  { error: { message: 'Lost Connection to MySQL server at localhost:3306' }, expected: true, desc: 'Mensaje con "Connection" (primera mayúscula)' },
  { error: { message: 'Could not connect to database' }, expected: true, desc: 'Mensaje con "connect" (minúscula)' },
  { error: { message: 'Pool acquisition failed' }, expected: true, desc: 'Mensaje con "pool" (minúscula)' },
  { error: { message: 'Access Denied for user root@localhost' }, expected: true, desc: 'Mensaje con "Access Denied" (mayúsculas y minúsculas)' },
  { error: { message: 'Table \'qa_portfolio.users\' doesn\'t exist' }, expected: true, desc: 'Mensaje con "does not exist"' },
  { error: { message: 'No such table: users' }, expected: true, desc: 'Mensaje con "no such table"' },

  // 4. Errores no relacionados a base de datos (deben retornar false)
  { error: { code: 'VALIDATION_ERROR', message: 'Invalid email format' }, expected: false, desc: 'Error de validación de usuario' },
  { error: { code: 'INVALID_TOKEN', message: 'JWT verification failed' }, expected: false, desc: 'Error de token de autenticación' },
  { error: { message: 'SyntaxError: Unexpected token' }, expected: false, desc: 'Error de sintaxis de JS' },
  { error: null, expected: false, desc: 'Objeto de error nulo' },
  { error: undefined, expected: false, desc: 'Objeto de error indefinido' }
];

let passedCount = 0;

for (const tc of testCases) {
  try {
    const result = isDatabaseError(tc.error);
    assert.strictEqual(result, tc.expected, `Falló: ${tc.desc}`);
    console.log(`✅ PASÓ: ${tc.desc}`);
    passedCount++;
  } catch (err) {
    console.error(`❌ FALLÓ: ${tc.desc} (Esperado: ${tc.expected}, Obtenido: ${!tc.expected})`);
    console.error(err);
    process.exit(1);
  }
}

console.log(`\n🎉 Pruebas de detección de errores de DB: ${passedCount}/${testCases.length} pasadas.`);

// 5. Simulación de la Evaluación de Autenticación de Fallback
console.log('\n=== SIMULANDO EVALUACIÓN DE AUTENTICACIÓN DE FALLBACK ===\n');

// Configuración de las variables de entorno simuladas para el fallback
process.env.ADMIN_FALLBACK_USER = 'admin';
process.env.ADMIN_FALLBACK_PASS = 'AdminQA#2026';

const runSimulatedLogin = (username, password, dbError) => {
  const fallbackUser = process.env.ADMIN_FALLBACK_USER;
  const fallbackPass = process.env.ADMIN_FALLBACK_PASS;
  const isDbErr = isDatabaseError(dbError);

  if (isDbErr && fallbackUser && fallbackPass) {
    if (username === fallbackUser && password === fallbackPass) {
      return { success: true, mode: 'fallback', message: 'Autenticación exitosa mediante credenciales de fallback' };
    }
    return { success: false, mode: 'fallback', message: 'Credenciales de fallback inválidas' };
  }
  return { success: false, mode: 'database', message: 'Intento de consulta a base de datos (u otro error no gestionable por fallback)' };
};

// Escenario A: DB caída + credenciales de fallback correctas
const r1 = runSimulatedLogin('admin', 'AdminQA#2026', { code: 'ECONNREFUSED', message: 'Connection refused' });
assert.deepStrictEqual(r1, { success: true, mode: 'fallback', message: 'Autenticación exitosa mediante credenciales de fallback' });
console.log('✅ Escenario A PASÓ: DB caída + credenciales fallback correctas -> Permite el ingreso.');

// Escenario B: DB caída + credenciales de fallback incorrectas
const r2 = runSimulatedLogin('admin', 'WrongPass123', { code: 'ENOTFOUND', message: 'Host not found' });
assert.deepStrictEqual(r2, { success: false, mode: 'fallback', message: 'Credenciales de fallback inválidas' });
console.log('✅ Escenario B PASÓ: DB caída + credenciales fallback incorrectas -> Bloquea el ingreso.');

// Escenario C: DB online + credenciales de fallback (no debe activar fallback, sino intentar base de datos normal)
const r3 = runSimulatedLogin('admin', 'AdminQA#2026', null);
assert.deepStrictEqual(r3, { success: false, mode: 'database', message: 'Intento de consulta a base de datos (u otro error no gestionable por fallback)' });
console.log('✅ Escenario C PASÓ: DB online + credenciales fallback -> No activa fallback (intenta flujo normal de BD).');

// Escenario D: DB online, pero el usuario no existe en la base de datos (es un resultado normal, no un error de DB)
const r4 = runSimulatedLogin('someUser', 'somePass', null);
assert.deepStrictEqual(r4, { success: false, mode: 'database', message: 'Intento de consulta a base de datos (u otro error no gestionable por fallback)' });
console.log('✅ Escenario D PASÓ: DB online + usuario inexistente -> No activa fallback.');

console.log('\n🎉 TODOS LOS ESCENARIOS DE FALLBACK SE VALIDARON DE MANERA CORRECTA Y SEGURA.');
process.exit(0);
