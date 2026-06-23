import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { query, checkDatabaseConnection, initDb } from './src/config/db.js';
import nodemailer from 'nodemailer';
import { mailConfig } from './src/config/mail.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'claveJWTseguraGenerada';

// Ensure database is initialized on boot
initDb().then(() => {
  console.log('Database initialized successfully.');
}).catch(err => {
  console.error('Failed to initialize database:', err.message);
});

// Helper to log errors in MySQL (with fallback to console)
async function logErrorToDb(code, user, module, action, details) {
  try {
    await query(
      'INSERT INTO error_logs (codigo, usuario, modulo, accion, detalles) VALUES (?, ?, ?, ?, ?)',
      [code, user || 'anonymous', module || 'system', action || 'none', details || '']
    );
  } catch (err) {
    console.error(`[DB ERROR LOG FAIL] ${code} | ${err.message}`);
  }
}

// OWASP Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' ws: http: https:; frame-ancestors 'none';"
  );
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Explicit CORS Config (No wildcard in production)
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.APP_URL || 'https://qa-portfolio.vercel.app'] 
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS Policy Denied'));
    }
  },
  credentials: true
}));

app.use(express.json());

// JWT Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ code: 'Auth-401', error: 'Token no provisto' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ code: 'Auth-401', error: 'Token inválido o expirado' });
    }
    req.user = user;
    next();
  });
}

// Role authorization middleware
function authorizeRole(roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ code: 'Permission-403', error: 'Acceso denegado: permisos insuficientes' });
    }
    next();
  };
}

// XSS Sanitizer helper
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => typeof item === 'object' ? sanitizeObject(item) : sanitizeString(item));
  }
  const result = {};
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      result[key] = sanitizeObject(obj[key]);
    } else {
      result[key] = sanitizeString(obj[key]);
    }
  }
  return result;
}

// Database Connection Check Endpoint
app.get('/api/db-check', async (req, res) => {
  try {
    await checkDatabaseConnection();
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('DB-500', 'anonymous', 'database', 'check', err.message);
    res.status(500).json({ code: 'DB-500', error: err.message, errorType: err.errorType });
  }
});

