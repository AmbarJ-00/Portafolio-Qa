# Database Setup Guide — QA Portfolio

This guide explains how to configure, activate, deactivate, and migrate data between localStorage and MySQL for the QA Portfolio application.

---

## Architecture Overview

The application uses a **decoupled storage layer** (`src/services/storage/`):

```
src/services/storage/
├── storage.config.js      ← Controls which provider is active
├── localStorage.service.js ← Default active provider (browser localStorage)
├── database.service.js    ← Database provider (disabled, prepared)
└── storage.service.js     ← Facade that routes and auto-fallbacks
```

By default, the app runs fully with `localStorage` — **no database is required**.

---

## Environment Variables

Create or update the `.env` file at the project root:

```dotenv
# ── DATABASE ─────────────────────────────────────────────────────────────────
DB_HOST=localhost
DB_USER=admin_user
DB_PASSWORD=your_secure_password
DB_NAME=qa_portfolio
DB_PORT=3306

# ── AUTHENTICATION ────────────────────────────────────────────────────────────
JWT_SECRET=your_jwt_secret_here

# ── ADMIN FALLBACK (used when DB is offline) ──────────────────────────────────
ADMIN_FALLBACK_USER=admin
ADMIN_FALLBACK_PASS=AdminQA#2026

# ── EMAIL / SMTP ──────────────────────────────────────────────────────────────
CONTACT_TARGET_EMAIL=your@email.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user@gmail.com
SMTP_PASS=your_app_password

# ── APPLICATION ───────────────────────────────────────────────────────────────
NODE_ENV=development
PORT=3001
APP_URL=https://qa-portfolio.vercel.app
```

> **SMTP Note:** For Gmail, generate an **App Password** from Google Account → Security → App Passwords. Do NOT use your regular Gmail password.

---

## How to Activate the Database

**Step 1:** Set up your MySQL instance and update `.env` with correct credentials.

**Step 2:** Edit `src/services/storage/storage.config.js`:

```js
export const storageConfig = {
  activeProvider: 'database', // Changed from 'localStorage'
};
```

**Step 3:** Start the backend server:

```bash
node server.js
# or
npm run dev
```

The server will automatically:
- Connect to MySQL
- Create all tables if they don't exist (`initDb()` in `src/config/db.js`)
- Seed default admin user and portfolio data

---

## How to Deactivate the Database (Use localStorage)

Edit `src/services/storage/storage.config.js`:

```js
export const storageConfig = {
  activeProvider: 'localStorage', // Default
};
```

The app will load data from `localStorage` key `qa-portfolio-data` and operate fully without any backend server.

---

## How to Connect MySQL

Requirements:
- MySQL 8.0+ (or MariaDB 10.5+)
- User with CREATE, INSERT, UPDATE, DELETE, DROP privileges on the target database

Example setup in MySQL shell:

```sql
CREATE DATABASE IF NOT EXISTS qa_portfolio;
CREATE USER 'admin_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON qa_portfolio.* TO 'admin_user'@'localhost';
FLUSH PRIVILEGES;
```

Tables are created automatically on first run via the migration script in `src/config/db.js`.

---

## Database Tables

| Table                   | Description                                      |
|-------------------------|--------------------------------------------------|
| `users`                 | Admin credentials (bcrypt hashed passwords)      |
| `personal_info`         | Portfolio owner information                      |
| `hero_cards`            | Hero section cards                               |
| `about_items`           | About page pillars and content                   |
| `projects`              | Project entries with metrics and metadata        |
| `skills`                | Skills/technologies with levels and descriptions |
| `certifications`        | Professional certifications                      |
| `documentation_templates` | QA documentation templates               |
| `modules`               | Custom portfolio modules                         |
| `module_elements`       | Elements belonging to each module                |
| `settings`              | Key-value app settings (appearance, SEO, etc.)   |
| `contact_messages`      | Submitted contact form messages                  |
| `error_logs`            | Runtime error audit log                          |

---

## How to Migrate Data from localStorage to MySQL

**Step 1:** Export your data from the browser console:

```js
const data = JSON.parse(localStorage.getItem('qa-portfolio-data'));
console.log(JSON.stringify(data, null, 2));
// Copy the output
```

**Step 2:** Activate the database provider (see above).

**Step 3:** Start the server — it will seed default data automatically if tables are empty.

**Step 4:** Log in to the backoffice at `/admin` and manually update each section with your data, OR use the admin API endpoints to POST/PUT your exported records programmatically.

---

## Fallback Behavior

If the database is configured but goes offline:

1. The `storageService` catches the connection error.
2. It automatically falls back to `localStorage`.
3. All changes made offline are saved to `qa-portfolio-data` in localStorage.
4. A warning banner appears in the UI: *"No se pudo establecer comunicación con el servidor de base de datos. Se están mostrando datos locales de respaldo."*
5. When the database comes back online, clicking **"Reintentar conexión"** restores full functionality.

---

## Contact Form Email (SMTP)

The contact form works in two modes:

| Mode | Behavior |
|------|----------|
| **SMTP configured** | Sends email via Nodemailer to `CONTACT_TARGET_EMAIL` |
| **SMTP not configured** | Saves message to `contact_messages` table (DB mode) or `qa-contact-messages` in localStorage |

To configure Gmail SMTP:
1. Enable 2-Step Verification on your Google account.
2. Go to **Security → App Passwords**.
3. Generate a password for "Mail".
4. Set `SMTP_USER` and `SMTP_PASS` in `.env`.

---

## Vercel Deployment

For Vercel, add all environment variables in the **Vercel Dashboard → Project → Settings → Environment Variables**.

The `vercel.json` routes all `/api/*` requests to `api/index.js` (which re-exports `server.js`), so all Express API endpoints work as serverless functions.

> **Note:** MySQL cannot run inside Vercel's serverless environment. You must use an external managed database (e.g., **PlanetScale**, **Railway**, **Clever Cloud**, **Amazon RDS**) and update `DB_HOST` accordingly.
