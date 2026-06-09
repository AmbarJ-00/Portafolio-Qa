import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { FileText, Clipboard, CheckCircle, HelpCircle, Layers, Settings } from 'lucide-react';
import SEO from '../components/SEO.jsx';

const Documentation = () => {
  const { t } = useTranslation();
  const { store } = usePortfolio();
  const [copiedId, setCopiedId] = useState(null);

  // Resolve display value: prefer direct string, fall back to i18n key
  const resolveField = (directValue, translationKey) => {
    if (directValue && typeof directValue === 'string') return directValue;
    if (translationKey) return t(translationKey);
    return '';
  };

  const copyToClipboard = (template) => {
    // Generate a clean markdown string representation of the template
    const title = resolveField(template.title, template.titleKey);
    const desc = resolveField(template.description, template.descriptionKey);
    const method = resolveField(template.methodology, template.methodologyKey);
    const params = (template.parameters || []).map((p) => `- ${p}`).join('\n');
    const questions = (template.questions || []).map((q) => `- ${q}`).join('\n');

    const content = `# ${title}\n\n## Description\n${desc}\n\n## Methodology\n${method}\n\n## Structure Parameters\n${params}\n\n## Audit Questions\n${questions}`;

    navigator.clipboard.writeText(content).then(() => {
      setCopiedId(template.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
  };

  return (
    <>
      <SEO 
        title={t('nav.documentation')} 
        description={t('documentation.subtitle')}
        path="/documentation"
      />

      <div className="space-y-12">
        {/* Title Block */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-display font-extrabold text-brand-navy-900 dark:text-white">
            {t('documentation.title')}
          </h1>
          <p className="text-lg text-brand-navy-600 dark:text-brand-ash-400">
            {t('documentation.subtitle')}
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-brand-electric-500 to-brand-lilac-500 rounded" />
        </div>

        {/* Introduction */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-base text-brand-navy-700 dark:text-brand-ash-300 leading-relaxed max-w-4xl"
        >
          {t(store.documentation.methodsKey)}
        </motion.p>

        {/* Templates List */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >
          {store.documentation.templates.map((template) => {
            const title = t(template.titleKey);
            const desc = t(template.descriptionKey);
            const method = t(template.methodologyKey);
            const isCopied = copiedId === template.id;

            return (
              <motion.section
                key={template.id}
                variants={cardVariants}
                className="glass-card rounded-2xl p-6 md:p-8 space-y-6 shadow-sm border border-brand-ash-200/60 dark:border-brand-navy-800/40 relative group"
                aria-labelledby={`heading-${template.id}`}
              >
                {/* Header info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-ash-200 dark:border-brand-navy-800 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-brand-electric-500/10 dark:bg-brand-electric-500/20 text-brand-electric-500 rounded-xl">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 id={`heading-${template.id}`} className="text-xl md:text-2xl font-bold text-brand-navy-900 dark:text-white">
                        {title}
                      </h2>
                      <span className="text-xxs font-bold text-brand-lilac-500 uppercase tracking-widest block mt-0.5">
                        QA Artifact Template
                      </span>
                    </div>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => copyToClipboard(template)}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                      isCopied
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-brand-navy-800 text-white dark:bg-brand-navy-900 hover:opacity-90 border border-transparent shadow'
                    }`}
                    aria-label={`Copy template ${title} to clipboard`}
                  >
                    {isCopied ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{t('cta.template_copied')}</span>
                      </>
                    ) : (
                      <>
                        <Clipboard className="w-3.5 h-3.5" />
                        <span>{t('cta.copy_template')}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Body details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* General details and methodology (Left 2 cols) */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-brand-navy-800 dark:text-white uppercase tracking-wider">
                        Descripción del Artefacto
                      </h3>
                      <p className="text-sm text-brand-navy-600 dark:text-brand-ash-400 leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    <div className="space-y-3 bg-brand-ash-100/50 dark:bg-brand-navy-900/30 p-5 rounded-xl border border-brand-ash-200/40 dark:border-brand-navy-800/40">
                      <h4 className="text-xs font-bold text-brand-navy-800 dark:text-white flex items-center gap-2 uppercase tracking-wider">
                        <Layers className="w-4 h-4 text-brand-lilac-500" />
                        <span>{t('documentation.methodology')}</span>
                      </h4>
                      <p className="text-xs text-brand-navy-600 dark:text-brand-ash-300 leading-relaxed">
                        {method}
                      </p>
                    </div>
                  </div>

                  {/* Schema parameters (Right 1 col) */}
                  <div className="space-y-6">
                    {/* Structure parameters */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-brand-navy-800 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                        <Settings className="w-3.5 h-3.5 text-brand-electric-500" />
                        <span>{t('documentation.parameters')}</span>
                      </h3>
                      <ul className="space-y-1.5 text-xs text-brand-navy-600 dark:text-brand-ash-400">
                        {template.parameters.map((param, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-electric-500" />
                            <span>{param}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Requirement analysis questions */}
                    <div className="space-y-3 border-t border-brand-ash-200/60 dark:border-brand-navy-800/40 pt-4">
                      <h3 className="text-xs font-bold text-brand-navy-800 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                        <HelpCircle className="w-3.5 h-3.5 text-brand-lilac-500" />
                        <span>{t('documentation.questions')}</span>
                      </h3>
                      <ul className="space-y-2 text-xs text-brand-navy-600 dark:text-brand-ash-400">
                        {template.questions.map((question, idx) => (
                          <li key={idx} className="flex gap-2 items-start">
                            <span className="text-brand-lilac-500 font-bold shrink-0">?</span>
                            <span className="italic leading-normal">{question}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.section>
            );
          })}
        </motion.div>
      </div>
    </>
  );
};

export default Documentation;
