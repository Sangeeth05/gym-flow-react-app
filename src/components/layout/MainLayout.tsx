import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../store/authStore';

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-dark-900 flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

      {/* Main content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-60'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-dark-900/90 backdrop-blur-sm border-b border-dark-700 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Quick search..."
                className="bg-dark-700 border border-dark-500 text-white placeholder-slate-600 rounded-lg pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:border-brand-500 w-56"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-dark-700 text-slate-400 hover:text-white transition-colors">
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
                <p className="text-xs font-semibold text-white leading-none">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
