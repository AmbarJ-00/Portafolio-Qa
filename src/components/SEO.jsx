import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SEO = ({ title, description, path = "" }) => {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    // 1. Update Title tag
    const baseTitle = "Ambar Ramon | QA Lead";
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const defaultDesc = "Professional QA Lead & Quality Advocate Portfolio. Test strategies, API automation, CI/CD integrations, and WCAG accessibility audits.";
    metaDesc.setAttribute('content', description || defaultDesc);

    // 3. Update HTML lang tag
    document.documentElement.lang = i18n.language || 'es';

    // 4. Update OpenGraph and Twitter Meta Tags
    const ogTags = {
      'og:title': title ? `${title} | ${baseTitle}` : baseTitle,
      'og:description': description || defaultDesc,
      'og:url': `https://qa-portfolio.vercel.app${path}`,
      'twitter:title': title ? `${title} | ${baseTitle}` : baseTitle,
      'twitter:description': description || defaultDesc,
    };

    Object.entries(ogTags).forEach(([property, value]) => {
      let element = document.querySelector(`meta[property="${property}"]`) || 
                    document.querySelector(`meta[name="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        if (property.startsWith('og:')) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', property);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    });

  }, [title, description, path, i18n.language]);

  return null; // Side-effect only component
};

export default SEO;
