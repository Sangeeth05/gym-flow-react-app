import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Package,
  ShoppingBag,
  Tag,
  BarChart2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  UserCheck,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { authApi } from "../../auth/authService";
import { ConfirmDialog } from "../../components/ui";
import toast from "react-hot-toast";

const navItems = [
  { path: "/gym-admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/gym-admin/members", label: "Members", icon: Users },
  { path: "/gym-admin/finance", label: "Finance", icon: CreditCard },
  { path: "/gym-admin/inventory", label: "Inventory", icon: Package },
  { path: "/gym-admin/products", label: "Products", icon: ShoppingBag },
  { path: "/gym-admin/promotions", label: "Promotions", icon: Tag },
  { path: "/gym-admin/staff", label: "Staff", icon: UserCheck },
  { path: "/gym-admin/reports", label: "Reports", icon: BarChart2 },
  { path: "/gym-admin/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {}
    logout();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <aside
      className={`
      fixed left-0 top-0 h-full bg-dark-800 border-r border-dark-600 z-40
      flex flex-col transition-all duration-300 ease-in-out
      ${collapsed ? "w-16" : "w-60"}
    `}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-dark-600 ${collapsed ? "justify-center" : ""}`}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center flex-shrink-0">
          <Dumbbell className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-white text-sm leading-none">GymFlow</p>
            <p className="text-xs text-slate-500 mt-0.5">Admin Portal</p>
          </div>
        )}
      </div>

      {/* Gym name */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-dark-600">
          <p className="text-xs text-slate-500">Managing</p>
          <p className="text-sm font-semibold text-brand-400 truncate">
            {user?.gymName}
          </p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""} ${collapsed ? "justify-center px-2" : ""}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-dark-600 p-2 space-y-0.5">
        {!collapsed && (
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        )}
        <button
          onClick={() => setShowConfirm(true)}
          className={`sidebar-item w-full hover:bg-red-600/15 hover:text-red-400 ${collapsed ? "justify-center px-2" : ""}`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={onToggle}
          className={`sidebar-item w-full ${collapsed ? "justify-center px-2" : ""}`}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmLabel="Logout"
      />
    </aside>
  );
};

export default Sidebar;
