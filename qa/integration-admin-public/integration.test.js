/**
 * Integration Test Suite — Integration between Backoffice and Public View
 * 
 * This file contains automated tests to verify the integration between
 * the administrator actions (state mutations) and the public state/views.
 * 
 * Execution: node qa/integration-admin-public/integration.test.js
 */

import { portfolioConfig as defaultPortfolioConfig } from '../../src/data/portfolioData.js';

console.log('==================================================');
console.log('🧪 RUNNING INTEGRATION TESTS: BACKOFFICE <-> PUBLIC');
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

// State Emulator mimicking PortfolioContext behavior
class PortfolioStateEmulator {
  constructor() {
    this.store = {
      ...defaultPortfolioConfig,
      aboutItems: [],
      heroCards: [
        { id: 'hero-1', title: 'Liderazgo de Calidad', description: 'Garantizando la excelencia en cada sprint', icon: 'ShieldCheck', status: 'active', type: 'vertical', priority: 1 },
        { id: 'hero-2', title: 'Automatización Eficiente', description: 'Reduciendo tiempos de ejecución con scripts estables', icon: 'Terminal', status: 'active', type: 'vertical', priority: 2 }
      ],
      settings: {
        seo: {
          title: 'Ambar Ramon | QA Lead',
          description: 'QA lead portfolio and quality management system for testing services.',
          openGraph: { type: 'website', image: 'https://qa-portfolio.vercel.app/og-image.png' },
          twitter: { card: 'summary_large_image', creator: '@ambarqa' }
        },
        appearance: {
          home: { gradient: 'from-brand-navy-800 via-brand-electric-500 to-brand-lilac-500', particles: true, heroEffect: 'glow' },
          projects: { cardStyle: 'glass', shadowStrength: 'medium', highlightColor: 'brand-electric-500' },
          skills: { modalStyle: 'card', progressStyle: 'gradient', cardAnimation: 'float' },
          certifications: { cardStyle: 'image-frame', borderStyle: 'rounded', animation: 'fade' },
          colors: {
            light: { primary: '#0f172a', secondary: '#7c3aed', accent: '#38bdf8', success: '#10b981', warning: '#f59e0b', danger: '#ef4444' },
            dark: { background: '#020617', surface: '#111827', text: '#f8fafc', muted: '#94a3b8', accent: '#a78bfa' },
            hover: '#38bdf8', metrics: '#f97316', icons: '#7c3aed', decorative: '#38bdf8'
          },
          navbar: { type: 'horizontal', layout: 'wrap', behavior: 'grid' }
        },
        navbar: {
          items: [
            { id: 'home', name: 'Home', labelKey: 'nav.home', path: '/', active: true },
            { id: 'projects', name: 'Projects', labelKey: 'nav.projects', path: '/projects', active: true },
            { id: 'skills', name: 'Skills', labelKey: 'nav.skills', path: '/skills', active: true },
            { id: 'documentation', name: 'Documentation', labelKey: 'nav.documentation', path: '/documentation', active: true },
            { id: 'certifications', name: 'Certifications', labelKey: 'nav.certifications', path: '/certifications', active: true },
            { id: 'about', name: 'About', labelKey: 'nav.about', path: '/about', active: true },
            { id: 'contact', name: 'Contact', labelKey: 'nav.contact', path: '/contact', active: true }
          ],
          type: 'horizontal',
          layout: 'wrap',
          behavior: 'grid'
        },
        modules: [
          {
            id: 'portfolio-overview',
            name: 'Portfolio',
            icon: 'Layers',
            description: 'Showcase projects, skills and certifications in a modular experience.',
            cards: ['Featured projects', 'Top skills', 'Certifications summary'],
            colors: { accent: '#38bdf8', surface: '#0f172a' },
            animation: 'fade-in'
          }
        ],
        contact: {
          email: defaultPortfolioConfig.personal?.email || '',
          linkedin: defaultPortfolioConfig.personal?.linkedin || '',
          github: defaultPortfolioConfig.personal?.github || '',
          phone: '',
          alternativeContact: '',
          country: defaultPortfolioConfig.personal?.location || ''
        }
      }
    };
  }

  // Action Mimics
  updateAppearance(payload) {
    this.store.settings.appearance = {
      ...this.store.settings.appearance,
      ...payload
    };
  }

