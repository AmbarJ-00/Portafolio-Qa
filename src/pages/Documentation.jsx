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

  const resolveField = (directValue, translationKey) => {
    if (directValue && typeof directValue === 'string') return directValue;
    if (translationKey) return t(translationKey);
    return '';
  };

  const copyToClipboard = (template) => {
    const title = resolveField(template.title, template.titleKey);
    const desc  = resolveField(template.template, template.descriptionKey);
    const method = resolveField(template.methodology, template.methodologyKey);
    const category = resolveField(template.category, template.categoryKey) || 'QA Template';
    const type = resolveField(template.type, template.typeKey) || 'Artifact';
    const params      = (template.parameters || []).map((p) => `- ${p}`).join('\n');
    const questions   = (template.questions  || []).map((q) => `- ${q}`).join('\n');
    const checklistStr = (template.checklist || []).map((c) => `- ${c}`).join('\n');
    const strategiesStr= (template.strategies|| []).map((s) => `- ${s}`).join('\n');

    const content = `# ${title}\n\n## Category: ${category} | Type: ${type}\n\n## Description\n${desc}\n\n## Methodology\n${method}\n\n## Structure Parameters\n${params}\n\n## Strategies\n${strategiesStr}\n\n## Checklist\n${checklistStr}\n\n## Audit Questions\n${questions}`;

    navigator.clipboard.writeText(content).then(() => {
      setCopiedId(template.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } }
  };

  const dotStyle = (color) => ({
    width: '6px', height: '6px', borderRadius: '50%',
    background: color || 'var(--color-button)', flexShrink: 0
  });

  return (
    <>
      <SEO title={t('nav.documentation')} description={t('documentation.subtitle')} path="/documentation" />

      <div className="space-y-12">
        {/* Title Block */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-display font-extrabold" style={{ color: 'var(--color-text)' }}>
            {t('documentation.title')}
          </h1>
          <p className="text-lg" style={{ color: 'var(--color-muted)' }}>
            {t('documentation.subtitle')}
          </p>
          <div className="h-1 w-20 rounded" style={{ background: 'linear-gradient(to right, var(--color-button), var(--color-accent))' }} />
        </div>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-base leading-relaxed max-w-4xl"
          style={{ color: 'var(--color-muted)' }}
        >
          {t(store.documentation.methodsKey)}
        </motion.p>

        {/* Templates */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-10">
          {store.documentation.templates.map((template) => {
            const title      = resolveField(template.title, template.titleKey);
            const desc       = resolveField(template.template, template.descriptionKey);
            const method     = resolveField(template.methodology, template.methodologyKey);
            const category   = resolveField(template.category, template.categoryKey) || 'QA Template';
            const type       = resolveField(template.type, template.typeKey) || 'Artifact';
            const parameters = template.parameters || [];
            const questions  = template.questions  || [];
            const checklist  = template.checklist  || [];
            const strategies = template.strategies || [];
            const isCopied   = copiedId === template.id;

            return (
              <motion.section
                key={template.id}
                variants={cardVariants}
                className="glass-card rounded-2xl p-6 md:p-8 space-y-6 shadow-sm relative group"
                style={{ border: '1px solid var(--color-border)' }}
                aria-labelledby={`heading-${template.id}`}
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(214,136,128,0.1)', color: 'var(--color-button)' }}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 id={`heading-${template.id}`} className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                        {title}
                      </h2>
                      <span className="text-[10px] font-bold uppercase tracking-widest block mt-0.5" style={{ color: 'var(--color-accent)' }}>
                        {category}{type ? ` | ${type}` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => copyToClipboard(template)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300"
                    style={isCopied
                      ? { background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }
                      : { background: 'var(--color-button)', color: '#fff', border: '1px solid transparent' }
                    }
                    aria-label={`Copy template ${title} to clipboard`}
                  >
                    {isCopied ? (
                      <><CheckCircle className="w-3.5 h-3.5" /><span>{t('cta.template_copied')}</span></>
                    ) : (
                      <><Clipboard className="w-3.5 h-3.5" /><span>{t('cta.copy_template')}</span></>
                    )}
                  </button>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left 2 cols */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
                        Descripción del Artefacto
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{desc}</p>
                    </div>

                    {method && (
                      <div className="space-y-3 p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)' }}>
                        <h4 className="text-xs font-bold flex items-center gap-2 uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
                          <Layers className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                          <span>{t('documentation.methodology')}</span>
                        </h4>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>{method}</p>
                      </div>
                    )}
                  </div>

                  {/* Right col */}
                  <div className="space-y-6">
                    {parameters.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
                          <Settings className="w-3.5 h-3.5" style={{ color: 'var(--color-button)' }} />
                          <span>{t('documentation.parameters')}</span>
                        </h3>
                        <ul className="space-y-1.5 text-xs" style={{ color: 'var(--color-muted)' }}>
                          {parameters.map((param, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span style={dotStyle('var(--color-button)')} />
                              <span>{param}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {strategies.length > 0 && (
                      <div className="space-y-3 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                        <h3 className="text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
                          <Layers className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
                          <span>Estrategias</span>
                        </h3>
                        <ul className="space-y-1.5 text-xs" style={{ color: 'var(--color-muted)' }}>
                          {strategies.map((strategy, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span style={dotStyle('var(--color-accent)')} />
                              <span>{strategy}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {checklist.length > 0 && (
                      <div className="space-y-3 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                        <h3 className="text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Checklist</span>
                        </h3>
                        <ul className="space-y-1.5 text-xs" style={{ color: 'var(--color-muted)' }}>
                          {checklist.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span style={dotStyle('#10b981')} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {questions.length > 0 && (
                      <div className="space-y-3 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                        <h3 className="text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
                          <HelpCircle className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
                          <span>{t('documentation.questions')}</span>
                        </h3>
                        <ul className="space-y-2 text-xs" style={{ color: 'var(--color-muted)' }}>
                          {questions.map((question, idx) => (
                            <li key={idx} className="flex gap-2 items-start">
                              <span className="font-bold shrink-0" style={{ color: 'var(--color-accent)' }}>?</span>
                              <span className="italic leading-normal">{question}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
