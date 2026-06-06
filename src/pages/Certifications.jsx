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
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
  };

  const visibleCertifications = store.certifications.filter(
    (cert) => cert.status !== 'inactive' && cert.status !== 'Inactivo'
  );

  return (
    <>
      <SEO 
        title={t('nav.certifications')} 
        description={t('certifications.subtitle')}
        path="/certifications"
      />

      <div className="space-y-12">
        {/* Title Block */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-display font-extrabold text-brand-navy-900 dark:text-white">
            {t('certifications.title')}
          </h1>
          <p className="text-lg text-brand-navy-600 dark:text-brand-ash-400">
            {t('certifications.subtitle')}
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-brand-electric-500 to-brand-lilac-500 dark:from-brand-lilac-600 dark:to-brand-lilac-300 rounded" />
        </div>

        {/* Certifications Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {visibleCertifications.map((cert) => {
            const title = cert.titleKey ? t(cert.titleKey) : cert.title;
            const desc = cert.summary || (cert.translationKey ? t(`${cert.translationKey}.desc`) : '');

            return (
              <StatusCard key={cert.id} status={cert.status} type="certification">
                <motion.div
                  variants={itemVariants}
                  className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between border border-brand-ash-200/50 dark:border-brand-navy-800/40 relative shadow-sm h-full"
                >
                  {/* Certificate Image Frame */}
                  {cert.image && (
                    <div className="relative h-48 w-full overflow-hidden bg-brand-navy-900 group">
                      <img 
                        src={cert.image} 
                        alt={`Credential for ${title}`} 
                        className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {/* Hover overlay utility */}
                      <div className="absolute inset-0 bg-brand-navy-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300">
                        <button
                          onClick={() => setExpandedImage(cert)}
                          className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-lg transition-colors"
                          title="Expand Image"
                        >
                          <Maximize2 className="w-5 h-5" />
                        </button>
                        <a
                          href={cert.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-lg transition-colors"
                          title="Open Image in new tab"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 space-y-5 flex-grow">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-brand-electric-500 dark:text-brand-lilac-400 uppercase tracking-wider block">
                        {cert.authority}
                      </span>
                      <h2 className="text-lg md:text-xl font-bold text-brand-navy-900 dark:text-white leading-tight">
                        {title}
                      </h2>
                    </div>

                    <p className="text-sm text-brand-navy-600 dark:text-brand-ash-300 leading-relaxed line-clamp-3">
                      {desc}
                    </p>

                    <div className="h-px bg-brand-ash-200/60 dark:bg-brand-navy-800/40" />

                    {/* Syllabus / Tools Learned */}
                    <div className="grid grid-cols-2 gap-4">
                      {cert.tools && cert.tools.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-bold text-brand-navy-850 dark:text-brand-ash-200 uppercase tracking-wider flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-brand-electric-500 dark:text-brand-lilac-400" />
                            <span>{t('certifications.tools_learned')}</span>
                          </h3>
                          <ul className="space-y-1.5 text-xs text-brand-navy-600 dark:text-brand-ash-400">
                            {cert.tools.slice(0, 3).map((tool, idx) => (
                              <li key={idx} className="truncate flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-brand-navy-450 dark:bg-brand-navy-600 shrink-0" />
                                <span className="truncate">{tool}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {cert.integrations && cert.integrations.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-bold text-brand-navy-850 dark:text-brand-ash-200 uppercase tracking-wider flex items-center gap-2">
                            <Settings className="w-4 h-4 text-brand-lilac-500" />
                            <span>{t('certifications.integrations_learned')}</span>
                          </h3>
                          <ul className="space-y-1.5 text-xs text-brand-navy-600 dark:text-brand-ash-400">
                            {cert.integrations.slice(0, 3).map((item, idx) => (
                              <li key={idx} className="truncate flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-brand-navy-450 dark:bg-brand-navy-600 shrink-0" />
                                <span className="truncate">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Decorative Bottom Line */}
                  <div className="h-1 w-full bg-brand-ash-200 dark:bg-brand-navy-900" />
                </motion.div>
              </StatusCard>
            );
          })}
        </motion.div>

        {/* Expanded Image Overlay Modal */}
        <AnimatePresence>
          {expandedImage && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy-950/90 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-4xl w-full bg-white dark:bg-brand-navy-950 rounded-2xl overflow-hidden shadow-2xl border border-brand-ash-200/50 dark:border-brand-navy-800/40"
              >
                {/* Modal Header */}
                <div className="p-4 border-b border-brand-ash-200 dark:border-brand-navy-800 flex justify-between items-center bg-brand-ash-100/50 dark:bg-brand-navy-900/50">
                  <h2 className="text-base font-bold text-brand-navy-900 dark:text-white truncate">
                    {expandedImage.titleKey ? t(expandedImage.titleKey) : expandedImage.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <a 
                      href={expandedImage.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 hover:bg-brand-ash-200 dark:hover:bg-brand-navy-800 rounded-lg text-brand-navy-600 dark:text-brand-ash-400"
                      title="Open full size in new tab"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => setExpandedImage(null)}
                      className="p-1.5 hover:bg-brand-ash-200 dark:hover:bg-brand-navy-800 rounded-lg text-brand-navy-600 dark:text-brand-ash-400"
                      aria-label="Close image viewer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {/* Modal Body */}
                <div className="p-2 flex justify-center items-center bg-brand-navy-950">
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
