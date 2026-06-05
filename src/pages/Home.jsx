import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { portfolioConfig } from '../data/portfolioData.js';
import { ShieldCheck, Award, ArrowRight, ChevronRight, Terminal } from 'lucide-react';
import { GiAlienBug } from "react-icons/gi";
import SEO from '../components/SEO.jsx';

const Home = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <>
      <SEO 
        title={t('nav.home')} 
        description={t('personal.tagline')}
        path="/"
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-16"
      >
        {/* HERO SECTION */}
        <section className="relative min-h-[70vh] flex flex-col justify-center py-12 md:py-20 overflow-hidden" aria-labelledby="hero-heading">
          {/* Subtle background decoration (glowing gradients) */}
          <div className="absolute top-1/4 left-1/10 w-72 h-72 rounded-full bg-brand-electric-500/10 dark:bg-brand-lilac-500/10 blur-3xl -z-10 animate-pulse-subtle" />
          <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-brand-lilac-500/10 blur-3xl -z-10" />

          <div className="space-y-6 max-w-4xl">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 bg-brand-electric-500/10 dark:bg-brand-lilac-500/20 text-brand-electric-600 dark:text-brand-lilac-300 text-xs font-bold uppercase tracking-widest rounded-full border border-brand-electric-500/20 dark:border-brand-lilac-500/20">
              <Terminal className="w-3.5 h-3.5" />
              <span>{t('home.hero_badge')}</span>
            </motion.div>

            <motion.h1 
              variants={itemVariants} 
              id="hero-heading"
              className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight leading-none"
            >
              <span className="text-brand-navy-900 dark:text-brand-ash-100">{t('home.hero_title')}</span>
              <br />
              <span className="bg-gradient-to-r from-brand-navy-800 via-brand-electric-500 to-brand-lilac-500 dark:from-brand-lilac-400 dark:via-brand-lilac-500 dark:to-brand-lilac-300 bg-clip-text text-transparent">
                {portfolioConfig.personal.name}
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl font-medium text-brand-navy-700 dark:text-brand-ash-300 max-w-2xl leading-relaxed"
            >
              {t(portfolioConfig.personal.roleKey)}
            </motion.p>

            <motion.p 
              variants={itemVariants}
              className="text-base md:text-lg text-brand-navy-600 dark:text-brand-ash-400 max-w-3xl leading-relaxed"
            >
              {t(portfolioConfig.personal.taglineKey)}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-brand-navy-800 to-brand-navy-900 dark:from-brand-lilac-600 dark:to-brand-lilac-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-brand-electric-500/20 dark:hover:shadow-brand-lilac-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>{t('cta.view_projects')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/documentation"
                className="inline-flex items-center gap-2 px-6 py-3.5 glass-card glass-card-hover text-brand-navy-800 dark:text-brand-ash-200 font-semibold rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>{t('cta.view_docs')}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* METRICS / STATS SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-label="QA Metrics Summary">
          {[
            { 
              icon: GiAlienBug, 
              value: "230+", 
              labelKey: "home.stat_bugs", 
              color: "text-brand-electric-500 dark:text-brand-lilac-400",
              bgColor: "bg-brand-electric-500/10 dark:bg-brand-lilac-500/10"
            },
            { 
              icon: ShieldCheck, 
              value: "94%", 
              labelKey: "home.stat_coverage", 
              color: "text-brand-lilac-500",
              bgColor: "bg-brand-lilac-500/10"
            },
            { 
              icon: Award, 
              value: "15+", 
              labelKey: "home.stat_projects", 
              color: "text-brand-navy-500 dark:text-brand-lilac-300",
              bgColor: "bg-brand-navy-500/10 dark:bg-brand-lilac-500/10"
            }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="glass-card p-6 rounded-xl flex items-center gap-5 border-l-4 border-l-brand-electric-500 dark:border-l-brand-lilac-500 hover:scale-[1.01] transition-transform duration-200 shadow-sm"
              >
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-3xl font-display font-extrabold text-brand-navy-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm font-semibold text-brand-navy-600 dark:text-brand-ash-400 mt-0.5">{t(stat.labelKey)}</div>
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* PHILOSOPHY SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-8" aria-labelledby="philosophy-heading">
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 id="philosophy-heading" className="text-3xl md:text-4xl font-display font-bold text-brand-navy-900 dark:text-white">
              {t('home.philosophy_title')}
            </h2>
            <p className="text-brand-navy-600 dark:text-brand-ash-300 leading-relaxed text-lg">
              {t('home.philosophy_desc')}
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-brand-electric-500 to-brand-lilac-500 dark:from-brand-lilac-600 dark:to-brand-lilac-300 rounded" />
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-8 rounded-2xl glow-blue space-y-6">
            <h3 className="text-xl font-bold text-brand-navy-950 dark:text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-brand-electric-500 dark:text-brand-lilac-400" />
              <span>{t('home.highlight_title')}</span>
            </h3>

            <ul className="space-y-4 text-sm text-brand-navy-600 dark:text-brand-ash-300">
              {[
                'home.highlight_desc_1',
                'home.highlight_desc_2',
                'home.highlight_desc_3'
              ].map((key, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <span className="w-5 h-5 mt-0.5 rounded-full bg-brand-electric-100 dark:bg-brand-lilac-500/10 border border-brand-electric-500/20 dark:border-brand-lilac-500/20 flex items-center justify-center text-xs font-bold text-brand-electric-500 dark:text-brand-lilac-400 shrink-0">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed font-medium">{t(key)}</span>
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
