import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import {
  Plus,
  Trash2,
  Edit,
  X,
  GripVertical,
  HelpCircle,
  Code,
  Bug,
  Database,
  Shield,
  Globe,
  Monitor,
  FileCode,
  Server,
  GitBranch
} from 'lucide-react';

const skillSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  category: z.string().min(3, 'La categoría es obligatoria'),
  level: z.number().min(0, 'El nivel debe ser al menos 0').max(100, 'El nivel no puede superar 100'),
  icon: z.string().min(2, 'El icono es obligatorio'),
  color: z.string().min(3, 'El color es obligatorio'),
  tools: z.string().optional(),
  relation: z.string().optional(),
  description: z.string().optional()
});

const defaultSkillValues = {
  name: '',
  category: '',
  level: 70,
  icon: 'Code',
  color: '#09D8C7',
  tools: '',
  relation: '',
  description: ''
};

const helpIcons = [
  { name: 'Code', Icon: Code },
  { name: 'Bug', Icon: Bug },
  { name: 'Database', Icon: Database },
  { name: 'Shield', Icon: Shield },
  { name: 'Globe', Icon: Globe },
  { name: 'Monitor', Icon: Monitor },
  { name: 'FileCode', Icon: FileCode },
  { name: 'Server', Icon: Server },
  { name: 'GitBranch', Icon: GitBranch }
];

