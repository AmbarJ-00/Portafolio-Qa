import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Award, BookOpen, Maximize2, ExternalLink, X, Settings } from 'lucide-react';
import SEO from '../components/SEO.jsx';
import StatusCard from '../components/StatusCard.jsx';

const Certifications = () => {
  const { t } = useTranslation();
  const { store } = usePortfolio();
  const [expandedImage, setExpandedImage] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } }
  };

  const visibleCertifications = store.certifications.filter(
    (cert) => cert.status !== 'inactive' && cert.status !== 'Inactivo'
  );

  return (
    <>
      <SEO title={t('nav.certifications')} description={t('certifications.subtitle')} path="/certifications" />

      <div className="space-y-12">
        {/* Title Block */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-display font-extrabold" style={{ color: 'var(--color-text)' }}>
            {t('certifications.title')}
          </h1>
          <p className="text-lg" style={{ color: 'var(--color-muted)' }}>
            {t('certifications.subtitle')}
          </p>
          <div className="h-1 w-20 rounded" style={{ background: 'linear-gradient(to right, var(--color-button), var(--color-accent))' }} />
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants} initial="hidden" animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {visibleCertifications.map((cert) => {
            const title = cert.titleKey ? t(cert.titleKey) : cert.title;
            const desc  = cert.summary || (cert.translationKey ? t(`${cert.translationKey}.desc`) : '');

            return (
              <StatusCard key={cert.id} status={cert.status} type="certification">
                <motion.div
                  variants={itemVariants}
                  className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between relative shadow-sm h-full"
                  style={{ border: '1px solid var(--color-border)' }}
                >
                  {/* Image Frame */}
                  {cert.image && (
                    <div className="relative h-48 w-full overflow-hidden group" style={{ background: 'var(--bg-card)' }}>
                      <img
                        src={cert.image}
                        alt={`Credential for ${title}`}
                        className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300"
                        style={{ background: 'rgba(0,0,0,0.6)' }}>
                        <button
                          onClick={() => setExpandedImage(cert)}
                          className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-lg transition-colors"
                          title="Expand Image"
                        >
                          <Maximize2 className="w-5 h-5" />
                        </button>
                        <a
                          href={cert.image} target="_blank" rel="noopener noreferrer"
                          className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-lg transition-colors"
                          title="Open in new tab"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 space-y-5 flex-grow">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold uppercase tracking-wider block" style={{ color: 'var(--color-button)' }}>
                        {cert.authority}
                      </span>
                      <h2 className="text-lg md:text-xl font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
                        {title}
                      </h2>
                    </div>

                    <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--color-muted)' }}>
                      {desc}
                    </p>

                    <div className="h-px" style={{ background: 'var(--color-border)' }} />

                    {/* Tools & Integrations */}
                    <div className="grid grid-cols-2 gap-4">
                      {cert.tools && cert.tools.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                            <BookOpen className="w-4 h-4" style={{ color: 'var(--color-button)' }} />
                            <span>{t('certifications.tools_learned')}</span>
                          </h3>
                          <ul className="space-y-1.5 text-xs" style={{ color: 'var(--color-muted)' }}>
                            {cert.tools.slice(0, 3).map((tool, idx) => (
                              <li key={idx} className="truncate flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full shrink-0" style={{ background: 'var(--color-muted)' }} />
                                <span className="truncate">{tool}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {cert.integrations && cert.integrations.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                            <Settings className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                            <span>{t('certifications.integrations_learned')}</span>
                          </h3>
                          <ul className="space-y-1.5 text-xs" style={{ color: 'var(--color-muted)' }}>
                            {cert.integrations.slice(0, 3).map((item, idx) => (
                              <li key={idx} className="truncate flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full shrink-0" style={{ background: 'var(--color-muted)' }} />
                                <span className="truncate">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div className="h-1 w-full" style={{ background: 'var(--color-border)' }} />
                </motion.div>
              </StatusCard>
            );
          })}
        </motion.div>

        {/* Image Modal */}
        <AnimatePresence>
          {expandedImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
              style={{ background: 'rgba(0,0,0,0.85)' }}
              role="dialog" aria-modal="true"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl"
                style={{ background: 'var(--bg-global)', border: '1px solid var(--color-border)' }}
              >
                {/* Modal Header */}
                <div className="p-4 flex justify-between items-center" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--color-border)' }}>
                  <h2 className="text-base font-bold truncate" style={{ color: 'var(--color-text)' }}>
                    {expandedImage.titleKey ? t(expandedImage.titleKey) : expandedImage.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <a
                      href={expandedImage.image} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: 'var(--color-muted)' }}
                      title="Open full size in new tab"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => setExpandedImage(null)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: 'var(--color-muted)' }}
                      aria-label="Close image viewer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {/* Modal Body */}
                <div className="p-2 flex justify-center items-center" style={{ background: '#000' }}>
                  <img
                    src={expandedImage.image}
                    alt={expandedImage.titleKey ? t(expandedImage.titleKey) : expandedImage.title}
                    className="max-h-[70vh] max-w-full object-contain"
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Certifications;
