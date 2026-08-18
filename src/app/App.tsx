import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useThemeStore, applyTheme, accentVars, variantVars } from '../store/themeStore';
import { AuthProvider } from '../auth/AuthContext';
import AppRoutes from './routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 * 5 } },
});

const App: React.FC = () => {
  const { accent, variant } = useThemeStore();
  const themeVars = { ...accentVars[accent], ...variantVars[variant] };

  useEffect(() => {
    applyTheme(accent, variant);
  }, [accent, variant]);

  return (
    <ConfigProvider
      theme={{
        algorithm: antdTheme.darkAlgorithm,
        token: {
          colorPrimary: themeVars['--color-brand-500'],
          colorInfo: themeVars['--color-brand-500'],
          colorBgBase: themeVars['--color-bg-900'],
          colorBgContainer: themeVars['--color-bg-700'],
          colorBgElevated: themeVars['--color-bg-800'],
          colorBorder: themeVars['--color-bg-500'],
          colorText: '#ffffff',
          colorTextSecondary: '#94a3b8',
          colorTextPlaceholder: '#64748b',
          borderRadius: 8,
          fontFamily: 'DM Sans, sans-serif',
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
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
        </AuthProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default App;
