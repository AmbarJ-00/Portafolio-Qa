import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import Modal from '../../components/Modal.jsx';

const appearanceSchema = z.object({
  homeGradient: z.string().optional(),
  projectCardStyle: z.string().optional(),
  skillsProgressStyle: z.string().optional(),
  certificationsCardStyle: z.string().optional(),
  accentColor: z.string().min(3, 'El color de acento es obligatorio'),
  surfaceColor: z.string().min(3, 'El color de superficie es obligatorio'),
  hoverColor: z.string().min(3, 'El color de hover es obligatorio')
});

const AppearanceManager = () => {
  const { store, actions } = usePortfolio();
  const { appearance } = store.settings;
  const [helpOpen, setHelpOpen] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      homeGradient: appearance.home.gradient,
      projectCardStyle: appearance.projects.cardStyle,
      skillsProgressStyle: appearance.skills.progressStyle,
      certificationsCardStyle: appearance.certifications.cardStyle,
      accentColor: appearance.colors.accent,
      surfaceColor: appearance.colors.surface,
      hoverColor: appearance.colors.hover
    }
  });

  const watchedAppearance = watch([
    'homeGradient',
    'projectCardStyle',
    'skillsProgressStyle',
    'certificationsCardStyle',
    'accentColor',
    'surfaceColor',
    'hoverColor'
  ]);

  const activeAppearance = {
    homeGradient: watchedAppearance.homeGradient || appearance.home.gradient,
    projectCardStyle: watchedAppearance.projectCardStyle || appearance.projects.cardStyle,
    skillsProgressStyle: watchedAppearance.skillsProgressStyle || appearance.skills.progressStyle,
    certificationsCardStyle: watchedAppearance.certificationsCardStyle || appearance.certifications.cardStyle,
    accentColor: watchedAppearance.accentColor || appearance.colors.accent,
    surfaceColor: watchedAppearance.surfaceColor || appearance.colors.surface,
    hoverColor: watchedAppearance.hoverColor || appearance.colors.hover
  };

  const onSubmit = (data) => {
    actions.updateAppearance({
      home: {
        ...appearance.home,
        gradient: data.homeGradient
      },
      projects: {
        ...appearance.projects,
        cardStyle: data.projectCardStyle
      },
      skills: {
        ...appearance.skills,
        progressStyle: data.skillsProgressStyle
      },
      certifications: {
        ...appearance.certifications,
        cardStyle: data.certificationsCardStyle
      },
      colors: {
        ...appearance.colors,
        accent: data.accentColor,
        surface: data.surfaceColor,
        hover: data.hoverColor
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-[#17364F] bg-[#0D1A2F] p-8 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.6)] text-white">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-[#09D8C7]/80">Configuración visual</p>
            <h1 className="mt-4 text-4xl font-semibold">Apariencia del portafolio</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#C9F7EE]/80">
              Ajusta gradientes, estilos de tarjetas y tokens de color desde un panel moderno.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-3xl bg-[#11243B] p-4 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[#09D8C7]/80">Color principal</p>
              <p className="mt-2 text-lg font-semibold text-white">{activeAppearance.accentColor}</p>
            </div>
            <div className="rounded-3xl bg-[#11243B] p-4 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[#09D8C7]/80">Superficie</p>
              <p className="mt-2 text-lg font-semibold text-white">{activeAppearance.surfaceColor}</p>
            </div>
            <div className="rounded-3xl bg-[#11243B] p-4 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[#09D8C7]/80">Hover</p>
              <p className="mt-2 text-lg font-semibold text-white">{activeAppearance.hoverColor}</p>
            </div>
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="inline-flex items-center justify-center rounded-2xl border border-[#09D8C7] bg-[#09D8C7]/10 px-4 py-3 text-sm font-semibold text-[#09D8C7] hover:bg-[#09D8C7]/20 focus:outline-none focus:ring-2 focus:ring-[#09D8C7]"
            >
              Ayuda
            </button>
          </div>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-[#17364F] bg-[#11243B] p-6 shadow-lg shadow-[#0D1A2F]/10">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#09D8C7]/10">
            <div>
              <h2 className="text-2xl font-semibold text-white">Vista previa rápida</h2>
              <p className="mt-1 text-sm text-[#B8EDE6]">Ve cómo afectan los tokens a la superficie y componentes principales.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="rounded-[1.5rem] bg-[#0D1A2F] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#09D8C7]/80">Gradiente de portada</p>
              <div className="mt-4 rounded-3xl border border-[#17364F] overflow-hidden bg-[#0D1A2F]/70">
                <div className="p-5 text-white" style={{ background: activeAppearance.homeGradient.includes('to-') ? undefined : activeAppearance.accentColor }}>
                  <p className="text-lg font-semibold">Vista previa</p>
                  <p className="mt-2 text-sm text-[#C9F7EE]">Gradiente actual: {activeAppearance.homeGradient}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-[#09D8C7]/10 bg-[#0D1A2F] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#09D8C7]/80">Botones</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button className="rounded-2xl px-4 py-3 text-sm font-semibold text-[#0D1A2F]" style={{ backgroundColor: activeAppearance.accentColor }}>
                  Primario
                </button>
                <button className="rounded-2xl border px-4 py-3 text-sm font-semibold" style={{ borderColor: activeAppearance.accentColor, color: activeAppearance.accentColor }}>
                  Secundario
                </button>
                <button className="rounded-2xl px-4 py-3 text-sm font-semibold text-white" style={{ backgroundColor: activeAppearance.surfaceColor }}>
                  Superficie
                </button>
              </div>
              <div className="mt-4 rounded-3xl bg-[#11243B] p-4 text-[#C9F7EE]">
                <p className="text-xs uppercase tracking-[0.25em] text-[#09D8C7]/80">Hover token</p>
                <div className="mt-3 h-8 rounded-2xl" style={{ backgroundColor: activeAppearance.hoverColor }} />
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-[#09D8C7]/10 bg-[#0D1A2F] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#09D8C7]/80">Estilos configurados</p>
              <div className="mt-4 space-y-3 text-sm text-[#C9F7EE]">
                <div className="rounded-3xl border border-[#17364F] bg-[#11243B] p-4">
                  <p className="font-semibold text-white">Tarjetas de proyectos</p>
                  <p className="mt-2 break-all">{activeAppearance.projectCardStyle}</p>
                </div>
                <div className="rounded-3xl border border-[#17364F] bg-[#11243B] p-4">
                  <p className="font-semibold text-white">Progreso de habilidades</p>
                  <p className="mt-2 break-all">{activeAppearance.skillsProgressStyle}</p>
                </div>
                <div className="rounded-3xl border border-[#17364F] bg-[#11243B] p-4">
                  <p className="font-semibold text-white">Tarjetas de certificaciones</p>
                  <p className="mt-2 break-all">{activeAppearance.certificationsCardStyle}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#17364F] bg-[#0D1A2F] p-6 shadow-lg shadow-[#0D1A2F]/10">
          <div className="pb-4 border-b border-[#09D8C7]/10">
            <h2 className="text-2xl font-semibold text-white">Editar tokens</h2>
            <p className="mt-1 text-sm text-[#B8EDE6]">Actualiza estilos visuales globales sin tocar la lógica de datos.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#E5F9F4]">Gradiente de portada</label>
                <input
                  type="text"
                  {...register('homeGradient')}
                  className="w-full rounded-3xl border border-[#17364F] bg-[#11243B] px-4 py-3 text-white outline-none transition focus:border-[#09D8C7] focus:ring-[#09D8C7]/30"
                  placeholder="from-cyan-500 via-slate-900 to-slate-950"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#E5F9F4]">Estilo tarjetas de proyectos</label>
                <input
                  type="text"
                  {...register('projectCardStyle')}
                  className="w-full rounded-3xl border border-[#17364F] bg-[#11243B] px-4 py-3 text-white outline-none transition focus:border-[#09D8C7] focus:ring-[#09D8C7]/30"
                  placeholder="rounded-xl shadow-2xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#E5F9F4]">Estilo de progreso</label>
                <input
                  type="text"
                  {...register('skillsProgressStyle')}
                  className="w-full rounded-3xl border border-[#17364F] bg-[#11243B] px-4 py-3 text-white outline-none transition focus:border-[#09D8C7] focus:ring-[#09D8C7]/30"
                  placeholder="bg-gradient-to-r from-cyan-500 to-teal-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#E5F9F4]">Tarjetas de certificaciones</label>
                <input
                  type="text"
                  {...register('certificationsCardStyle')}
                  className="w-full rounded-3xl border border-[#17364F] bg-[#11243B] px-4 py-3 text-white outline-none transition focus:border-[#09D8C7] focus:ring-[#09D8C7]/30"
                  placeholder="bordered rounded-3xl"
                />
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#E5F9F4]">Color de acento</label>
                <input
                  type="color"
                  {...register('accentColor')}
                  className="h-14 w-full rounded-3xl border border-[#17364F] bg-[#11243B] p-2"
                />
                {errors.accentColor && <p className="text-xs text-[#FF7E8B]">{errors.accentColor.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#E5F9F4]">Color de superficie</label>
                <input
                  type="color"
                  {...register('surfaceColor')}
                  className="h-14 w-full rounded-3xl border border-[#17364F] bg-[#11243B] p-2"
                />
                {errors.surfaceColor && <p className="text-xs text-[#FF7E8B]">{errors.surfaceColor.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#E5F9F4]">Color hover</label>
                <input
                  type="color"
                  {...register('hoverColor')}
                  className="h-14 w-full rounded-3xl border border-[#17364F] bg-[#11243B] p-2"
                />
                {errors.hoverColor && <p className="text-xs text-[#FF7E8B]">{errors.hoverColor.message}</p>}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-3xl bg-[#09D8C7] px-6 py-3 text-sm font-semibold text-[#0D1A2F] transition hover:bg-[#08c1b6]"
              >
                Guardar apariencia
              </button>
            </div>
          </form>
        </div>
      </section>

      {helpOpen && (
        <Modal
          isOpen={helpOpen}
          onClose={() => setHelpOpen(false)}
          title="Ayuda de apariencia"
          subtitle="Visualiza la configuración de color y estilo antes de guardar los cambios."
          footer={
            <button
              type="button"
              onClick={() => setHelpOpen(false)}
              className="rounded-2xl bg-[#09D8C7] px-5 py-3 text-sm font-semibold text-[#0D1A2F] hover:bg-[#08c1b6]"
            >
              Cerrar ayuda
            </button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-4">
              <p className="font-semibold text-white">Panel de vista previa</p>
              <p className="mt-2 text-sm text-[#C9F7EE]">El panel refleja los valores de acento, superficie y hover que están configurados actualmente.</p>
            </div>
            <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-4">
              <p className="font-semibold text-white">Estilos configurados</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#C9F7EE]">
                <li>Gradiente de portada: {activeAppearance.homeGradient}</li>
                <li>Tarjetas proyectos: {activeAppearance.projectCardStyle}</li>
                <li>Progreso de habilidades: {activeAppearance.skillsProgressStyle}</li>
                <li>Tarjetas certificaciones: {activeAppearance.certificationsCardStyle}</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-4">
              <p className="font-semibold text-white">Token de color</p>
              <p className="mt-2 text-sm text-[#C9F7EE]">Acento: {activeAppearance.accentColor}</p>
              <p className="mt-1 text-sm text-[#C9F7EE]">Superficie: {activeAppearance.surfaceColor}</p>
              <p className="mt-1 text-sm text-[#C9F7EE]">Hover: {activeAppearance.hoverColor}</p>
            </div>
            <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-4">
              <p className="font-semibold text-white">Recomendación</p>
              <p className="mt-2 text-sm text-[#C9F7EE]">Usa colores contrastantes y valores breves para que el admin muestre estilos claros y coherentes.</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AppearanceManager;
