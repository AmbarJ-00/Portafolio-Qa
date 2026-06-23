import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loadingAuth } = useAdminAuth();

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white select-none">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#09D8C7] mb-3" />
        <span className="text-xs font-mono text-brand-ash-300">Verificando sesión...</span>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/backoffice/login" replace />;
};

export default AdminRoute;
