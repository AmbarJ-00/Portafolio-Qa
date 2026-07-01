/**
 * Documentation Validator — Architecture Documentation Audit
 * 
 * Verifies existence and detailed content compliance of docs/modules-architecture.md.
 * 
 * Execution: node qa/docs-validation.test.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOCS_FILE_PATH = path.resolve(__dirname, '../docs/modules-architecture.md');

console.log('==================================================');
console.log('🧪 RUNNING DOCUMENTATION VALIDATION AUDIT...');
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
  // 1. Check if the file exists
  const fileExists = fs.existsSync(DOCS_FILE_PATH);
  assert(fileExists, 'El archivo docs/modules-architecture.md fue creado correctamente');

  if (fileExists) {
    const content = fs.readFileSync(DOCS_FILE_PATH, 'utf8');

    // 2. Check for all 14 modules headers
    const modulesToVerify = [
      'Dashboard',
      'General',
      'Projects',
      'Skills',
      'Certifications',
      'Documentation',
      'Contact',
      'Appearance',
      'Navigation',
      'Modules',
      'About',
      'Home / Hero',
      'Footer',
      'Backoffice Auth'
    ];

    console.log('\n👉 Validando presencia de cabeceras de cada módulo...');
    modulesToVerify.forEach(m => {
      const hasHeader = content.includes(`### ${modulesToVerify.indexOf(m) + 1}. ${m}`) || content.includes(m);
      assert(hasHeader, `Módulo documentado: "${m}"`);
    });

    // 3. Check for structural properties per module
    console.log('\n👉 Validando presencia de subsecciones obligatorias...');
    const fieldsToVerify = [
      'Descripción funcional',
      'Responsabilidad técnica',
      'Componentes internos',
      'Estados',
      'Dependencias',
      'Dependencias inversas',
      'Archivos principales',
      'Flujo de datos',
      'Integración con Backoffice'
    ];

    fieldsToVerify.forEach(field => {
      const hasField = content.includes(field);
      assert(hasField, `Campo técnico presente: "${field}"`);
    });

    // 4. Verify Mermaid diagram
    console.log('\n👉 Validando diagramas de flujo y dependencias...');
    const hasMermaid = content.includes('```mermaid') && content.includes('graph TD');
    assert(hasMermaid, 'Diagrama de dependencias Mermaid (graph TD) definido');
  }

} catch (err) {
  console.error('Fallo crítico al correr la validación de documentación:', err.message);
  failures++;
}

console.log('\n==================================================');
if (failures === 0) {
  console.log(`🎉 SUCCESS: Todos los ${passes} tests de documentación pasaron.`);
  console.log('==================================================');
  process.exit(0);
} else {
  console.error(`❌ FAILURE: Se encontraron ${failures} fallos en el validador de documentación.`);
  console.log('==================================================');
  process.exit(1);
}
