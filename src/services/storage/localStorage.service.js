import { portfolioConfig as defaultPortfolioConfig } from '../../data/portfolioData.js';

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
  home: { gradient: 'from-brand-purple-800 via-brand-purple-600 to-brand-gold-500', particles: true, heroEffect: 'glow' },
  projects: { cardStyle: 'glass', shadowStrength: 'medium', highlightColor: 'brand-gold-500' },
  skills: { modalStyle: 'card', progressStyle: 'gradient', cardAnimation: 'float' },
  certifications: { cardStyle: 'image-frame', borderStyle: 'rounded', animation: 'fade' },
  colors: {
    light: { background: '#FAF9F6', card: 'rgba(66, 91, 111, 0.08)', text: '#182A3A', border: '#A08348', accent: '#D68880', button: '#D68880', primary: '#182A3A', secondary: '#425B6F', textSecondary: '#7A7E74' },
    dark: { background: '#231537', card: '#4F3179', text: '#ffffff', muted: '#ADB0BC', border: '#966D33', accent: '#CAA46E', button: '#CAA46E' },
    hover: '#CAA46E', metrics: '#CAA46E', icons: '#CAA46E', decorative: '#966D33'
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

export const getFallbackState = () => ({
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

const LOCAL_STORAGE_KEY = 'qa-portfolio-data';
const CONTACT_MESSAGES_KEY = 'qa-contact-messages';

const createId = (prefix = 'item') => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const reorderByIds = (items, ids) => {
  const lookup = items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});
  const ordered = ids.map((id) => lookup[id]).filter(Boolean);
  return ordered.concat(items.filter((item) => !ids.includes(item.id)));
};

const getStoredPortfolio = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    const fallback = getFallbackState();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse portfolio data from localStorage', e);
    const fallback = getFallbackState();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
};

const saveStoredPortfolio = (data) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
};

const mutatePortfolio = (mutator) => {
  const portfolio = getStoredPortfolio();
  const result = mutator(portfolio);
  saveStoredPortfolio(portfolio);
  return result || { success: true };
};