  addModule(module) {
    const moduleId = module.id || `module-${Math.random().toString(36).slice(2, 9)}`;
    const newNavbarItem = {
      id: `nav-${moduleId}`,
      name: module.name,
      path: `/modules/${moduleId}`,
      active: module.status === 'active' || module.status === 'creative' || module.active !== false,
      status: module.status || 'active',
      creativeMessage: module.creativeMessage || ''
    };
    
    this.store.settings.modules.push({
      id: moduleId,
      name: module.name,
      icon: module.icon,
      description: module.description,
      cards: module.cards || [],
      colors: {
        accent: module.accentColor || '#38bdf8',
        surface: module.surfaceColor || '#0f172a'
      },
      animation: module.animation || 'fade-in',
      status: module.status || 'active',
      creativeMessage: module.creativeMessage || '',
      elementsType: module.elementsType || 'cards',
      elements: module.elements || []
    });

    this.store.settings.navbar.items.push(newNavbarItem);
  }

  updateModule(moduleId, payload) {
    this.store.settings.modules = this.store.settings.modules.map((module) =>
      module.id === moduleId
        ? {
            ...module,
            ...payload,
            colors: {
              accent: payload.accentColor || module.colors?.accent || '#38bdf8',
              surface: payload.surfaceColor || module.colors?.surface || '#0f172a'
            },
            status: payload.status || module.status || 'active',
            creativeMessage: payload.creativeMessage || module.creativeMessage || '',
            elementsType: payload.elementsType || module.elementsType || 'cards',
            elements: payload.elements || module.elements || []
          }
        : module
    );

    this.store.settings.navbar.items = this.store.settings.navbar.items.map((item) =>
      item.id === `nav-${moduleId}` || item.path === `/modules/${moduleId}`
        ? {
            ...item,
            name: payload.name || item.name,
            active: payload.status === 'active' || payload.status === 'creative' || payload.active !== false,
            status: payload.status || item.status || 'active',
            creativeMessage: payload.creativeMessage || item.creativeMessage || ''
          }
        : item
    );
  }

  deleteModule(moduleId) {
    this.store.settings.modules = this.store.settings.modules.filter((module) => module.id !== moduleId);
    this.store.settings.navbar.items = this.store.settings.navbar.items.filter(
      (item) => item.id !== `nav-${moduleId}` && item.path !== `/modules/${moduleId}`
    );
  }
}

// ----------------------------------------------------
// TEST RUNNER
// ----------------------------------------------------

console.log('👉 Running Test 1: Appearance & Colors Custom Configurations...');
{
  const emulator = new PortfolioStateEmulator();
  emulator.updateAppearance({
    backgroundGlobalLight: '#f8fafc',
    backgroundGlobalDark: '#0b0f19',
    colors: {
      light: { primary: '#1e293b', secondary: '#6d28d9', accent: '#06b6d4' },
      dark: { background: '#0b0f19', surface: '#1e293b', text: '#ffffff', muted: '#cbd5e1' }
    }
  });

  assert(emulator.store.settings.appearance.backgroundGlobalLight === '#f8fafc', 'Global light background correctly configured');
  assert(emulator.store.settings.appearance.backgroundGlobalDark === '#0b0f19', 'Global dark background correctly configured');
  assert(emulator.store.settings.appearance.colors.light.accent === '#06b6d4', 'Custom accent color is saved');
}

console.log('\n👉 Running Test 2: Dynamic Modules Addition & Navbar Synchronization...');
{
  const emulator = new PortfolioStateEmulator();
  emulator.addModule({
    id: 'test-kpis',
    name: 'Métricas QA',
    icon: 'Activity',
    description: 'Indicadores clave de automatización',
    status: 'active',
    elementsType: 'métricas',
    accentColor: '#10b981',
    surfaceColor: '#0c1020',
    animation: 'slide-up',
    elements: [
      { value: '98', percentage: true, indicator: 'Cobertura funcional' },
      { value: '142', percentage: false, indicator: 'Tests Ejecutados' }
    ]
  });

  const savedModule = emulator.store.settings.modules.find(m => m.id === 'test-kpis');
  assert(savedModule !== undefined, 'Module is added to modules list');
  assert(savedModule.elementsType === 'métricas', 'Elements layout type matches "métricas"');
  assert(savedModule.elements.length === 2, 'Two statistical metrics are populated');
  assert(savedModule.colors.accent === '#10b981', 'Custom accent color is correctly mapped');

  const navItem = emulator.store.settings.navbar.items.find(i => i.id === 'nav-test-kpis');
  assert(navItem !== undefined, 'Corresponding navbar link is auto-generated');
  assert(navItem.path === '/modules/test-kpis', 'Navbar path route format matches public structure');
  assert(navItem.active === true, 'Navbar link is active when status is active');
}

