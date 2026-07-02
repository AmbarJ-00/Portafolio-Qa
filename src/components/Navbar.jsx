import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext.jsx';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Menu, X, Sun, Moon, Globe, Github, Linkedin, Radar } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { store } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const toggleLang = () => {
    const nextLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('portfolio-lang', nextLang);
    document.documentElement.lang = nextLang;
  };

  const navLinks = store?.settings?.navbar?.items?.filter((item) => {
    const status = item.status || (item.active ? 'active' : 'inactive');
    return (
      status !== 'inactive' &&
      status !== 'maintenance' &&
      !item.path.startsWith('/admin') &&
      !item.path.startsWith('/backoffice')
    );
  }) || [];

  const maxDirectLinks = 5;
  const directLinks = navLinks.slice(0, maxDirectLinks);
  const extraLinks = navLinks.slice(maxDirectLinks);

  const linkActive = { color: 'var(--color-button)', background: 'rgba(214,136,128,0.08)' };
  const linkIdle = { color: 'var(--color-text)' };

  const iconBtnStyle = {
    padding: '0.5rem',
    borderRadius: '0.375rem',
    border: '1px solid var(--color-border)',
    color: 'var(--color-muted)',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  return (
    <header className="sticky top-0 z-50 w-full nav-blur">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-14">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="font-sans font-bold text-base tracking-tight text-brand-navy-800 dark:text-white flex items-center gap-2 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand-electric-500 rounded"
              aria-label="Ambar Ramon QA Lead Home"
            >
              <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-navy-800 to-brand-electric-500 dark:from-brand-electric-500 dark:to-brand-lilac-500 flex items-center justify-center text-white shadow-sm">
                <Radar className="w-4 h-4" />
              </span>
              <span className="hidden sm:inline">Ambar Ramon</span>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full hidden md:inline"
                style={{
                  color: 'var(--color-button)',
                  background: 'rgba(214,136,128,0.12)',
                  border: '1px solid rgba(214,136,128,0.25)'
                }}
              >
                QA
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Desktop Navigation">
            {directLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                style={({ isActive }) => isActive ? linkActive : linkIdle}
              >
                {link.labelKey ? t(link.labelKey) : link.name}
              </NavLink>
            ))}

            {extraLinks.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1"
                  style={{ color: 'var(--color-text)' }}
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                >
                  <span>{t('nav.more') || 'Más'}</span>
                  <span className="text-[10px]">▼</span>
                </button>

                {moreOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMoreOpen(false)} />
                    <div
                      className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 z-20"
                      style={{
                        background: 'var(--bg-global)',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      {extraLinks.map((link) => (
                        <NavLink
                          key={link.path}
                          to={link.path}
                          onClick={() => setMoreOpen(false)}
                          className="block px-4 py-2 text-sm transition-colors"
                          style={({ isActive }) => isActive ? linkActive : linkIdle}
                        >
                          {link.labelKey ? t(link.labelKey) : link.name}
                        </NavLink>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </nav>

          {/* Desktop Right Utilities */}
          <div className="hidden lg:flex items-center space-x-3">
            <a
              href={store?.settings?.contact?.github || store?.personal?.github || '#'}
              target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-md transition-colors"
              style={{ color: 'var(--color-muted)' }}
              aria-label="GitHub"
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-button)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-muted)'}
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={store?.settings?.contact?.linkedin || store?.personal?.linkedin || '#'}
              target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-md transition-colors"
              style={{ color: 'var(--color-muted)' }}
              aria-label="LinkedIn"
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-button)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-muted)'}
            >
              <Linkedin className="w-5 h-5" />
            </a>

            <div className="h-4 w-px" style={{ background: 'var(--color-border)' }} />

            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200"
              style={{ ...iconBtnStyle, padding: '0.375rem 0.75rem' }}
              aria-label={i18n.language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-button)'; e.currentTarget.style.color = 'var(--color-button)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-muted)'; }}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{i18n.language === 'es' ? 'EN' : 'ES'}</span>
            </button>

            <button
              onClick={toggleTheme}
              style={iconBtnStyle}
              aria-label={theme === 'dark' ? 'Activate Light Mode' : 'Activar Modo Oscuro'}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-button)'; e.currentTarget.style.color = 'var(--color-button)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-muted)'; }}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center space-x-2">
            <button onClick={toggleLang} style={iconBtnStyle} aria-label="Toggle language">
              {i18n.language === 'es' ? 'EN' : 'ES'}
            </button>
            <button onClick={toggleTheme} style={iconBtnStyle} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{ ...iconBtnStyle, border: 'none' }}
              aria-expanded={isOpen}
              aria-label="Toggle main menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden"
            style={{
              background: 'var(--bg-global)',
              borderBottom: '1px solid var(--color-border)'
            }}
          >
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 max-h-[70vh] overflow-y-auto">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-base font-semibold transition-all"
                  style={({ isActive }) => isActive ? linkActive : linkIdle}
                >
                  {link.labelKey ? t(link.labelKey) : link.name}
                </NavLink>
              ))}

              <div className="h-px my-2" style={{ background: 'var(--color-border)' }} />

              <div className="flex items-center justify-around py-2">
                <a
                  href={store?.settings?.contact?.github || store?.personal?.github || '#'}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 font-medium py-1.5 px-3 rounded"
                  style={{ color: 'var(--color-muted)' }}
                  aria-label="GitHub Link"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
                <a
                  href={store?.settings?.contact?.linkedin || store?.personal?.linkedin || '#'}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 font-medium py-1.5 px-3 rounded"
                  style={{ color: 'var(--color-muted)' }}
                  aria-label="LinkedIn Link"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
