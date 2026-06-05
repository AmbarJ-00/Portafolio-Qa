import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, Zap, MessageSquare, Target, Terminal } from 'lucide-react';
import SEO from '../components/SEO.jsx';

const About = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <>
      <SEO 
        title={t('nav.about')} 
        description={t('about.subtitle')}
        path="/about"
      />

      <div className="space-y-16">
        {/* Title Block */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-display font-extrabold text-brand-navy-900 dark:text-white">
            {t('about.title')}
          </h1>
          <p className="text-lg text-brand-navy-600 dark:text-brand-ash-400">
            {t('about.subtitle')}
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-brand-electric-500 to-brand-lilac-500 rounded" />
        </div>

        {/* Narrative & Philosophy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Narrative (Left 2 cols) */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-6 text-base md:text-lg text-brand-navy-700 dark:text-brand-ash-300 leading-relaxed font-medium"
          >
            <motion.p variants={itemVariants}>
              {t('about.intro_1')}
            </motion.p>
            <motion.p variants={itemVariants}>
              {t('about.intro_2')}
            </motion.p>
            
            {/* Visual Callout block */}
            <motion.div 
              variants={itemVariants} 
              className="p-6 bg-brand-electric-500/5 dark:bg-brand-electric-500/10 border border-brand-electric-500/20 rounded-2xl flex gap-4 items-start"
            >
              <Terminal className="w-6 h-6 text-brand-electric-500 shrink-0 mt-1" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-brand-electric-600 dark:text-brand-electric-300 uppercase tracking-widest">
                  Misión Técnica
                </span>
                <p className="text-sm text-brand-navy-600 dark:text-brand-ash-400 leading-relaxed font-normal">
                  Reducir la ambigüedad en los requerimientos mediante testing en etapas tempranas (Shift-Left), automatizar regresiones y auditar la accesibilidad para garantizar un producto utilizable por todos.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Quick Pillars Sidebar (Right 1 col) */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-brand-navy-900 dark:text-white uppercase tracking-wider text-center lg:text-left">
              {t('about.values_title')}
            </h2>
            
            {[
              {
                icon: Shield,
                titleKey: 'about.value_1_title',
                descKey: 'about.value_1_desc',
                color: 'text-brand-electric-500',
                border: 'border-l-brand-electric-500'
              },
              {
                icon: Zap,
                titleKey: 'about.value_2_title',
                descKey: 'about.value_2_desc',
                color: 'text-brand-lilac-500',
                border: 'border-l-brand-lilac-500'
              },
              {
                icon: MessageSquare,
                titleKey: 'about.value_3_title',
                descKey: 'about.value_3_desc',
                color: 'text-emerald-500',
                border: 'border-l-emerald-500'
              }
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.section 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, type: "spring", stiffness: 80 }}
                  className={`glass-card p-5 rounded-xl border-l-4 ${pillar.border} space-y-2`}
                  aria-labelledby={`pillar-heading-${idx}`}
                >
                  <h3 id={`pillar-heading-${idx}`} className="text-sm font-bold text-brand-navy-950 dark:text-white flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${pillar.color}`} />
                    <span>{t(pillar.titleKey)}</span>
                  </h3>
                  <p className="text-xs text-brand-navy-600 dark:text-brand-ash-400 leading-relaxed">
                    {t(pillar.descKey)}
                  </p>
                </motion.section>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
};

export default About;
