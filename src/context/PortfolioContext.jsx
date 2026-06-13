import React, { createContext, useContext, useEffect, useState } from 'react';
import { portfolioConfig as defaultPortfolioConfig } from '../data/portfolioData.js';

const PortfolioContext = createContext();

const defaultNavbarItems = [
  { id: 'home', name: 'Home', labelKey: 'nav.home', path: '/', active: true },
  { id: 'projects', name: 'Projects', labelKey: 'nav.projects', path: '/projects', active: true },
  { id: 'skills', name: 'Skills', labelKey: 'nav.skills', path: '/skills', active: true },
  { id: 'documentation', name: 'Documentation', labelKey: 'nav.documentation', path: '/documentation', active: true },
  { id: 'certifications', name: 'Certifications', labelKey: 'nav.certifications', path: '/certifications', active: true },
  { id: 'about', name: 'About', labelKey: 'nav.about', path: '/about', active: true },
  { id: 'contact', name: 'Contact', labelKey: 'nav.contact', path: '/contact', active: true }
];

const defaultAppearance = {
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
};

const defaultModules = [
  {
    id: 'portfolio-overview',
    name: 'Portfolio',
    icon: 'Layers',
    description: 'Showcase projects, skills and certifications in a modular experience.',
    cards: ['Featured projects', 'Top skills', 'Certifications summary'],
    colors: { accent: '#38bdf8', surface: '#0f172a' },
    animation: 'fade-in'
  }
];

const createId = (prefix = 'item') => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const splitCsv = (value) =>
  typeof value === 'string'
    ? value.split(',').map((item) => item.trim()).filter(Boolean)
    : Array.isArray(value)
      ? value
      : [];

const getFallbackState = () => ({
  personal: defaultPortfolioConfig.personal || {
    name: "Ambar Ramon",
    roleKey: "personal.role",
    taglineKey: "personal.tagline",
    location: "Republica dominicana, Santo domingo",
    email: "ambarJob007@gmail.com",
    github: "https://github.com/AmbarJ-00",
    linkedin: "https://www.linkedin.com/in/ambarrq/"
  },
  aboutItems: [
    { id: 'about-1', type: 'mision', title: 'Misión Profesional', description: 'Asegurar la calidad del software mediante metodologías ágiles y automatización eficiente.', position: 'center', priority: 1, status: 'active', behavior: 'card' }
  ],
  heroCards: [
    { id: 'hero-1', title: 'Liderazgo de Calidad', description: 'Garantizando la excelencia en cada sprint', icon: 'ShieldCheck', status: 'active', priority: 1 },
    { id: 'hero-2', title: 'Automatización Eficiente', description: 'Reduciendo tiempos de ejecución con scripts estables', icon: 'Terminal', status: 'active', priority: 2 }
  ],
  projects: defaultPortfolioConfig.projects || [],
  skills: defaultPortfolioConfig.skills || [],
  certifications: defaultPortfolioConfig.certifications || [],
  documentation: defaultPortfolioConfig.documentation || { templates: [] },
  settings: {
    seo: defaultPortfolioConfig.settings?.seo || { title: 'Ambar Ramon | QA Lead', description: 'QA lead portfolio and quality management system.' },
    appearance: defaultAppearance,
    navbar: {
      items: defaultNavbarItems,
      type: 'horizontal',
      layout: 'wrap',
      behavior: 'grid'
    },
    modules: defaultModules,
    contact: {
      email: defaultPortfolioConfig.personal?.email || '',
      linkedin: defaultPortfolioConfig.personal?.linkedin || '',
      github: defaultPortfolioConfig.personal?.github || '',
      phone: '',
      alternativeContact: '',
      country: defaultPortfolioConfig.personal?.location || ''
    }
  }
});

const getInitialState = () => ({
  personal: {},
  aboutItems: [],
  heroCards: [],
  projects: [],
  skills: [],
  certifications: [],
  documentation: { templates: [] },
  settings: {
    seo: { title: 'Ambar Ramon | QA Lead', description: 'QA lead portfolio and quality management system.' },
    appearance: defaultAppearance,
    navbar: {
      items: defaultNavbarItems,
      type: 'horizontal',
      layout: 'wrap',
      behavior: 'grid'
    },
    modules: defaultModules,
    contact: {}
  }
});

