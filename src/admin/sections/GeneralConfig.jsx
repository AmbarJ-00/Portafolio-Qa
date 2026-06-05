import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import Modal from '../../components/Modal.jsx';
import { HelpCircle } from 'lucide-react';

const generalSchema = z.object({
  name: z.string().min(3, 'El nombre es obligatorio'),
  role: z.string().min(3, 'El rol es obligatorio'),
  tagline: z.string().min(10, 'La frase debe ser descriptiva'),
  location: z.string().min(3, 'La ubicación es obligatoria'),
  availability: z.string().min(3, 'La disponibilidad es obligatoria'),
  workMode: z.string().min(3, 'La modalidad es obligatoria'),
  heroBadge: z.string().optional(),
  heroHeadline: z.string().optional(),
  heroSubtitle: z.string().optional(),
  primaryButton: z.string().optional(),
  secondaryButton: z.string().optional(),
  seoTitle: z.string().min(5, 'El título SEO es obligatorio'),
  seoDescription: z.string().min(20, 'La descripción SEO debe ser descriptiva')
});

const GeneralConfig = () => {
  const { store, actions } = usePortfolio();
  const { personal, settings } = store;
  const [helpOpen, setHelpOpen] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      name: personal.name,
      role: personal.role || '',
      tagline: personal.tagline || '',
      location: personal.location,
      availability: personal.availability || '',
      workMode: personal.workMode || '',
      heroBadge: personal.heroBadge || '',
      heroHeadline: personal.heroHeadline || '',
      heroSubtitle: personal.heroSubtitle || '',
      primaryButton: personal.primaryButton || 'Ver proyectos',
      secondaryButton: personal.secondaryButton || 'Descargar CV',
      seoTitle: settings.seo.title,
      seoDescription: settings.seo.description
    }
  });

  const onSubmit = (data) => {
    actions.updatePersonal({
      name: data.name,
      role: data.role,
      tagline: data.tagline,
      location: data.location,
      availability: data.availability,
      workMode: data.workMode,
      heroBadge: data.heroBadge,
      heroHeadline: data.heroHeadline,
      heroSubtitle: data.heroSubtitle,
      primaryButton: data.primaryButton,
      secondaryButton: data.secondaryButton
    });
    actions.updateSEO({ title: data.seoTitle, description: data.seoDescription });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-[#17364F] bg-[#0D1A2F] p-6 text-white shadow-[0_20px_60px_-35px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#09D8C7]/80">Configuración general</p>
            <h1 className="mt-3 text-3xl font-semibold">Perfil y SEO</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#C9F7EE]/85">
              Ajusta los datos del perfil público, los botones del héroe y la información SEO desde el admin.
            </p>
          </div>
          <button
            onClick={() => setHelpOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#09D8C7] bg-[#09D8C7]/10 px-4 py-3 text-sm font-semibold text-[#09D8C7] hover:bg-[#09D8C7]/20"
          >
            <HelpCircle className="w-4 h-4" /> Ayuda
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
        <section className="rounded-[1.75rem] border border-[#17364F] bg-[#0D1A2F]/80 p-6 shadow-sm text-[#E2E8F0]">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#09D8C7]/10">
            <div>
              <h2 className="text-xl font-semibold text-white">Datos personales y héroe</h2>
              <p className="text-sm text-[#C9F7EE]/80">Campos clave que se muestran en la portada pública.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {[
              { name: 'name', label: 'Nombre', placeholder: 'Ambar Ramon' },
              { name: 'role', label: 'Rol profesional', placeholder: 'QA Lead' },
              { name: 'tagline', label: 'Frase descriptiva', placeholder: 'Automatización y pruebas con foco en calidad.' },
              { name: 'location', label: 'Ubicación', placeholder: 'Rep. Dominicana, Santo Domingo' },
              { name: 'availability', label: 'Disponibilidad', placeholder: 'Disponible para proyectos remotos o presenciales' },
              { name: 'workMode', label: 'Modalidad', placeholder: 'Remoto / Híbrido / Presencial' }
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-semibold text-white">{field.label}</label>
                <input
                  id={field.name}
                  type="text"
                  placeholder={field.placeholder}
                  {...register(field.name)}
                  className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none transition focus:border-[#09D8C7] focus:ring-[#09D8C7]/30"
                />
                {errors[field.name] && <p className="text-xs text-[#BD0927]">{errors[field.name].message}</p>}
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {[
              { name: 'heroBadge', label: 'Texto del badge', placeholder: 'QA Accelerated' },
              { name: 'heroHeadline', label: 'Título del héroe', placeholder: 'Pruebas para productos de excelencia' },
              { name: 'heroSubtitle', label: 'Subtítulo del héroe', placeholder: 'Confianza en producto con QA accesible y automatizado.' },
              { name: 'primaryButton', label: 'Botón primario', placeholder: 'Ver proyectos' },
              { name: 'secondaryButton', label: 'Botón secundario', placeholder: 'Contactar' }
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-semibold text-white">{field.label}</label>
                <input
                  id={field.name}
                  type="text"
                  placeholder={field.placeholder}
                  {...register(field.name)}
                  className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none transition focus:border-[#09D8C7] focus:ring-[#09D8C7]/30"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-[#17364F] bg-[#0D1A2F]/80 p-6 shadow-sm text-[#E2E8F0]">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#09D8C7]/10">
            <div>
              <h2 className="text-xl font-semibold text-white">SEO público</h2>
              <p className="text-sm text-[#C9F7EE]/80">Configura título y descripción que verá Google.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="seoTitle" className="text-sm font-semibold text-white">Título SEO</label>
              <input
                id="seoTitle"
                type="text"
                placeholder="Sofía Rodríguez | QA Lead"
                {...register('seoTitle')}
                className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none transition focus:border-[#09D8C7] focus:ring-[#09D8C7]/30"
              />
              {errors.seoTitle && <p className="text-xs text-[#BD0927]">{errors.seoTitle.message}</p>}
            </div>
            <div className="space-y-2 lg:col-span-2">
              <label htmlFor="seoDescription" className="text-sm font-semibold text-white">Descripción SEO</label>
              <textarea
                id="seoDescription"
                rows={4}
                placeholder="Portfolio de QA y estrategia de pruebas para servicios de calidad."
                {...register('seoDescription')}
                className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none transition focus:border-[#09D8C7] focus:ring-[#09D8C7]/30"
              />
              {errors.seoDescription && <p className="text-xs text-[#BD0927]">{errors.seoDescription.message}</p>}
            </div>
          </div>
        </section>

        <button type="submit" className="w-full rounded-2xl bg-[#09D8C7] px-6 py-3 text-sm font-semibold text-[#0D1A2F] hover:bg-[#08c1b6] transition">
          Guardar configuración general
        </button>
      </form>

      {helpOpen && (
        <Modal
          isOpen={helpOpen}
          onClose={() => setHelpOpen(false)}
          title="Guía rápida"
          subtitle="Consejos cortos para mantener el admin organizado y claro."
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
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-4">
              <p className="font-semibold text-white">Perfil claro</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#C9F7EE]">
                <li>Usa un nombre y rol consistentes.</li>
                <li>La frase debe ser breve y clara.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-4">
              <p className="font-semibold text-white">Botones públicos</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#C9F7EE]">
                <li>Texto directo: Ver proyectos / Contactar.</li>
                <li>No dejes valores en inglés.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-4">
              <p className="font-semibold text-white">SEO breve</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#C9F7EE]">
                <li>El título debe describir tu perfil.</li>
                <li>La descripción debe ser compacta y convincente.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-4">
              <p className="font-semibold text-white">Flujo de edición</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#C9F7EE]">
                <li>Modifica y guarda sin cambiar la navegación pública.</li>
                <li>Mantén el formulario limpio y directamente legible.</li>
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GeneralConfig;
