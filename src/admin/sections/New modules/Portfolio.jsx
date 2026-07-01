import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Activity, X } from 'lucide-react';

const Portfolio = () => {
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const elements = [
  {
    "description": "# TASK: Diagnose and Fix Full Backoffice ↔ Main Website Integration Failure\n\nAntes de ejecutar cualquier cambio, debes leer y respetar completamente el archivo de reglas del proyecto:\n\n* AI_EXECUTION_RULES.md\n  (o el archivo maestro equivalente definido para este proyecto)\n\nDebes cumplir todas las reglas de ejecución, validación, testing y restricciones.\n\n---\n\n# CRITICAL EXECUTION RULES\n\n* NO modificar archivos innecesariamente.\n* NO cambiar rutas del sistema.\n* NO modificar credenciales del administrador.\n* NO cambiar estilos ni UI salvo que sea estrictamente necesario para resolver el bug.\n* NO dejar código incompleto.\n* NO dejar esquemas vacíos.\n* NO dejar funciones a medias.\n* NO eliminar comentarios existentes.\n* Al finalizar, ejecutar todos los tests QA.\n\n---\n\n# MAIN PROBLEM\n\nDebes revisar exhaustivamente la integración entre el **Backoffice (Admin Manager)** y la **Página Principal**.\n\nActualmente la integración está fallando gravemente.\n\nEl problema principal es que prácticamente nada del backoffice funciona correctamente.\n\nLos cambios realizados desde el administrador:\n\n* No se almacenan correctamente\n* No persisten\n* No se reflejan en la página principal\n* Algunos módulos presentan errores internos\n\nEn otras palabras:\n\nActualmente el backoffice no está conectado correctamente con la web principal.\n\n---\n\n# MAIN OBJECTIVE\n\nDebes diagnosticar y solucionar completamente el flujo:\n\nBackoffice → Storage Layer → Main Website Rendering\n\nToda modificación hecha en el administrador debe:\n\n1. Guardarse correctamente\n2. Persistir correctamente\n3. Ser recuperable\n4. Reflejarse automáticamente en la página principal\n\n---\n\n# MODULES WITH CONFIRMED ISSUES\n\nDebes revisar prioritariamente estos módulos:\n\n* Proyectos\n* Configuración General\n* Certificados\n* Skills\n* Documentación\n\n---\n\n# CURRENT FAILURES\n\n---\n\n## 1. Projects Module Failing\n\nLos cambios realizados en:\n\n* Título\n* Descripción\n* Métricas\n* Mejoras\n* Imagen\n* Estado\n* Demo URL\n* Repository URL\n\nNo se almacenan correctamente o no aparecen en la página principal.\n\nDebes revisar:\n\n* Forms\n* Validation\n* Save handlers\n* Edit handlers\n* Delete handlers\n* Storage logic\n* Rendering logic\n\n---\n\n## 2. General Settings Module Failing\n\nCambios realizados en:\n\n* Hero content\n* Home texts\n* Titles\n* Descriptions\n* Metrics\n* Leadership card\n* General config\n\nNo están impactando la página principal.\n\nDebes revisar:\n\n* Config persistence\n* Context update\n* State synchronization\n* Render pipeline\n\n---\n\n## 3. Certifications Module Failing\n\nLos nuevos certificados creados en backoffice:\n\n* No persisten\n* No aparecen en página principal\n* Descripciones no renderizan correctamente\n\nDebes revisar:\n\n* Certificate schemas\n* Upload/image storage\n* Card rendering\n* Mapping logic\n\n---\n\n## 4. Skills Module Failing\n\nActualmente el módulo Skills no está funcionando correctamente.\n\nRevisar:\n\n* Add skill\n* Edit skill\n* Delete skill\n* Skill status\n* Skill rendering in homepage\n\nValidar que:\n\n* Skills nuevas se guarden\n* Skills editadas se actualicen\n* Skills eliminadas desaparezcan\n\n---\n\n## 5. Documentation Module Error\n\nExiste un error interno en el módulo Documentation.\n\nLa información relacionada con:\n\n* Checklist\n* Description\n* Strategy\n* Methodology\n* Type\n* Category\n\nNo está funcionando correctamente.\n\nDebes revisar:\n\n* Forms\n* Schemas\n* Save logic\n* Render logic\n* State synchronization\n\n---\n\n# REQUIRED FULL DIAGNOSTIC\n\nDebes revisar TODA la arquitectura de integración.\n\n---\n\n# STORAGE LAYER ANALYSIS\n\nPrimero identifica qué storage está usando el sistema actualmente.\n\nRevisar si la web está usando:\n\n* localStorage\n* sessionStorage\n* context only\n* in-memory state\n* API\n* database layer\n* hybrid architecture\n\n---\n\n# Validate Full Data Flow\n\nDebes analizar toda la cadena:\n\nAdmin Input\n→ Form State\n→ Validation\n→ Save Handler\n→ Storage Layer\n→ Context Update\n→ Main Website Read\n→ Main Website Render\n\n---\n\n# FILES TO INSPECT\n\nDebes revisar exhaustivamente todos los archivos relacionados.\n\nIncluye pero no te limites a:\n\n* PortfolioContext\n* Admin contexts\n* Storage services\n* Config services\n* Data services\n* Module services\n* Local storage helpers\n* Render components\n* Form schemas\n* Validation schemas\n\n---\n\n# REQUIRED CHECKS\n\nDebes validar si el problema está en:\n\n---\n\n## Form Layer\n\n* Inputs broken\n* Submit broken\n* Form validation failing\n\n---\n\n## Storage Layer\n\n* Save function broken\n* Wrong storage key\n* Invalid serialization\n* localStorage corruption\n\n---\n\n## Data Layer\n\n* Incorrect schemas\n* Broken mapping\n* Null values\n* Wrong default values\n\n---\n\n## State Layer\n\n* Context not updating\n* State mutation issues\n* Missing re-renders\n\n---\n\n## Rendering Layer\n\n* Components not reading updated state\n* Stale values\n* Incorrect mapping\n\n---\n\n# REQUIRED FIXES\n\nDebes solucionar TODOS los puntos encontrados.\n\nNo quiero diagnóstico parcial.\n\nQuiero solución completa.\n\n---\n\n# NEW TESTS REQUIRED\n\nCrear nuevos tests de integración dedicados exclusivamente a validar:\n\nBackoffice ↔ Main Website Integration\n\nCrear carpeta:\n\n```bash\nqa/backoffice_integration_tests/\n```\n\n---\n\n# Required Test Files\n\nEjemplo:\n\n* projects.integration.test.js\n* general.integration.test.js\n* certifications.integration.test.js\n* skills.integration.test.js\n* documentation.integration.test.js\n* storage.integration.test.js\n\nPuedes reorganizar si mejora la arquitectura.\n\n---\n\n# Test Requirements\n\nCada test debe validar:\n\n1. Cambio en backoffice\n2. Guardado correcto\n3. Persistencia correcta\n4. Reflejo en página principal\n\n---\n\n# Failure Reporting Format\n\nSi falla algo, reportar exactamente:\n\nBACKOFFICE INTEGRATION ERROR REPORT\n\n* Module:\n* Failed Layer:\n* Failed File:\n* Root Cause:\n* Impact:\n* Recommended Fix:\n\nEjemplo:\n\n* Module: Skills\n* Failed Layer: Storage\n* Failed File: src/context/PortfolioContext.jsx\n* Root Cause: localStorage key mismatch\n* Impact: Skills not rendering in homepage\n* Recommended Fix: normalize storage keys\n\n---\n\n# FINAL VALIDATION\n\nAntes de cerrar la tarea debes verificar:\n\n* Projects working\n* General working\n* Certifications working\n* Skills working\n* Documentation working\n* Storage working\n* Persistence working\n* Main website rendering updated data correctly\n\n---\n\n# MANDATORY FINAL STEP\n\nEjecutar:\n\n* QA tests\n* Integration tests\n* Backoffice integration tests\n\nSi algo falla:\n\nNO cierres la tarea.\n\nDebes reportarlo con diagnóstico completo y posibles soluciones.\n",
    "image": "",
    "url": "",
    "status": "active"
  },
  {
    "description": "Añadir Nuevo Elemento",
    "image": "",
    "url": "",
    "status": "active"
  },
  {
    "description": "Añadir Nuevo Elemento",
    "image": "",
    "url": "",
    "status": "active"
  }
];
  const accentColor = "#f8f838";
  const surfaceColor = "#85fef4";

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % elements.length);
  };
  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + elements.length) % elements.length);
  };

  return (
    <div className="space-y-8 p-6 rounded-3xl" style={{ backgroundColor: surfaceColor }}>
      <div className="space-y-2">
        <h2 className="text-3xl font-display font-extrabold text-brand-navy-900 dark:text-white">Portfolio</h2>
        <div className="h-1 w-20 rounded" style={{ backgroundColor: accentColor }} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {elements.map((item, idx) => (
          <div 
            key={idx} 
            className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between h-full relative group border-t-4"
            style={{ borderTopColor: accentColor }}
          >
            <div className="space-y-4">
              {item.image && (
                <img 
                  src={item.image} 
                  alt="Element visual" 
                  className="w-full h-44 object-cover rounded-xl border border-brand-ash-200/50 dark:border-brand-navy-800/40"
                />
              )}
              <p className="text-sm text-brand-navy-700 dark:text-brand-ash-300 leading-relaxed">
                {item.description}
              </p>
            </div>
            {item.url && (
              <div className="mt-6 pt-4 border-t border-brand-ash-200/30 dark:border-brand-navy-800/20">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-electric-500 hover:opacity-85"
                >
                  <span>Visitar recurso</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
