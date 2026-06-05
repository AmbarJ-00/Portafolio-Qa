import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import SEO from '../components/SEO.jsx';

const CustomModule = () => {
  const { moduleId } = useParams();
  const { store } = usePortfolio();
  const module = store.settings.modules.find((item) => item.id === moduleId);

  if (!module) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <SEO title={module.name} description={module.description} path={`/modules/${module.id}`} />
      <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Dynamic Module</p>
          <h1 className="text-4xl font-bold text-slate-950 dark:text-white">{module.name}</h1>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{module.description}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {module.cards.map((card, idx) => (
            <div key={idx} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{card}</h2>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default CustomModule;
