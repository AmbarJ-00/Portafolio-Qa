import React from 'react';
import { useTranslation } from 'react-i18next';
import { portfolioConfig } from '../data/portfolioData.js';
import { Github, Linkedin, ShieldAlert } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-brand-navy-950 border-t border-brand-ash-200/50 dark:border-brand-navy-800/30 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand/Rights */}
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold text-brand-navy-800 dark:text-white">
              © {currentYear} {portfolioConfig.personal.name}. {t('footer.rights')}
            </p>
            <p className="text-xs text-brand-navy-500 dark:text-brand-ash-400 mt-1 flex items-center gap-1 justify-center md:justify-start">
              <ShieldAlert className="w-3.5 h-3.5 text-brand-electric-500" />
              <span>{t('footer.design')}</span>
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a
              href={portfolioConfig.personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-brand-ash-100 dark:bg-brand-navy-900 text-brand-navy-600 dark:text-brand-ash-300 hover:text-brand-electric-500 hover:dark:text-brand-electric-300 rounded-full transition-all duration-200"
              aria-label="GitHub Account"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={portfolioConfig.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-brand-ash-100 dark:bg-brand-navy-900 text-brand-navy-600 dark:text-brand-ash-300 hover:text-brand-electric-500 hover:dark:text-brand-electric-300 rounded-full transition-all duration-200"
              aria-label="LinkedIn Account"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
