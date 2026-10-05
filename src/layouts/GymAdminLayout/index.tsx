import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../store/authStore';

const GymAdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg-900)' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-60'}`}>
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 backdrop-blur-sm border-b px-6 py-3 flex items-center justify-between"
          style={{ backgroundColor: 'var(--color-bg-900)', borderColor: 'var(--color-bg-600)' }}
        >
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                placeholder="Quick search..."
                className="rounded-lg pl-8 pr-3 py-1.5 text-sm focus:outline-none w-56 border transition-colors focus:border-brand-500"
                style={{
                  backgroundColor: 'var(--color-bg-700)',
                  borderColor: 'var(--color-bg-500)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded-lg transition-colors hover:bg-[var(--color-bg-700)]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold leading-none" style={{ color: 'var(--color-text-primary)' }}>{user?.name}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default GymAdminLayout;