export const PortfolioProvider = ({ children }) => {
  const [store, setStore] = useState(getInitialState);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  // Authenticated fetch helper
  const apiCall = async (url, options = {}) => {
    const token = sessionStorage.getItem('qa-admin-token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };
    
    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        
        // Handle specific DB-500 error code
        if (response.status === 500 && errData.code === 'DB-500') {
          setDbError('DB-500');
        }
        
        const error = new Error(errData.error || `HTTP error ${response.status}`);
        error.code = errData.code || 'Server-500';
        throw error;
      }
      return response.json();
    } catch (err) {
      console.error(`API Call failed to: ${url}`, err);
      // Trigger error log endpoint on backend (non-blocking)
      if (url !== '/api/errors' && token) {
        fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: err.code || 'Server-500',
            user: 'admin',
            module: url.split('/')[2] || 'context',
            action: options.method || 'GET',
            details: err.message
          })
        }).catch(() => {});
      }
      throw err;
    }
  };

  const loadData = async () => {
    setLoading(true);
    setDbError(null);
    try {
      const data = await apiCall('/api/portfolio');
      setStore(data);
    } catch (err) {
      console.warn("Using fallback portfolio data due to connection failure:", err.message);
      if (err.code === 'DB-500') {
        setDbError('DB-500');
      } else {
        setDbError('Server-500');
      }
      setStore(getFallbackState());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updatePersonal = async (payload) => {
    try {
      await apiCall('/api/admin/personal', { method: 'PUT', body: JSON.stringify(payload) });
      setStore((prev) => ({
        ...prev,
        personal: { ...prev.personal, ...payload }
      }));
    } catch (err) {
      throw err;
    }
  };

  const updateSEO = async (payload) => {
    try {
      await apiCall('/api/admin/settings/seo', { method: 'PUT', body: JSON.stringify(payload) });
      setStore((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          seo: { ...prev.settings.seo, ...payload }
        }
      }));
    } catch (err) {
      throw err;
    }
  };

  const updateContact = async (payload) => {
    try {
      await apiCall('/api/admin/settings/contact', { method: 'PUT', body: JSON.stringify(payload) });
      setStore((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          contact: { ...prev.settings.contact, ...payload }
        }
      }));
    } catch (err) {
      throw err;
    }
  };

  const updateAppearance = async (payload) => {
    try {
      await apiCall('/api/admin/settings/appearance', { method: 'PUT', body: JSON.stringify(payload) });
      setStore((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          appearance: { ...prev.settings.appearance, ...payload }
        }
      }));
    } catch (err) {
      throw err;
    }
  };

  const saveNavbarState = async (items, navbarConfig = {}) => {
    try {
      const payload = {
        items,
        type: navbarConfig.type || store.settings.navbar.type,
        layout: navbarConfig.layout || store.settings.navbar.layout,
        behavior: navbarConfig.behavior || store.settings.navbar.behavior
      };
      await apiCall('/api/admin/settings/navbar', { method: 'PUT', body: JSON.stringify(payload) });
      setStore((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          navbar: { ...prev.settings.navbar, ...payload }
        }
      }));
    } catch (err) {
      throw err;
    }
  };

  const setNavbar = async (payload) => {
    await saveNavbarState(store.settings.navbar.items, payload);
  };

  const addNavbarItem = async (item) => {
    const newItem = { id: createId('nav'), active: true, ...item };
    const nextItems = [...store.settings.navbar.items, newItem];
    await saveNavbarState(nextItems);
  };

  const updateNavbarItem = async (itemId, payload) => {
    const nextItems = store.settings.navbar.items.map((item) =>
      item.id === itemId ? { ...item, ...payload } : item
    );
    await saveNavbarState(nextItems);
  };

  const deleteNavbarItem = async (itemId) => {
    const nextItems = store.settings.navbar.items.filter((item) => item.id !== itemId);
    await saveNavbarState(nextItems);
  };

  const reorderNavbarItems = async (items) => {
    await saveNavbarState(items);
  };

  const addProject = async (project) => {
    const nextProject = {
      title: project.title,
      description: project.description,
      titleKey: project.titleKey || null,
      descriptionKey: project.descriptionKey || null,
      category: project.category,
      demo: project.demo,
      repository: project.repository,
      image: project.image,
      integrations: splitCsv(project.integrations),
      objectives: project.objectives,
      testingStrategy: project.testingStrategy,
      testPlan: project.testPlan,
      risks: project.risks,
      bugs: project.bugs,
      status: project.status || 'active',
      demoVisibility: project.demoVisibility || 'show',
      metrics: {
        coverage: Number(project.coverage) || 0,
        improvements: Number(project.improvements) || 0,
        riskCoverage: Number(project.riskCoverage) || 0,
        findingsCritical: Number(project.findingsCritical) || 0,
        bugsResolved: Number(project.bugsResolved) || 0,
        ambiguitiesFound: Number(project.ambiguitiesFound) || 0,
        qualityImpact: project.qualityImpact
      },
      enableMetrics: project.enableMetrics || true
    };

    try {
      const res = await apiCall('/api/admin/projects', { method: 'POST', body: JSON.stringify(nextProject) });
      nextProject.id = res.id;
      setStore((prev) => ({
        ...prev,
        projects: [nextProject, ...prev.projects]
      }));
    } catch (err) {
      throw err;
    }
  };

  const updateProject = async (projectId, payload) => {
    const updatedProject = {
      ...payload,
      integrations: splitCsv(payload.integrations),
      metrics: {
        coverage: Number(payload.coverage),
        improvements: Number(payload.improvements),
        riskCoverage: Number(payload.riskCoverage),
        findingsCritical: Number(payload.findingsCritical),
        bugsResolved: Number(payload.bugsResolved),
        ambiguitiesFound: Number(payload.ambiguitiesFound),
        qualityImpact: payload.qualityImpact
      }
    };
    try {
      await apiCall(`/api/admin/projects/${projectId}`, { method: 'PUT', body: JSON.stringify(updatedProject) });
      setStore((prev) => ({
        ...prev,
        projects: prev.projects.map((project) =>
          project.id === projectId ? { ...project, ...updatedProject } : project
        )
      }));
    } catch (err) {
      throw err;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await apiCall(`/api/admin/projects/${projectId}`, { method: 'DELETE' });
      setStore((prev) => ({
        ...prev,
        projects: prev.projects.filter((project) => project.id !== projectId)
      }));
    } catch (err) {
      throw err;
    }
  };

  const duplicateProject = async (projectId) => {
    const project = store.projects.find((item) => item.id === projectId);
    if (!project) return;
    const copy = {
      ...project,
      title: `${project.title} (Copy)`
    };
    await addProject(copy);
  };

  const addSkill = async (skill) => {
    const nextSkill = {
      name: skill.name,
      icon: skill.icon,
      level: Number(skill.level) || 0,
      category: skill.category,
      tools: splitCsv(skill.tools),
      relation: splitCsv(skill.relation),
      description: skill.description,
      color: skill.color || '#7c3aed',
      status: skill.status || 'active'
    };
    try {
      const res = await apiCall('/api/admin/skills', { method: 'POST', body: JSON.stringify(nextSkill) });
      nextSkill.id = res.id;
      setStore((prev) => ({
        ...prev,
        skills: [...prev.skills, nextSkill]
      }));
    } catch (err) {
      throw err;
    }
  };

  const updateSkill = async (skillId, payload) => {
    const updatedSkill = {
      ...payload,
      level: Number(payload.level),
      tools: splitCsv(payload.tools),
      relation: splitCsv(payload.relation)
    };
    try {
      await apiCall(`/api/admin/skills/${skillId}`, { method: 'PUT', body: JSON.stringify(updatedSkill) });
      setStore((prev) => ({
        ...prev,
        skills: prev.skills.map((skill) =>
          skill.id === skillId ? { ...skill, ...updatedSkill } : skill
        )
      }));
    } catch (err) {
      throw err;
    }
  };

  const deleteSkill = async (skillId) => {
    try {
      await apiCall(`/api/admin/skills/${skillId}`, { method: 'DELETE' });
      setStore((prev) => ({
        ...prev,
        skills: prev.skills.filter((skill) => skill.id !== skillId)
      }));
    } catch (err) {
      throw err;
    }
  };

  const reorderSkills = async (newOrder) => {
    try {
      const ids = newOrder.map((s) => s.id);
      await apiCall('/api/admin/skills/reorder', { method: 'PUT', body: JSON.stringify({ ids }) });
      setStore((prev) => ({
        ...prev,
        skills: newOrder
      }));
    } catch (err) {
      throw err;
    }
  };

  const addCertification = async (cert) => {
    const nextCert = {
      title: cert.title,
      authority: cert.authority,
      image: cert.image,
      date: cert.date,
      tools: splitCsv(cert.tools),
      integrations: splitCsv(cert.integrations),
      summary: cert.summary,
      url: cert.url,
      status: cert.status || 'Active'
    };
    try {
      const res = await apiCall('/api/admin/certifications', { method: 'POST', body: JSON.stringify(nextCert) });
      nextCert.id = res.id;
      setStore((prev) => ({
        ...prev,
        certifications: [...prev.certifications, nextCert]
      }));
    } catch (err) {
      throw err;
    }
  };

  const updateCertification = async (certId, payload) => {
    const updatedCert = {
      ...payload,
      tools: splitCsv(payload.tools),
      integrations: splitCsv(payload.integrations)
    };
    try {
      await apiCall(`/api/admin/certifications/${certId}`, { method: 'PUT', body: JSON.stringify(updatedCert) });
      setStore((prev) => ({
        ...prev,
        certifications: prev.certifications.map((cert) =>
          cert.id === certId ? { ...cert, ...updatedCert } : cert
        )
      }));
    } catch (err) {
      throw err;
    }
  };

  const deleteCertification = async (certId) => {
    try {
      await apiCall(`/api/admin/certifications/${certId}`, { method: 'DELETE' });
      setStore((prev) => ({
        ...prev,
        certifications: prev.certifications.filter((cert) => cert.id !== certId)
      }));
    } catch (err) {
      throw err;
    }
  };

  const reorderCertifications = async (newOrder) => {
    try {
      const ids = newOrder.map((c) => c.id);
      await apiCall('/api/admin/certifications/reorder', { method: 'PUT', body: JSON.stringify({ ids }) });
      setStore((prev) => ({
        ...prev,
        certifications: newOrder
      }));
    } catch (err) {
      throw err;
    }
  };

  const addDocumentationTemplate = async (template) => {
    const nextTpl = {
      title: template.title,
      category: template.category,
      type: template.type,
      template: template.template,
      questions: splitCsv(template.questions),
      parameters: splitCsv(template.parameters),
      methodology: template.methodology,
      checklist: splitCsv(template.checklist),
      strategies: splitCsv(template.strategies)
    };
    try {
      const res = await apiCall('/api/admin/documentation', { method: 'POST', body: JSON.stringify(nextTpl) });
      nextTpl.id = res.id;
      setStore((prev) => ({
        ...prev,
        documentation: {
          ...prev.documentation,
          templates: [nextTpl, ...prev.documentation.templates]
        }
      }));
    } catch (err) {
      throw err;
    }
  };

  const updateDocumentationTemplate = async (templateId, payload) => {
    const updatedTpl = {
      ...payload,
      questions: splitCsv(payload.questions),
      parameters: splitCsv(payload.parameters),
      checklist: splitCsv(payload.checklist),
      strategies: splitCsv(payload.strategies)
    };
    try {
      await apiCall(`/api/admin/documentation/${templateId}`, { method: 'PUT', body: JSON.stringify(updatedTpl) });
      setStore((prev) => ({
        ...prev,
        documentation: {
          ...prev.documentation,
          templates: prev.documentation.templates.map((template) =>
            template.id === templateId ? { ...template, ...updatedTpl } : template
          )
        }
      }));
    } catch (err) {
      throw err;
    }
  };

  const deleteDocumentationTemplate = async (templateId) => {
    try {
      await apiCall(`/api/admin/documentation/${templateId}`, { method: 'DELETE' });
      setStore((prev) => ({
        ...prev,
        documentation: {
          ...prev.documentation,
          templates: prev.documentation.templates.filter((template) => template.id !== templateId)
        }
      }));
    } catch (err) {
      throw err;
    }
  };

  const addModule = async (module) => {
    const moduleId = module.id || `module-${Math.random().toString(36).slice(2, 9)}`;
    const nextNavbarItem = {
      id: `nav-${moduleId}`,
      name: module.name,
      path: `/modules/${moduleId}`,
      active: module.status === 'active' || module.status === 'creative' || module.active !== false,
      status: module.status || 'active',
      creativeMessage: module.creativeMessage || ''
    };

    const nextModule = {
      id: moduleId,
      name: module.name,
      icon: module.icon,
      description: module.description,
      status: module.status || 'active',
      creativeMessage: module.creativeMessage || '',
      visible: module.visible !== false,
      configurado: module.configurado === true || module.configurado === 1,
      elementsType: module.elementsType || 'cards',
      elements: module.elements || [],
      accentColor: module.accentColor || '#38bdf8',
      surfaceColor: module.surfaceColor || '#0f172a',
      animation: module.animation || 'fade-in'
    };

    try {
      await apiCall('/api/admin/modules', { method: 'POST', body: JSON.stringify(nextModule) });
      
      const nextNavbarItems = [...store.settings.navbar.items, nextNavbarItem];
      await saveNavbarState(nextNavbarItems);

      setStore((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          modules: [nextModule, ...prev.settings.modules]
        }
      }));
    } catch (err) {
      throw err;
    }
  };

  const updateModule = async (moduleId, payload) => {
    const nextModule = {
      ...payload,
      configurado: payload.configurado === true || payload.configurado === 1
    };

    try {
      await apiCall(`/api/admin/modules/${moduleId}`, { method: 'PUT', body: JSON.stringify(nextModule) });

      const nextNavbarItems = store.settings.navbar.items.map((item) =>
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
      await saveNavbarState(nextNavbarItems);

      setStore((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          modules: prev.settings.modules.map((module) =>
            module.id === moduleId ? { ...module, ...nextModule } : module
          )
        }
      }));
    } catch (err) {
      throw err;
    }
  };

  const deleteModule = async (moduleId) => {
    try {
      await apiCall(`/api/admin/modules/${moduleId}`, { method: 'DELETE' });

      const nextNavbarItems = store.settings.navbar.items.filter(
        (item) => item.id !== `nav-${moduleId}` && item.path !== `/modules/${moduleId}`
      );
      await saveNavbarState(nextNavbarItems);

      setStore((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          modules: prev.settings.modules.filter((module) => module.id !== moduleId)
        }
      }));
    } catch (err) {
      throw err;
    }
  };

  const reorderModules = async (newOrder) => {
    try {
      const ids = newOrder.map((m) => m.id);
      await apiCall('/api/admin/modules/reorder', { method: 'PUT', body: JSON.stringify({ ids }) });
      setStore((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          modules: newOrder
        }
      }));
    } catch (err) {
      throw err;
    }
  };

  const addAboutItem = async (item) => {
    const nextItem = {
      type: item.type || 'pilar',
      title: item.title,
      description: item.description,
      position: item.position || 'center',
      priority: Number(item.priority) || 0,
      status: item.status || 'active',
      behavior: item.behavior || 'card'
    };
    try {
      const res = await apiCall('/api/admin/about-items', { method: 'POST', body: JSON.stringify(nextItem) });
      nextItem.id = res.id;
      setStore((prev) => ({
        ...prev,
        aboutItems: [nextItem, ...prev.aboutItems]
      }));
    } catch (err) {
      throw err;
    }
  };

  const updateAboutItem = async (itemId, payload) => {
    const updatedItem = {
      ...payload,
      priority: Number(payload.priority)
    };
    try {
      await apiCall(`/api/admin/about-items/${itemId}`, { method: 'PUT', body: JSON.stringify(updatedItem) });
      setStore((prev) => ({
        ...prev,
        aboutItems: prev.aboutItems.map((item) =>
          item.id === itemId ? { ...item, ...updatedItem } : item
        )
      }));
    } catch (err) {
      throw err;
    }
  };

  const deleteAboutItem = async (itemId) => {
    try {
      await apiCall(`/api/admin/about-items/${itemId}`, { method: 'DELETE' });
      setStore((prev) => ({
        ...prev,
        aboutItems: prev.aboutItems.filter((item) => item.id !== itemId)
      }));
    } catch (err) {
      throw err;
    }
  };

  const reorderAboutItems = async (newOrder) => {
    try {
      const ids = newOrder.map((a) => a.id);
      await apiCall('/api/admin/about-items/reorder', { method: 'PUT', body: JSON.stringify({ ids }) });
      setStore((prev) => ({
        ...prev,
        aboutItems: newOrder
      }));
    } catch (err) {
      throw err;
    }
  };

  const addHeroCard = async (card) => {
    const nextCard = {
      title: card.title,
      description: card.description,
      icon: card.icon || 'ShieldCheck',
      status: card.status || 'active',
      priority: Number(card.priority) || 0
    };
    try {
      const res = await apiCall('/api/admin/hero-cards', { method: 'POST', body: JSON.stringify(nextCard) });
      nextCard.id = res.id;
      setStore((prev) => ({
        ...prev,
        heroCards: [nextCard, ...prev.heroCards]
      }));
    } catch (err) {
      throw err;
    }
  };

  const updateHeroCard = async (cardId, payload) => {
    const updatedCard = {
      ...payload,
      priority: Number(payload.priority)
    };
    try {
      await apiCall(`/api/admin/hero-cards/${cardId}`, { method: 'PUT', body: JSON.stringify(updatedCard) });
      setStore((prev) => ({
        ...prev,
        heroCards: prev.heroCards.map((card) =>
          card.id === cardId ? { ...card, ...updatedCard } : card
        )
      }));
    } catch (err) {
      throw err;
    }
  };

  const deleteHeroCard = async (cardId) => {
    try {
      await apiCall(`/api/admin/hero-cards/${cardId}`, { method: 'DELETE' });
      setStore((prev) => ({
        ...prev,
        heroCards: prev.heroCards.filter((card) => card.id !== cardId)
      }));
    } catch (err) {
      throw err;
    }
  };

  const reorderHeroCards = async (newOrder) => {
    try {
      const ids = newOrder.map((h) => h.id);
      await apiCall('/api/admin/hero-cards/reorder', { method: 'PUT', body: JSON.stringify({ ids }) });
      setStore((prev) => ({
        ...prev,
        heroCards: newOrder
      }));
    } catch (err) {
      throw err;
    }
  };

  const duplicateHeroCard = async (cardId) => {
    const card = store.heroCards.find((item) => item.id === cardId);
    if (!card) return;
    const copy = {
      ...card,
      title: `${card.title} (Copy)`
    };
    await addHeroCard(copy);
  };

  const actions = {
    updatePersonal,
    updateSEO,
    updateContact,
    updateAppearance,
    setNavbar,
    addNavbarItem,
    updateNavbarItem,
    deleteNavbarItem,
    reorderNavbarItems,
    addProject,
    updateProject,
    deleteProject,
    duplicateProject,
    addSkill,
    updateSkill,
    deleteSkill,
    reorderSkills,
    addCertification,
    updateCertification,
    deleteCertification,
    reorderCertifications,
    addDocumentationTemplate,
    updateDocumentationTemplate,
    deleteDocumentationTemplate,
    addModule,
    updateModule,
    deleteModule,
    reorderModules,
    addAboutItem,
    updateAboutItem,
    deleteAboutItem,
    reorderAboutItems,
    addHeroCard,
    updateHeroCard,
    deleteHeroCard,
    reorderHeroCards,
    duplicateHeroCard,
    reload: loadData
  };

  return (
    <PortfolioContext.Provider value={{ store, loading, dbError, actions }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
