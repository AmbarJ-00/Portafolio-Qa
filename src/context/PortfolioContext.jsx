import React, { createContext, useContext, useEffect, useState } from 'react';
import { portfolioConfig as defaultPortfolioConfig } from '../data/portfolioData.js';

const PortfolioContext = createContext();
const STORAGE_KEY = 'qa-portfolio-admin-store';

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
  home: {
    gradient: 'from-brand-navy-800 via-brand-electric-500 to-brand-lilac-500',
    particles: true,
    heroEffect: 'glow'
  },
  projects: {
    cardStyle: 'glass',
    shadowStrength: 'medium',
    highlightColor: 'brand-electric-500'
  },
  skills: {
    modalStyle: 'card',
    progressStyle: 'gradient',
    cardAnimation: 'float'
  },
  certifications: {
    cardStyle: 'image-frame',
    borderStyle: 'rounded',
    animation: 'fade'
  },
  colors: {
    light: {
      primary: '#0f172a',
      secondary: '#7c3aed',
      accent: '#38bdf8',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444'
    },
    dark: {
      background: '#020617',
      surface: '#111827',
      text: '#f8fafc',
      muted: '#94a3b8',
      accent: '#a78bfa'
    },
    hover: '#38bdf8',
    metrics: '#f97316',
    icons: '#7c3aed',
    decorative: '#38bdf8'
  },
  navbar: {
    type: 'horizontal',
    layout: 'wrap',
    behavior: 'grid'
  }
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

const getInitialState = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (!parsed.aboutItems) parsed.aboutItems = [];
      if (!parsed.heroCards) {
        parsed.heroCards = [
          { id: 'hero-1', title: 'Liderazgo de Calidad', description: 'Garantizando la excelencia en cada sprint', icon: 'ShieldCheck', status: 'active', priority: 1 },
          { id: 'hero-2', title: 'Automatización Eficiente', description: 'Reduciendo tiempos de ejecución con scripts estables', icon: 'Terminal', status: 'active', priority: 2 }
        ];
      }
      return parsed;
    } catch (error) {
      console.warn('Failed to parse local portfolio store', error);
    }
  }

  return {
    ...defaultPortfolioConfig,
    aboutItems: [],
    heroCards: [
      { id: 'hero-1', title: 'Liderazgo de Calidad', description: 'Garantizando la excelencia en cada sprint', icon: 'ShieldCheck', status: 'active', priority: 1 },
      { id: 'hero-2', title: 'Automatización Eficiente', description: 'Reduciendo tiempos de ejecución con scripts estables', icon: 'Terminal', status: 'active', priority: 2 }
    ],
    settings: {
      seo: {
        title: 'Sofia Rodriguez | QA Lead',
        description: 'QA lead portfolio and quality management system for testing services.',
        openGraph: {
          type: 'website',
          image: 'https://qa-portfolio.vercel.app/og-image.png'
        },
        twitter: {
          card: 'summary_large_image',
          creator: '@ambarqa'
        }
      },
      appearance: defaultAppearance,
      navbar: {
        items: defaultNavbarItems,
        type: 'horizontal',
        layout: 'wrap',
        behavior: 'grid'
      },
      modules: defaultModules,
      contact: {
        email: defaultPortfolioConfig.personal.email,
        linkedin: defaultPortfolioConfig.personal.linkedin,
        github: defaultPortfolioConfig.personal.github,
        phone: '',
        alternativeContact: '',
        country: defaultPortfolioConfig.personal.location
      }
    }
  };
};

const createId = (prefix = 'item') => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const splitCsv = (value) =>
  typeof value === 'string'
    ? value.split(',').map((item) => item.trim()).filter(Boolean)
    : Array.isArray(value)
    ? value
    : [];

