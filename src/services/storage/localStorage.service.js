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

export const localStorageService = {
  getPortfolio: () => {
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
  },

  savePortfolio: (data) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  },

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
  }
};