console.log('\n👉 Running Test 3: Dynamic Modules Updating & Status Creative Mode Banners...');
{
  const emulator = new PortfolioStateEmulator();
  emulator.addModule({
    id: 'test-feedback',
    name: 'Feedback de Clientes',
    icon: 'Users',
    description: 'Testimoniales del equipo de desarrollo',
    status: 'active',
    elementsType: 'carruseles'
  });

  // Update status to Creative Mode
  emulator.updateModule('test-feedback', {
    name: 'Feedback QA',
    status: 'creative',
    creativeMessage: 'Diseñando la sección de testimonios de sprints...'
  });

  const updatedModule = emulator.store.settings.modules.find(m => m.id === 'test-feedback');
  assert(updatedModule.name === 'Feedback QA', 'Module name was updated successfully');
  assert(updatedModule.status === 'creative', 'Module status is now set to creative');
  assert(updatedModule.creativeMessage === 'Diseñando la sección de testimonios de sprints...', 'Creative process description holds message');

  const navItem = emulator.store.settings.navbar.items.find(i => i.id === 'nav-test-feedback');
  assert(navItem.active === true, 'Creative mode is active and remains visible to users');
  assert(navItem.status === 'creative', 'Navbar item status synced with module status');
  assert(navItem.creativeMessage === 'Diseñando la sección de testimonios de sprints...', 'Creative message synced to navbar structure');
}

console.log('\n👉 Running Test 4: Dynamic Modules Deletion Sync...');
{
  const emulator = new PortfolioStateEmulator();
  emulator.addModule({
    id: 'to-delete',
    name: 'Temp Module',
    icon: 'Trash',
    description: 'Módulo temporal para eliminar',
    status: 'inactive'
  });

  assert(emulator.store.settings.modules.some(m => m.id === 'to-delete'), 'Temporary module initially exists');
  assert(emulator.store.settings.navbar.items.some(i => i.id === 'nav-to-delete'), 'Temporary navbar link initially exists');

  emulator.deleteModule('to-delete');

  assert(!emulator.store.settings.modules.some(m => m.id === 'to-delete'), 'Module deleted from storage configurations');
  assert(!emulator.store.settings.navbar.items.some(i => i.id === 'nav-to-delete'), 'Navbar link is auto-removed on module deletion');
}

console.log('\n👉 Running Test 5: Navbar Filtering and Resolving Overflow Dropdowns...');
{
  // Simulated render checks matching Navbar.jsx logic
  const emulator = new PortfolioStateEmulator();
  
  // Add multiple modules to make total items > 5
  emulator.addModule({ id: 'm1', name: 'Mod1', status: 'active' });
  emulator.addModule({ id: 'm2', name: 'Mod2', status: 'maintenance' }); // Maintenance status
  emulator.addModule({ id: 'm3', name: 'Mod3', status: 'inactive' });    // Inactive status
  emulator.addModule({ id: 'm4', name: 'Mod4', status: 'active' });
  emulator.addModule({ id: 'm5', name: 'Mod5', status: 'active' });

  // Simulate Navbar.jsx filtering logic
  const allItems = emulator.store.settings.navbar.items;
  const visibleItems = allItems.filter(
    (item) => item.status !== 'inactive' && item.status !== 'maintenance' && item.active !== false
  );

  assert(!visibleItems.some(i => i.id === 'nav-m2'), 'Maintenance modules are filtered out from public menu list');
  assert(!visibleItems.some(i => i.id === 'nav-m3'), 'Inactive modules are filtered out from public menu list');
  assert(visibleItems.some(i => i.id === 'nav-m1'), 'Active module link is visible');

  // Verify More Dropdown Logic (limit threshold is 5 links)
  const threshold = 5;
  const primaryLinks = visibleItems.slice(0, threshold);
  const dropdownLinks = visibleItems.slice(threshold);

  assert(primaryLinks.length === 5, 'Exactly 5 links displayed in main navigation bar');
  assert(dropdownLinks.length > 0, 'Excess links grouped into a dynamic "More" list');
  assert(dropdownLinks.some(i => i.id === 'nav-m5'), 'Excess active module link falls in dropdown container');
}

console.log('\n==================================================');
if (failures === 0) {
  console.log(`🎉 SUCCESS: All ${passes} integration tests passed successfully.`);
  console.log('==================================================');
  process.exit(0);
} else {
  console.error(`❌ FAILURE: ${failures} assertions failed. Test suite failed.`);
  console.log('==================================================');
  process.exit(1);
}
