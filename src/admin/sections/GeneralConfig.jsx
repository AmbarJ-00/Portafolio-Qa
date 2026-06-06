import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Modal from '../../components/Modal.jsx';
import { ConfirmDialog } from '../../components/ConfirmDialog.jsx';
import { HelpCircle, Trash2, Edit, Copy, Plus, Star, ShieldCheck, Terminal, Award, Cpu, Layers, Activity } from 'lucide-react';

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
  const { personal, settings, heroCards = [] } = store;
  const { toast } = useToast();

  const [helpOpen, setHelpOpen] = useState(false);

  // Hero Card Manager States
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Form states for Hero Card Modal
  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [cardIcon, setCardIcon] = useState('ShieldCheck');
  const [cardStatus, setCardStatus] = useState('active');
  const [cardPriority, setCardPriority] = useState('0');

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
    try {
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
      toast.success('Configuración general y SEO guardados correctamente');
    } catch (e) {
      toast.error('Ocurrió un error al guardar la configuración');
    }
  };

  // Open modal to create card
  const handleCreateCardClick = () => {
    setEditingCard(null);
    setCardTitle('');
    setCardDescription('');
    setCardIcon('ShieldCheck');
    setCardStatus('active');
    setCardPriority('0');
    setIsCardModalOpen(true);
  };

  // Open modal to edit card
  const handleEditCardClick = (card) => {
    setEditingCard(card);
    setCardTitle(card.title || '');
    setCardDescription(card.description || '');
    setCardIcon(card.icon || 'ShieldCheck');
    setCardStatus(card.status || 'active');
    setCardPriority(String(card.priority || 0));
    setIsCardModalOpen(true);
  };

  // Save Card (create or update)
  const handleSaveCard = (e) => {
    e.preventDefault();
    if (!cardTitle.trim() || !cardDescription.trim()) {
      toast.warning('Título y descripción son requeridos');
      return;
    }

    const cardPayload = {
      title: cardTitle,
      description: cardDescription,
      icon: cardIcon,
      status: cardStatus,
      priority: Number(cardPriority) || 0
    };

    if (editingCard) {
      actions.updateHeroCard(editingCard.id, cardPayload);
      toast.success('Carta de héroe actualizada');
    } else {
      actions.addHeroCard(cardPayload);
      toast.success('Carta de héroe creada correctamente');
    }

    setIsCardModalOpen(false);
  };

  // Duplicate card
  const handleDuplicateCard = (id) => {
    actions.duplicateHeroCard(id);
    toast.success('Carta de héroe duplicada');
  };

  // Request delete card
  const handleDeleteCardClick = (card) => {
    setCardToDelete(card);
    setIsDeleteConfirmOpen(true);
  };

  // Confirm delete card
  const handleConfirmDelete = () => {
    if (cardToDelete) {
      actions.deleteHeroCard(cardToDelete.id);
      toast.success('Carta de héroe eliminada');
      setCardToDelete(null);
    }
    setIsDeleteConfirmOpen(false);
  };

  const getIconElement = (name) => {
    const icons = { ShieldCheck, Terminal, Award, Cpu, Layers, Activity };
    const Comp = icons[name] || ShieldCheck;
    return <Comp className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-[#17364F] bg-[#0D1A2F] p-6 text-white shadow-[0_20px_60px_-35px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#09D8C7]/80">Configuración general</p>
            <h1 className="mt-3 text-3xl font-semibold">Perfil y SEO</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#C9F7EE]/85">
              Ajusta los datos del perfil público, las tarjetas de presentación del héroe y la información SEO.
            </p>
          </div>
          <button
            onClick={() => setHelpOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#09D8C7] bg-[#09D8C7]/10 px-4 py-3 text-sm font-semibold text-[#09D8C7] hover:bg-[#09D8C7]/20 transition"
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

        <button type="submit" className="w-full rounded-2xl bg-[#09D8C7] px-6 py-4 text-sm font-bold text-[#0D1A2F] hover:bg-[#08c1b6] transition duration-200 shadow-lg shadow-[#09D8C7]/10">
          Guardar configuración general
        </button>
      </form>

      {/* Hero Cards CRUD Section */}
      <section className="rounded-[1.75rem] border border-[#17364F] bg-[#0D1A2F]/80 p-6 shadow-sm text-[#E2E8F0] space-y-6">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#09D8C7]/10">
          <div>
            <h2 className="text-xl font-semibold text-white">Tarjetas del Hero</h2>
            <p className="text-sm text-[#C9F7EE]/80">Listado y gestión de cartas mostradas en la portada principal.</p>
          </div>
          <button
            onClick={handleCreateCardClick}
            className="inline-flex items-center gap-2 rounded-xl bg-[#09D8C7] px-4 py-2.5 text-xs font-bold text-[#0D1A2F] hover:bg-[#08c1b6] transition"
          >
            <Plus className="w-4 h-4" /> Agregar Tarjeta
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {heroCards.map((card) => (
            <div key={card.id} className="p-5 rounded-2xl border border-[#17364F] bg-[#0D1A2F] flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#09D8C7]/10 text-[#09D8C7] mt-1">
                  {getIconElement(card.icon)}
                </div>
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    {card.title}
                    {card.status === 'inactive' && (
                      <span className="text-[10px] bg-red-950/80 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-semibold uppercase">Inactiva</span>
                    )}
                  </h3>
                  <p className="text-xs text-[#C9F7EE]/70 mt-1.5 leading-relaxed">{card.description}</p>
                  <p className="text-[10px] text-slate-500 mt-2">Prioridad: {card.priority || 0}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEditCardClick(card)}
                  className="p-2 text-[#C9F7EE]/80 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDuplicateCard(card.id)}
                  className="p-2 text-[#C9F7EE]/80 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  title="Duplicar"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCardClick(card)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {heroCards.length === 0 && (
            <p className="text-sm text-slate-400 py-4 col-span-2 text-center">No hay tarjetas registradas en el Hero. Crea una nueva.</p>
          )}
        </div>
      </section>

      {/* Hero Card Creation / Editing Modal */}
      {isCardModalOpen && (
        <Modal
          isOpen={isCardModalOpen}
          onClose={() => setIsCardModalOpen(false)}
          title={editingCard ? 'Editar Tarjeta' : 'Crear Tarjeta'}
          subtitle="Modifica los campos para definir una tarjeta de presentación rápida."
          footer={
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setIsCardModalOpen(false)}
                className="rounded-2xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveCard}
                className="rounded-2xl bg-[#09D8C7] px-5 py-3 text-sm font-bold text-[#0D1A2F] hover:bg-[#08c1b6]"
              >
                {editingCard ? 'Guardar Cambios' : 'Crear Tarjeta'}
              </button>
            </div>
          }
        >
          <form className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Título</label>
              <input
                type="text"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                placeholder="Liderazgo de Calidad"
                className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none transition focus:border-[#09D8C7]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Descripción corta</label>
              <textarea
                value={cardDescription}
                onChange={(e) => setCardDescription(e.target.value)}
                rows={3}
                placeholder="Garantizando la excelencia en cada entrega técnica."
                className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none transition focus:border-[#09D8C7]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Icono</label>
                <select
                  value={cardIcon}
                  onChange={(e) => setCardIcon(e.target.value)}
                  className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none transition focus:border-[#09D8C7]"
                >
                  <option value="ShieldCheck">ShieldCheck</option>
                  <option value="Terminal">Terminal</option>
                  <option value="Award">Award</option>
                  <option value="Cpu">Cpu</option>
                  <option value="Layers">Layers</option>
                  <option value="Activity">Activity</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Prioridad</label>
                <input
                  type="number"
                  value={cardPriority}
                  onChange={(e) => setCardPriority(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none transition focus:border-[#09D8C7]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Estado</label>
              <select
                value={cardStatus}
                onChange={(e) => setCardStatus(e.target.value)}
                className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none transition focus:border-[#09D8C7]"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirmation for deletions */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Eliminar Tarjeta"
        description={`¿Estás seguro de que deseas eliminar la tarjeta "${cardToDelete?.title || ''}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      />

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
              <p className="font-semibold text-white">Tarjetas de Héroe</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#C9F7EE]">
                <li>Úsalas para destacar pilares de liderazgo.</li>
                <li>Ordena mediante prioridad ascendente.</li>
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GeneralConfig;
