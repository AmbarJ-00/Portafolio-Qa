import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAuthContext = createContext();
const ADMIN_SESSION_KEY = 'qa-admin-auth';
const FALLBACK_PASSWORD = 'AdminQA#2026';

const getAdminSecret = () => import.meta.env.VITE_ADMIN_PASSWORD || FALLBACK_PASSWORD;

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (stored === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (enteredPassword) => {
    const adminSecret = getAdminSecret();
    if (!enteredPassword || enteredPassword !== adminSecret) {
      return false;
    }

    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
    navigate('/backoffice/login');
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
