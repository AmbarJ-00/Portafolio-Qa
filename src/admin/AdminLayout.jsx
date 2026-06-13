import React, { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LogOut,
  LayoutDashboard,
  Settings,
  FolderKanban,
  Brain,
  Award,
  FileText,
  Mail,
  Palette,
  Navigation,
  LayoutGrid,
  Menu,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  User
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';
import { usePortfolio } from '../context/PortfolioContext.jsx';

const adminRoutes = [
  { path: '/backoffice', label: 'Tablero', icon: LayoutDashboard },
  { path: '/backoffice/general', label: 'General', icon: Settings },
  { path: '/backoffice/projects', label: 'Proyectos', icon: FolderKanban },
  { path: '/backoffice/skills', label: 'Habilidades', icon: Brain },
  { path: '/backoffice/certifications', label: 'Certificaciones', icon: Award },
  { path: '/backoffice/documentation', label: 'Documentación', icon: FileText },
  { path: '/backoffice/about', label: 'Sobre Mí', icon: User },
  { path: '/backoffice/contact', label: 'Contacto', icon: Mail },
  { path: '/backoffice/appearance', label: 'Apariencia', icon: Palette },
  { path: '/backoffice/navbar', label: 'Navegación', icon: Navigation },
  { path: '/backoffice/modules', label: 'Módulos', icon: LayoutGrid }
];

const breadcrumbLabels = {
  backoffice: 'Tablero',
  general: 'General',
  projects: 'Proyectos',
  skills: 'Habilidades',
  certifications: 'Certificaciones',
  documentation: 'Documentación',
  about: 'Sobre Mí',
  contact: 'Contacto',
  appearance: 'Apariencia',
  navbar: 'Navegación',
  modules: 'Módulos'
};

const AdminLayout = () => {
  const { logout } = useAdminAuth();
  const { store } = usePortfolio();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [themeMode, setThemeMode] = useState('dark');

  const stats = {
    projects: store.projects.length,
    skills: store.skills.length,
    certifications: store.certifications.length,
    docs: store.documentation.templates.length
  };

  const currentBreadcrumb = useMemo(() => {
    const parts = location.pathname.replace('/backoffice', '').split('/').filter(Boolean);
    return parts.length
      ? ['Tablero', ...parts.map((part) => breadcrumbLabels[part] || part)]
      : ['Tablero'];
  }, [location.pathname]);

  const displayName = store.personal?.name || 'Admin';

  const handleLogout = () => {
    logout();
    navigate('/backoffice/login');
  };

  return (
    <div className={`min-h-screen ${themeMode === 'light' ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#0D1A2F] text-[#F8FAFC]'}`}>
      <div className="mx-auto flex min-h-screen max-w-[1700px]">
        <aside className={`sticky top-0 z-20 flex h-screen flex-col border-r border-[#17364F] bg-[#0F223B] transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-72'}`}>
          <div className="flex h-full flex-col justify-between overflow-hidden">
            <div className="space-y-6 px-4 py-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#09D8C7]/10 text-[#09D8C7] shadow-sm shadow-[#09D8C7]/10">
                    <User className="h-5 w-5" />
                  </div>
                  {!sidebarCollapsed && (
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.35em] text-[#8EA9BC]">Admin SaaS</p>
                      <h1 className="text-lg font-semibold text-white">Control QA</h1>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSidebarCollapsed((prev) => !prev)}
                  className="rounded-full bg-[#0D1A2F] p-2 text-[#09D8C7] transition hover:bg-[#09D8C7]/10"
                  aria-label="Colapsar sidebar"
                >
                  {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>
              </div>

              {/* Estado rápido removed from sidebar; integrated into main header for Dashboard */}
            </div>

            <nav className="mb-6 space-y-1 overflow-y-auto px-2 pb-6">
              {adminRoutes.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/backoffice'}
                    title={item.label}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                        isActive
                          ? 'bg-[#09D8C7] text-[#0D1A2F] shadow-sm shadow-[#09D8C7]/20'
                          : 'text-[#B8D6EB] hover:bg-[#09D8C7]/10 hover:text-white'
                      }`
                    }
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[#0D1A2F]/80 text-[#09D8C7] transition group-hover:bg-[#09D8C7]/20">
                      <Icon className="h-5 w-5" />
                    </span>
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </NavLink>
                );
              })}
            </nav>

            {/* Sidebar actions removed - logout moved to header for visibility */}
          </div>
        </aside>

        <div className="flex-1 p-4 lg:p-6">
          <div className="mb-4 flex flex-col gap-4 rounded-[2rem] border border-[#17364F] bg-[#0D1A2F]/95 p-4 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.7)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <nav className="flex flex-wrap items-center gap-2 text-xs text-[#8EA9BC]">
                  {currentBreadcrumb.map((crumb, index) => (
                    <span key={crumb} className="flex items-center gap-2">
                      {index > 0 && <span className="text-[#475B72]">/</span>}
                      <span>{crumb}</span>
                    </span>
                  ))}
                </nav>
                <h2 className="mt-3 text-3xl font-semibold text-white">{currentBreadcrumb[currentBreadcrumb.length - 1]}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#B8D6EB]">
                  Interfaz administrativa optimizada para un flujo SaaS moderno, con navegación clara y controles rápidos.
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#0D1A2F] p-3 text-white shadow-sm shadow-[#000000]/10">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#5ABBC6]">Proyectos</p>
                  <p className="mt-2 text-2xl font-semibold">{stats.projects}</p>
                </div>
                <div className="rounded-2xl bg-[#0D1A2F] p-3 text-white shadow-sm shadow-[#000000]/10">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#5ABBC6]">Habilidades</p>
                  <p className="mt-2 text-2xl font-semibold">{stats.skills}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'))}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-sm text-[#B8D6EB] transition hover:bg-[#09D8C7]/10"
              >
                {themeMode === 'dark' ? <Sun className="h-4 w-4 text-[#FDE68A]" /> : <Moon className="h-4 w-4 text-[#94A3B8]" />}
                {themeMode === 'dark' ? 'Modo oscuro' : 'Modo claro'}
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#09D8C7] px-4 py-3 text-sm font-semibold text-[#0D1A2F] transition hover:bg-[#08c1b6]"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>

            <div className="flex flex-col gap-3 rounded-[1.75rem] border border-[#17364F] bg-[#11243B]/90 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-3xl bg-[#09D8C7]/10 text-[#09D8C7]">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#8EA9BC]">Administrador</p>
                  <p className="text-lg font-semibold text-white">{displayName}</p>
                </div>
              </div>

  {/* este bloque de accion quedara comentada por que no tiene una vista, acciones ni funcionalidades asignadas, se dejara para 
  futuras implementaciones de perfil de usuario en el admin */ }
              {/* <div className="flex flex-wrap items-center gap-3">
                <button className="rounded-2xl bg-[#09D8C7] px-4 py-3 text-sm font-semibold text-[#0D1A2F] transition hover:bg-[#08c1b6]">
                  Ver perfil
                </button>
              </div> */}
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
