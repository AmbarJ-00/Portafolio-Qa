import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { ShieldAlert } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const { store } = usePortfolio();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="py-8 transition-colors duration-300"
      style={{
        background: 'var(--color-footer)',
        borderTop: '1px solid var(--color-border)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              © {currentYear} {store?.personal?.name || 'Ambar Ramon'}. {t('footer.rights')}
            </p>
            <p className="text-xs mt-1 flex items-center gap-1 justify-center md:justify-start" style={{ color: 'var(--color-muted)' }}>
              <ShieldAlert className="w-3.5 h-3.5" style={{ color: 'var(--color-button)' }} />
              <span>{t('footer.design')}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
