import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { ShieldCheck, Award, ArrowRight, ChevronRight, Terminal, Cpu, Layers, Activity } from 'lucide-react';
import { GiAlienBug } from 'react-icons/gi';
import SEO from '../components/SEO.jsx';

const Home = () => {
  const { t } = useTranslation();
  const { store } = usePortfolio();
  const personal = store.personal;

  const heroBadge    = personal.heroBadge    || t('home.hero_badge');
  const heroHeadline = personal.heroHeadline || t('home.hero_title');
  const role         = personal.role         || t(personal.roleKey);
  const tagline      = personal.tagline      || t(personal.taglineKey);

  const activeProjects = store.projects.filter(
    (p) => p.status !== 'inactive' && p.status !== 'Inactivo'
  );

  let bugsVal = '230+', coverageVal = '94%', projectsVal = '15+';
  if (activeProjects.length > 0) {
    const totalBugs = activeProjects.reduce((acc, p) => {
      return acc + Number(p.metrics?.findingsCritical || 0) + Number(p.metrics?.bugsResolved || 0) * 0.3;
    }, 0);
    bugsVal = Math.round(totalBugs);
    const totalCoverage = activeProjects.reduce((acc, p) => acc + Number(p.metrics?.coverage || 0), 0);
    coverageVal = `${Math.round(totalCoverage / activeProjects.length)}%`;
    projectsVal = activeProjects.length;
  }

  const activeHeroCards = (store.heroCards || [])
    .filter((c) => c.status !== 'inactive' && c.status !== 'Inactivo')
    .sort((a, b) => a.priority - b.priority);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <>
      <SEO title={t('nav.home')} description={t('personal.tagline')} path="/" />

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-16">

        {/* HERO SECTION */}
        <section className="relative min-h-[70vh] flex flex-col justify-center py-12 md:py-20 overflow-hidden" aria-labelledby="hero-heading">
          {/* Ambient orbs */}
          <div className="absolute top-1/4 left-[10%] w-72 h-72 rounded-full blur-3xl -z-10 animate-pulse-subtle"
            style={{ background: 'rgba(214,136,128,0.08)' }} />
          <div className="absolute bottom-1/4 right-[10%] w-96 h-96 rounded-full blur-3xl -z-10"
            style={{ background: 'rgba(202,164,110,0.06)' }} />

          <div className="space-y-6 max-w-4xl">
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full"
              style={{
                background: 'rgba(214,136,128,0.1)',
                color: 'var(--color-button)',
                border: '1px solid rgba(214,136,128,0.2)'
              }}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{heroBadge}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              id="hero-heading"
              className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight leading-none"
            >
              <span style={{ color: 'var(--color-text)' }}>{heroHeadline}</span>
              <br />
              <span style={{
                background: 'linear-gradient(to right, var(--color-text), var(--color-button), var(--color-accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {personal.name}
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl font-medium max-w-2xl leading-relaxed" style={{ color: 'var(--color-text)' }}>
              {role}
            </motion.p>
            <motion.p variants={itemVariants} className="text-base md:text-lg max-w-3xl leading-relaxed" style={{ color: 'var(--color-muted)' }}>
              {tagline}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-white font-semibold rounded-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 hover:opacity-90"
                style={{ background: 'linear-gradient(to right, var(--color-text), var(--color-button))' }}
              >
                <span>{t('cta.view_projects')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/documentation"
                className="glass-card glass-card-hover inline-flex items-center gap-2 px-6 py-3.5 font-semibold rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                style={{ color: 'var(--color-text)' }}
              >
                <span>{t('cta.view_docs')}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Hero Cards */}
            {activeHeroCards.length > 0 && (
              <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
                {activeHeroCards.map((card) => {
                  const iconsMap = { ShieldCheck, Terminal, Award, Cpu, Layers, Activity };
                  const CardIcon = iconsMap[card.icon] || ShieldCheck;
                  return (
                    <motion.div
                      key={card.id}
                      variants={itemVariants}
                      className="glass-card p-5 rounded-2xl flex items-start gap-4 hover:scale-[1.01] transition-transform duration-200 shadow-sm"
                      style={{ border: '1px solid var(--color-border)' }}
                    >
                      <div className="p-2.5 rounded-xl shrink-0" style={{ background: 'rgba(214,136,128,0.1)', color: 'var(--color-button)' }}>
                        <CardIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>{card.title}</h4>
                        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--color-muted)' }}>{card.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* METRICS SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-label="QA Metrics Summary">
          {[
            { icon: GiAlienBug,   value: bugsVal,      labelKey: 'home.stat_bugs' },
            { icon: ShieldCheck,  value: coverageVal,  labelKey: 'home.stat_coverage' },
            { icon: Award,        value: projectsVal,  labelKey: 'home.stat_projects' }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="glass-card p-6 rounded-xl flex items-center gap-5 hover:scale-[1.01] transition-transform duration-200 shadow-sm"
                style={{ borderLeft: '4px solid var(--color-button)' }}
              >
                <div className="p-3 rounded-lg" style={{ background: 'rgba(214,136,128,0.1)', color: 'var(--color-button)' }}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-display font-extrabold" style={{ color: 'var(--color-text)' }}>{stat.value}</div>
                  <div className="text-sm font-semibold mt-0.5" style={{ color: 'var(--color-muted)' }}>{t(stat.labelKey)}</div>
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* PHILOSOPHY SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-8" aria-labelledby="philosophy-heading">
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 id="philosophy-heading" className="text-3xl md:text-4xl font-display font-bold" style={{ color: 'var(--color-text)' }}>
              {t('home.philosophy_title')}
            </h2>
            <p className="leading-relaxed text-lg" style={{ color: 'var(--color-muted)' }}>
              {t('home.philosophy_desc')}
            </p>
            <div className="h-1 w-20 rounded" style={{ background: 'linear-gradient(to right, var(--color-button), var(--color-accent))' }} />
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-8 rounded-2xl space-y-6" style={{ border: '1px solid var(--color-border)' }}>
            <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <Terminal className="w-5 h-5" style={{ color: 'var(--color-button)' }} />
              <span>{t('home.highlight_title')}</span>
            </h3>
            <ul className="space-y-4 text-sm">
              {['home.highlight_desc_1', 'home.highlight_desc_2', 'home.highlight_desc_3'].map((key, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <span
                    className="w-5 h-5 mt-0.5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: 'rgba(214,136,128,0.1)',
                      border: '1px solid rgba(214,136,128,0.25)',
                      color: 'var(--color-button)'
                    }}
                  >
                    {index + 1}
                  </span>
                  <span className="leading-relaxed font-medium" style={{ color: 'var(--color-muted)' }}>{t(key)}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </section>
      </motion.div>
    </>
  );
};

export default Home;
