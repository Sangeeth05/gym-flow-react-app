import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import MembersPage from './pages/Members';
import FinancePage from './pages/Finance';
import InventoryPage from './pages/Inventory';
import ProductsPage from './pages/Products';
import PromotionsPage from './pages/Promotions';
import StaffPage from './pages/Staff';
import ReportsPage from './pages/Reports';
import SettingsPage from './pages/Settings';
import { useThemeStore, applyTheme } from './store/themeStore';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 * 5 } },
});

function App() {
  const { accent, variant } = useThemeStore();

  // Apply theme CSS variables on mount and whenever theme changes
  useEffect(() => {
    applyTheme(accent, variant);
  }, [accent, variant]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/members" element={<MembersPage />} />
              <Route path="/finance" element={<FinancePage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/promotions" element={<PromotionsPage />} />
              <Route path="/staff" element={<StaffPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-bg-700)',
            color: '#fff',
            border: '1px solid var(--color-bg-500)',
            borderRadius: '12px',
            fontSize: '13px',
            fontFamily: 'DM Sans, sans-serif',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#0a0a0f' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#0a0a0f' } },
          duration: 3000,
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
