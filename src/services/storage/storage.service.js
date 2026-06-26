// Storage Service — Facade interface
// Routes all operations to the active provider (localStorage or database).
// If database fails, automatically falls back to localStorage.

import { storageConfig } from './storage.config.js';
import { localStorageService } from './localStorage.service.js';
import { databaseService } from './database.service.js';

// Helpers to detect DB/network errors
const isDbOrNetworkError = (err) => {
  const code = String(err?.code || '').toUpperCase();
  const msg = String(err?.message || '').toLowerCase();
  const dbCodes = ['DB-500', 'ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNRESET', 'SERVER-500'];
  const dbKeywords = ['connection', 'database', 'db-', 'mysql', 'refused', 'timeout', 'fetch', 'network', 'failed to fetch'];
  return (
    dbCodes.includes(code) ||
    code.startsWith('ER_') ||
    dbKeywords.some((kw) => msg.includes(kw))
  );
};

// Creates a method that tries the DB provider first, then falls back to localStorage
const withFallback = (dbMethod, localMethod) => async (...args) => {
  if (storageConfig.activeProvider === 'localStorage') {
    return localMethod ? localMethod(...args) : null;
  }
  try {
    return await dbMethod(...args);
  } catch (err) {
    if (isDbOrNetworkError(err)) {
      console.warn('[StorageService] DB unavailable — falling back to localStorage:', err.message);
      return localMethod ? localMethod(...args) : null;
    }
    throw err;
  }
};

export const storageService = {
  // Read the full portfolio state
  getPortfolio: withFallback(
    () => databaseService.getPortfolio(),
    () => localStorageService.getPortfolio()
  ),

  // Submit contact form (try email API, fallback to local save)
  submitContact: withFallback(
    (data) => databaseService.submitContact(data),
    (data) => localStorageService.submitContact(data)
  ),

  // Update personal info
  updatePersonal: withFallback(
    (payload) => databaseService.updatePersonal(payload),
    null
  ),

  updateSEO: withFallback(
    (payload) => databaseService.updateSEO(payload),
    null
  ),

  updateContact: withFallback(
    (payload) => databaseService.updateContact(payload),
    null
  ),

  updateAppearance: withFallback(
    (payload) => databaseService.updateAppearance(payload),
    null
  ),

  updateNavbar: withFallback(
    (payload) => databaseService.updateNavbar(payload),
    null
  ),

  // Skills
  addSkill: withFallback(
    (payload) => databaseService.addSkill(payload),
    null
  ),
  updateSkill: withFallback(
    (id, payload) => databaseService.updateSkill(id, payload),
    null
  ),
  deleteSkill: withFallback(
    (id) => databaseService.deleteSkill(id),
    null
  ),
  reorderSkills: withFallback(
    (ids) => databaseService.reorderSkills(ids),
    null
  ),

  // Projects
  addProject: withFallback(
    (payload) => databaseService.addProject(payload),
    null
  ),
  updateProject: withFallback(
    (id, payload) => databaseService.updateProject(id, payload),
    null
  ),
  deleteProject: withFallback(
    (id) => databaseService.deleteProject(id),
    null
  ),

  // Certifications
  addCertification: withFallback(
    (payload) => databaseService.addCertification(payload),
    null
  ),
  updateCertification: withFallback(
    (id, payload) => databaseService.updateCertification(id, payload),
    null
  ),
  deleteCertification: withFallback(
    (id) => databaseService.deleteCertification(id),
    null
  ),
  reorderCertifications: withFallback(
    (ids) => databaseService.reorderCertifications(ids),
    null
  ),

  // Documentation
  addDocumentation: withFallback(
    (payload) => databaseService.addDocumentation(payload),
    null
  ),
  updateDocumentation: withFallback(
    (id, payload) => databaseService.updateDocumentation(id, payload),
    null
  ),
  deleteDocumentation: withFallback(
    (id) => databaseService.deleteDocumentation(id),
    null
  ),

  // Modules
  addModule: withFallback(
    (payload) => databaseService.addModule(payload),
    null
  ),
  updateModule: withFallback(
    (id, payload) => databaseService.updateModule(id, payload),
    null
  ),
  deleteModule: withFallback(
    (id) => databaseService.deleteModule(id),
    null
  ),
  reorderModules: withFallback(
    (ids) => databaseService.reorderModules(ids),
    null
  ),

  // About Items
  addAboutItem: withFallback(
    (payload) => databaseService.addAboutItem(payload),
    null
  ),
  updateAboutItem: withFallback(
    (id, payload) => databaseService.updateAboutItem(id, payload),
    null
  ),
  deleteAboutItem: withFallback(
    (id) => databaseService.deleteAboutItem(id),
    null
  ),
  reorderAboutItems: withFallback(
    (ids) => databaseService.reorderAboutItems(ids),
    null
  ),

  // Hero Cards
  addHeroCard: withFallback(
    (payload) => databaseService.addHeroCard(payload),
    null
  ),
  updateHeroCard: withFallback(
    (id, payload) => databaseService.updateHeroCard(id, payload),
    null
  ),
  deleteHeroCard: withFallback(
    (id) => databaseService.deleteHeroCard(id),
    null
  ),
  reorderHeroCards: withFallback(
    (ids) => databaseService.reorderHeroCards(ids),
    null
  ),

  // Direct localStorage access
  saveLocalPortfolio: (data) => localStorageService.savePortfolio(data),
};
