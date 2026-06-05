import React from 'react';
import { Briefcase, ShieldCheck, Award, FileText } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';

const AdminDashboard = () => {
  const { store } = usePortfolio();
  const stats = {
    projects: store.projects.length,
    skills: store.skills.length,
    certifications: store.certifications.length,
    docs: store.documentation.templates.length
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-[#17364F] bg-[#0D1A2F]/95 p-8 shadow-[0_35px_80px_-40px_rgba(0,0,0,0.7)] text-[#F8FAFC]">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#09D8C7]">Panel administrativo</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Resumen estratégico</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#C9F7EE]/90">
              Supervisa la plataforma interna y toma decisiones rápidas sobre proyectos, habilidades y documentación.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-[#17364F] bg-[#11243B] p-5 text-white shadow-sm shadow-[#09D8C7]/10">
              <p className="text-sm text-[#A5F5E0]">Disponibilidad</p>
              <p className="mt-3 text-3xl font-semibold">99.9%</p>
            </div>
            <div className="rounded-[1.75rem] border border-[#17364F] bg-[#11243B] p-5 text-white shadow-sm shadow-[#09D8C7]/10">
              <p className="text-sm text-[#A5F5E0]">Acciones pendientes</p>
              <p className="mt-3 text-3xl font-semibold">5</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.75rem] border border-[#17364F] bg-[#11243B] p-6 shadow-sm shadow-[#09D8C7]/10">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#09D8C7]/10 text-[#09D8C7]">
              <Briefcase className="h-5 w-5" />
            </div>
            <p className="text-sm text-[#A5F5E0]">Proyectos activos</p>
            <p className="mt-3 text-3xl font-semibold text-white">{stats.projects}</p>
          </div>
          <div className="rounded-[1.75rem] border border-[#17364F] bg-[#11243B] p-6 shadow-sm shadow-[#09D8C7]/10">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#09D8C7]/10 text-[#09D8C7]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="text-sm text-[#A5F5E0]">Habilidades disponibles</p>
            <p className="mt-3 text-3xl font-semibold text-white">{stats.skills}</p>
          </div>
          <div className="rounded-[1.75rem] border border-[#17364F] bg-[#11243B] p-6 shadow-sm shadow-[#09D8C7]/10">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#09D8C7]/10 text-[#09D8C7]">
              <Award className="h-5 w-5" />
            </div>
            <p className="text-sm text-[#A5F5E0]">Certificaciones</p>
            <p className="mt-3 text-3xl font-semibold text-white">{stats.certifications}</p>
          </div>
          <div className="rounded-[1.75rem] border border-[#17364F] bg-[#11243B] p-6 shadow-sm shadow-[#09D8C7]/10">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#09D8C7]/10 text-[#09D8C7]">
              <FileText className="h-5 w-5" />
            </div>
            <p className="text-sm text-[#A5F5E0]">Plantillas QA</p>
            <p className="mt-3 text-3xl font-semibold text-white">{stats.docs}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6">
        <div className="rounded-[2rem] border border-[#17364F] bg-[#11243B] p-6 shadow-lg shadow-[#000000]/20">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#8EA9BC]">Visión general</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Actividad reciente</h2>
            </div>
            <div className="rounded-2xl bg-[#0D1A2F] px-4 py-2 text-sm text-[#09D8C7]">Actualizado ahora</div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-[1.5rem] border border-[#17364F] bg-[#0D1A2F] p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-[#A5F5E0]">Tendencia de uso</p>
                  <p className="mt-1 text-2xl font-semibold text-white">24.8%</p>
                </div>
                <div className="text-sm text-[#38BDF8]">Estable</div>
              </div>
              <div className="h-24 overflow-hidden rounded-[1.5rem] bg-[#08141F] p-3">
                <div className="relative h-full w-full">
                  <div className="absolute bottom-0 left-0 h-[18%] w-8 rounded-full bg-[#09D8C7]" />
                  <div className="absolute bottom-0 left-16 h-[33%] w-8 rounded-full bg-[#22D3EE]" />
                  <div className="absolute bottom-0 left-28 h-[23%] w-8 rounded-full bg-[#0EA5E9]" />
                  <div className="absolute bottom-0 left-40 h-[42%] w-8 rounded-full bg-[#06B6D4]" />
                  <div className="absolute bottom-0 left-52 h-[36%] w-8 rounded-full bg-[#14B8A6]" />
                  <div className="absolute bottom-0 left-64 h-[48%] w-8 rounded-full bg-[#22C55E]" />
                  <div className="absolute bottom-0 left-76 h-[28%] w-8 rounded-full bg-[#0EA5E9]" />
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#17364F] bg-[#0D1A2F] p-5">
              <p className="text-sm uppercase tracking-[0.35em] text-[#8EA9BC]">Últimos eventos</p>
              <ul className="mt-4 space-y-3 text-[#CBD5E1]">
                <li className="flex items-center justify-between rounded-2xl border border-[#17364F] bg-[#11243B] px-4 py-3">
                  <span>Proyecto actualizado</span>
                  <span className="text-xs text-[#7DD3FC]">Ahora</span>
                </li>
                <li className="flex items-center justify-between rounded-2xl border border-[#17364F] bg-[#11243B] px-4 py-3">
                  <span>Plantilla QA sincronizada</span>
                  <span className="text-xs text-[#A5F5E0]">Hace 12 min</span>
                </li>
                <li className="flex items-center justify-between rounded-2xl border border-[#17364F] bg-[#11243B] px-4 py-3">
                  <span>Nuevo módulo registrado</span>
                  <span className="text-xs text-[#A5F5E0]">Hace 1 h</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
