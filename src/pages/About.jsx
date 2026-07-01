import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, Zap, MessageSquare, Target, Terminal } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import SEO from '../components/SEO.jsx';

const About = () => {
  const { t } = useTranslation();
  const { store } = usePortfolio();
  const { aboutItems = [] } = store;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  const activeAboutItems = aboutItems.filter((item) => item.status !== 'inactive');
  const leftItems   = activeAboutItems.filter((item) => item.position === 'left').sort((a, b) => a.priority - b.priority);
  const rightItems  = activeAboutItems.filter((item) => item.position === 'right').sort((a, b) => a.priority - b.priority);
  const centerItems = activeAboutItems.filter((item) => item.position === 'center' || !item.position).sort((a, b) => a.priority - b.priority);

  const icons = { pilar: Shield, mision: Target, filosofia: Zap, trayectoria: Terminal, valor: MessageSquare };

  const renderAboutItem = (item) => {
    const Icon = icons[item.type] || Terminal;

    if (item.behavior === 'badge') {
      return (
        <span
          key={item.id}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full"
          style={{ background: 'rgba(214,136,128,0.1)', color: 'var(--color-button)', border: '1px solid rgba(214,136,128,0.2)' }}
        >
          <Icon className="w-3.5 h-3.5 shrink-0" />
          <span>{item.title}</span>
        </span>
      );
    }

    if (item.behavior === 'block') {
      return (
        <div
          key={item.id}
          className="p-6 rounded-2xl flex gap-4 items-start"
          style={{ background: 'rgba(214,136,128,0.05)', border: '1px solid rgba(214,136,128,0.2)' }}
        >
          <Icon className="w-6 h-6 shrink-0 mt-1" style={{ color: 'var(--color-button)' }} />
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-widest block" style={{ color: 'var(--color-button)' }}>
              {item.title}
            </span>
            <p className="text-sm leading-relaxed font-normal" style={{ color: 'var(--color-muted)' }}>
              {item.description}
            </p>
          </div>
        </div>
      );
    }

    return (
      <section
        key={item.id}
        className="glass-card p-5 rounded-xl space-y-2.5 shadow-sm"
        style={{ borderLeft: '4px solid var(--color-button)' }}
      >
        <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <Icon className="w-4 h-4 shrink-0" style={{ color: 'var(--color-button)' }} />
          <span>{item.title}</span>
        </h3>
        <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-muted)' }}>
          {item.description}
        </p>
      </section>
    );
  };

  return (
    <>
      <SEO title={t('nav.about')} description={t('about.subtitle')} path="/about" />

      <div className="space-y-16">
        {/* Title Block */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-display font-extrabold" style={{ color: 'var(--color-text)' }}>
            {t('about.title')}
          </h1>
          <p className="text-lg" style={{ color: 'var(--color-muted)' }}>
            {t('about.subtitle')}
          </p>
          <div className="h-1 w-20 rounded" style={{ background: 'linear-gradient(to right, var(--color-button), var(--color-accent))' }} />
        </div>

        {/* Narrative & Philosophy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

          {/* Left narrative */}
          <motion.div
            variants={containerVariants} initial="hidden" animate="visible"
            className="lg:col-span-2 space-y-8 text-base md:text-lg leading-relaxed font-medium"
            style={{ color: 'var(--color-muted)' }}
          >
            <motion.p variants={itemVariants}>{t('about.intro_1')}</motion.p>
            <motion.p variants={itemVariants}>{t('about.intro_2')}</motion.p>

            {/* Callout block */}
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-2xl flex gap-4 items-start"
              style={{ background: 'rgba(214,136,128,0.05)', border: '1px solid rgba(214,136,128,0.2)' }}
            >
              <Terminal className="w-6 h-6 shrink-0 mt-1" style={{ color: 'var(--color-button)' }} />
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest block" style={{ color: 'var(--color-button)' }}>
                  Misión Técnica
                </span>
                <p className="text-sm leading-relaxed font-normal mt-1" style={{ color: 'var(--color-muted)' }}>
                  Reducir la ambigüedad en los requerimientos mediante testing en etapas tempranas (Shift-Left), automatizar regresiones y auditar la accesibilidad para garantizar un producto utilizable por todos.
                </p>
              </div>
            </motion.div>

            {leftItems.length > 0 && (
              <motion.div variants={itemVariants} className="space-y-6 pt-4">
                {leftItems.map((item) => renderAboutItem(item))}
              </motion.div>
            )}
          </motion.div>

          {/* Pillars sidebar */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-wider text-center lg:text-left" style={{ color: 'var(--color-text)' }}>
              {t('about.values_title')}
            </h2>

            {[
              { icon: Shield,       titleKey: 'about.value_1_title', descKey: 'about.value_1_desc' },
              { icon: Zap,          titleKey: 'about.value_2_title', descKey: 'about.value_2_desc' },
              { icon: MessageSquare,titleKey: 'about.value_3_title', descKey: 'about.value_3_desc' }
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.section
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, type: 'spring', stiffness: 80 }}
                  className="glass-card p-5 rounded-xl space-y-2"
                  style={{ borderLeft: '4px solid var(--color-button)' }}
                  aria-labelledby={`pillar-heading-${idx}`}
                >
                  <h3 id={`pillar-heading-${idx}`} className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                    <Icon className="w-4 h-4" style={{ color: 'var(--color-button)' }} />
                    <span>{t(pillar.titleKey)}</span>
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                    {t(pillar.descKey)}
                  </p>
                </motion.section>
              );
            })}

            {rightItems.length > 0 && (
              <div className="space-y-4 pt-4">
                {rightItems.map((item) => renderAboutItem(item))}
              </div>
            )}
          </div>
        </div>

        {/* Center items */}
        {centerItems.length > 0 && (
          <div className="pt-12 space-y-8" style={{ borderTop: '1px solid var(--color-border)' }}>
            <h2 className="text-2xl font-display font-extrabold" style={{ color: 'var(--color-text)' }}>
              Aspectos Destacados Adicionales
            </h2>
            {centerItems.some((item) => item.behavior === 'badge') && (
              <div className="flex flex-wrap gap-3">
                {centerItems.filter((item) => item.behavior === 'badge').map((item) => renderAboutItem(item))}
              </div>
            )}
            {centerItems.some((item) => item.behavior !== 'badge') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {centerItems.filter((item) => item.behavior !== 'badge').map((item) => renderAboutItem(item))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default About;
