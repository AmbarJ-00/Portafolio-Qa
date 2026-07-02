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
    (payload) => localStorageService.updatePersonal(payload)
  ),

  updateSEO: withFallback(
    (payload) => databaseService.updateSEO(payload),
    (payload) => localStorageService.updateSEO(payload)
  ),

  updateContact: withFallback(
    (payload) => databaseService.updateContact(payload),
    (payload) => localStorageService.updateContact(payload)
  ),

  updateAppearance: withFallback(
    (payload) => databaseService.updateAppearance(payload),
    (payload) => localStorageService.updateAppearance(payload)
  ),

  updateNavbar: withFallback(
    (payload) => databaseService.updateNavbar(payload),
    (payload) => localStorageService.updateNavbar(payload)
  ),

  // Skills
  addSkill: withFallback(
    (payload) => databaseService.addSkill(payload),
    (payload) => localStorageService.addSkill(payload)
  ),
  updateSkill: withFallback(
    (id, payload) => databaseService.updateSkill(id, payload),
    (id, payload) => localStorageService.updateSkill(id, payload)
  ),
  deleteSkill: withFallback(
    (id) => databaseService.deleteSkill(id),
    (id) => localStorageService.deleteSkill(id)
  ),
  reorderSkills: withFallback(
    (ids) => databaseService.reorderSkills(ids),
    (ids) => localStorageService.reorderSkills(ids)
  ),

  // Projects
  addProject: withFallback(
    (payload) => databaseService.addProject(payload),
    (payload) => localStorageService.addProject(payload)
  ),
  updateProject: withFallback(
    (id, payload) => databaseService.updateProject(id, payload),
    (id, payload) => localStorageService.updateProject(id, payload)
  ),
  deleteProject: withFallback(
    (id) => databaseService.deleteProject(id),
    (id) => localStorageService.deleteProject(id)
  ),

  // Certifications
  addCertification: withFallback(
    (payload) => databaseService.addCertification(payload),
    (payload) => localStorageService.addCertification(payload)
  ),
  updateCertification: withFallback(
    (id, payload) => databaseService.updateCertification(id, payload),
    (id, payload) => localStorageService.updateCertification(id, payload)
  ),
  deleteCertification: withFallback(
    (id) => databaseService.deleteCertification(id),
    (id) => localStorageService.deleteCertification(id)
  ),
  reorderCertifications: withFallback(
    (ids) => databaseService.reorderCertifications(ids),
    (ids) => localStorageService.reorderCertifications(ids)
  ),

  // Documentation
  addDocumentation: withFallback(
    (payload) => databaseService.addDocumentation(payload),
    (payload) => localStorageService.addDocumentation(payload)
  ),
  updateDocumentation: withFallback(
    (id, payload) => databaseService.updateDocumentation(id, payload),
    (id, payload) => localStorageService.updateDocumentation(id, payload)
  ),
  deleteDocumentation: withFallback(
    (id) => databaseService.deleteDocumentation(id),
    (id) => localStorageService.deleteDocumentation(id)
  ),

  // Modules
  addModule: withFallback(
    (payload) => databaseService.addModule(payload),
    (payload) => localStorageService.addModule(payload)
  ),
  updateModule: withFallback(
    (id, payload) => databaseService.updateModule(id, payload),
    (id, payload) => localStorageService.updateModule(id, payload)
  ),
  deleteModule: withFallback(
    (id) => databaseService.deleteModule(id),
    (id) => localStorageService.deleteModule(id)
  ),
  reorderModules: withFallback(
    (ids) => databaseService.reorderModules(ids),
    (ids) => localStorageService.reorderModules(ids)
  ),

  // About Items
  addAboutItem: withFallback(
    (payload) => databaseService.addAboutItem(payload),
    (payload) => localStorageService.addAboutItem(payload)
  ),
  updateAboutItem: withFallback(
    (id, payload) => databaseService.updateAboutItem(id, payload),
    (id, payload) => localStorageService.updateAboutItem(id, payload)
  ),
  deleteAboutItem: withFallback(
    (id) => databaseService.deleteAboutItem(id),
    (id) => localStorageService.deleteAboutItem(id)
  ),
  reorderAboutItems: withFallback(
    (ids) => databaseService.reorderAboutItems(ids),
    (ids) => localStorageService.reorderAboutItems(ids)
  ),

  // Hero Cards
  addHeroCard: withFallback(
    (payload) => databaseService.addHeroCard(payload),
    (payload) => localStorageService.addHeroCard(payload)
  ),
  updateHeroCard: withFallback(
    (id, payload) => databaseService.updateHeroCard(id, payload),
    (id, payload) => localStorageService.updateHeroCard(id, payload)
  ),
  deleteHeroCard: withFallback(
    (id) => databaseService.deleteHeroCard(id),
    (id) => localStorageService.deleteHeroCard(id)
  ),
  reorderHeroCards: withFallback(
    (ids) => databaseService.reorderHeroCards(ids),
    (ids) => localStorageService.reorderHeroCards(ids)
  ),

  // Direct localStorage access
  saveLocalPortfolio: (data) => localStorageService.savePortfolio(data),
};
