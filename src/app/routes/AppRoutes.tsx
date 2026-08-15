import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { DEFAULT_ROUTE, UserRole } from '../../auth/permissions';

import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

import LoginPage from '../../auth/LoginPage';

import GymAdminLayout from '../../layouts/GymAdminLayout';
import SuperAdminLayout from '../../layouts/SuperAdminLayout';
import TrainerLayout from '../../layouts/TrainerLayout';
import MemberLayout from '../../layouts/MemberLayout';

// ── Gym Admin pages ───────────────────────────────────────────────────────────
import Dashboard from '../../features/gym-admin/dashboard';
import MembersPage from '../../features/gym-admin/members';
import FinancePage from '../../features/gym-admin/finance';
import InventoryPage from '../../features/gym-admin/inventory';
import ProductsPage from '../../features/gym-admin/products';
import PromotionsPage from '../../features/gym-admin/promotions';
import StaffPage from '../../features/gym-admin/staff';
import ReportsPage from '../../features/gym-admin/reports';
import SettingsPage from '../../features/gym-admin/settings';

// ── Super Admin pages ─────────────────────────────────────────────────────────
import SuperAdminDashboard from '../../features/super-admin/dashboard';
import GymsPage from '../../features/super-admin/gyms';
import GymAdminsPage from '../../features/super-admin/gym-admins';
import UsersPage from '../../features/super-admin/users';
import SubscriptionsPage from '../../features/super-admin/subscriptions';
import SuperAdminReports from '../../features/super-admin/reports';
import SuperAdminSettings from '../../features/super-admin/settings';

// ── Trainer pages ─────────────────────────────────────────────────────────────
import TrainerDashboard from '../../features/trainer/dashboard';
import MyMembersPage from '../../features/trainer/my-members';
import WorkoutsPage from '../../features/trainer/workouts';
import WorkoutPlansPage from '../../features/trainer/workout-plans';
import TrainerAttendance from '../../features/trainer/attendance';
import TrainerProgress from '../../features/trainer/progress';
import TrainerProfile from '../../features/trainer/profile';

// ── Member pages ──────────────────────────────────────────────────────────────
import MemberDashboard from '../../features/member/dashboard';
import MembershipPage from '../../features/member/membership';
import MemberAttendance from '../../features/member/attendance';
import WorkoutPlanPage from '../../features/member/workout-plan';
import MemberProgress from '../../features/member/progress';
import PaymentsPage from '../../features/member/payments';
import MemberTrainer from '../../features/member/trainer';
import MemberProfile from '../../features/member/profile';

const SmartRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  return <Navigate to={DEFAULT_ROUTE[user.role as UserRole] || '/gym-admin/dashboard'} replace />;
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />

    <Route element={<ProtectedRoute />}>
      {/* ── Gym Admin Portal ───────────────────────────────────────────── */}
      <Route element={<RoleRoute roles={['Admin', 'Staff']} />}>
        <Route element={<GymAdminLayout />}>
          <Route path="/gym-admin/dashboard" element={<Dashboard />} />
          <Route path="/gym-admin/members" element={<MembersPage />} />
          <Route path="/gym-admin/finance" element={<FinancePage />} />
          <Route path="/gym-admin/inventory" element={<InventoryPage />} />
          <Route path="/gym-admin/products" element={<ProductsPage />} />
          <Route path="/gym-admin/promotions" element={<PromotionsPage />} />
          <Route path="/gym-admin/staff" element={<StaffPage />} />
          <Route path="/gym-admin/reports" element={<ReportsPage />} />
          <Route path="/gym-admin/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* ── Super Admin Portal ─────────────────────────────────────────── */}
      <Route element={<RoleRoute roles={['SuperAdmin']} />}>
        <Route element={<SuperAdminLayout />}>
          <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/gyms" element={<GymsPage />} />
          <Route path="/super-admin/gym-admins" element={<GymAdminsPage />} />
          <Route path="/super-admin/users" element={<UsersPage />} />
          <Route path="/super-admin/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/super-admin/reports" element={<SuperAdminReports />} />
          <Route path="/super-admin/settings" element={<SuperAdminSettings />} />
        </Route>
      </Route>

      {/* ── Trainer Portal ─────────────────────────────────────────────── */}
      <Route element={<RoleRoute roles={['Trainer']} />}>
        <Route element={<TrainerLayout />}>
          <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
          <Route path="/trainer/my-members" element={<MyMembersPage />} />
          <Route path="/trainer/workouts" element={<WorkoutsPage />} />
          <Route path="/trainer/workout-plans" element={<WorkoutPlansPage />} />
          <Route path="/trainer/attendance" element={<TrainerAttendance />} />
          <Route path="/trainer/progress" element={<TrainerProgress />} />
          <Route path="/trainer/profile" element={<TrainerProfile />} />
        </Route>
      </Route>

      {/* ── Member Portal ──────────────────────────────────────────────── */}
      <Route element={<RoleRoute roles={['Member']} />}>
        <Route element={<MemberLayout />}>
          <Route path="/member/dashboard" element={<MemberDashboard />} />
          <Route path="/member/membership" element={<MembershipPage />} />
          <Route path="/member/attendance" element={<MemberAttendance />} />
          <Route path="/member/workout-plan" element={<WorkoutPlanPage />} />
          <Route path="/member/progress" element={<MemberProgress />} />
          <Route path="/member/payments" element={<PaymentsPage />} />
          <Route path="/member/trainer" element={<MemberTrainer />} />
          <Route path="/member/profile" element={<MemberProfile />} />
        </Route>
      </Route>
    </Route>

    <Route path="/" element={<SmartRedirect />} />
    <Route path="*" element={<SmartRedirect />} />
  </Routes>
);

export default AppRoutes;
