import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Dumbbell, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { ConfirmDialog } from '../../components/ui';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/super-admin/dashboard', label: 'Dashboard' },
  { path: '/super-admin/gyms', label: 'Gyms' },
  { path: '/super-admin/gym-admins', label: 'Gym Admins' },
  { path: '/super-admin/users', label: 'Users' },
  { path: '/super-admin/subscriptions', label: 'Subscriptions' },
  { path: '/super-admin/reports', label: 'Reports' },
  { path: '/super-admin/settings', label: 'Settings' },
];

const SuperAdminLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-dark-900 flex">
      <aside className="fixed left-0 top-0 h-full w-60 bg-dark-800 border-r border-dark-600 z-40 flex flex-col">
        <div className="flex items-center gap-3 px-4 py-5 border-b border-dark-600">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-none">GymFlow</p>
            <p className="text-xs text-slate-500 mt-0.5">Super Admin</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            >
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-dark-600 p-2 space-y-0.5">
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="sidebar-item w-full hover:bg-red-600/15 hover:text-red-400"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmLabel="Logout"
      />

      <div className="ml-60 flex-1 flex flex-col">
        <main className="flex-1 p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
