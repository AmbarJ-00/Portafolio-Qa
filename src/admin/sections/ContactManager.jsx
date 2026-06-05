import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import Modal from '../../components/Modal.jsx';
import { HelpCircle } from 'lucide-react';

const contactSchema = z.object({
  email: z.string().email('El correo debe ser válido'),
  linkedin: z.string().url('LinkedIn debe ser una URL válida'),
  github: z.string().url('GitHub debe ser una URL válida'),
  phone: z.string().optional(),
  alternativeContact: z.string().optional(),
  country: z.string().min(2, 'El país es obligatorio'),
  availability: z.string().min(3, 'La disponibilidad es obligatoria'),
  workMode: z.string().min(3, 'La modalidad es obligatoria')
});

const ContactManager = () => {
  const { store, actions } = usePortfolio();
  const { settings } = store;
  const [helpOpen, setHelpOpen] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: settings.contact.email,
      linkedin: settings.contact.linkedin,
      github: settings.contact.github,
      phone: settings.contact.phone,
      alternativeContact: settings.contact.alternativeContact,
      country: settings.contact.country,
      availability: store.personal.availability || '',
      workMode: store.personal.workMode || ''
    }
  });

  const onSubmit = (data) => {
    actions.updateContact({
      email: data.email,
      linkedin: data.linkedin,
      github: data.github,
      phone: data.phone,
      alternativeContact: data.alternativeContact,
      country: data.country
    });
    actions.updatePersonal({ availability: data.availability, workMode: data.workMode });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-[#17364F] bg-[#0D1A2F] p-6 text-white shadow-[0_20px_60px_-35px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#09D8C7]/80">Contacto público</p>
            <h1 className="mt-3 text-3xl font-semibold">Gestor de contacto</h1>
            <p className="mt-2 text-sm leading-relaxed text-[#C9F7EE]/85">
              Actualiza correo, redes y modalidades de contacto sin salir del admin.
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

      <section className="rounded-[1.75rem] border border-[#17364F] bg-[#0D1A2F]/80 p-6 shadow-sm text-[#E2E8F0]">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 lg:grid-cols-2">
          {[
            { name: 'email', label: 'Correo', type: 'email' },
            { name: 'linkedin', label: 'LinkedIn', type: 'url' },
            { name: 'github', label: 'GitHub', type: 'url' },
            { name: 'phone', label: 'Teléfono' },
            { name: 'alternativeContact', label: 'Contacto alternativo' },
            { name: 'country', label: 'País' },
            { name: 'availability', label: 'Disponibilidad' },
            { name: 'workMode', label: 'Modalidad' }
          ].map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="text-sm font-semibold text-white">{field.label}</label>
              <input
                type={field.type || 'text'}
                {...register(field.name)}
                className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none transition focus:border-[#09D8C7] focus:ring-[#09D8C7]/30"
              />
              {errors[field.name] && <p className="text-xs text-[#BD0927]">{errors[field.name].message}</p>}
            </div>
          ))}

          <div className="lg:col-span-2 flex justify-end">
            <button type="submit" className="rounded-2xl bg-[#09D8C7] px-6 py-3 text-sm font-semibold text-[#0D1A2F] hover:bg-[#08c1b6] transition">
              Guardar contacto
            </button>
          </div>
        </form>
      </section>

      {helpOpen && (
        <Modal
          isOpen={helpOpen}
          onClose={() => setHelpOpen(false)}
          title="Guía de contacto"
          subtitle="Pautas para mantener el contacto público claro y accesible."
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
              <p className="font-semibold text-white">Correo</p>
              <p className="mt-2 text-sm text-[#C9F7EE]">Usa una dirección oficial y revisa que sea la que está visible en la web pública.</p>
            </div>
            <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-4">
              <p className="font-semibold text-white">Redes</p>
              <p className="mt-2 text-sm text-[#C9F7EE]">LinkedIn y GitHub deben ser URLs completas y válidas.</p>
            </div>
            <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-4">
              <p className="font-semibold text-white">Disponibilidad</p>
              <p className="mt-2 text-sm text-[#C9F7EE]">Especifica si estás disponible para trabajo remoto, híbrido o presencial.</p>
            </div>
            <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-4">
              <p className="font-semibold text-white">Contacto alternativo</p>
              <p className="mt-2 text-sm text-[#C9F7EE]">Agrega un canal extra solo si es relevante y activo.</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ContactManager;
