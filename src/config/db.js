import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { portfolioConfig } from '../data/portfolioData.js';

dotenv.config();

let pool = null;

// Default admin credentials
const DEFAULT_ADMIN_USER = 'admin';
const DEFAULT_ADMIN_PASS = 'AdminQA#2026';

export function getPoolConfig() {
  return {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'qa_portfolio',
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 5000
  };
}

async function addColumnIfNotExists(conn, table, column, definition) {
  try {
    const [cols] = await conn.query(`SHOW COLUMNS FROM \`${table}\` LIKE ?`, [column]);
    if (cols.length === 0) {
      await conn.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
      console.log(`Added column ${column} to table ${table}`);
    }
  } catch (err) {
    console.warn(`Could not check or add column ${column} to ${table}:`, err.message);
  }
}

export async function initDb() {
  const config = getPoolConfig();
  
  // 1. Try connecting without database first to ensure DB exists
  let tempConn;
  try {
    tempConn = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      port: config.port,
      connectTimeout: 5000
    });
    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\``);
    await tempConn.end();
  } catch (err) {
    if (tempConn) await tempConn.end();
    
    // Categorize standard MySQL error codes
    const errorObj = new Error(`Database connection failed: ${err.message}`);
    errorObj.code = 'DB-500';
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      errorObj.errorType = 'INVALID_CREDENTIALS';
    } else if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
      errorObj.errorType = 'DATABASE_DOWN';
    } else {
      errorObj.errorType = 'UNKNOWN_DB_ERROR';
    }
    throw errorObj;
  }

  // 2. Establish connection pool with the database
  if (!pool) {
    pool = mysql.createPool(config);
  }

  // 3. Test query & check permissions
  let conn;
  try {
    conn = await pool.getConnection();
  } catch (err) {
    const errorObj = new Error(`Database Pool error: ${err.message}`);
    errorObj.code = 'DB-500';
    errorObj.errorType = 'POOL_ACQUISITION_FAILED';
    throw errorObj;
  }

  try {
    // 4. Run migrations to create tables
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS personal_info (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(100),
        title VARCHAR(100),
        subtitle VARCHAR(255),
        bio TEXT,
        email VARCHAR(100),
        linkedin VARCHAR(255),
        github VARCHAR(255),
        location VARCHAR(100),
        cv VARCHAR(255)
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS hero_cards (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        icon VARCHAR(50),
        status VARCHAR(20),
        priority INT
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS about_items (
        id VARCHAR(36) PRIMARY KEY,
        type VARCHAR(50),
        title VARCHAR(255),
        description TEXT,
        position VARCHAR(50),
        priority INT,
        status VARCHAR(20),
        behavior VARCHAR(50)
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        titleKey VARCHAR(100),
        descriptionKey VARCHAR(100),
        translationKey VARCHAR(100),
        category VARCHAR(100),
        demo VARCHAR(255),
        repository VARCHAR(255),
        image VARCHAR(255),
        integrations TEXT,
        objectives TEXT,
        testingStrategy TEXT,
        testPlan TEXT,
        risks TEXT,
        bugs TEXT,
        status VARCHAR(255),
        demoVisibility VARCHAR(50),
        enableMetrics BOOLEAN,
        metrics TEXT
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(50),
        level INT,
        category VARCHAR(100),
        tools TEXT,
        relation TEXT,
        description TEXT,
        color VARCHAR(20),
        status VARCHAR(20),
        priority INT DEFAULT 0
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS certifications (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        authority VARCHAR(255),
        image VARCHAR(255),
        date VARCHAR(50),
        tools TEXT,
        integrations TEXT,
        summary TEXT,
        url VARCHAR(255),
        status VARCHAR(20),
        priority INT DEFAULT 0
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS documentation_templates (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        titleKey VARCHAR(100),
        descriptionKey VARCHAR(100),
        methodologyKey VARCHAR(100),
        category VARCHAR(100),
        type VARCHAR(100),
        template TEXT,
        questions TEXT,
        parameters TEXT,
        methodology TEXT,
        checklist TEXT,
        strategies TEXT
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS modules (
        id VARCHAR(36) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        tipo VARCHAR(50),
        estado VARCHAR(20),
        mensaje_creativo TEXT,
        visible BOOLEAN DEFAULT TRUE,
        configurado BOOLEAN DEFAULT FALSE,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        creado_por VARCHAR(50),
        actualizado_por VARCHAR(50),
        priority INT DEFAULT 0
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS module_elements (
        id VARCHAR(36) PRIMARY KEY,
        module_id VARCHAR(36),
        tipo_elemento VARCHAR(50),
        titulo VARCHAR(255),
        descripcion TEXT,
        imagen VARCHAR(255),
        url VARCHAR(255),
        estado VARCHAR(20),
        configuracion_json TEXT,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS settings (
        \`key\` VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS error_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        codigo VARCHAR(50),
        usuario VARCHAR(50),
        modulo VARCHAR(100),
        accion VARCHAR(100),
        detalles TEXT
      )
    `);

    // Self-healing: Check and add priority column to pre-existing tables if needed
    await addColumnIfNotExists(conn, 'skills', 'priority', 'INT DEFAULT 0');
    await addColumnIfNotExists(conn, 'certifications', 'priority', 'INT DEFAULT 0');
    await addColumnIfNotExists(conn, 'modules', 'priority', 'INT DEFAULT 0');

    // 5. Seed default admin if user table empty
    const [users] = await conn.query('SELECT COUNT(*) as count FROM users');
    if (users[0].count === 0) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(DEFAULT_ADMIN_PASS, salt);
      await conn.query(
        'INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)',
        ['user-admin-default', DEFAULT_ADMIN_USER, hash, 'admin']
      );
      console.log('Seeded default admin user');
    }

    // 6. Seed other tables if empty
    const [personalCount] = await conn.query('SELECT COUNT(*) as count FROM personal_info');
    if (personalCount[0].count === 0 && portfolioConfig.personal) {
      const p = portfolioConfig.personal;
      await conn.query(
        `INSERT INTO personal_info (id, name, title, subtitle, bio, email, linkedin, github, location, cv) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['personal-default', p.name, p.title, p.subtitle, p.bio, p.email, p.linkedin, p.github, p.location, p.cv || '']
      );
    }

    const [heroCount] = await conn.query('SELECT COUNT(*) as count FROM hero_cards');
    if (heroCount[0].count === 0) {
      const defaults = [
        { id: 'hero-1', title: 'Liderazgo de Calidad', description: 'Garantizando la excelencia en cada sprint', icon: 'ShieldCheck', status: 'active', priority: 1 },
        { id: 'hero-2', title: 'Automatización Eficiente', description: 'Reduciendo tiempos de ejecución con scripts estables', icon: 'Terminal', status: 'active', priority: 2 }
      ];
      for (const card of defaults) {
        await conn.query(
          'INSERT INTO hero_cards (id, title, description, icon, status, priority) VALUES (?, ?, ?, ?, ?, ?)',
          [card.id, card.title, card.description, card.icon, card.status, card.priority]
        );
      }
    }

    const [skillsCount] = await conn.query('SELECT COUNT(*) as count FROM skills');
    if (skillsCount[0].count === 0 && portfolioConfig.skills) {
      let priority = 0;
      for (const s of portfolioConfig.skills) {
        await conn.query(
          `INSERT INTO skills (id, name, icon, level, category, tools, relation, description, color, status, priority) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            s.id, s.name, s.icon, s.level, s.category, 
            JSON.stringify(s.tools || []), JSON.stringify(s.relation || []), 
            s.description || '', s.color || '#7c3aed', s.status || 'active', priority++
          ]
        );
      }
    }

    const [projectsCount] = await conn.query('SELECT COUNT(*) as count FROM projects');
    if (projectsCount[0].count === 0 && portfolioConfig.projects) {
      for (const p of portfolioConfig.projects) {
        await conn.query(
          `INSERT INTO projects (id, title, description, titleKey, descriptionKey, translationKey, category, demo, repository, image, integrations, objectives, testingStrategy, testPlan, risks, bugs, status, demoVisibility, enableMetrics, metrics) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            p.id, p.title, p.description || '', p.titleKey || null, p.descriptionKey || null, p.translationKey || null,
            p.category || '', p.demo || '', p.repository || '', p.image || '', 
            JSON.stringify(p.integrations || []), JSON.stringify(p.objectives || []), 
            p.testingStrategy || '', p.testPlan || '', JSON.stringify(p.risks || []), 
            JSON.stringify(p.bugs || []), p.status || 'active', p.demoVisibility || 'show',
            p.enableMetrics !== false, JSON.stringify(p.metrics || {})
          ]
        );
      }
    }

    const [certificationsCount] = await conn.query('SELECT COUNT(*) as count FROM certifications');
    if (certificationsCount[0].count === 0 && portfolioConfig.certifications) {
      let priority = 0;
      for (const c of portfolioConfig.certifications) {
        await conn.query(
          `INSERT INTO certifications (id, title, authority, image, date, tools, integrations, summary, url, status, priority) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            c.id, c.title, c.authority || '', c.image || '', c.date || '', 
            JSON.stringify(c.tools || []), JSON.stringify(c.integrations || []), 
            c.summary || '', c.url || '', c.status || 'Active', priority++
          ]
        );
      }
    }

    const [docCount] = await conn.query('SELECT COUNT(*) as count FROM documentation_templates');
    if (docCount[0].count === 0 && portfolioConfig.documentation?.templates) {
      for (const t of portfolioConfig.documentation.templates) {
        await conn.query(
          `INSERT INTO documentation_templates (id, title, titleKey, descriptionKey, methodologyKey, category, type, template, questions, parameters, methodology, checklist, strategies) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            t.id, t.title, t.titleKey || null, t.descriptionKey || null, t.methodologyKey || null,
            t.category || '', t.type || '', t.template || '', JSON.stringify(t.questions || []), 
            JSON.stringify(t.parameters || []), t.methodology || '', 
            JSON.stringify(t.checklist || []), JSON.stringify(t.strategies || [])
          ]
        );
      }
    }

    const [settingsCount] = await conn.query('SELECT COUNT(*) as count FROM settings');
    if (settingsCount[0].count === 0) {
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

      const defaultNavbarItems = [
        { id: 'home', name: 'Home', labelKey: 'nav.home', path: '/', active: true },
        { id: 'projects', name: 'Projects', labelKey: 'nav.projects', path: '/projects', active: true },
        { id: 'skills', name: 'Skills', labelKey: 'nav.skills', path: '/skills', active: true },
        { id: 'documentation', name: 'Documentation', labelKey: 'nav.documentation', path: '/documentation', active: true },
        { id: 'certifications', name: 'Certifications', labelKey: 'nav.certifications', path: '/certifications', active: true },
        { id: 'about', name: 'About', labelKey: 'nav.about', path: '/about', active: true },
        { id: 'contact', name: 'Contact', labelKey: 'nav.contact', path: '/contact', active: true }
      ];

      const defaultContact = {
        email: portfolioConfig.personal?.email || '',
        linkedin: portfolioConfig.personal?.linkedin || '',
        github: portfolioConfig.personal?.github || '',
        phone: '',
        alternativeContact: '',
        country: portfolioConfig.personal?.location || ''
      };

      await conn.query('INSERT INTO settings (\`key\`, value) VALUES (?, ?)', ['seo', JSON.stringify(portfolioConfig.settings?.seo || {})]);
      await conn.query('INSERT INTO settings (\`key\`, value) VALUES (?, ?)', ['appearance', JSON.stringify(defaultAppearance)]);
      await conn.query('INSERT INTO settings (\`key\`, value) VALUES (?, ?)', ['navbar_config', JSON.stringify({ type: 'horizontal', layout: 'wrap', behavior: 'grid' })]);
      await conn.query('INSERT INTO settings (\`key\`, value) VALUES (?, ?)', ['navbar_items', JSON.stringify(defaultNavbarItems)]);
      await conn.query('INSERT INTO settings (\`key\`, value) VALUES (?, ?)', ['contact', JSON.stringify(defaultContact)]);
    }

    const [modulesCount] = await conn.query('SELECT COUNT(*) as count FROM modules');
    if (modulesCount[0].count === 0) {
      await conn.query(
        `INSERT INTO modules (id, nombre, descripcion, tipo, estado, mensaje_creativo, visible, configurado, priority) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'portfolio-overview', 'Portfolio', 'Showcase projects, skills and certifications in a modular experience.', 
          'cards', 'active', '', true, true, 0
        ]
      );
    }

  } catch (err) {
    const errorObj = new Error(`Database Migration failed: ${err.message}`);
    errorObj.code = 'DB-500';
    errorObj.errorType = 'MIGRATION_FAILED';
    throw errorObj;
  } finally {
    if (conn) conn.release();
  }
}

export async function query(sql, params) {
  if (!pool) {
    await initDb();
  }
  return pool.query(sql, params);
}

export async function checkDatabaseConnection() {
  try {
    await initDb();
    const [res] = await pool.query('SELECT 1');
    if (!res) throw new Error('Query select 1 returned empty');
    return true;
  } catch (err) {
    const errorObj = new Error(`Connection validation failed: ${err.message}`);
    errorObj.code = 'DB-500';
    errorObj.errorType = err.errorType || 'CONNECTION_TEST_FAILED';
    throw errorObj;
  }
}
