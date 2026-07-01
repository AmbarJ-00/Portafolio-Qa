import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { ArrowLeft, ExternalLink, Github, Layers, AlertTriangle, FileText } from 'lucide-react';
import { GiAlienBug } from 'react-icons/gi';
import SEO from '../components/SEO.jsx';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { t } = useTranslation();
  const { store } = usePortfolio();

  const project = store.projects.find((p) => p.id === projectId);
  if (!project) return <Navigate to="/projects" replace />;

  const title          = project.titleKey          ? t(project.titleKey)          : project.title;
  const desc           = project.descriptionKey    ? t(project.descriptionKey)    : project.description;
  const strategySummary = project.translationKey   ? t(`${project.translationKey}.strategy_summary`) : project.testingStrategy;
  const risksText       = project.translationKey   ? t(`${project.translationKey}.risks`)             : project.risks;
  const bugsDetailedText= project.translationKey   ? t(`${project.translationKey}.bugs_detailed`)     : project.bugs;

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const metricColors = [
    'var(--color-button)',
    'var(--color-accent)',
    '#10b981'
  ];

  return (
    <>
      <SEO title={title} description={desc} path={`/projects/${project.id}`} />

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-10">

        {/* Back Link */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-bold rounded px-2 py-1 transition-colors hover:opacity-75"
          style={{ color: 'var(--color-muted)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('cta.back_to_projects')}</span>
        </Link>

        {/* Title Block */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="space-y-3">
            <span
              className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded"
              style={{ color: 'var(--color-button)', background: 'rgba(214,136,128,0.1)' }}
            >
              {project.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold" style={{ color: 'var(--color-text)' }}>
              {title}
            </h1>
          </div>

          <div className="flex gap-4">
            {project.demo && project.demoVisibility !== 'hide' && project.demoVisibility !== 'hidden' && (
              <a
                href={project.demo} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 font-semibold rounded-lg text-sm shadow-md transition-all hover:opacity-90"
                style={{ background: 'var(--color-button)', color: '#fff' }}
              >
                <span>{t('cta.visit_demo')}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.repository && (
              <a
                href={project.repository} target="_blank" rel="noopener noreferrer"
                className="glass-card glass-card-hover inline-flex items-center gap-2 px-4 py-2.5 font-semibold rounded-lg text-sm transition-all"
                style={{ color: 'var(--color-text)' }}
              >
                <Github className="w-4 h-4" />
                <span>{t('cta.visit_repo')}</span>
              </a>
            )}
          </div>
        </div>

        <div className="h-px" style={{ background: 'var(--color-border)' }} />

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left 2 cols */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.section variants={itemVariants} className="space-y-4" aria-labelledby="desc-heading">
              <h2 id="desc-heading" className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                <FileText className="w-5 h-5" style={{ color: 'var(--color-button)' }} />
                <span>Descripción General</span>
              </h2>
              <p className="leading-relaxed text-base" style={{ color: 'var(--color-muted)' }}>{desc}</p>
            </motion.section>

            {/* Strategy */}
            <motion.section variants={itemVariants} className="glass-card p-6 rounded-2xl space-y-4" style={{ border: '1px solid var(--color-border)' }} aria-labelledby="strategy-heading">
              <h2 id="strategy-heading" className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                <Layers className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
                <span>Estrategia de Pruebas &amp; Cobertura</span>
              </h2>
              <p className="leading-relaxed text-sm whitespace-pre-line" style={{ color: 'var(--color-muted)' }}>{strategySummary}</p>
            </motion.section>

            {/* Risks & Bugs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.section variants={itemVariants} className="glass-card p-6 rounded-xl space-y-3" style={{ borderLeft: '4px solid #f59e0b' }} aria-labelledby="risks-heading">
                <h3 id="risks-heading" className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Riesgos Críticos Identificados</span>
                </h3>
                <p className="text-xs whitespace-pre-line leading-relaxed" style={{ color: 'var(--color-muted)' }}>{risksText}</p>
              </motion.section>

              <motion.section variants={itemVariants} className="glass-card p-6 rounded-xl space-y-3" style={{ borderLeft: '4px solid #ef4444' }} aria-labelledby="bugs-heading">
                <h3 id="bugs-heading" className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                  <GiAlienBug className="w-4 h-4 text-red-500" />
                  <span>Defectos Resueltos Complejos</span>
                </h3>
                <p className="text-xs whitespace-pre-line leading-relaxed" style={{ color: 'var(--color-muted)' }}>{bugsDetailedText}</p>
              </motion.section>
            </div>

            {/* Integrations */}
            <motion.section variants={itemVariants} className="space-y-4" aria-labelledby="integrations-heading">
              <h2 id="integrations-heading" className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                Herramientas e Integraciones del Pipeline
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.integrations.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 text-sm font-semibold rounded-lg"
                    style={{ background: 'var(--bg-card)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Metrics Panel */}
          <div className="space-y-6">
            <motion.section
              variants={itemVariants}
              className="glass-card p-6 rounded-2xl space-y-6"
              style={{ border: '1px solid var(--color-border)' }}
              aria-labelledby="metrics-panel-heading"
            >
              <h2 id="metrics-panel-heading" className="text-lg font-bold pb-3" style={{ color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)' }}>
                {t('projects.metrics_title')}
              </h2>

              <div className="space-y-5">
                {[
                  { label: t('projects.coverage'),      val: `${project.metrics.coverage}%`,       pct: project.metrics.coverage },
                  { label: t('projects.risk_coverage'),  val: `${project.metrics.riskCoverage}%`,   pct: project.metrics.riskCoverage },
                  { label: t('projects.improvement'),    val: `+${project.metrics.improvements}%`,  pct: project.metrics.improvements }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold" style={{ color: 'var(--color-muted)' }}>
                      <span>{item.label}</span><span>{item.val}</span>
                    </div>
                    <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                      <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: metricColors[idx] }} />
                    </div>
                  </div>
                ))}

                <div className="h-px" style={{ background: 'var(--color-border)' }} />

                {/* KPI Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: t('projects.critical_findings'), val: project.metrics.findingsCritical },
                    { label: t('projects.ambiguities'),       val: project.metrics.ambiguitiesFound }
                  ].map((kpi, idx) => (
                    <div key={idx} className="p-3 rounded-lg text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)' }}>
                      <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>{kpi.label}</div>
                      <div className="text-xl font-extrabold mt-1" style={{ color: 'var(--color-text)' }}>{kpi.val}</div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(214,136,128,0.05)', border: '1px solid rgba(214,136,128,0.2)' }}>
                  <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-button)' }}>
                    {t('projects.quality_impact')}
                  </div>
                  <div className="text-2xl font-black mt-1" style={{ color: 'var(--color-text)' }}>
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
