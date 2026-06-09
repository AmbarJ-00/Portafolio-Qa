import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { ConfirmDialog } from '../../components/ConfirmDialog.jsx';
import { Plus, Trash2, Copy, Edit, X, HelpCircle } from 'lucide-react';
import Modal from '../../components/Modal.jsx';

const projectSchema = z.object({
  title: z.string().min(3, 'El título es obligatorio'),
  description: z.string().min(15, 'La descripción es obligatoria'),
  category: z.string().min(3, 'La categoría es obligatoria'),
  demo: z.string().url('La URL de demo debe ser válida').optional().or(z.literal('')),
  repository: z.string().url('La URL del repositorio debe ser válida').optional().or(z.literal('')),
  image: z.string().url('La URL de imagen debe ser válida').optional().or(z.literal('')),
  integrations: z.string().optional(),
  objectives: z.string().optional(),
  testingStrategy: z.string().optional(),
  testPlan: z.string().optional(),
  risks: z.string().optional(),
  bugs: z.string().optional(),
  coverage: z.number().min(0).max(100),
  improvements: z.number().min(0),
  riskCoverage: z.number().min(0).max(100),
  findingsCritical: z.number().min(0),
  bugsResolved: z.number().min(0),
  ambiguitiesFound: z.number().min(0),
  qualityImpact: z.string().optional(),
  enableMetrics: z.boolean().optional(),
  status: z.string().optional(),
  demoVisibility: z.string().optional()
});