const SortableItem = ({ skill, onEdit, onDelete, listeners, attributes, setNodeRef, transform, transition }) => (
  <div
    ref={setNodeRef}
    style={{ transform: CSS.Transform.toString(transform), transition }}
    className="group flex items-center justify-between gap-4 rounded-3xl border border-[#17364F] bg-[#11243B] p-4 shadow-lg shadow-[#0D1A2F]/20 focus-within:ring-2 focus-within:ring-[#09D8C7]"
  >
    <div className="flex items-center gap-3">
      <div className="rounded-2xl bg-[#0D1A2F] p-2 text-[#09D8C7]">
        <GripVertical className="w-5 h-5" {...listeners} {...attributes} />
      </div>
      <div>
        <h3 className="font-semibold text-[#E2E8F0]">{skill.name}</h3>
        <p className="text-sm text-[#A5B4FC]">{skill.category}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={() => onEdit(skill)}
        className="rounded-2xl border border-[#17364F] px-3 py-2 text-sm text-[#C9F7EE] hover:bg-[#09D8C7]/10 focus:outline-none focus:ring-2 focus:ring-[#09D8C7]"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDelete(skill.id)}
        className="rounded-2xl border border-[#BD0927] bg-[#BD0927]/10 px-3 py-2 text-sm text-[#BD0927] hover:bg-[#BD0927]/20 focus:outline-none focus:ring-2 focus:ring-[#BD0927]"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const SkillsManager = () => {
  const { store, actions } = usePortfolio();
  const [activeSkill, setActiveSkill] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: defaultSkillValues
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors }
  } = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: defaultSkillValues
  });

  const onCreateSkill = (data) => {
    actions.addSkill(data);
    reset(defaultSkillValues);
  };

  const onUpdateSkill = (data) => {
    if (!activeSkill) return;
    actions.updateSkill(activeSkill.id, data);
    setActiveSkill(null);
    resetEdit(defaultSkillValues);
  };

  const openEditModal = (skill) => {
    setActiveSkill(skill);
    resetEdit({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon,
      color: skill.color || '#09D8C7',
      tools: skill.tools.join(', '),
      relation: skill.relation?.join(', ') || '',
      description: skill.description || ''
    });
  };

  const closeEditModal = () => {
    setActiveSkill(null);
    resetEdit(defaultSkillValues);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = store.skills.findIndex((skill) => skill.id === active.id);
      const newIndex = store.skills.findIndex((skill) => skill.id === over?.id);
      const nextOrder = arrayMove(store.skills, oldIndex, newIndex);
      actions.reorderSkills(nextOrder);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-[#17364F] bg-[#0D1A2F] p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.5)] text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#09D8C7]/80">Panel administrativo</p>
            <h1 className="mt-4 text-4xl font-bold">Gestión de Skills</h1>
            <p className="mt-3 max-w-2xl text-sm text-[#C9F7EE]">Administra habilidades, iconos Lucide, niveles y relaciones de forma clara y ordenada.</p>
          </div>
          <button
            onClick={() => setShowHelp(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#09D8C7] bg-[#09D8C7]/10 px-4 py-3 text-sm font-semibold text-[#09D8C7] hover:bg-[#09D8C7]/20 focus:outline-none focus:ring-2 focus:ring-[#09D8C7]"
          >
            <HelpCircle className="w-4 h-4" /> Guía de iconos Lucide
          </button>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-4">
          <div className="rounded-[1.75rem] border border-[#17364F] bg-[#11243B]/90 p-6 shadow-lg shadow-[#0D1A2F]/20 text-[#E2E8F0]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Listado de skills</h2>
                <p className="mt-1 text-sm text-[#C9F7EE]">Arrastra para reordenar y selecciona editar para modificar una skill existente.</p>
              </div>
            </div>
          </div>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={store.skills.map((skill) => skill.id)} strategy={verticalListSortingStrategy}>
              {store.skills.map((skill) => (
                <SortableSkillItem key={skill.id} skill={skill} onEdit={openEditModal} onDelete={actions.deleteSkill} />
              ))}
            </SortableContext>
          </DndContext>
        </section>

        <section className="rounded-[2rem] border border-[#17364F] bg-[#11243B]/95 p-6 shadow-lg shadow-[#0D1A2F]/20 text-[#E2E8F0]">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold text-white">Crear nueva skill</h2>
            <p className="text-sm text-[#C9F7EE]">El formulario de creación permanece independiente de la edición. Se reinicia automáticamente después de guardar.</p>
          </div>
          <form onSubmit={handleSubmit(onCreateSkill)} className="mt-6 space-y-5">
            {[
              { name: 'name', label: 'Nombre', hint: 'Mínimo 3 caracteres' },
              { name: 'category', label: 'Categoría', hint: 'Ej: QA, Frontend, Infraestructura' },
              { name: 'icon', label: 'Icono Lucide', hint: 'Usa nombres exactos: Code, Bug, Database, Shield' },
              { name: 'tools', label: 'Herramientas', hint: 'Formato: Postman, Jira, SQL, Cypress' },
              { name: 'relation', label: 'Skills relacionadas', hint: 'Formato: TypeScript, React, Testing' }
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-semibold text-white">{field.label}</label>
                <input
                  type="text"
                  {...register(field.name)}
                  className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none transition focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
                />
                <p className="text-xs text-[#C9F7EE]">{field.hint}</p>
                {errors[field.name] && <p className="text-xs text-[#FCA5A5]">{errors[field.name].message}</p>}
              </div>
            ))}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Nivel (%)</label>
                <input
                  type="number"
                  {...register('level', { valueAsNumber: true })}
                  className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
                />
                <p className="text-xs text-[#C9F7EE]">Valor entre 0 y 100</p>
                {errors.level && <p className="text-xs text-[#FCA5A5]">{errors.level.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Color</label>
                <input
                  type="color"
                  {...register('color')}
                  className="h-12 w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] p-2 outline-none focus:ring-2 focus:ring-[#09D8C7]/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Descripción</label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
              />
              <p className="text-xs text-[#C9F7EE]">Mínimo recomendado: 20 caracteres.</p>
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <button
                type="reset"
                onClick={() => reset(defaultSkillValues)}
                className="rounded-2xl border border-[#17364F] px-5 py-3 text-sm font-semibold text-[#C9F7EE] hover:bg-[#17364F]/10 focus:outline-none focus:ring-2 focus:ring-[#09D8C7]/30"
              >
                Limpiar formulario
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-[#09D8C7] px-5 py-3 text-sm font-semibold text-[#0D1A2F] hover:bg-[#08c1b6] transition focus:outline-none focus:ring-2 focus:ring-[#09D8C7]"
              >
                Crear skill
              </button>
            </div>
          </form>
        </section>
      </div>

      <Modal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        title="Guía de iconos Lucide"
        subtitle="Selecciona el nombre exacto del icono que usarás para la skill y mantén coherencia visual."
        footer={
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="rounded-2xl bg-[#09D8C7] px-5 py-3 text-sm font-semibold text-[#0D1A2F] hover:bg-[#08c1b6]"
            >
              Cerrar
            </button>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {helpIcons.map(({ name, Icon }) => (
            <div key={name} className="flex items-center gap-3 rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-4">
              <div className="rounded-2xl bg-[#09D8C7]/15 p-3 text-[#09D8C7]">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-white">{name}</p>
                <p className="text-xs text-[#C9F7EE]">Usar como: <span className="font-mono text-[#A5F3FC]">{name}</span></p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-3xl border border-[#09D8C7] bg-[#0D1A2F]/5 p-4 text-sm text-[#C9F7EE]">
          <p className="font-semibold text-white">Ejemplo de uso</p>
          <p className="mt-2">Para una skill de desarrollo, usa <span className="font-mono text-[#A5F3FC]">Code</span>. Para seguridad, usa <span className="font-mono text-[#A5F3FC]">Shield</span>.</p>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(activeSkill)}
        onClose={closeEditModal}
        title="Editar skill"
        subtitle="Modifica la skill seleccionada sin afectar la creación de una nueva."
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={closeEditModal}
              className="rounded-2xl border border-[#17364F] px-5 py-3 text-sm font-semibold text-[#C9F7EE] hover:bg-[#17364F]/10"
            >
              Cancelar
            </button>
            <button
              form="edit-skill-form"
              type="submit"
              className="rounded-2xl bg-[#09D8C7] px-5 py-3 text-sm font-semibold text-[#0D1A2F] hover:bg-[#08c1b6]"
            >
              Guardar cambios
            </button>
          </div>
        }
      >
        <form id="edit-skill-form" onSubmit={handleSubmitEdit(onUpdateSkill)} className="space-y-5">
          {[
            { name: 'name', label: 'Nombre', hint: 'Mínimo 3 caracteres' },
            { name: 'category', label: 'Categoría', hint: 'Ej: QA, Frontend, Infraestructura' },
            { name: 'icon', label: 'Icono Lucide', hint: 'Usa nombres exactos: Code, Bug, Database, Shield' },
            { name: 'tools', label: 'Herramientas', hint: 'Formato: Postman, Jira, SQL, Cypress' },
            { name: 'relation', label: 'Skills relacionadas', hint: 'Formato: TypeScript, React, Testing' }
          ].map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="text-sm font-semibold text-white">{field.label}</label>
              <input
                type="text"
                {...registerEdit(field.name)}
                className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none transition focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
              />
              <p className="text-xs text-[#C9F7EE]">{field.hint}</p>
              {editErrors[field.name] && <p className="text-xs text-[#FCA5A5]">{editErrors[field.name].message}</p>}
            </div>
          ))}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Nivel (%)</label>
              <input
                type="number"
                {...registerEdit('level', { valueAsNumber: true })}
                className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
              />
              <p className="text-xs text-[#C9F7EE]">Valor entre 0 y 100</p>
              {editErrors.level && <p className="text-xs text-[#FCA5A5]">{editErrors.level.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Color</label>
              <input
                type="color"
                {...registerEdit('color')}
                className="h-12 w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] p-2 outline-none focus:ring-2 focus:ring-[#09D8C7]/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Descripción</label>
            <textarea
              {...registerEdit('description')}
              rows={4}
              className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
            />
            <p className="text-xs text-[#C9F7EE]">Mínimo recomendado: 20 caracteres.</p>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const SortableSkillItem = ({ skill, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: skill.id });
  return (
    <SortableItem
      skill={skill}
      onEdit={onEdit}
      onDelete={onDelete}
      listeners={listeners}
      attributes={attributes}
      setNodeRef={setNodeRef}
      transform={transform}
      transition={transition}
    />
  );
};

export default SkillsManager;
