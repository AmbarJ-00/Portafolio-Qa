// Database Service — Encapsulates API-based mutations and queries
// This service communicates with the backend Express server.
// It is DISABLED by default via storage.config.js.

const getToken = () => sessionStorage.getItem('qa-admin-token');

const apiFetch = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const error = new Error(errData.error || `HTTP error ${response.status}`);
    error.code = errData.code || 'Server-500';
    error.errorType = errData.errorType || 'HTTP_ERROR';
    throw error;
  }
  return response.json();
};

export const databaseService = {
  getPortfolio: () => apiFetch('/api/portfolio'),

  // Contact submission via backend (uses Nodemailer)
  submitContact: async (data) => {
    const result = await apiFetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return { success: true, ...result };
  },

  // Personal Info
  updatePersonal: (payload) =>
    apiFetch('/api/admin/personal', { method: 'PUT', body: JSON.stringify(payload) }),

  updateSEO: (payload) =>
    apiFetch('/api/admin/settings/seo', { method: 'PUT', body: JSON.stringify(payload) }),

  updateContact: (payload) =>
    apiFetch('/api/admin/settings/contact', { method: 'PUT', body: JSON.stringify(payload) }),

  updateAppearance: (payload) =>
    apiFetch('/api/admin/settings/appearance', { method: 'PUT', body: JSON.stringify(payload) }),

  updateNavbar: (payload) =>
    apiFetch('/api/admin/settings/navbar', { method: 'PUT', body: JSON.stringify(payload) }),

  // Skills
  addSkill: (payload) =>
    apiFetch('/api/admin/skills', { method: 'POST', body: JSON.stringify(payload) }),
  updateSkill: (id, payload) =>
    apiFetch(`/api/admin/skills/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteSkill: (id) =>
    apiFetch(`/api/admin/skills/${id}`, { method: 'DELETE' }),
  reorderSkills: (ids) =>
    apiFetch('/api/admin/skills/reorder', { method: 'PUT', body: JSON.stringify({ ids }) }),

  // Projects
  addProject: (payload) =>
    apiFetch('/api/admin/projects', { method: 'POST', body: JSON.stringify(payload) }),
  updateProject: (id, payload) =>
    apiFetch(`/api/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteProject: (id) =>
    apiFetch(`/api/admin/projects/${id}`, { method: 'DELETE' }),

  // Certifications
  addCertification: (payload) =>
    apiFetch('/api/admin/certifications', { method: 'POST', body: JSON.stringify(payload) }),
  updateCertification: (id, payload) =>
    apiFetch(`/api/admin/certifications/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteCertification: (id) =>
    apiFetch(`/api/admin/certifications/${id}`, { method: 'DELETE' }),
  reorderCertifications: (ids) =>
    apiFetch('/api/admin/certifications/reorder', { method: 'PUT', body: JSON.stringify({ ids }) }),

  // Documentation
  addDocumentation: (payload) =>
    apiFetch('/api/admin/documentation', { method: 'POST', body: JSON.stringify(payload) }),
  updateDocumentation: (id, payload) =>
    apiFetch(`/api/admin/documentation/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteDocumentation: (id) =>
    apiFetch(`/api/admin/documentation/${id}`, { method: 'DELETE' }),

  // Modules
  addModule: (payload) =>
    apiFetch('/api/admin/modules', { method: 'POST', body: JSON.stringify(payload) }),
  updateModule: (id, payload) =>
    apiFetch(`/api/admin/modules/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteModule: (id) =>
    apiFetch(`/api/admin/modules/${id}`, { method: 'DELETE' }),
  reorderModules: (ids) =>
    apiFetch('/api/admin/modules/reorder', { method: 'PUT', body: JSON.stringify({ ids }) }),

  // About Items
  addAboutItem: (payload) =>
    apiFetch('/api/admin/about-items', { method: 'POST', body: JSON.stringify(payload) }),
  updateAboutItem: (id, payload) =>
    apiFetch(`/api/admin/about-items/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteAboutItem: (id) =>
    apiFetch(`/api/admin/about-items/${id}`, { method: 'DELETE' }),
  reorderAboutItems: (ids) =>
    apiFetch('/api/admin/about-items/reorder', { method: 'PUT', body: JSON.stringify({ ids }) }),

  // Hero Cards
  addHeroCard: (payload) =>
    apiFetch('/api/admin/hero-cards', { method: 'POST', body: JSON.stringify(payload) }),
  updateHeroCard: (id, payload) =>
    apiFetch(`/api/admin/hero-cards/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteHeroCard: (id) =>
    apiFetch(`/api/admin/hero-cards/${id}`, { method: 'DELETE' }),
  reorderHeroCards: (ids) =>
    apiFetch('/api/admin/hero-cards/reorder', { method: 'PUT', body: JSON.stringify({ ids }) }),
};