const ProjectsManager = () => {
  const { store, actions } = usePortfolio();
  const { toast } = useToast();
  const [activeProject, setActiveProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  // Deletion state
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const defaultValues = useMemo(() => ({
    title: '',
    description: '',
    category: '',
    demo: '',
    repository: '',
    image: '',
    integrations: '',
    objectives: '',
    testingStrategy: '',
    testPlan: '',
    risks: '',
    bugs: '',
    coverage: 0,
    improvements: 0,
    riskCoverage: 0,
    findingsCritical: 0,
    bugsResolved: 0,
    ambiguitiesFound: 0,
    qualityImpact: '',
    enableMetrics: true,
    status: 'active',
    demoVisibility: 'show'
  }), []);

  const {
    register,
    handleSubmit: handleSubmitCreate,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors }
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues
  });

  const openEditor = (project) => {
    setIsEditing(true);
    setActiveProject(project);
    resetEdit({
      title: project.title,
      description: project.description,
      category: project.category,
      demo: project.demo || '',
      repository: project.repository || '',
      image: project.image || '',
      integrations: project.integrations ? project.integrations.join(', ') : '',
      objectives: project.objectives || '',
      testingStrategy: project.testingStrategy || '',
      testPlan: project.testPlan || '',
      risks: project.risks || '',
      bugs: project.bugs || '',
      coverage: project.metrics?.coverage || 0,
      improvements: project.metrics?.improvements || 0,
      riskCoverage: project.metrics?.riskCoverage || 0,
      findingsCritical: project.metrics?.findingsCritical || 0,
      bugsResolved: project.metrics?.bugsResolved || 0,
      ambiguitiesFound: project.metrics?.ambiguitiesFound || 0,
      qualityImpact: project.metrics?.qualityImpact || '',
      enableMetrics: project.enableMetrics !== false,
      status: project.status || 'active',
      demoVisibility: project.demoVisibility || 'show'
    });
  };

  const closeEditor = () => {
    setIsEditing(false);
    setActiveProject(null);
    resetEdit(defaultValues);
  };

  const onCreateProject = (data) => {
    try {
      actions.addProject(data);
      toast.success('Proyecto creado con éxito');
      reset(defaultValues);
    } catch (e) {
      toast.error('Error al crear el proyecto');
    }
  };

  const onUpdateProject = (data) => {
    if (!activeProject) return;
    try {
      actions.updateProject(activeProject.id, data);
      toast.success('Proyecto actualizado correctamente');
      closeEditor();
    } catch (e) {
      toast.error('Error al actualizar el proyecto');
    }
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      try {
        actions.deleteProject(projectToDelete.id);
        toast.success('Proyecto eliminado correctamente');
      } catch (e) {
        toast.error('Error al eliminar el proyecto');
      }
      setProjectToDelete(null);
    }
    setIsDeleteConfirmOpen(false);
  };

  const handleDuplicate = (id) => {
    try {
      actions.duplicateProject(id);
      toast.success('Proyecto duplicado correctamente');
    } catch (e) {
      toast.error('Error al duplicar el proyecto');
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-[#17364F] bg-[#0D1A2F] p-6 text-white shadow-[0_20px_60px_-35px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#09D8C7]/80">Gestión de proyectos</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Administrador de proyectos</h1>
            <p className="mt-2 text-sm leading-relaxed text-[#C9F7EE]/85">
              Crea, edita y duplica entradas de proyecto desde el panel privado.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={() => setHelpOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#09D8C7] bg-[#09D8C7]/10 px-4 py-3 text-sm font-semibold text-[#09D8C7] hover:bg-[#09D8C7]/20 transition"
            >
              <HelpCircle className="w-4 h-4" /> Ayuda
            </button>
            <button
              onClick={() => { closeEditor(); setIsEditing(false); }}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#09D8C7] bg-[#09D8C7]/10 px-4 py-3 text-sm font-semibold text-[#09D8C7] hover:bg-[#09D8C7]/20 transition"
            >
              <Plus className="w-4 h-4" />
              Nuevo proyecto
            </button>
          </div>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          {store.projects.map((project) => (
            <article key={project.id} className="rounded-[1.75rem] border border-[#17364F] bg-[#0D1A2F] p-6 shadow-lg shadow-[#0D1A2F]/10 text-[#E2E8F0]">
              <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm uppercase tracking-[0.3em] text-[#A5B4FC]">{project.category}</p>
                    {project.status && project.status !== 'active' && (
                      <span className={`text-[10px] border px-2 py-0.5 rounded-full font-semibold uppercase ${
                        project.status === 'maintenance' ? 'bg-amber-950/80 text-amber-400 border-amber-500/20' : 
                        project.status === 'learning' ? 'bg-indigo-950/80 text-indigo-400 border-indigo-500/20' : 
                        'bg-red-950/80 text-red-400 border-red-500/20'
                      }`}>
                        {project.status === 'maintenance' ? 'Mantenimiento' : project.status === 'learning' ? 'En proceso' : 'Inactivo'}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-semibold text-white">{project.titleKey ? `${project.title} (i18n)` : project.title}</h2>
                  <p className="text-sm leading-6 text-[#C9F7EE] line-clamp-3">{project.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    onClick={() => openEditor(project)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-[#09D8C7] bg-[#09D8C7]/10 px-3 py-2 text-sm text-[#09D8C7] hover:bg-[#09D8C7]/20 transition"
                  >
                    <Edit className="w-4 h-4" /> Editar
                  </button>
                  <button
                    onClick={() => handleDuplicate(project.id)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-[#09D8C7] bg-[#0D1A2F]/90 px-3 py-2 text-sm text-[#C9F7EE] hover:bg-[#0D1A2F] transition"
                  >
                    <Copy className="w-4 h-4" /> Duplicar
                  </button>
                  <button
                    onClick={() => handleDeleteClick(project)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-[#BD0927] bg-[#BD0927]/10 px-3 py-2 text-sm text-[#BD0927] hover:bg-[#BD0927]/20 transition"
                  >
                    <Trash2 className="w-4 h-4" /> Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="rounded-[1.75rem] border border-[#17364F] bg-[#0D1A2F]/80 p-6 shadow-sm text-[#E2E8F0]">
          <div className="flex items-center justify-between gap-4 border-b border-[#09D8C7]/10 pb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Crear un proyecto</h2>
              <p className="text-sm text-[#C9F7EE]/80">Rellena el formulario para añadir un proyecto nuevo.</p>
            </div>
          </div>

          <form onSubmit={handleSubmitCreate(onCreateProject)} className="space-y-4">
            {[
              { name: 'title', label: 'Título', placeholder: 'Portal QA Automation' },
              { name: 'category', label: 'Categoría', placeholder: 'Automatización QA, Seguridad, Frontend' },
              { name: 'demo', label: 'Demo URL (Opcional)', type: 'text', placeholder: 'https://demo.ejemplo.com' },
              { name: 'repository', label: 'Repositorio URL (Opcional)', type: 'text', placeholder: 'https://github.com/usuario/proyecto' },
              { name: 'image', label: 'Imagen URL (Opcional)', type: 'text', placeholder: 'https://imagenes.ejemplo.com/preview.png' }
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-semibold text-white">{field.label}</label>
                <input
                  type="text"
                  {...register(field.name)}
                  placeholder={field.placeholder}
                  className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-[#09D8C7]/30"
                />
                {errors[field.name] && <p className="text-xs text-[#BD0927]">{errors[field.name].message}</p>}
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Estado público</label>
                <select
                  {...register('status')}
                  className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7]"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo (Ocultar)</option>
                  <option value="maintenance">En Mantenimiento</option>
                  <option value="learning">En Proceso de Adquisición</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Visibilidad Demo</label>
                <select
                  {...register('demoVisibility')}
                  className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7]"
                >
                  <option value="show">Mostrar</option>
                  <option value="hide">Ocultar</option>
                  <option value="auto">Automático (Verificar URL)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Descripción</label>
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Aplicación para automatizar pruebas E2E utilizando Cypress."
                className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-[#09D8C7]/30"
              />
              {errors.description && <p className="text-xs text-[#BD0927]">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Integraciones</label>
              <input
                {...register('integrations')}
                placeholder="GitHub, Vercel, Supabase"
                className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-[#09D8C7]/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'coverage', label: 'Cobertura (%)', type: 'number' },
                { name: 'riskCoverage', label: 'Cobertura de riesgos (%)', type: 'number' },
                { name: 'improvements', label: 'Mejoras (%)', type: 'number' },
                { name: 'findingsCritical', label: 'Hallazgos críticos', type: 'number' },
                { name: 'bugsResolved', label: 'Bugs resueltos', type: 'number' },
                { name: 'ambiguitiesFound', label: 'Ambigüedades', type: 'number' }
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-semibold text-white">{field.label}</label>
                  <input
                    type={field.type}
                    {...register(field.name, { valueAsNumber: true })}
                    className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7]"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {[
                { name: 'objectives', label: 'Objetivos', placeholder: 'Reducir errores de producción en un 30%.' },
                { name: 'testingStrategy', label: 'Estrategia de pruebas', placeholder: 'Validar casos críticos con Cypress y pruebas de regresión.' },
                { name: 'testPlan', label: 'Plan de pruebas', placeholder: 'Pruebas E2E, unidad y validación de flujos principales.' },
                { name: 'risks', label: 'Riesgos', placeholder: 'Dependencia de terceros y fechas de despliegue ajustadas.' },
                { name: 'bugs', label: 'Errores encontrados', placeholder: 'Listado de defectos prioritarios y su estado.' },
                { name: 'qualityImpact', label: 'Impacto en calidad', placeholder: 'Mejora de la estabilidad del 25% en producción.' }
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-semibold text-white">{field.label}</label>
                  <textarea
                    {...register(field.name)}
                    rows={2}
                    placeholder={field.placeholder}
                    className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7]"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button type="reset" className="rounded-2xl border border-[#09D8C7] px-5 py-3 text-sm font-semibold text-[#09D8C7] hover:bg-[#09D8C7]/10 transition">
                Limpiar
              </button>
              <button type="submit" className="rounded-2xl bg-[#09D8C7] px-5 py-3 text-sm font-semibold text-[#0D1A2F] hover:bg-[#08c1b6] transition">
                Crear proyecto
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Help Modal */}
      <Modal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="Ayuda de campos de proyecto"
        subtitle="Explicación clara de lo que espera cada campo y el formato recomendado."
        footer={
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setHelpOpen(false)}
              className="rounded-2xl bg-[#09D8C7] px-5 py-3 text-sm font-semibold text-[#0D1A2F] hover:bg-[#08c1b6]"
            >
              Cerrar
            </button>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-4">
            <p className="font-semibold text-white">Título</p>
            <p className="mt-2 text-sm text-[#C9F7EE]">Nombre del proyecto. Mínimo 3 caracteres.</p>
          </div>
          <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-4">
            <p className="font-semibold text-white">Visibilidad Demo</p>
            <p className="mt-2 text-sm text-[#C9F7EE]">Permite forzar ocultación del botón Demo en la ficha pública.</p>
          </div>
          <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-4">
            <p className="font-semibold text-white">Integraciones</p>
            <p className="mt-2 text-sm text-[#C9F7EE]">Usa comas para separar tags (ej: Jest, Playwright, Docker).</p>
          </div>
          <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-4">
            <p className="font-semibold text-white">Estado público</p>
            <p className="mt-2 text-sm text-[#C9F7EE]">Usa "Mantenimiento" o "En proceso" para habilitar las visualizaciones especiales de tarjetas.</p>
          </div>
        </div>
      </Modal>

      {/* Editing Modal */}
      {isEditing && activeProject && (
        <Modal
          isOpen={isEditing}
          onClose={closeEditor}
          title="Editar proyecto"
          subtitle="Actualiza el proyecto seleccionado con campos específicos."
          footer={
            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={closeEditor}
                className="rounded-2xl border border-[#17364F] px-5 py-3 text-sm font-semibold text-[#C9F7EE] hover:bg-[#17364F]/10 transition"
              >
                Cancelar
              </button>
              <button
                form="edit-project-form"
                type="submit"
                className="rounded-2xl bg-[#09D8C7] px-5 py-3 text-sm font-semibold text-[#0D1A2F] hover:bg-[#08c1b6] transition"
              >
                Actualizar proyecto
              </button>
            </div>
          }
        >
          <form id="edit-project-form" onSubmit={handleSubmitEdit(onUpdateProject)} className="space-y-4">
            {[
              { name: 'title', label: 'Título', placeholder: 'Portal QA Automation' },
              { name: 'category', label: 'Categoría', placeholder: 'Automatización QA, Seguridad, Frontend' },
              { name: 'demo', label: 'Demo URL (Opcional)', type: 'text', placeholder: 'https://demo.ejemplo.com' },
              { name: 'repository', label: 'Repositorio URL (Opcional)', type: 'text', placeholder: 'https://github.com/usuario/proyecto' },
              { name: 'image', label: 'Imagen URL (Opcional)', type: 'text', placeholder: 'https://imagenes.ejemplo.com/preview.png' }
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-semibold text-white">{field.label}</label>
                <input
                  type="text"
                  {...registerEdit(field.name)}
                  placeholder={field.placeholder}
                  className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-[#09D8C7]/30"
                />
                {editErrors[field.name] && <p className="text-xs text-[#BD0927]">{editErrors[field.name].message}</p>}
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Estado público</label>
                <select
                  {...registerEdit('status')}
                  className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7]"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo (Ocultar)</option>
                  <option value="maintenance">En Mantenimiento</option>
                  <option value="learning">En Proceso de Adquisición</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Visibilidad Demo</label>
                <select
                  {...registerEdit('demoVisibility')}
                  className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7]"
                >
                  <option value="show">Mostrar</option>
                  <option value="hide">Ocultar</option>
                  <option value="auto">Automático (Verificar URL)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Descripción</label>
              <textarea
                {...registerEdit('description')}
                rows={4}
                placeholder="Aplicación para automatizar pruebas E2E utilizando Cypress."
                className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-[#09D8C7]/30"
              />
              {editErrors.description && <p className="text-xs text-[#BD0927]">{editErrors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Integraciones</label>
              <input
                {...registerEdit('integrations')}
                placeholder="GitHub, Vercel, Supabase"
                className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-[#09D8C7]/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'coverage', label: 'Cobertura (%)', type: 'number' },
                { name: 'riskCoverage', label: 'Cobertura de riesgos (%)', type: 'number' },
                { name: 'improvements', label: 'Mejoras (%)', type: 'number' },
                { name: 'findingsCritical', label: 'Hallazgos críticos', type: 'number' },
                { name: 'bugsResolved', label: 'Bugs resueltos', type: 'number' },
                { name: 'ambiguitiesFound', label: 'Ambigüedades', type: 'number' }
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-semibold text-white">{field.label}</label>
                  <input
                    type={field.type}
                    {...registerEdit(field.name, { valueAsNumber: true })}
                    className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7]"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {[
                { name: 'objectives', label: 'Objetivos', placeholder: 'Reducir errores de producción en un 30%.' },
                { name: 'testingStrategy', label: 'Estrategia de pruebas', placeholder: 'Validar casos críticos con Cypress y pruebas de regresión.' },
                { name: 'testPlan', label: 'Plan de pruebas', placeholder: 'Pruebas E2E, unidad y validación de flujos principales.' },
                { name: 'risks', label: 'Riesgos', placeholder: 'Dependencia de terceros y fechas de despliegue ajustadas.' },
                { name: 'bugs', label: 'Errores encontrados', placeholder: 'Listado de defectos prioritarios y su estado.' },
                { name: 'qualityImpact', label: 'Impacto en calidad', placeholder: 'Mejora de la estabilidad del 25% en producción.' }
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-semibold text-white">{field.label}</label>
                  <textarea
                    {...registerEdit(field.name)}
                    rows={2}
                    placeholder={field.placeholder}
                    className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7]"
                  />
                </div>
              ))}
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Eliminar Proyecto"
        description={`¿Estás seguro de que deseas eliminar el proyecto "${projectToDelete?.title || ''}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      />
    </div>
  );
};

export default ProjectsManager;
