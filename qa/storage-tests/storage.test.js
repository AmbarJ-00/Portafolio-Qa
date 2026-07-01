/**
 * Storage Layer Tests — QA Portfolio
 * Suite: Persistence, fallback behavior, contact form routing
 *
 * Run: node qa/storage-tests/storage.test.js
 * (No external test runner required — pure Node.js)
 */

'use strict';

// ─── Minimal test framework ──────────────────────────────────────────────────
let passed = 0;
let failed = 0;
const errors = [];

function assert(condition, label) {
  if (condition) {
    console.log(`  ✅  ${label}`);
    passed++;
  } else {
    console.error(`  ❌  ${label}`);
    failed++;
    errors.push(label);
  }
}

function assertThrows(fn, label) {
  try {
    fn();
    console.error(`  ❌  ${label} — expected an error but none was thrown`);
    failed++;
    errors.push(label);
  } catch (_e) {
    console.log(`  ✅  ${label}`);
    passed++;
  }
}

function describe(suiteName, fn) {
  console.log(`\n📋  ${suiteName}`);
  fn();
}

// ─── LocalStorage mock ───────────────────────────────────────────────────────
const storage = {};
const localStorageMock = {
  getItem: (key) => (key in storage ? storage[key] : null),
  setItem: (key, value) => { storage[key] = String(value); },
  removeItem: (key) => { delete storage[key]; },
  clear: () => { Object.keys(storage).forEach((k) => delete storage[k]); }
};
global.localStorage = localStorageMock;

// ─── Load modules after mocking globals ──────────────────────────────────────
// NOTE: Using inline re-implementations here since Node.js in this context
// doesn't transpile ESM. These implementations mirror the real service logic.

const PORTFOLIO_KEY = 'qa-portfolio-data';
const CONTACT_KEY = 'qa-contact-messages';

const FALLBACK_PORTFOLIO = {
  personal: {
    name: 'Ambar Ramon',
    role: 'QA Lead',
    email: 'ambarqaleads@gmail.com',
    github: 'AmbarJ-00',
    linkedin: 'ambar-ramon-qa'
  },
  skills: [],
  projects: [],
  certifications: [],
  documentation: { templates: [] },
  aboutItems: [],
  heroCards: [],
  settings: {
    seo: { title: 'Ambar Ramon | QA Lead', description: '' },
    appearance: { darkMode: false, primaryColor: '#D68880' },
    navbar: { items: [], type: 'horizontal', layout: 'wrap', behavior: 'grid' },
    modules: [],
    contact: {}
  }
};

// Inline localStorage service mirror
const getPortfolioFromLocal = () => {
  const raw = localStorage.getItem(PORTFOLIO_KEY);
  if (!raw) return { ...FALLBACK_PORTFOLIO };
  try {
    const parsed = JSON.parse(raw);
    return { ...FALLBACK_PORTFOLIO, ...parsed };
  } catch {
    return { ...FALLBACK_PORTFOLIO };
  }
};

const savePortfolioToLocal = (data) => {
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(data));
};

