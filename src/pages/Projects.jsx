import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Activity, ArrowUpRight } from 'lucide-react';
import { GiAlienBug } from 'react-icons/gi';
import SEO from '../components/SEO.jsx';
import StatusCard from '../components/StatusCard.jsx';

const MotionLink = motion(Link);

const Projects = () => {
  const t = useTranslation().t;
  const { store } = usePortfolio();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } }
  };

  const visibleProjects = store.projects.filter(
    (project) => project.status !== 'inactive' && project.status !== 'Inactivo'
  );

  return (
    <>
      <SEO title={t('nav.projects')} description={t('projects.subtitle')} path="/projects" />

      <div className="space-y-12">
        {/* Heading */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-display font-extrabold" style={{ color: 'var(--color-text)' }}>
            {t('projects.title')}
          </h1>
          <p className="text-lg" style={{ color: 'var(--color-muted)' }}>
            {t('projects.subtitle')}
          </p>
          <div className="h-1 w-20 rounded" style={{ background: 'linear-gradient(to right, var(--color-button), var(--color-accent))' }} />
        </div>

        {/* Project Grid */}
        <motion.div
          variants={containerVariants} initial="hidden" animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {visibleProjects.map((project) => {
            const title = project.titleKey ? t(project.titleKey) : project.title;
            const desc  = project.descriptionKey ? t(project.descriptionKey) : project.description;

            return (
              <StatusCard key={project.id} status={project.status} type="project">
                <MotionLink
                  to={`/projects/${project.id}`}
                  variants={cardVariants}
                  className="glass-card glass-card-hover rounded-2xl flex flex-col justify-between overflow-hidden relative group h-full text-left no-underline hover:no-underline focus:outline-none focus:ring-2"
                  style={{ border: '1px solid var(--color-border)' }}
                >
                  {/* Top accent bar */}
                  <div className="h-1.5 w-full" style={{ background: 'linear-gradient(to right, var(--color-text), var(--color-button))' }} />

                  <div className="p-6 space-y-6 flex-grow flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-wider block" style={{ color: 'var(--color-button)' }}>
                          {project.category}
                        </span>
                        <h2 className="text-2xl font-bold transition-colors group-hover:text-brand-electric-500 group-hover:opacity-80" style={{ color: 'var(--color-text)' }}>
                          {title}
                        </h2>
                      </div>

                      <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--color-muted)' }}>
                        {desc}
                      </p>

                      {/* Integration tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.integrations && project.integrations.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-xs font-medium rounded"
                            style={{ background: 'var(--bg-card)', color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}
                          >
                            {tag}
                          </span>
                        ))}
                        {project.integrations && project.integrations.length > 3 && (
                          <span
                            className="px-2 py-0.5 text-xs font-semibold rounded"
                            style={{ background: 'rgba(214,136,128,0.1)', color: 'var(--color-button)' }}
                          >
                            +{project.integrations.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metrics preview */}
                    <div className="grid grid-cols-2 gap-4 pt-4 mt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--color-muted)' }}>
                          <Activity className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
                          <span>{t('projects.coverage')}</span>
                        </div>
                        <div className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                          {project.metrics?.coverage || 0}%
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--color-muted)' }}>
                          <GiAlienBug className="w-3.5 h-3.5" style={{ color: 'var(--color-button)' }} />
                          <span>{t('projects.bugs_resolved')}</span>
                        </div>
                        <div className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                          {project.metrics?.bugsResolved || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer action */}
                  <div className="px-6 py-4" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--color-border)' }}>
                    <div className="inline-flex items-center justify-between w-full text-sm font-bold transition-colors group-hover:opacity-80" style={{ color: 'var(--color-text)' }}>
                      <span>{t('cta.view_details')}</span>
                      <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                    </div>
                  </div>
                </MotionLink>
              </StatusCard>
            );
          })}
        </motion.div>
      </div>
    </>
  );
};

export default Projects;
