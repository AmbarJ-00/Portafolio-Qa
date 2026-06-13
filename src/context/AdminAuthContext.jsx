import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAuthContext = createContext();
const ADMIN_TOKEN_KEY = 'qa-admin-token';
const ADMIN_USER_KEY = 'qa-admin-user';

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
      if (!token) {
        setLoadingAuth(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          // Token expired or invalid
          sessionStorage.removeItem(ADMIN_TOKEN_KEY);
          sessionStorage.removeItem(ADMIN_USER_KEY);
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
      } finally {
        setLoadingAuth(false);
      }
    };
    
    verifySession();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      sessionStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));
      setIsAuthenticated(true);
      setUser(data.user);
      return true;
    } catch (err) {
      console.error('Login action failed:', err);
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_USER_KEY);
    setIsAuthenticated(false);
    setUser(null);
    navigate('/backoffice/login');
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, user, loadingAuth, login, logout }}>
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
