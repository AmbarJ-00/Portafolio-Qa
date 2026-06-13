import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext.jsx';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Menu, X, Sun, Moon, Globe, Github, Linkedin } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { store } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();

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

  return (
    <header className="sticky top-0 z-50 w-full nav-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="font-display font-bold text-xl tracking-tight text-brand-navy-800 dark:text-white flex items-center gap-2 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand-electric-500 rounded"
              aria-label="Ambar Ramon QA Lead Home"
            >
              <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-navy-800 to-brand-electric-500 dark:from-brand-electric-500 dark:to-brand-lilac-500 flex items-center justify-center text-white text-sm font-extrabold shadow-sm">
                AR
              </span>
              <span className="hidden sm:inline">Ambar Ramon</span>
              <span className="text-brand-electric-500 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-electric-100/50 dark:bg-brand-electric-500/10 border border-brand-electric-500/25 hidden md:inline">
                QA
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Desktop Navigation">
            {directLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-electric-500 ${
                    isActive
                      ? 'text-brand-electric-600 dark:text-brand-electric-300 bg-brand-electric-50/50 dark:bg-brand-electric-500/5'
                      : 'text-brand-navy-600 dark:text-brand-ash-300 hover:text-brand-electric-600 hover:dark:text-brand-electric-300 hover:bg-brand-ash-100/60 dark:hover:bg-brand-navy-900/60'
                  }`
                }
              >
                {link.labelKey ? t(link.labelKey) : link.name}
              </NavLink>
            ))}

            {/* "More" Dropdown Menu */}
            {extraLinks.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1 text-brand-navy-600 dark:text-brand-ash-300 hover:text-brand-electric-600 hover:bg-brand-ash-100/60 dark:hover:bg-brand-navy-900/60"
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                >
                  <span>{t('nav.more') || 'Más'}</span>
                  <span className="text-[10px]">▼</span>
                </button>
                
                {moreOpen && (
                  <>
                    {/* Backdrop cover to click outside */}
                    <div className="fixed inset-0 z-10" onClick={() => setMoreOpen(false)} />
                    
                    <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white dark:bg-brand-navy-950 border border-brand-ash-200 dark:border-brand-navy-800 py-1 z-20">
                      {extraLinks.map((link) => (
                        <NavLink
                          key={link.path}
                          to={link.path}
                          onClick={() => setMoreOpen(false)}
                          className={({ isActive }) =>
                            `block px-4 py-2 text-sm transition-colors ${
                              isActive
                                ? 'text-brand-electric-600 dark:text-brand-electric-300 bg-brand-electric-50/50 dark:bg-brand-electric-500/5 font-semibold'
                                : 'text-brand-navy-600 dark:text-brand-ash-300 hover:bg-brand-ash-50 dark:hover:bg-brand-navy-900'
                            }`
                          }
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

          {/* Right Utility Buttons (Socials, Language, Theme) */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Social Links */}
            <a
              href={store?.settings?.contact?.github || store?.personal?.github || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-brand-navy-600 dark:text-brand-ash-300 hover:text-brand-electric-600 hover:dark:text-brand-electric-300 rounded-md transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={store?.settings?.contact?.linkedin || store?.personal?.linkedin || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-brand-navy-600 dark:text-brand-ash-300 hover:text-brand-electric-600 hover:dark:text-brand-electric-300 rounded-md transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>

            <div className="h-4 w-px bg-brand-ash-200 dark:bg-brand-navy-800" />

            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-brand-ash-200 dark:border-brand-navy-800 hover:border-brand-electric-500/30 dark:hover:border-brand-electric-500/20 rounded-md text-xs font-semibold text-brand-navy-600 dark:text-brand-ash-300 hover:bg-brand-ash-50 dark:hover:bg-brand-navy-900 transition-all duration-200"
              aria-label={i18n.language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{i18n.language === 'es' ? 'EN' : 'ES'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 border border-brand-ash-200 dark:border-brand-navy-800 hover:border-brand-electric-500/30 dark:hover:border-brand-electric-500/20 rounded-md text-brand-navy-600 dark:text-brand-ash-300 hover:bg-brand-ash-50 dark:hover:bg-brand-navy-900 transition-all duration-200"
              aria-label={theme === 'dark' ? 'Activate Light Mode' : 'Activar Modo Oscuro'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* Lang Switcher (always visible on mobile header) */}
            <button
              onClick={toggleLang}
              className="p-2 border border-brand-ash-200 dark:border-brand-navy-800 rounded-md text-brand-navy-600 dark:text-brand-ash-300 text-xs font-bold flex items-center justify-center"
              aria-label="Toggle language"
            >
              {i18n.language === 'es' ? 'EN' : 'ES'}
            </button>

            {/* Theme Switcher (always visible on mobile header) */}
            <button
              onClick={toggleTheme}
              className="p-2 border border-brand-ash-200 dark:border-brand-navy-800 rounded-md text-brand-navy-600 dark:text-brand-ash-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-brand-navy-600 dark:text-brand-ash-300 hover:text-brand-electric-600 hover:dark:text-brand-electric-300 focus:outline-none"
              aria-expanded={isOpen}
              aria-label="Toggle main menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-brand-navy-950 border-b border-brand-ash-200 dark:border-brand-navy-800 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 max-h-[70vh] overflow-y-auto">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-md text-base font-semibold transition-all ${
                      isActive
                        ? 'text-brand-electric-600 dark:text-brand-electric-300 bg-brand-electric-50/50 dark:bg-brand-electric-500/5'
                        : 'text-brand-navy-600 dark:text-brand-ash-300 hover:text-brand-electric-600 hover:bg-brand-ash-50'
                    }`
                  }
                >
                  {link.labelKey ? t(link.labelKey) : link.name}
                </NavLink>
              ))}
              
              <div className="h-px bg-brand-ash-200 dark:bg-brand-navy-800 my-2" />

              <div className="flex items-center justify-around py-2">
                <a
                  href={store?.settings?.contact?.github || store?.personal?.github || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-brand-navy-600 dark:text-brand-ash-300 font-medium py-1.5 px-3 hover:bg-brand-ash-50 rounded"
                  aria-label="GitHub Link"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
                <a
                  href={store?.settings?.contact?.linkedin || store?.personal?.linkedin || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-brand-navy-600 dark:text-brand-ash-300 font-medium py-1.5 px-3 hover:bg-brand-ash-50 rounded"
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
