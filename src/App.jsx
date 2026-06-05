import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
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

// Loading fallback component
const Loader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-brand-ash-200 border-t-brand-electric-500 animate-spin" />
      <Terminal className="w-5 h-5 text-brand-electric-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    </div>
    <span className="text-xs font-semibold text-brand-navy-500 dark:text-brand-ash-400 uppercase tracking-widest animate-pulse">
      Loading QA Ecosystem...
    </span>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/certifications" element={<Certifications />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              {/* Fallback to Home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
