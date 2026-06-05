import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { es } from './data/translations/es.js';
import { en } from './data/translations/en.js';

// Get saved language or fallback to Spanish
const savedLanguage = localStorage.getItem('portfolio-lang') || 'es';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: es
      },
      en: {
        translation: en
      }
    },
    lng: savedLanguage,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false // React already escapes values to prevent XSS
    }
  });

// Set HTML lang attribute on init
document.documentElement.lang = savedLanguage;

export default i18n;
