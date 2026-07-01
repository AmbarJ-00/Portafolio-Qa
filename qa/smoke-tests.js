/**
 * Smoke Tests — Portafolio QA
 * 
 * Este script valida programáticamente la consistencia de las traducciones
 * y la integridad de los datos de configuración del portafolio.
 * 
 * Ejecución: node qa/smoke-tests.js
 */

import { es } from '../src/data/translations/es.js';
import { en } from '../src/data/translations/en.js';
import { portfolioConfig } from '../src/data/portfolioData.js';

// Helper: Obtener todas las rutas de objetos anidados como strings ("nav.home", etc)
function getObjectPaths(obj, prefix = '') {
  let paths = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        paths = paths.concat(getObjectPaths(obj[key], path));
      } else {
        paths.push(path);
      }
    }
  }
  return paths;
}

console.log('==================================================');
console.log('🤖 INICIANDO PRUEBAS DE HUMO (SMOKE TESTS) QA...');
console.log('==================================================\n');

let failures = 0;

// TEST 1: Simetría de Diccionarios de Traducción
console.log('👉 [TEST 1] Verificando consistencia de traducción (ES <-> EN)...');
const pathsEs = getObjectPaths(es);
const pathsEn = getObjectPaths(en);

const missingInEn = pathsEs.filter(p => !pathsEn.includes(p));
const missingInEs = pathsEn.filter(p => !pathsEs.includes(p));

if (missingInEn.length > 0) {
  console.error(`❌ ERROR: Las siguientes claves existen en ES pero no en EN:`);
  missingInEn.forEach(p => console.error(`   - ${p}`));
  failures++;
} else {
  console.log('✅ Simetría ES -> EN: Correcta.');
}

if (missingInEs.length > 0) {
  console.error(`❌ ERROR: Las siguientes claves existen en EN pero no en ES:`);
  missingInEs.forEach(p => console.error(`   - ${p}`));
  failures++;
} else {
  console.log('✅ Simetría EN -> ES: Correcta.');
}

// TEST 2: Validación de Claves en Configuración Central
console.log('\n👉 [TEST 2] Verificando referencias a i18n en portfolioData.js...');

// Verificar Skills
portfolioConfig.skills.forEach(skill => {
  const descKey = `${skill.translationKey}.desc`;
  const expKey = `${skill.translationKey}.exp`;
  const useCasesKey = `${skill.translationKey}.use_cases`;

  if (!pathsEs.includes(descKey)) {
    console.error(`❌ ERROR: Habilidad [${skill.id}] falta clave traducción para descripción (${descKey})`);
    failures++;
  }
  if (!pathsEs.includes(expKey)) {
    console.error(`❌ ERROR: Habilidad [${skill.id}] falta clave traducción para experiencia (${expKey})`);
    failures++;
  }
  if (!pathsEs.includes(useCasesKey)) {
    console.error(`❌ ERROR: Habilidad [${skill.id}] falta clave traducción para casos de uso (${useCasesKey})`);
    failures++;
  }
});

// Verificar Proyectos
portfolioConfig.projects.forEach(project => {
  const titleKey = project.titleKey;
  const descKey = project.descriptionKey;
  const strategyKey = `${project.translationKey}.strategy_summary`;
  const risksKey = `${project.translationKey}.risks`;
  const bugsKey = `${project.translationKey}.bugs_detailed`;

  if (!pathsEs.includes(titleKey)) {
    console.error(`❌ ERROR: Proyecto [${project.id}] falta clave traducción para título (${titleKey})`);
    failures++;
  }
  if (!pathsEs.includes(descKey)) {
    console.error(`❌ ERROR: Proyecto [${project.id}] falta clave traducción para descripción (${descKey})`);
    failures++;
  }
  if (!pathsEs.includes(strategyKey)) {
    console.error(`❌ ERROR: Proyecto [${project.id}] falta clave traducción para estrategia (${strategyKey})`);
    failures++;
  }
  if (!pathsEs.includes(risksKey)) {
    console.error(`❌ ERROR: Proyecto [${project.id}] falta clave traducción para riesgos (${risksKey})`);
    failures++;
  }
  if (!pathsEs.includes(bugsKey)) {
    console.error(`❌ ERROR: Proyecto [${project.id}] falta clave traducción para reporte de bugs (${bugsKey})`);
    failures++;
  }
});

// Verificar Certificaciones
portfolioConfig.certifications.forEach(cert => {
  const titleKey = cert.titleKey;
  const descKey = `${cert.translationKey}.desc`;

  if (!pathsEs.includes(titleKey)) {
    console.error(`❌ ERROR: Certificación [${cert.id}] falta clave traducción para título (${titleKey})`);
    failures++;
  }
  if (!pathsEs.includes(descKey)) {
    console.error(`❌ ERROR: Certificación [${cert.id}] falta clave traducción para descripción (${descKey})`);
    failures++;
  }
});

// Verificar Documentación
portfolioConfig.documentation.templates.forEach(tpl => {
  const titleKey = tpl.titleKey;
  const descKey = tpl.descriptionKey;
  const methodologyKey = tpl.methodologyKey;

  if (!pathsEs.includes(titleKey)) {
    console.error(`❌ ERROR: Plantilla Documento [${tpl.id}] falta clave traducción para título (${titleKey})`);
    failures++;
  }
  if (!pathsEs.includes(descKey)) {
    console.error(`❌ ERROR: Plantilla Documento [${tpl.id}] falta clave traducción para descripción (${descKey})`);
    failures++;
  }
  if (!pathsEs.includes(methodologyKey)) {
    console.error(`❌ ERROR: Plantilla Documento [${tpl.id}] falta clave traducción para metodología (${methodologyKey})`);
    failures++;
  }
});

console.log('\n==================================================');
if (failures === 0) {
  console.log('🎉 RESULTADO: TODOS LOS TEST PASARON EXITOSAMENTE (0 fallos).');
  console.log('==================================================');
  process.exit(0);
} else {
  console.error(`❌ RESULTADO: SE ENCONTRARON ${failures} ERRORES DE CONSISTENCIA.`);
  console.log('==================================================');
  process.exit(1);
}
