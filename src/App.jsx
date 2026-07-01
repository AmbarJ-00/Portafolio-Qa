import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { PortfolioProvider } from './context/PortfolioContext.jsx';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ToastContainer } from './components/Toast.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Layout from './components/Layout.jsx';
import { Terminal } from 'lucide-react';

// Lazy loading pages for optimized performance
const Home = lazy(() => import('./pages/Home.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.jsx'));
const Skills = lazy(() => import('./pages/Skills.jsx'));
const Documentation = lazy(() => import('./pages/Documentation.jsx'));
const Certifications = lazy(() => import('./pages/Certifications.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const CustomModule = lazy(() => import('./pages/CustomModule.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

const AdminLogin = lazy(() => import('./admin/AdminLogin.jsx'));
const AdminLayout = lazy(() => import('./admin/AdminLayout.jsx'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard.jsx'));
const GeneralConfig = lazy(() => import('./admin/sections/GeneralConfig.jsx'));
const ProjectsManager = lazy(() => import('./admin/sections/ProjectsManager.jsx'));
const SkillsManager = lazy(() => import('./admin/sections/SkillsManager.jsx'));
const DocumentationManager = lazy(() => import('./admin/sections/DocumentationManager.jsx'));
const CertificationsManager = lazy(() => import('./admin/sections/CertificationsManager.jsx'));
const ContactManager = lazy(() => import('./admin/sections/ContactManager.jsx'));
const AppearanceManager = lazy(() => import('./admin/sections/AppearanceManager.jsx'));
const NavbarManager = lazy(() => import('./admin/sections/NavbarManager.jsx'));
const ModulesManager = lazy(() => import('./admin/sections/ModulesManager.jsx'));
const AboutMeManager = lazy(() => import('./admin/sections/AboutMeManager.jsx'));
const AdminRoute = lazy(() => import('./admin/AdminRoute.jsx'));

// Loading fallback component
const Loader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-current animate-spin" style={{ color: 'var(--color-button)' }} />
      <Terminal className="w-5 h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ color: 'var(--color-button)' }} />
    </div>
    <span className="text-xs font-semibold uppercase tracking-widest animate-pulse" style={{ color: 'var(--color-muted)' }}>
      Loading QA Ecosystem...
    </span>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <PortfolioProvider>
            <ToastProvider>
              <AdminAuthProvider>
                <Suspense fallback={<Loader />}>
                  <Routes>
                    <Route path="/" element={<Layout><Home /></Layout>} />
                    <Route path="/projects" element={<Layout><Projects /></Layout>} />
                    <Route path="/projects/:projectId" element={<Layout><ProjectDetail /></Layout>} />
                    <Route path="/skills" element={<Layout><Skills /></Layout>} />
                    <Route path="/documentation" element={<Layout><Documentation /></Layout>} />
                    <Route path="/certifications" element={<Layout><Certifications /></Layout>} />
                    <Route path="/about" element={<Layout><About /></Layout>} />
                    <Route path="/contact" element={<Layout><Contact /></Layout>} />
                    <Route path="/modules/:moduleId" element={<Layout><CustomModule /></Layout>} />

                    <Route path="/backoffice/login" element={<AdminLogin />} />
                    <Route path="/backoffice" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="general" element={<GeneralConfig />} />
                      <Route path="projects" element={<ProjectsManager />} />
                      <Route path="skills" element={<SkillsManager />} />
                      <Route path="certifications" element={<CertificationsManager />} />
                      <Route path="documentation" element={<DocumentationManager />} />
                      <Route path="contact" element={<ContactManager />} />
                      <Route path="appearance" element={<AppearanceManager />} />
                      <Route path="navbar" element={<NavbarManager />} />
                      <Route path="modules" element={<ModulesManager />} />
                      <Route path="about" element={<AboutMeManager />} />
                    </Route>
                    <Route path="/admin/login" element={<Navigate to="/backoffice/login" replace />} />
                    <Route path="/admin" element={<Navigate to="/backoffice" replace />} />

                    {/* Fallback to NotFound */}
                    <Route path="/404" element={<Layout><NotFound /></Layout>} />
                    <Route path="*" element={<Layout><NotFound /></Layout>} />
                  </Routes>
                </Suspense>
              </AdminAuthProvider>
              <ToastContainer />
            </ToastProvider>
          </PortfolioProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
