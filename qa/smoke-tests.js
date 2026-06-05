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

const isValidUrl = (value) => typeof value === 'string' && /^https?:\/\/.+/.test(value);
const isValidEmail = (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const keyExists = (path) => pathsEs.includes(path) || pathsEn.includes(path);

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

  [[titleKey, 'título'], [descKey, 'descripción'], [strategyKey, 'estrategia'], [risksKey, 'riesgos'], [bugsKey, 'reporte de bugs']].forEach(([path, label]) => {
    if (!pathsEs.includes(path)) {
      console.error(`❌ ERROR: Proyecto [${project.id}] falta clave traducción EN ES para ${label} (${path})`);
      failures++;
    }
    if (!pathsEn.includes(path)) {
      console.error(`❌ ERROR: Proyecto [${project.id}] falta clave traducción EN EN para ${label} (${path})`);
      failures++;
    }
  });
});

// Verificar Certificaciones
portfolioConfig.certifications.forEach(cert => {
  const titleKey = cert.titleKey;
  const descKey = `${cert.translationKey}.desc`;

  [[titleKey, 'título'], [descKey, 'descripción']].forEach(([path, label]) => {
    if (!pathsEs.includes(path)) {
      console.error(`❌ ERROR: Certificación [${cert.id}] falta clave traducción EN ES para ${label} (${path})`);
      failures++;
    }
    if (!pathsEn.includes(path)) {
      console.error(`❌ ERROR: Certificación [${cert.id}] falta clave traducción EN EN para ${label} (${path})`);
      failures++;
    }
  });
});

// Verificar Documentación
portfolioConfig.documentation.templates.forEach(tpl => {
  const titleKey = tpl.titleKey;
  const descKey = tpl.descriptionKey;
  const methodologyKey = tpl.methodologyKey;

  [[titleKey, 'título'], [descKey, 'descripción'], [methodologyKey, 'metodología']].forEach(([path, label]) => {
    if (!pathsEs.includes(path)) {
      console.error(`❌ ERROR: Plantilla Documento [${tpl.id}] falta clave traducción EN ES para ${label} (${path})`);
      failures++;
    }
    if (!pathsEn.includes(path)) {
      console.error(`❌ ERROR: Plantilla Documento [${tpl.id}] falta clave traducción EN EN para ${label} (${path})`);
      failures++;
    }
  });
});

console.log('\n👉 [TEST 3] Verificando consistencia de datos de configuración y enlaces públicos...');

if (!isValidEmail(portfolioConfig.personal.email)) {
  console.error(`❌ ERROR: El correo personal no es válido (${portfolioConfig.personal.email}).`);
  failures++;
}
if (!isValidUrl(portfolioConfig.personal.github)) {
  console.error(`❌ ERROR: La URL de GitHub no es válida (${portfolioConfig.personal.github}).`);
  failures++;
}
if (!isValidUrl(portfolioConfig.personal.linkedin)) {
  console.error(`❌ ERROR: La URL de LinkedIn no es válida (${portfolioConfig.personal.linkedin}).`);
  failures++;
}

['roleKey', 'taglineKey', 'availabilityKey', 'workModeKey'].forEach((keyName) => {
  const path = portfolioConfig.personal[keyName];
  if (!keyExists(path)) {
    console.error(`❌ ERROR: La clave personal ${keyName} no existe en las traducciones (${path}).`);
    failures++;
  }
});

portfolioConfig.projects.forEach(project => {
  if (!isValidUrl(project.demo)) {
    console.error(`❌ ERROR: El demo del proyecto [${project.id}] no es una URL válida (${project.demo}).`);
    failures++;
  }
  if (!isValidUrl(project.repository)) {
    console.error(`❌ ERROR: El repositorio del proyecto [${project.id}] no es una URL válida (${project.repository}).`);
    failures++;
  }
  if (typeof project.metrics.coverage !== 'number' || project.metrics.coverage < 0 || project.metrics.coverage > 100) {
    console.error(`❌ ERROR: La cobertura del proyecto [${project.id}] debe ser un número entre 0 y 100.`);
    failures++;
  }
});

portfolioConfig.certifications.forEach(cert => {
  if (!isValidUrl(cert.image)) {
    console.error(`❌ ERROR: La imagen de la certificación [${cert.id}] no es una URL válida (${cert.image}).`);
    failures++;
  }
});

if (!keyExists(portfolioConfig.documentation.methodsKey)) {
  console.error(`❌ ERROR: La clave de método de documentación no existe en traducciones (${portfolioConfig.documentation.methodsKey}).`);
  failures++;
}

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