export const PortfolioProvider = ({ children }) => {
  const [store, setStore] = useState(getInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  const updatePersonal = (payload) => {
    setStore((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        ...payload
      }
    }));
  };

  const updateSEO = (payload) => {
    setStore((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        seo: {
          ...prev.settings.seo,
          ...payload
        }
      }
    }));
  };

  const updateContact = (payload) => {
    setStore((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        contact: {
          ...prev.settings.contact,
          ...payload
        }
      }
    }));
  };

  const updateAppearance = (payload) => {
    setStore((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        appearance: {
          ...prev.settings.appearance,
          ...payload
        }
      }
    }));
  };

  const setNavbar = (payload) => {
    setStore((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        navbar: {
          ...prev.settings.navbar,
          ...payload
        }
      }
    }));
  };

  const addNavbarItem = (item) => {
    setStore((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        navbar: {
          ...prev.settings.navbar,
          items: [...prev.settings.navbar.items, { id: createId('nav'), active: true, ...item }]
        }
      }
    }));
  };

  const updateNavbarItem = (itemId, payload) => {
    setStore((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        navbar: {
          ...prev.settings.navbar,
          items: prev.settings.navbar.items.map((item) =>
            item.id === itemId ? { ...item, ...payload } : item
          )
        }
      }
    }));
  };

  const deleteNavbarItem = (itemId) => {
    setStore((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        navbar: {
          ...prev.settings.navbar,
          items: prev.settings.navbar.items.filter((item) => item.id !== itemId)
        }
      }
    }));
  };

  const reorderNavbarItems = (items) => {
    setStore((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        navbar: {
          ...prev.settings.navbar,
          items
        }
      }
    }));
  };

  const addProject = (project) => {
    const nextProject = {
      id: createId('project'),
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

    setStore((prev) => ({
      ...prev,
      projects: [nextProject, ...prev.projects]
    }));
  };

  const updateProject = (projectId, payload) => {
    setStore((prev) => ({
      ...prev,
      projects: prev.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              ...payload,
              integrations: splitCsv(payload.integrations || project.integrations),
              status: payload.status ?? project.status ?? 'active',
              demoVisibility: payload.demoVisibility ?? project.demoVisibility ?? 'show',
              metrics: {
                ...project.metrics,
                coverage: Number(payload.coverage ?? project.metrics.coverage),
                improvements: Number(payload.improvements ?? project.metrics.improvements),
                riskCoverage: Number(payload.riskCoverage ?? project.metrics.riskCoverage),
                findingsCritical: Number(payload.findingsCritical ?? project.metrics.findingsCritical),
                bugsResolved: Number(payload.bugsResolved ?? project.metrics.bugsResolved),
                ambiguitiesFound: Number(payload.ambiguitiesFound ?? project.metrics.ambiguitiesFound),
                qualityImpact: payload.qualityImpact ?? project.metrics.qualityImpact
              }
            }
          : project
      )
    }));
  };

  const deleteProject = (projectId) => {
    setStore((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => project.id !== projectId)
    }));
  };

  const duplicateProject = (projectId) => {
    setStore((prev) => {
      const project = prev.projects.find((item) => item.id === projectId);
      if (!project) return prev;
      const copy = {
        ...project,
        id: createId('project'),
        title: `${project.title} (Copy)`,
        demo: project.demo,
        repository: project.repository
      };
      return {
        ...prev,
        projects: [copy, ...prev.projects]
      };
    });
  };

  const addSkill = (skill) => {
    setStore((prev) => ({
      ...prev,
      skills: [
        {
          id: createId('skill'),
          name: skill.name,
          icon: skill.icon,
          level: Number(skill.level) || 0,
          category: skill.category,
          tools: splitCsv(skill.tools),
          relation: splitCsv(skill.relation),
          description: skill.description,
          color: skill.color || '#7c3aed'
        },
        ...prev.skills
      ]
    }));
  };

  const updateSkill = (skillId, payload) => {
    setStore((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) =>
        skill.id === skillId
          ? {
              ...skill,
              ...payload,
              level: Number(payload.level ?? skill.level),
              tools: splitCsv(payload.tools || skill.tools),
              relation: splitCsv(payload.relation || skill.relation)
            }
          : skill
      )
    }));
  };

  const deleteSkill = (skillId) => {
    setStore((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.id !== skillId)
    }));
  };

  const reorderSkills = (newOrder) => {
    setStore((prev) => ({
      ...prev,
      skills: newOrder
    }));
  };

  const addCertification = (cert) => {
    setStore((prev) => ({
      ...prev,
      certifications: [
        {
          id: createId('cert'),
          title: cert.title,
          authority: cert.authority,
          image: cert.image,
          date: cert.date,
          tools: splitCsv(cert.tools),
          integrations: splitCsv(cert.integrations),
          summary: cert.summary,
          url: cert.url,
          status: cert.status || 'Active'
        },
        ...prev.certifications
      ]
    }));
  };

  const updateCertification = (certId, payload) => {
    setStore((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert) =>
        cert.id === certId
          ? {
              ...cert,
              ...payload,
              tools: splitCsv(payload.tools || cert.tools),
              integrations: splitCsv(payload.integrations || cert.integrations)
            }
          : cert
      )
    }));
  };

  const deleteCertification = (certId) => {
    setStore((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert.id !== certId)
    }));
  };

  const reorderCertifications = (newOrder) => {
    setStore((prev) => ({
      ...prev,
      certifications: newOrder
    }));
  };

  const addDocumentationTemplate = (template) => {
    setStore((prev) => ({
      ...prev,
      documentation: {
        ...prev.documentation,
        templates: [
          {
            id: createId('doc'),
            title: template.title,
            category: template.category,
            type: template.type,
            template: template.template,
            questions: splitCsv(template.questions),
            parameters: splitCsv(template.parameters),
            methodology: template.methodology,
            checklist: splitCsv(template.checklist),
            strategies: splitCsv(template.strategies)
          },
          ...prev.documentation.templates
        ]
      }
    }));
  };

  const updateDocumentationTemplate = (templateId, payload) => {
    setStore((prev) => ({
      ...prev,
      documentation: {
        ...prev.documentation,
        templates: prev.documentation.templates.map((template) =>
          template.id === templateId
            ? {
                ...template,
                ...payload,
                questions: splitCsv(payload.questions || template.questions),
                parameters: splitCsv(payload.parameters || template.parameters),
                checklist: splitCsv(payload.checklist || template.checklist),
                strategies: splitCsv(payload.strategies || template.strategies)
              }
            : template
        )
      }
    }));
  };

  const deleteDocumentationTemplate = (templateId) => {
    setStore((prev) => ({
      ...prev,
      documentation: {
        ...prev.documentation,
        templates: prev.documentation.templates.filter((template) => template.id !== templateId)
      }
    }));
  };

  const addModule = (module) => {
    setStore((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        modules: [
          {
            id: createId('module'),
            name: module.name,
            icon: module.icon,
            description: module.description,
            cards: splitCsv(module.cards),
            colors: {
              accent: module.accentColor || '#38bdf8',
              surface: module.surfaceColor || '#0f172a'
            },
            animation: module.animation || 'fade-in'
          },
          ...prev.settings.modules
        ]
      }
    }));
  };

  const updateModule = (moduleId, payload) => {
    setStore((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        modules: prev.settings.modules.map((module) =>
          module.id === moduleId
            ? {
                ...module,
                ...payload,
                cards: splitCsv(payload.cards || module.cards),
                colors: {
                  accent: payload.accentColor || module.colors.accent,
                  surface: payload.surfaceColor || module.colors.surface
                }
              }
            : module
        )
      }
    }));
  };

  const deleteModule = (moduleId) => {
    setStore((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        modules: prev.settings.modules.filter((module) => module.id !== moduleId)
      }
    }));
  };

  const reorderModules = (newOrder) => {
    setStore((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        modules: newOrder
      }
    }));
  };

  const addAboutItem = (item) => {
    setStore((prev) => ({
      ...prev,
      aboutItems: [
        {
          id: createId('about'),
          type: item.type || 'pilar',
          title: item.title,
          description: item.description,
          position: item.position || 'center',
          priority: Number(item.priority) || 0,
          status: item.status || 'active',
          behavior: item.behavior || 'card'
        },
        ...prev.aboutItems
      ]
    }));
  };

  const updateAboutItem = (itemId, payload) => {
    setStore((prev) => ({
      ...prev,
      aboutItems: prev.aboutItems.map((item) =>
        item.id === itemId ? { ...item, ...payload, priority: Number(payload.priority ?? item.priority) } : item
      )
    }));
  };

  const deleteAboutItem = (itemId) => {
    setStore((prev) => ({
      ...prev,
      aboutItems: prev.aboutItems.filter((item) => item.id !== itemId)
    }));
  };

  const reorderAboutItems = (newOrder) => {
    setStore((prev) => ({
      ...prev,
      aboutItems: newOrder
    }));
  };

  const addHeroCard = (card) => {
    setStore((prev) => ({
      ...prev,
      heroCards: [
        {
          id: createId('hero-card'),
          title: card.title,
          description: card.description,
          icon: card.icon || 'ShieldCheck',
          status: card.status || 'active',
          priority: Number(card.priority) || 0
        },
        ...prev.heroCards
      ]
    }));
  };

  const updateHeroCard = (cardId, payload) => {
    setStore((prev) => ({
      ...prev,
      heroCards: prev.heroCards.map((card) =>
        card.id === cardId ? { ...card, ...payload, priority: Number(payload.priority ?? card.priority) } : card
      )
    }));
  };

  const deleteHeroCard = (cardId) => {
    setStore((prev) => ({
      ...prev,
      heroCards: prev.heroCards.filter((card) => card.id !== cardId)
    }));
  };

  const reorderHeroCards = (newOrder) => {
    setStore((prev) => ({
      ...prev,
      heroCards: newOrder
    }));
  };

  const duplicateHeroCard = (cardId) => {
    setStore((prev) => {
      const card = prev.heroCards.find((item) => item.id === cardId);
      if (!card) return prev;
      const copy = {
        ...card,
        id: createId('hero-card'),
        title: `${card.title} (Copy)`,
      };
      return {
        ...prev,
        heroCards: [copy, ...prev.heroCards]
      };
    });
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
    duplicateHeroCard
  };

  return (
    <PortfolioContext.Provider value={{ store, actions }}>
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