// Auth Login
app.post('/api/auth/login', async (req, res) => {
  const username = sanitizeString(req.body.username);
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const [rows] = await query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ code: 'Auth-401', error: 'Credenciales inválidas' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ code: 'Auth-401', error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    // --- Fallback: validate against env vars if the DB is unavailable ---
    const fallbackUser = process.env.ADMIN_FALLBACK_USER;
    const fallbackPass = process.env.ADMIN_FALLBACK_PASS;
    const isDbError = err.code === 'DB-500' ||
      (err.message && (
        err.message.includes('ECONNREFUSED') ||
        err.message.includes('ETIMEDOUT') ||
        err.message.includes('ER_ACCESS_DENIED') ||
        err.message.includes('connection') ||
        err.message.includes('connect')
      ));

    if (isDbError && fallbackUser && fallbackPass) {
      if (username === fallbackUser && password === fallbackPass) {
        console.warn('[AUTH] DB unavailable — authenticated via env fallback credentials.');
        const token = jwt.sign(
          { id: 'fallback-admin', username: fallbackUser, role: 'admin' },
          JWT_SECRET,
          { expiresIn: '8h' }
        );
        return res.json({
          token,
          user: { id: 'fallback-admin', username: fallbackUser, role: 'admin' },
          warning: 'Authenticated via fallback credentials. Database is offline.'
        });
      }
      return res.status(401).json({ code: 'Auth-401', error: 'Credenciales inválidas' });
    }
    // --- End fallback ---

    console.error('[AUTH] Login error:', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

// Verification token check
app.post('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Fetch full portfolio state (Public & Admin initializer)
app.get('/api/portfolio', async (req, res) => {
  try {
    // Check connection first
    await checkDatabaseConnection();

    // Query tables
    const [personalRows] = await query('SELECT * FROM personal_info');
    const [heroRows] = await query('SELECT * FROM hero_cards ORDER BY priority ASC');
    const [aboutRows] = await query('SELECT * FROM about_items ORDER BY priority ASC');
    const [projectRows] = await query('SELECT * FROM projects');
    const [skillRows] = await query('SELECT * FROM skills ORDER BY priority ASC');
    const [certRows] = await query('SELECT * FROM certifications ORDER BY priority ASC');
    const [docRows] = await query('SELECT * FROM documentation_templates');
    const [moduleRows] = await query('SELECT * FROM modules ORDER BY priority ASC, fecha_creacion DESC');
    const [settingsRows] = await query('SELECT * FROM settings');

    // Parse JSON properties
    const personal = personalRows[0] || {};
    const heroCards = heroRows;
    const aboutItems = aboutRows;
    
    const projects = projectRows.map(p => ({
      ...p,
      integrations: JSON.parse(p.integrations || '[]'),
      objectives: JSON.parse(p.objectives || '[]'),
      risks: JSON.parse(p.risks || '[]'),
      bugs: JSON.parse(p.bugs || '[]'),
      enableMetrics: p.enableMetrics === 1 || p.enableMetrics === true,
      metrics: JSON.parse(p.metrics || '{}')
    }));

    const skills = skillRows.map(s => ({
      ...s,
      tools: JSON.parse(s.tools || '[]'),
      relation: JSON.parse(s.relation || '[]')
    }));

    const certifications = certRows.map(c => ({
      ...c,
      tools: JSON.parse(c.tools || '[]'),
      integrations: JSON.parse(c.integrations || '[]')
    }));

    const documentation = {
      templates: docRows.map(d => ({
        ...d,
        questions: JSON.parse(d.questions || '[]'),
        parameters: JSON.parse(d.parameters || '[]'),
        checklist: JSON.parse(d.checklist || '[]'),
        strategies: JSON.parse(d.strategies || '[]')
      }))
    };

    // Load settings key-values
    const settingsMap = {};
    settingsRows.forEach(row => {
      settingsMap[row.key] = JSON.parse(row.value);
    });

    // Fetch module elements
    const parsedModules = [];
    for (const mod of moduleRows) {
      const [elemRows] = await query('SELECT * FROM module_elements WHERE module_id = ?', [mod.id]);
      const elements = elemRows.map(e => ({
        ...e,
        percentage: e.configuracion_json ? JSON.parse(e.configuracion_json).percentage : false,
        value: e.configuracion_json ? JSON.parse(e.configuracion_json).value : '',
        indicator: e.configuracion_json ? JSON.parse(e.configuracion_json).indicator : ''
      }));

      parsedModules.push({
        id: mod.id,
        name: mod.nombre,
        description: mod.descripcion,
        icon: mod.icon || 'Layers',
        status: mod.estado,
        creativeMessage: mod.mensaje_creativo,
        visible: mod.visible === 1 || mod.visible === true,
        configurado: mod.configurado === 1 || mod.configurado === true,
        elementsType: mod.tipo,
        accentColor: mod.accentColor || '#38bdf8',
        surfaceColor: mod.surfaceColor || '#0f172a',
        animation: mod.animation || 'fade-in',
        elements
      });
    }

    res.json({
      personal,
      heroCards,
      aboutItems,
      projects,
      skills,
      certifications,
      documentation,
      settings: {
        seo: settingsMap.seo || {},
        appearance: settingsMap.appearance || {},
        navbar: {
          items: settingsMap.navbar_items || [],
          ...(settingsMap.navbar_config || {})
        },
        modules: parsedModules,
        contact: settingsMap.contact || {}
      }
    });
  } catch (err) {
    res.status(500).json({ code: 'DB-500', error: err.message, errorType: err.errorType });
  }
});

// Protect all edit endpoints with authentication & requireRole 'admin'
app.use('/api/admin', authenticateToken, authorizeRole(['admin']));

// Update personal details
app.put('/api/admin/personal', async (req, res) => {
  const p = sanitizeObject(req.body);
  try {
    await query(
      `UPDATE personal_info SET name=?, title=?, subtitle=?, bio=?, email=?, linkedin=?, github=?, location=?, cv=? WHERE id=?`,
      [p.name, p.title, p.subtitle, p.bio, p.email, p.linkedin, p.github, p.location, p.cv, 'personal-default']
    );
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'personal', 'update', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

// Skills CRUD
app.post('/api/admin/skills', async (req, res) => {
  const s = sanitizeObject(req.body);
  const id = `skill-${Math.random().toString(36).slice(2, 9)}`;
  try {
    await query(
      `INSERT INTO skills (id, name, icon, level, category, tools, relation, description, color, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, s.name, s.icon, s.level, s.category, JSON.stringify(s.tools || []), JSON.stringify(s.relation || []), s.description || '', s.color, s.status || 'active']
    );
    res.json({ success: true, id });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'skills', 'create', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

app.put('/api/admin/skills/:id', async (req, res) => {
  const s = sanitizeObject(req.body);
  try {
    await query(
      `UPDATE skills SET name=?, icon=?, level=?, category=?, tools=?, relation=?, description=?, color=?, status=? WHERE id=?`,
      [s.name, s.icon, s.level, s.category, JSON.stringify(s.tools || []), JSON.stringify(s.relation || []), s.description || '', s.color, s.status || 'active', req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'skills', 'update', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

app.delete('/api/admin/skills/:id', async (req, res) => {
  try {
    await query('DELETE FROM skills WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'skills', 'delete', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

// Projects CRUD
app.post('/api/admin/projects', async (req, res) => {
  const p = sanitizeObject(req.body);
  const id = `project-${Math.random().toString(36).slice(2, 9)}`;
  try {
    await query(
      `INSERT INTO projects (id, title, description, category, demo, repository, image, integrations, objectives, testingStrategy, testPlan, risks, bugs, status, demoVisibility, enableMetrics, metrics) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, p.title, p.description || '', p.category || '', p.demo || '', p.repository || '', p.image || '', 
        JSON.stringify(p.integrations || []), JSON.stringify(p.objectives || []), p.testingStrategy || '', p.testPlan || '',
        JSON.stringify(p.risks || []), JSON.stringify(p.bugs || []), p.status || 'active', p.demoVisibility || 'show',
        p.enableMetrics !== false, JSON.stringify(p.metrics || {})
      ]
    );
    res.json({ success: true, id });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'projects', 'create', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

app.put('/api/admin/projects/:id', async (req, res) => {
  const p = sanitizeObject(req.body);
  try {
    await query(
      `UPDATE projects SET title=?, description=?, category=?, demo=?, repository=?, image=?, integrations=?, objectives=?, testingStrategy=?, testPlan=?, risks=?, bugs=?, status=?, demoVisibility=?, enableMetrics=?, metrics=? WHERE id=?`,
      [
        p.title, p.description || '', p.category || '', p.demo || '', p.repository || '', p.image || '', 
        JSON.stringify(p.integrations || []), JSON.stringify(p.objectives || []), p.testingStrategy || '', p.testPlan || '',
        JSON.stringify(p.risks || []), JSON.stringify(p.bugs || []), p.status || 'active', p.demoVisibility || 'show',
        p.enableMetrics !== false, JSON.stringify(p.metrics || {}), req.params.id
      ]
    );
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'projects', 'update', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

app.delete('/api/admin/projects/:id', async (req, res) => {
  try {
    await query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'projects', 'delete', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

// Certifications CRUD
app.post('/api/admin/certifications', async (req, res) => {
  const c = sanitizeObject(req.body);
  const id = `cert-${Math.random().toString(36).slice(2, 9)}`;
  try {
    await query(
      `INSERT INTO certifications (id, title, authority, image, date, tools, integrations, summary, url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, c.title, c.authority || '', c.image || '', c.date || '', JSON.stringify(c.tools || []), JSON.stringify(c.integrations || []), c.summary || '', c.url || '', c.status || 'Active']
    );
    res.json({ success: true, id });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'certifications', 'create', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

app.put('/api/admin/certifications/:id', async (req, res) => {
  const c = sanitizeObject(req.body);
  try {
    await query(
      `UPDATE certifications SET title=?, authority=?, image=?, date=?, tools=?, integrations=?, summary=?, url=?, status=? WHERE id=?`,
      [c.title, c.authority || '', c.image || '', c.date || '', JSON.stringify(c.tools || []), JSON.stringify(c.integrations || []), c.summary || '', c.url || '', c.status || 'Active', req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'certifications', 'update', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

app.delete('/api/admin/certifications/:id', async (req, res) => {
  try {
    await query('DELETE FROM certifications WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'certifications', 'delete', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

// Documentation Templates CRUD
app.post('/api/admin/documentation', async (req, res) => {
  const d = sanitizeObject(req.body);
  const id = `doc-${Math.random().toString(36).slice(2, 9)}`;
  try {
    await query(
      `INSERT INTO documentation_templates (id, title, category, type, template, questions, parameters, methodology, checklist, strategies) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, d.title, d.category || '', d.type || '', d.template || '', JSON.stringify(d.questions || []), JSON.stringify(d.parameters || []), d.methodology || '', JSON.stringify(d.checklist || []), JSON.stringify(d.strategies || [])]
    );
    res.json({ success: true, id });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'documentation', 'create', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

app.put('/api/admin/documentation/:id', async (req, res) => {
  const d = sanitizeObject(req.body);
  try {
    await query(
      `UPDATE documentation_templates SET title=?, category=?, type=?, template=?, questions=?, parameters=?, methodology=?, checklist=?, strategies=? WHERE id=?`,
      [d.title, d.category || '', d.type || '', d.template || '', JSON.stringify(d.questions || []), JSON.stringify(d.parameters || []), d.methodology || '', JSON.stringify(d.checklist || []), JSON.stringify(d.strategies || []), req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'documentation', 'update', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

app.delete('/api/admin/documentation/:id', async (req, res) => {
  try {
    await query('DELETE FROM documentation_templates WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'documentation', 'delete', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

// Settings update routes
app.put('/api/admin/settings/appearance', async (req, res) => {
  const appearanceObj = sanitizeObject(req.body);
  try {
    await query('UPDATE settings SET value=? WHERE \`key\`=?', [JSON.stringify(appearanceObj), 'appearance']);
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'settings', 'update-appearance', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

app.put('/api/admin/settings/navbar', async (req, res) => {
  const { items, type, layout, behavior } = sanitizeObject(req.body);
  try {
    await query('UPDATE settings SET value=? WHERE \`key\`=?', [JSON.stringify(items), 'navbar_items']);
    await query('UPDATE settings SET value=? WHERE \`key\`=?', [JSON.stringify({ type, layout, behavior }), 'navbar_config']);
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'settings', 'update-navbar', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

app.put('/api/admin/settings/contact', async (req, res) => {
  const contactObj = sanitizeObject(req.body);
  try {
    await query('UPDATE settings SET value=? WHERE \`key\`=?', [JSON.stringify(contactObj), 'contact']);
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'settings', 'update-contact', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

app.put('/api/admin/settings/seo', async (req, res) => {
  const seoObj = sanitizeObject(req.body);
  try {
    await query('UPDATE settings SET value=? WHERE \`key\`=?', [JSON.stringify(seoObj), 'seo']);
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'settings', 'update-seo', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

// Reorder routes
app.put('/api/admin/skills/reorder', async (req, res) => {
  const { ids } = req.body;
  try {
    for (let i = 0; i < ids.length; i++) {
      await query('UPDATE skills SET priority = ? WHERE id = ?', [i, ids[i]]);
    }
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'skills', 'reorder', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

app.put('/api/admin/certifications/reorder', async (req, res) => {
  const { ids } = req.body;
  try {
    for (let i = 0; i < ids.length; i++) {
      await query('UPDATE certifications SET priority = ? WHERE id = ?', [i, ids[i]]);
    }
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'certifications', 'reorder', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

app.put('/api/admin/modules/reorder', async (req, res) => {
  const { ids } = req.body;
  try {
    for (let i = 0; i < ids.length; i++) {
      await query('UPDATE modules SET priority = ? WHERE id = ?', [i, ids[i]]);
    }
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'modules', 'reorder', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

// About Items CRUD
app.post('/api/admin/about-items', async (req, res) => {
  const item = sanitizeObject(req.body);
  const id = item.id || `about-${Math.random().toString(36).slice(2, 9)}`;
  try {
    await query(
      `INSERT INTO about_items (id, type, title, description, position, priority, status, behavior) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, item.type || 'pilar', item.title, item.description, item.position || 'center', item.priority || 0, item.status || 'active', item.behavior || 'card']
    );
    res.json({ success: true, id });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'about', 'create', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

app.put('/api/admin/about-items/:id', async (req, res) => {
  const item = sanitizeObject(req.body);
  try {
    await query(
      `UPDATE about_items SET type=?, title=?, description=?, position=?, priority=?, status=?, behavior=? WHERE id=?`,
      [item.type || 'pilar', item.title, item.description, item.position || 'center', item.priority || 0, item.status || 'active', item.behavior || 'card', req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'about', 'update', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

app.delete('/api/admin/about-items/:id', async (req, res) => {
  try {
    await query('DELETE FROM about_items WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'about', 'delete', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

app.put('/api/admin/about-items/reorder', async (req, res) => {
  const { ids } = req.body;
  try {
    for (let i = 0; i < ids.length; i++) {
      await query('UPDATE about_items SET priority = ? WHERE id = ?', [i, ids[i]]);
    }
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'about', 'reorder', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

// Hero Cards CRUD
app.post('/api/admin/hero-cards', async (req, res) => {
  const card = sanitizeObject(req.body);
  const id = card.id || `hero-card-${Math.random().toString(36).slice(2, 9)}`;
  try {
    await query(
      `INSERT INTO hero_cards (id, title, description, icon, status, priority) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, card.title, card.description, card.icon || 'ShieldCheck', card.status || 'active', card.priority || 0]
    );
    res.json({ success: true, id });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'hero', 'create', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

app.put('/api/admin/hero-cards/:id', async (req, res) => {
  const card = sanitizeObject(req.body);
  try {
    await query(
      `UPDATE hero_cards SET title=?, description=?, icon=?, status=?, priority=? WHERE id=?`,
      [card.title, card.description, card.icon || 'ShieldCheck', card.status || 'active', card.priority || 0, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'hero', 'update', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

app.delete('/api/admin/hero-cards/:id', async (req, res) => {
  try {
    await query('DELETE FROM hero_cards WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'hero', 'delete', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

app.put('/api/admin/hero-cards/reorder', async (req, res) => {
  const { ids } = req.body;
  try {
    for (let i = 0; i < ids.length; i++) {
      await query('UPDATE hero_cards SET priority = ? WHERE id = ?', [i, ids[i]]);
    }
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'hero', 'reorder', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

// Modules CRUD
app.post('/api/admin/modules', async (req, res) => {
  const m = sanitizeObject(req.body);
  const id = m.id || `module-${Math.random().toString(36).slice(2, 9)}`;
  const configurado = m.configurado === true || m.configurado === 1;
  
  try {
    // 1. Insert module metadata
    await query(
      `INSERT INTO modules (id, nombre, descripcion, tipo, estado, mensaje_creativo, visible, configurado, creado_por, actualizado_por) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, m.name, m.description || '', m.elementsType || 'cards', m.status || 'active', m.creativeMessage || '', m.visible !== false, configurado, req.user.username, req.user.username]
    );

    // 2. Insert items
    if (m.elements && m.elements.length > 0) {
      for (const el of m.elements) {
        const elId = `elem-${Math.random().toString(36).slice(2, 9)}`;
        const configJson = JSON.stringify({
          percentage: el.percentage || false,
          value: el.value || '',
          indicator: el.indicator || ''
        });
        await query(
          `INSERT INTO module_elements (id, module_id, tipo_elemento, titulo, descripcion, imagen, url, estado, configuracion_json) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [elId, id, m.elementsType, el.titulo || null, el.description || el.text || '', el.image || null, el.url || null, el.status || 'active', configJson]
        );
      }
    }

    res.json({ success: true, id });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'modules', 'create', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

app.put('/api/admin/modules/:id', async (req, res) => {
  const m = sanitizeObject(req.body);
  const id = req.params.id;
  const configurado = m.configurado === true || m.configurado === 1;

  try {
    // 1. Update module main metadata
    await query(
      `UPDATE modules SET nombre=?, descripcion=?, tipo=?, estado=?, mensaje_creativo=?, visible=?, configurado=?, actualizado_por=? 
       WHERE id=?`,
      [m.name, m.description || '', m.elementsType || 'cards', m.status || 'active', m.creativeMessage || '', m.visible !== false, configurado, req.user.username, id]
    );

    // 2. Refresh items (delete old, insert new)
    await query('DELETE FROM module_elements WHERE module_id = ?', [id]);
    if (m.elements && m.elements.length > 0) {
      for (const el of m.elements) {
        const elId = `elem-${Math.random().toString(36).slice(2, 9)}`;
        const configJson = JSON.stringify({
          percentage: el.percentage || false,
          value: el.value || '',
          indicator: el.indicator || ''
        });
        await query(
          `INSERT INTO module_elements (id, module_id, tipo_elemento, titulo, descripcion, imagen, url, estado, configuracion_json) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [elId, id, m.elementsType, el.titulo || null, el.description || el.text || '', el.image || null, el.url || null, el.status || 'active', configJson]
        );
      }
    }

    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'modules', 'update', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

app.delete('/api/admin/modules/:id', async (req, res) => {
  try {
    await query('DELETE FROM modules WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    await logErrorToDb('Server-500', req.user.username, 'modules', 'delete', err.message);
    res.status(500).json({ code: 'Server-500', error: err.message });
  }
});

// Dynamic component code generation endpoint (compatible with ModulesManager.jsx)
app.post('/api/create-module', async (req, res) => {
  try {
    const { name, content } = req.body;
    if (!name || !content) {
      return res.status(400).json({ error: 'Name and content are required' });
    }
    const fileName = name.replace(/[^a-zA-Z0-9]/g, '') + '.jsx';
    const dirPath = path.resolve(__dirname, 'src/admin/sections/New modules');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    const filePath = path.join(dirPath, fileName);
    fs.writeFileSync(filePath, content, 'utf8');

    res.json({ success: true, filePath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rate limiting map for contacts in memory
const contactRateLimit = {};

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  const limitWindow = 60 * 1000; // 1 minute
  const maxRequests = 3;

  // Initialize/clean IP rate limit timestamps
  if (!contactRateLimit[ip]) {
    contactRateLimit[ip] = [];
  }
  contactRateLimit[ip] = contactRateLimit[ip].filter(t => now - t < limitWindow);

  // Rate Limit Check
  if (contactRateLimit[ip].length >= maxRequests) {
    return res.status(429).json({ 
      error: 'Demasiadas solicitudes de contacto. Por favor, inténtalo de nuevo más tarde.' 
    });
  }
  contactRateLimit[ip].push(now);

  // 1. Honeypot check for spam
  if (req.body.honeypot) {
    console.warn(`[SPAM DETECTED] Honeypot field filled by IP ${ip}`);
    // Return success to trick the bot, but do not send email or save in DB
    return res.json({ success: true, message: 'Mensaje procesado' });
  }

  // 2. Extract and Sanitize Inputs
  const name = sanitizeString(req.body.name);
  const email = sanitizeString(req.body.email);
  const queryType = sanitizeString(req.body.queryType);
  const phone = sanitizeString(req.body.phone || '');
  const alternativeContact = sanitizeString(req.body.alternativeContact || '');
  const message = sanitizeString(req.body.message);

  // 3. Validation Checks
  if (!name || !email || !queryType || !message) {
    return res.status(400).json({ error: 'Todos los campos obligatorios (*) son requeridos.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Dirección de correo electrónico inválida.' });
  }

  const messageId = `msg-${Math.random().toString(36).slice(2, 9)}`;

  try {
    // 4. Persistence: save to contact_messages DB table
    let dbSaved = false;
    try {
      await query(
        `INSERT INTO contact_messages (id, name, email, query_type, phone, alternative_contact, message) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [messageId, name, email, queryType, phone, alternativeContact, message]
      );
      dbSaved = true;
    } catch (dbErr) {
      console.warn(`[DB Persist Failed] Could not save contact message: ${dbErr.message}`);
    }

    // 5. Send Email via Nodemailer
    const { smtp, targetEmail } = mailConfig;
    const emailBody = `
      <h3>Nuevo mensaje de contacto</h3>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Correo electrónico:</strong> ${email}</p>
      <p><strong>Tipo de consulta:</strong> ${queryType}</p>
      <p><strong>Número de contacto:</strong> ${phone || 'N/A'}</p>
      <p><strong>Contacto alternativo:</strong> ${alternativeContact || 'N/A'}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    if (smtp.auth.user && smtp.auth.pass) {
      const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.smtpPort || smtp.port,
        secure: smtp.secure,
        auth: {
          user: smtp.auth.user,
          pass: smtp.auth.pass
        }
      });

      await transporter.sendMail({
        from: `"${name}" <${smtp.auth.user}>`,
        to: targetEmail,
        replyTo: email,
        subject: `Contacto QA Portfolio: ${queryType} - de ${name}`,
        html: emailBody
      });
      
      console.log(`[EMAIL SENT] Contact message sent successfully to ${targetEmail}`);
    } else {
      console.warn(`[EMAIL NOT SENT - SMTP MISSING] Mail content:\nRecipient: ${targetEmail}\nContent:`, {
        name, email, queryType, phone, alternativeContact, message
      });
    }

    res.json({ success: true, messageId, dbSaved });
  } catch (err) {
    console.error('[CONTACT SEND ERROR]', err.message);
    res.status(500).json({ error: 'No se pudo enviar el mensaje. Inténtalo nuevamente más tarde.' });
  }
});

// Log custom runtime errors from client-side
app.post('/api/errors', async (req, res) => {
  const { code, user, module, action, details } = req.body;
  await logErrorToDb(code, user, module, action, details);
  res.json({ success: true });
});

// Serve frontend SPA static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
