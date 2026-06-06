import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { 
  ArrowLeft, ExternalLink, Github, Activity, Shield, 
  Layers, AlertTriangle, CheckCircle, FileText 
} from 'lucide-react';
import { GiAlienBug } from "react-icons/gi";
import SEO from '../components/SEO.jsx';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { t } = useTranslation();
  const { store } = usePortfolio();

  const project = store.projects.find((p) => p.id === projectId);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const title = project.titleKey ? t(project.titleKey) : project.title;
  const desc = project.descriptionKey ? t(project.descriptionKey) : project.description;
  const strategySummary = project.translationKey ? t(`${project.translationKey}.strategy_summary`) : project.testingStrategy;
  const risksText = project.translationKey ? t(`${project.translationKey}.risks`) : project.risks;
  const bugsDetailedText = project.translationKey ? t(`${project.translationKey}.bugs_detailed`) : project.bugs;

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <SEO 
        title={title} 
        description={desc}
        path={`/projects/${project.id}`}
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {/* Back Link */}
        <Link 
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-navy-600 dark:text-brand-ash-300 hover:text-brand-electric-500 hover:dark:text-brand-lilac-300 transition-colors focus-visible:ring-2 focus-visible:ring-brand-electric-500 dark:focus-visible:ring-brand-lilac-500 rounded px-2 py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('cta.back_to_projects')}</span>
        </Link>

        {/* Title Block */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-brand-electric-500 dark:text-brand-lilac-300 uppercase tracking-widest bg-brand-electric-500/10 dark:bg-brand-lilac-500/20 px-2.5 py-1 rounded">
              {project.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold text-brand-navy-900 dark:text-white">
              {title}
            </h1>
          </div>
          
          <div className="flex gap-4">
            {project.demo && project.demoVisibility !== 'hide' && project.demoVisibility !== 'hidden' && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-navy-800 text-white dark:bg-brand-lilac-600 dark:hover:bg-brand-lilac-500 hover:bg-brand-navy-900 font-semibold rounded-lg text-sm shadow-md transition-all duration-200"
              >
                <span>{t('cta.visit_demo')}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.repository && (
              <a
                href={project.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 glass-card glass-card-hover text-brand-navy-800 dark:text-brand-ash-200 font-semibold rounded-lg text-sm transition-all duration-200"
              >
                <Github className="w-4 h-4" />
                <span>{t('cta.visit_repo')}</span>
              </a>
            )}
          </div>
        </div>

        <div className="h-px bg-brand-ash-200 dark:bg-brand-navy-800" />

        {/* Core Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Areas (Left 2 columns) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.section variants={itemVariants} className="space-y-4" aria-labelledby="desc-heading">
              <h2 id="desc-heading" className="text-xl font-bold text-brand-navy-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-electric-500 dark:text-brand-lilac-400" />
                <span>Descripción General</span>
              </h2>
              <p className="text-brand-navy-600 dark:text-brand-ash-300 leading-relaxed text-base">
                {desc}
              </p>
            </motion.section>

            {/* Test Strategy */}
            <motion.section variants={itemVariants} className="glass-card p-6 rounded-2xl space-y-4" aria-labelledby="strategy-heading">
              <h2 id="strategy-heading" className="text-xl font-bold text-brand-navy-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-lilac-500" />
                <span>Estrategia de Pruebas & Cobertura</span>
              </h2>
              <p className="text-brand-navy-600 dark:text-brand-ash-300 leading-relaxed text-sm whitespace-pre-line">
                {strategySummary}
              </p>
            </motion.section>

            {/* Risks and Defect Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Risks */}
              <motion.section variants={itemVariants} className="glass-card p-6 rounded-xl border-l-4 border-l-amber-500 space-y-3" aria-labelledby="risks-heading">
                <h3 id="risks-heading" className="text-base font-bold text-brand-navy-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Riesgos Críticos Identificados</span>
                </h3>
                <p className="text-xs text-brand-navy-600 dark:text-brand-ash-400 whitespace-pre-line leading-relaxed">
                  {risksText}
                </p>
              </motion.section>

              {/* Bugs Detailed */}
              <motion.section variants={itemVariants} className="glass-card p-6 rounded-xl border-l-4 border-l-red-500 space-y-3" aria-labelledby="bugs-heading">
                <h3 id="bugs-heading" className="text-base font-bold text-brand-navy-900 dark:text-white flex items-center gap-2">
                  <GiAlienBug className="w-4 h-4 text-red-500 dark:text-brand-lilac-400" />
                  <span>Defectos Resueltos Complejos</span>
                </h3>
                <p className="text-xs text-brand-navy-600 dark:text-brand-ash-400 whitespace-pre-line leading-relaxed">
                  {bugsDetailedText}
                </p>
              </motion.section>
            </div>

            {/* Integrations Stack */}
            <motion.section variants={itemVariants} className="space-y-4" aria-labelledby="integrations-heading">
              <h2 id="integrations-heading" className="text-xl font-bold text-brand-navy-900 dark:text-white">
                Herramientas e Integraciones del Pipeline
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.integrations.map((tool, idx) => (
                  <span 
                    key={idx}
                    className="px-3.5 py-1.5 bg-brand-ash-100 dark:bg-brand-navy-900 text-brand-navy-700 dark:text-brand-ash-200 text-sm font-semibold rounded-lg border border-brand-ash-200 dark:border-brand-navy-800"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </motion.section>
          </div>

          {/* QA Metrics Panel (Right 1 column) */}
          <div className="space-y-6">
            <motion.section 
              variants={itemVariants} 
              className="glass-card p-6 rounded-2xl glow-blue dark:glow-lilac space-y-6 border border-brand-electric-500/20 dark:border-brand-lilac-500/20"
              aria-labelledby="metrics-panel-heading"
            >
              <h2 id="metrics-panel-heading" className="text-lg font-bold text-brand-navy-900 dark:text-white border-b border-brand-ash-200 dark:border-brand-navy-800 pb-3">
                {t('projects.metrics_title')}
              </h2>

              <div className="space-y-5">
                {[
                  {
                    label: t('projects.coverage'),
                    val: `${project.metrics.coverage}%`,
                    color: "bg-brand-electric-500 dark:bg-brand-lilac-500",
                    percentage: project.metrics.coverage
                  },
                  {
                    label: t('projects.risk_coverage'),
                    val: `${project.metrics.riskCoverage}%`,
                    color: "bg-brand-lilac-500",
                    percentage: project.metrics.riskCoverage
                  },
                  {
                    label: t('projects.improvement'),
                    val: `+${project.metrics.improvements}%`,
                    color: "bg-emerald-500",
                    percentage: project.metrics.improvements
                  }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-brand-navy-700 dark:text-brand-ash-300">
                      <span>{item.label}</span>
                      <span>{item.val}</span>
                    </div>
                    <div className="h-2 w-full bg-brand-ash-200 dark:bg-brand-navy-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="h-px bg-brand-ash-200 dark:bg-brand-navy-800" />

                {/* Additional KPI cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-brand-ash-100/50 dark:bg-brand-navy-950/40 p-3 rounded-lg border border-brand-ash-200/40 dark:border-brand-navy-800/40 text-center">
                    <div className="text-xxs font-bold text-brand-navy-500 dark:text-brand-ash-400 uppercase tracking-wide">
                      {t('projects.critical_findings')}
                    </div>
                    <div className="text-xl font-extrabold text-brand-navy-900 dark:text-white mt-1">
                      {project.metrics.findingsCritical}
                    </div>
                  </div>
                  <div className="bg-brand-ash-100/50 dark:bg-brand-navy-950/40 p-3 rounded-lg border border-brand-ash-200/40 dark:border-brand-navy-800/40 text-center">
                    <div className="text-xxs font-bold text-brand-navy-500 dark:text-brand-ash-400 uppercase tracking-wide">
                      {t('projects.ambiguities')}
                    </div>
                    <div className="text-xl font-extrabold text-brand-navy-900 dark:text-white mt-1">
                      {project.metrics.ambiguitiesFound}
                    </div>
                  </div>
                </div>

                <div className="bg-brand-electric-500/5 dark:bg-brand-lilac-500/10 p-4 rounded-xl border border-brand-electric-500/20 dark:border-brand-lilac-500/20 text-center">
                  <div className="text-xs font-bold text-brand-electric-600 dark:text-brand-lilac-300 uppercase tracking-wider">
                    {t('projects.quality_impact')}
                  </div>
                  <div className="text-2xl font-black text-brand-navy-900 dark:text-white mt-1">
                    {project.metrics.qualityImpact}
                  </div>
                </div>
              </div>
            </motion.section>
          </div>

        </div>
      </motion.div>
    </>
  );
};

export default ProjectDetail;
