import React, { createContext, useContext } from 'react';
import { useAuthStore } from '../store/authStore';
import { AdminUser } from '../types';

interface AuthContextValue {
  user: AdminUser | null;
  isAuthenticated: boolean;
  role: string | null;
  setAuth: (user: AdminUser, token: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, setAuth, logout } = useAuthStore();

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, role: user?.role ?? null, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