export const localStorageService = {
  getPortfolio: getStoredPortfolio,

  savePortfolio: saveStoredPortfolio,

  submitContact: (data) => {
    try {
      const messages = JSON.parse(localStorage.getItem(CONTACT_MESSAGES_KEY) || '[]');
      const messageId = `msg-local-${Math.random().toString(36).slice(2, 9)}`;
      messages.push({
        id: messageId,
        ...data,
        created_at: new Date().toISOString()
      });
      localStorage.setItem(CONTACT_MESSAGES_KEY, JSON.stringify(messages));
      return { success: true, messageId, dbSaved: false, localSaved: true };
    } catch (e) {
      console.error('Failed to save contact message to localStorage', e);
      return { success: false, error: e.message };
    }
  },

  updatePersonal: (payload) => mutatePortfolio((portfolio) => {
    portfolio.personal = { ...portfolio.personal, ...payload };
  }),

  updateSEO: (payload) => mutatePortfolio((portfolio) => {
    portfolio.settings.seo = { ...portfolio.settings.seo, ...payload };
  }),

  updateContact: (payload) => mutatePortfolio((portfolio) => {
    portfolio.settings.contact = { ...portfolio.settings.contact, ...payload };
  }),

  updateAppearance: (payload) => mutatePortfolio((portfolio) => {
    portfolio.settings.appearance = { ...portfolio.settings.appearance, ...payload };
  }),

  updateNavbar: (payload) => mutatePortfolio((portfolio) => {
    portfolio.settings.navbar = { ...portfolio.settings.navbar, ...payload };
  }),

  addSkill: (payload) => mutatePortfolio((portfolio) => {
    const id = payload.id || createId('skill');
    portfolio.skills = [...portfolio.skills, { ...payload, id }];
    return { success: true, id };
  }),

  updateSkill: (id, payload) => mutatePortfolio((portfolio) => {
    portfolio.skills = portfolio.skills.map((skill) => skill.id === id ? { ...skill, ...payload } : skill);
  }),

  deleteSkill: (id) => mutatePortfolio((portfolio) => {
    portfolio.skills = portfolio.skills.filter((skill) => skill.id !== id);
  }),

  reorderSkills: (ids) => mutatePortfolio((portfolio) => {
    portfolio.skills = reorderByIds(portfolio.skills, ids);
  }),

  addProject: (payload) => mutatePortfolio((portfolio) => {
    const id = payload.id || createId('project');
    portfolio.projects = [{ ...payload, id }, ...(portfolio.projects || [])];
    return { success: true, id };
  }),

  updateProject: (id, payload) => mutatePortfolio((portfolio) => {
    portfolio.projects = portfolio.projects.map((project) => project.id === id ? { ...project, ...payload } : project);
  }),

  deleteProject: (id) => mutatePortfolio((portfolio) => {
    portfolio.projects = portfolio.projects.filter((project) => project.id !== id);
  }),

  addCertification: (payload) => mutatePortfolio((portfolio) => {
    const id = payload.id || createId('cert');
    portfolio.certifications = [...(portfolio.certifications || []), { ...payload, id }];
    return { success: true, id };
  }),

  updateCertification: (id, payload) => mutatePortfolio((portfolio) => {
    portfolio.certifications = portfolio.certifications.map((cert) => cert.id === id ? { ...cert, ...payload } : cert);
  }),

  deleteCertification: (id) => mutatePortfolio((portfolio) => {
    portfolio.certifications = portfolio.certifications.filter((cert) => cert.id !== id);
  }),

  reorderCertifications: (ids) => mutatePortfolio((portfolio) => {
    portfolio.certifications = reorderByIds(portfolio.certifications, ids);
  }),

  addDocumentation: (payload) => mutatePortfolio((portfolio) => {
    const id = payload.id || createId('doc');
    portfolio.documentation.templates = [...(portfolio.documentation.templates || []), { ...payload, id }];
    return { success: true, id };
  }),

  updateDocumentation: (id, payload) => mutatePortfolio((portfolio) => {
    portfolio.documentation.templates = portfolio.documentation.templates.map((template) =>
      template.id === id ? { ...template, ...payload } : template
    );
  }),

  deleteDocumentation: (id) => mutatePortfolio((portfolio) => {
    portfolio.documentation.templates = portfolio.documentation.templates.filter((template) => template.id !== id);
  }),

  addModule: (payload) => mutatePortfolio((portfolio) => {
    const id = payload.id || createId('module');
    portfolio.settings.modules = [...(portfolio.settings.modules || []), { ...payload, id }];
    return { success: true, id };
  }),

  updateModule: (id, payload) => mutatePortfolio((portfolio) => {
    portfolio.settings.modules = portfolio.settings.modules.map((module) => module.id === id ? { ...module, ...payload } : module);
  }),

  deleteModule: (id) => mutatePortfolio((portfolio) => {
    portfolio.settings.modules = portfolio.settings.modules.filter((module) => module.id !== id);
  }),

  reorderModules: (ids) => mutatePortfolio((portfolio) => {
    portfolio.settings.modules = reorderByIds(portfolio.settings.modules, ids);
  }),

  addAboutItem: (payload) => mutatePortfolio((portfolio) => {
    const id = payload.id || createId('about');
    portfolio.aboutItems = [...(portfolio.aboutItems || []), { ...payload, id }];
    return { success: true, id };
  }),

  updateAboutItem: (id, payload) => mutatePortfolio((portfolio) => {
    portfolio.aboutItems = portfolio.aboutItems.map((item) => item.id === id ? { ...item, ...payload } : item);
  }),

  deleteAboutItem: (id) => mutatePortfolio((portfolio) => {
    portfolio.aboutItems = portfolio.aboutItems.filter((item) => item.id !== id);
  }),

  reorderAboutItems: (ids) => mutatePortfolio((portfolio) => {
    portfolio.aboutItems = reorderByIds(portfolio.aboutItems, ids);
  }),

  addHeroCard: (payload) => mutatePortfolio((portfolio) => {
    const id = payload.id || createId('hero');
    portfolio.heroCards = [...(portfolio.heroCards || []), { ...payload, id }];
    return { success: true, id };
  }),

  updateHeroCard: (id, payload) => mutatePortfolio((portfolio) => {
    portfolio.heroCards = portfolio.heroCards.map((card) => card.id === id ? { ...card, ...payload } : card);
  }),

  deleteHeroCard: (id) => mutatePortfolio((portfolio) => {
    portfolio.heroCards = portfolio.heroCards.filter((card) => card.id !== id);
  }),

  reorderHeroCards: (ids) => mutatePortfolio((portfolio) => {
    portfolio.heroCards = reorderByIds(portfolio.heroCards, ids);
  })
};
