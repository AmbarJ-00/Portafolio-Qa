import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Activity, ArrowUpRight } from 'lucide-react';
import { GiAlienBug } from "react-icons/gi";
import SEO from '../components/SEO.jsx';
import StatusCard from '../components/StatusCard.jsx';

const Projects = () => {
  const { t } = useTranslation();
  const { store } = usePortfolio();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 }
    }
  };

  const visibleProjects = store.projects.filter(
    (project) => project.status !== 'inactive' && project.status !== 'Inactivo'
  );

  return (
    <>
      <SEO 
        title={t('nav.projects')} 
        description={t('projects.subtitle')}
        path="/projects"
      />

      <div className="space-y-12">
        {/* Heading */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-display font-extrabold text-brand-navy-900 dark:text-white">
            {t('projects.title')}
          </h1>
          <p className="text-lg text-brand-navy-600 dark:text-brand-ash-400">
            {t('projects.subtitle')}
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-brand-electric-500 to-brand-lilac-500 dark:from-brand-lilac-600 dark:to-brand-lilac-300 rounded" />
        </div>

        {/* Project Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {visibleProjects.map((project) => {
            const title = project.titleKey ? t(project.titleKey) : project.title;
            const desc = project.descriptionKey ? t(project.descriptionKey) : project.description;

            return (
              <StatusCard key={project.id} status={project.status} type="project">
                <motion.div
                  variants={cardVariants}
                  className="glass-card glass-card-hover rounded-2xl flex flex-col justify-between overflow-hidden relative group h-full"
                >
                  {/* Visual Top Bar decoration */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-brand-navy-800 to-brand-electric-500 dark:from-brand-lilac-700 dark:to-brand-lilac-400" />
                  
                  <div className="p-6 space-y-6 flex-grow flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-brand-electric-500 dark:text-brand-lilac-300 uppercase tracking-wider block">
                          {project.category}
                        </span>
                        <h2 className="text-2xl font-bold text-brand-navy-900 dark:text-white group-hover:text-brand-electric-500 dark:group-hover:text-brand-lilac-300 transition-colors">
                          {title}
                        </h2>
                      </div>

                      <p className="text-sm text-brand-navy-600 dark:text-brand-ash-400 leading-relaxed line-clamp-3">
                        {desc}
                      </p>

                      {/* Integrations Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.integrations && project.integrations.slice(0, 3).map((tag, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-0.5 bg-brand-ash-100 dark:bg-brand-navy-800 text-brand-navy-600 dark:text-brand-ash-300 text-xs font-medium rounded border border-brand-ash-200/40 dark:border-brand-navy-800/40"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.integrations && project.integrations.length > 3 && (
                          <span className="px-2 py-0.5 bg-brand-electric-500/5 dark:bg-brand-lilac-500/10 text-brand-electric-500 dark:text-brand-lilac-300 text-xs font-semibold rounded">
                            +{project.integrations.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metrics preview */}
                    <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t border-brand-ash-200/50 dark:border-brand-navy-800/30">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-navy-500 dark:text-brand-ash-400">
                          <Activity className="w-3.5 h-3.5 text-brand-lilac-500" />
                          <span>{t('projects.coverage')}</span>
                        </div>
                        <div className="text-base font-bold text-brand-navy-900 dark:text-white">
                          {project.metrics?.coverage || 0}%
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-navy-500 dark:text-brand-ash-400">
                          <GiAlienBug className="w-3.5 h-3.5 text-brand-electric-500 dark:text-brand-lilac-400" />
                          <span>{t('projects.bugs_resolved')}</span>
                        </div>
                        <div className="text-base font-bold text-brand-navy-900 dark:text-white">
                          {project.metrics?.bugsResolved || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="px-6 py-4 bg-brand-ash-55/50 dark:bg-brand-navy-900/30 border-t border-brand-ash-200/30 dark:border-brand-navy-800/20">
                    <Link
                      to={`/projects/${project.id}`}
                      className="inline-flex items-center justify-between w-full text-sm font-bold text-brand-navy-800 dark:text-brand-ash-200 hover:text-brand-electric-600 hover:dark:text-brand-lilac-300 transition-colors"
                    >
                      <span>{t('cta.view_details')}</span>
                      <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                    </Link>
                  </div>
                </motion.div>
              </StatusCard>
            );
          })}
        </motion.div>
      </div>
    </>
  );
};

export default Projects;
