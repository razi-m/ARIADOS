import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_USERS, ROLES } from '../utils/constants';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ariados_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ariados_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ariados_user');
    }
  }, [user]);

  const login = useCallback(async (username, password, role) => {
    setLoading(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    const found = DEFAULT_USERS.find(
      u => u.username === username && u.password === password
    );

    if (found) {
      const userData = {
        id: found.id,
        username: found.username,
        email: found.email,
        role: role || found.role,
        lastLogin: new Date().toISOString(),
      };
      setUser(userData);
      setLoading(false);
      return { success: true, user: userData };
    }

    // Allow any username/password for demo
    const userData = {
      id: Date.now(),
      username,
      email: `${username}@ariados.com`,
      role: role || ROLES.INSPECTOR,
      lastLogin: new Date().toISOString(),
    };
    setUser(userData);
    setLoading(false);
    return { success: true, user: userData };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('ariados_user');
  }, []);

  const isAdmin = user?.role === ROLES.ADMIN;
  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};