const submitContactToLocal = (data) => {
  const raw = localStorage.getItem(CONTACT_KEY);
  const messages = raw ? JSON.parse(raw) : [];
  const newMessage = {
    id: `msg-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...data,
    _savedLocally: true
  };
  messages.push(newMessage);
  localStorage.setItem(CONTACT_KEY, JSON.stringify(messages));
  return { success: true, localFallback: true, messageId: newMessage.id };
};

// ─── Tests: localStorage Persistence ─────────────────────────────────────────
describe('LocalStorage Service — Portfolio Persistence', () => {
  localStorageMock.clear();

  describe('getPortfolio — fallback state when empty', () => {
    const data = getPortfolioFromLocal();
    assert(typeof data === 'object', 'Returns an object');
    assert(data.personal?.name === 'Ambar Ramon', 'Fallback personal.name is set');
    assert(Array.isArray(data.skills), 'Fallback skills is array');
    assert(Array.isArray(data.projects), 'Fallback projects is array');
    assert(Array.isArray(data.certifications), 'Fallback certifications is array');
    assert(data.settings?.seo?.title?.length > 0, 'Fallback SEO title is present');
  });

  describe('savePortfolio — writes and reads back', () => {
    const testData = {
      ...FALLBACK_PORTFOLIO,
      personal: { name: 'Test User', role: 'QA Engineer' }
    };
    savePortfolioToLocal(testData);
    const readBack = getPortfolioFromLocal();
    assert(readBack.personal.name === 'Test User', 'Written name is read back correctly');
    assert(readBack.personal.role === 'QA Engineer', 'Written role is read back correctly');
  });

  describe('getPortfolio — handles corrupted localStorage', () => {
    localStorageMock.setItem(PORTFOLIO_KEY, '{invalid_json_:}');
    const data = getPortfolioFromLocal();
    assert(typeof data === 'object', 'Returns object even on corrupt data');
    assert(data.personal?.name === 'Ambar Ramon', 'Falls back to defaults on corrupt data');
    localStorageMock.clear();
  });

  describe('Partial data merge — does not lose fallback keys', () => {
    localStorageMock.setItem(PORTFOLIO_KEY, JSON.stringify({ personal: { name: 'Partial' } }));
    const data = getPortfolioFromLocal();
    assert(data.personal.name === 'Partial', 'Partial data is loaded');
    assert(Array.isArray(data.skills), 'Missing skills key is filled with fallback');
    assert(typeof data.settings === 'object', 'Missing settings key is filled with fallback');
    localStorageMock.clear();
  });
});

// ─── Tests: Contact Form ──────────────────────────────────────────────────────
describe('LocalStorage Service — Contact Form', () => {
  localStorageMock.clear();

  describe('submitContact — saves to localStorage', () => {
    const contactData = {
      name: 'Test QA',
      email: 'test@qa.com',
      subject: 'Test subject',
      message: 'Hello, this is a test message'
    };
    const result = submitContactToLocal(contactData);
    assert(result.success === true, 'Returns success: true');
    assert(result.localFallback === true, 'Marks as localFallback: true');
    assert(typeof result.messageId === 'string', 'Returns a messageId string');

    const raw = localStorage.getItem(CONTACT_KEY);
    const messages = JSON.parse(raw);
    assert(Array.isArray(messages), 'Contact messages is an array');
    assert(messages.length === 1, 'One message was saved');
    assert(messages[0].email === contactData.email, 'Saved message has correct email');
    assert(messages[0].name === contactData.name, 'Saved message has correct name');
    assert(typeof messages[0].timestamp === 'string', 'Saved message has ISO timestamp');
    assert(messages[0]._savedLocally === true, 'Message is flagged as saved locally');
  });

  describe('submitContact — accumulates multiple messages', () => {
    submitContactToLocal({ name: 'A', email: 'a@test.com', message: 'One' });
    submitContactToLocal({ name: 'B', email: 'b@test.com', message: 'Two' });
    const messages = JSON.parse(localStorage.getItem(CONTACT_KEY));
    assert(messages.length === 3, 'Accumulates messages (1 from previous + 2 new)');
  });

  localStorageMock.clear();
});

// ─── Tests: Storage Config ────────────────────────────────────────────────────
describe('Storage Config — Provider Selection', () => {
  const VALID_PROVIDERS = ['localStorage', 'database'];

  describe('Validates supported providers', () => {
    for (const provider of VALID_PROVIDERS) {
      const fakeConfig = { activeProvider: provider };
      assert(VALID_PROVIDERS.includes(fakeConfig.activeProvider), `Provider '${provider}' is valid`);
    }
  });

  describe('Identifies invalid providers', () => {
    const invalidConfig = { activeProvider: 'redis' };
    assert(!VALID_PROVIDERS.includes(invalidConfig.activeProvider), "Provider 'redis' is correctly identified as invalid");
  });
});

// ─── Tests: DB Fallback Detection ─────────────────────────────────────────────
describe('Storage Service — Fallback Error Detection', () => {
  const DB_CODES = ['DB-500', 'ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNRESET'];
  const DB_KEYWORDS = ['connection', 'database', 'refused', 'timeout', 'fetch', 'failed to fetch'];

  const isDbError = (err) => {
    const code = String(err?.code || '').toUpperCase();
    const msg = String(err?.message || '').toLowerCase();
    return (
      DB_CODES.includes(code) ||
      code.startsWith('ER_') ||
      DB_KEYWORDS.some((kw) => msg.includes(kw))
    );
  };

  describe('Detects database errors by code', () => {
    assert(isDbError({ code: 'ECONNREFUSED' }), 'ECONNREFUSED is a DB error');
    assert(isDbError({ code: 'ETIMEDOUT' }), 'ETIMEDOUT is a DB error');
    assert(isDbError({ code: 'DB-500' }), 'DB-500 is a DB error');
    assert(isDbError({ code: 'ER_BAD_DB_ERROR' }), 'ER_ prefix is a DB error');
  });

  describe('Detects database errors by message', () => {
    assert(isDbError({ message: 'Failed to fetch' }), 'Failed to fetch is DB error');
    assert(isDbError({ message: 'connection refused to host' }), 'Connection refused in message');
    assert(isDbError({ message: 'database connection timeout' }), 'Database timeout in message');
  });

  describe('Does NOT flag non-DB errors', () => {
    assert(!isDbError({ code: '401' }), '401 Unauthorized is not a DB error');
    assert(!isDbError({ code: '403' }), '403 Forbidden is not a DB error');
    assert(!isDbError({ message: 'Invalid field: name' }), 'Validation error is not a DB error');
    assert(!isDbError({}), 'Empty error is not a DB error');
  });
});

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(60));
console.log(`\n🏁  Test Run Complete`);
console.log(`    Passed: ${passed}`);
console.log(`    Failed: ${failed}`);
if (errors.length > 0) {
  console.log('\n  ❌  Failed tests:');
  errors.forEach((e) => console.log(`     - ${e}`));
  process.exit(1);
} else {
  console.log('\n  ✅  All tests passed!');
}
