import React, { createContext, useContext, useEffect, useState } from 'react';
import { storageService } from '../services/storage/storage.service.js';
import { localStorageService, getFallbackState } from '../services/storage/localStorage.service.js';

const PortfolioContext = createContext();

const createId = (prefix = 'item') => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const splitCsv = (value) =>
  typeof value === 'string'
    ? value.split(',').map((item) => item.trim()).filter(Boolean)
    : Array.isArray(value)
      ? value
      : [];

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
    appearance: getFallbackState().settings.appearance,
    navbar: {
      items: getFallbackState().settings.navbar.items,
      type: 'horizontal',
      layout: 'wrap',
      behavior: 'grid'
    },
    modules: getFallbackState().settings.modules,
    contact: {}
  }
});

export const PortfolioProvider = ({ children }) => {
  const [store, setStore] = useState(getInitialState);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setDbError(null);
    try {
      const data = await storageService.getPortfolio();
      if (data) {
        storageService.saveLocalPortfolio(data);
        setStore(data);
      } else {
        throw new Error('No data returned from storage');
      }
    } catch (err) {
      console.warn('Storage load failed. Using localStorage fallback:', err.message);
      setDbError('Server-500');
      const localData = localStorageService.getPortfolio();
      setStore(localData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Persist every store change to localStorage
  useEffect(() => {
    if (!loading && store && store.personal && Object.keys(store.personal).length > 0) {
      storageService.saveLocalPortfolio(store);
    }
  }, [store, loading]);

  // ─── PERSONAL ──────────────────────────────────────────────────────────────
  const updatePersonal = async (payload) => {
    try { await storageService.updatePersonal(payload); } catch (err) {
      console.warn('updatePersonal API failed, persisting locally:', err.message);
    }
    setStore((prev) => ({ ...prev, personal: { ...prev.personal, ...payload } }));
  };

  // ─── SEO ───────────────────────────────────────────────────────────────────
  const updateSEO = async (payload) => {
    try { await storageService.updateSEO(payload); } catch (err) {
      console.warn('updateSEO API failed, persisting locally:', err.message);
    }
    setStore((prev) => ({
      ...prev,
      settings: { ...prev.settings, seo: { ...prev.settings.seo, ...payload } }
    }));
  };

  // ─── CONTACT SETTINGS ──────────────────────────────────────────────────────
  const updateContact = async (payload) => {
    try { await storageService.updateContact(payload); } catch (err) {
      console.warn('updateContact API failed, persisting locally:', err.message);
    }
    setStore((prev) => ({
      ...prev,
      settings: { ...prev.settings, contact: { ...prev.settings.contact, ...payload } }
    }));
  };

  // ─── APPEARANCE ────────────────────────────────────────────────────────────
  const updateAppearance = async (payload) => {
    try { await storageService.updateAppearance(payload); } catch (err) {
      console.warn('updateAppearance API failed, persisting locally:', err.message);
    }
    setStore((prev) => ({
      ...prev,
      settings: { ...prev.settings, appearance: { ...prev.settings.appearance, ...payload } }
    }));
  };

  // ─── NAVBAR ────────────────────────────────────────────────────────────────
  const saveNavbarState = async (items, navbarConfig = {}) => {
    const payload = {
      items,
      type: navbarConfig.type || store.settings.navbar.type,
      layout: navbarConfig.layout || store.settings.navbar.layout,
      behavior: navbarConfig.behavior || store.settings.navbar.behavior
    };
    try { await storageService.updateNavbar(payload); } catch (err) {
      console.warn('updateNavbar API failed, persisting locally:', err.message);
    }
    setStore((prev) => ({
      ...prev,
      settings: { ...prev.settings, navbar: { ...prev.settings.navbar, ...payload } }
    }));
  };

  const setNavbar = async (payload) => {
    await saveNavbarState(store.settings.navbar.items, payload);
  };

  const addNavbarItem = async (item) => {
    const newItem = { id: createId('nav'), active: true, ...item };
    await saveNavbarState([...store.settings.navbar.items, newItem]);
  };

  const updateNavbarItem = async (itemId, payload) => {
    const nextItems = store.settings.navbar.items.map((item) =>
      item.id === itemId ? { ...item, ...payload } : item
    );
    await saveNavbarState(nextItems);
  };

  const deleteNavbarItem = async (itemId) => {
    await saveNavbarState(store.settings.navbar.items.filter((item) => item.id !== itemId));
  };

  const reorderNavbarItems = async (items) => {
    await saveNavbarState(items);
  };

  // ─── PROJECTS ──────────────────────────────────────────────────────────────
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
      enableMetrics: project.enableMetrics !== false
    };
    try {
      const res = await storageService.addProject(nextProject);
      if (res?.id) nextProject.id = res.id;
    } catch (err) {
      console.warn('addProject API failed, saving locally:', err.message);
      nextProject.id = project.id || createId('project');
    }
    if (!nextProject.id) nextProject.id = project.id || createId('project');
    setStore((prev) => ({ ...prev, projects: [nextProject, ...prev.projects] }));
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
    try { await storageService.updateProject(projectId, updatedProject); } catch (err) {
      console.warn('updateProject API failed, saving locally:', err.message);
    }
    setStore((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => p.id === projectId ? { ...p, ...updatedProject } : p)
    }));
  };

  const deleteProject = async (projectId) => {
    try { await storageService.deleteProject(projectId); } catch (err) {
      console.warn('deleteProject API failed, deleting locally:', err.message);
    }
    setStore((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== projectId) }));
  };

  const duplicateProject = async (projectId) => {
    const project = store.projects.find((item) => item.id === projectId);
    if (!project) return;
    await addProject({ ...project, title: `${project.title} (Copy)` });
  };

  // ─── SKILLS ────────────────────────────────────────────────────────────────
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
      const res = await storageService.addSkill(nextSkill);
      if (res?.id) nextSkill.id = res.id;
    } catch (err) {
      console.warn('addSkill API failed, saving locally:', err.message);
      nextSkill.id = skill.id || createId('skill');
    }
    if (!nextSkill.id) nextSkill.id = skill.id || createId('skill');
    setStore((prev) => ({ ...prev, skills: [...prev.skills, nextSkill] }));
  };

  const updateSkill = async (skillId, payload) => {
    const updatedSkill = {
      ...payload,
      level: Number(payload.level),
      tools: splitCsv(payload.tools),
      relation: splitCsv(payload.relation)
    };
    try { await storageService.updateSkill(skillId, updatedSkill); } catch (err) {
      console.warn('updateSkill API failed, saving locally:', err.message);
    }
    setStore((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => s.id === skillId ? { ...s, ...updatedSkill } : s)
    }));
  };

  const deleteSkill = async (skillId) => {
    try { await storageService.deleteSkill(skillId); } catch (err) {
      console.warn('deleteSkill API failed, deleting locally:', err.message);
    }
    setStore((prev) => ({ ...prev, skills: prev.skills.filter((s) => s.id !== skillId) }));
  };

  const reorderSkills = async (newOrder) => {
    try {
      await storageService.reorderSkills(newOrder.map((s) => s.id));
    } catch (err) {
      console.warn('reorderSkills API failed, reordering locally:', err.message);
    }
    setStore((prev) => ({ ...prev, skills: newOrder }));
  };

  // ─── CERTIFICATIONS ────────────────────────────────────────────────────────
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
      const res = await storageService.addCertification(nextCert);
      if (res?.id) nextCert.id = res.id;
    } catch (err) {
      console.warn('addCertification API failed, saving locally:', err.message);
      nextCert.id = cert.id || createId('cert');
    }
    if (!nextCert.id) nextCert.id = cert.id || createId('cert');
    setStore((prev) => ({ ...prev, certifications: [...prev.certifications, nextCert] }));
  };

  const updateCertification = async (certId, payload) => {
    const updatedCert = {
      ...payload,
      tools: splitCsv(payload.tools),
      integrations: splitCsv(payload.integrations)
    };
    try { await storageService.updateCertification(certId, updatedCert); } catch (err) {
      console.warn('updateCertification API failed, saving locally:', err.message);
    }
    setStore((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) => c.id === certId ? { ...c, ...updatedCert } : c)
    }));
  };

  const deleteCertification = async (certId) => {
    try { await storageService.deleteCertification(certId); } catch (err) {
      console.warn('deleteCertification API failed, deleting locally:', err.message);
    }
    setStore((prev) => ({ ...prev, certifications: prev.certifications.filter((c) => c.id !== certId) }));
  };

  const reorderCertifications = async (newOrder) => {
    try {
      await storageService.reorderCertifications(newOrder.map((c) => c.id));
    } catch (err) {
      console.warn('reorderCertifications API failed, reordering locally:', err.message);
    }
    setStore((prev) => ({ ...prev, certifications: newOrder }));
  };

  // ─── DOCUMENTATION ─────────────────────────────────────────────────────────
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
      const res = await storageService.addDocumentation(nextTpl);
      if (res?.id) nextTpl.id = res.id;
    } catch (err) {
      console.warn('addDocumentation API failed, saving locally:', err.message);
      nextTpl.id = template.id || createId('tpl');
    }
    if (!nextTpl.id) nextTpl.id = template.id || createId('tpl');
    setStore((prev) => ({
      ...prev,
      documentation: { ...prev.documentation, templates: [nextTpl, ...prev.documentation.templates] }
    }));
  };

  const updateDocumentationTemplate = async (templateId, payload) => {
    const updatedTpl = {
      ...payload,
      questions: splitCsv(payload.questions),
      parameters: splitCsv(payload.parameters),
      checklist: splitCsv(payload.checklist),
      strategies: splitCsv(payload.strategies)
    };
    try { await storageService.updateDocumentation(templateId, updatedTpl); } catch (err) {
      console.warn('updateDocumentation API failed, saving locally:', err.message);
    }
    setStore((prev) => ({
      ...prev,
      documentation: {
        ...prev.documentation,
        templates: prev.documentation.templates.map((t) =>
          t.id === templateId ? { ...t, ...updatedTpl } : t
        )
      }
    }));
  };

  const deleteDocumentationTemplate = async (templateId) => {
    try { await storageService.deleteDocumentation(templateId); } catch (err) {
      console.warn('deleteDocumentation API failed, deleting locally:', err.message);
    }
    setStore((prev) => ({
      ...prev,
      documentation: {
        ...prev.documentation,
        templates: prev.documentation.templates.filter((t) => t.id !== templateId)
      }
    }));
  };

  // ─── MODULES ───────────────────────────────────────────────────────────────
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
    try { await storageService.addModule(nextModule); } catch (err) {
      console.warn('addModule API failed, saving locally:', err.message);
    }
    const nextNavbarItems = [...store.settings.navbar.items, nextNavbarItem];
    await saveNavbarState(nextNavbarItems);
    setStore((prev) => ({
      ...prev,
      settings: { ...prev.settings, modules: [nextModule, ...prev.settings.modules] }
    }));
  };

  const updateModule = async (moduleId, payload) => {
    const nextModule = {
      ...payload,
      configurado: payload.configurado === true || payload.configurado === 1
    };
    try { await storageService.updateModule(moduleId, nextModule); } catch (err) {
      console.warn('updateModule API failed, saving locally:', err.message);
    }
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
        modules: prev.settings.modules.map((m) => m.id === moduleId ? { ...m, ...nextModule } : m)
      }
    }));
  };

  const deleteModule = async (moduleId) => {
    try { await storageService.deleteModule(moduleId); } catch (err) {
      console.warn('deleteModule API failed, deleting locally:', err.message);
    }
    const nextNavbarItems = store.settings.navbar.items.filter(
      (item) => item.id !== `nav-${moduleId}` && item.path !== `/modules/${moduleId}`
    );
    await saveNavbarState(nextNavbarItems);
    setStore((prev) => ({
      ...prev,
      settings: { ...prev.settings, modules: prev.settings.modules.filter((m) => m.id !== moduleId) }
    }));
  };

  const reorderModules = async (newOrder) => {
    try {
      await storageService.reorderModules(newOrder.map((m) => m.id));
    } catch (err) {
      console.warn('reorderModules API failed, reordering locally:', err.message);
    }
    setStore((prev) => ({ ...prev, settings: { ...prev.settings, modules: newOrder } }));
  };

  // ─── ABOUT ITEMS ───────────────────────────────────────────────────────────
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
      const res = await storageService.addAboutItem(nextItem);
      if (res?.id) nextItem.id = res.id;
    } catch (err) {
      console.warn('addAboutItem API failed, saving locally:', err.message);
      nextItem.id = item.id || createId('about');
    }
    if (!nextItem.id) nextItem.id = item.id || createId('about');
    setStore((prev) => ({ ...prev, aboutItems: [nextItem, ...prev.aboutItems] }));
  };

  const updateAboutItem = async (itemId, payload) => {
    const updatedItem = { ...payload, priority: Number(payload.priority) };
    try { await storageService.updateAboutItem(itemId, updatedItem); } catch (err) {
      console.warn('updateAboutItem API failed, saving locally:', err.message);
    }
    setStore((prev) => ({
      ...prev,
      aboutItems: prev.aboutItems.map((a) => a.id === itemId ? { ...a, ...updatedItem } : a)
    }));
  };

  const deleteAboutItem = async (itemId) => {
    try { await storageService.deleteAboutItem(itemId); } catch (err) {
      console.warn('deleteAboutItem API failed, deleting locally:', err.message);
    }
    setStore((prev) => ({ ...prev, aboutItems: prev.aboutItems.filter((a) => a.id !== itemId) }));
  };

  const reorderAboutItems = async (newOrder) => {
    try {
      await storageService.reorderAboutItems(newOrder.map((a) => a.id));
    } catch (err) {
      console.warn('reorderAboutItems API failed, reordering locally:', err.message);
    }
    setStore((prev) => ({ ...prev, aboutItems: newOrder }));
  };

  // ─── HERO CARDS ────────────────────────────────────────────────────────────
  const addHeroCard = async (card) => {
    const nextCard = {
      title: card.title,
      description: card.description,
      icon: card.icon || 'ShieldCheck',
      status: card.status || 'active',
      priority: Number(card.priority) || 0
    };
    try {
      const res = await storageService.addHeroCard(nextCard);
      if (res?.id) nextCard.id = res.id;
    } catch (err) {
      console.warn('addHeroCard API failed, saving locally:', err.message);
      nextCard.id = card.id || createId('hero');
    }
    if (!nextCard.id) nextCard.id = card.id || createId('hero');
    setStore((prev) => ({ ...prev, heroCards: [nextCard, ...prev.heroCards] }));
  };

  const updateHeroCard = async (cardId, payload) => {
    const updatedCard = { ...payload, priority: Number(payload.priority) };
    try { await storageService.updateHeroCard(cardId, updatedCard); } catch (err) {
      console.warn('updateHeroCard API failed, saving locally:', err.message);
    }
    setStore((prev) => ({
      ...prev,
      heroCards: prev.heroCards.map((c) => c.id === cardId ? { ...c, ...updatedCard } : c)
    }));
  };

  const deleteHeroCard = async (cardId) => {
    try { await storageService.deleteHeroCard(cardId); } catch (err) {
      console.warn('deleteHeroCard API failed, deleting locally:', err.message);
    }
    setStore((prev) => ({ ...prev, heroCards: prev.heroCards.filter((c) => c.id !== cardId) }));
  };

  const reorderHeroCards = async (newOrder) => {
    try {
      await storageService.reorderHeroCards(newOrder.map((h) => h.id));
    } catch (err) {
      console.warn('reorderHeroCards API failed, reordering locally:', err.message);
    }
    setStore((prev) => ({ ...prev, heroCards: newOrder }));
  };

  const duplicateHeroCard = async (cardId) => {
    const card = store.heroCards.find((item) => item.id === cardId);
    if (!card) return;
    await addHeroCard({ ...card, title: `${card.title} (Copy)` });
  };

  // ─── CONTACT FORM SUBMISSION ───────────────────────────────────────────────
  // Tries backend email API first; if offline, saves locally and returns success.
  const submitContactForm = async (data) => {
    try {
      const result = await storageService.submitContact(data);
      return result;
    } catch (err) {
      console.warn('submitContactForm failed via service, saving locally:', err.message);
      return localStorageService.submitContact(data);
    }
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
    submitContactForm,
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
