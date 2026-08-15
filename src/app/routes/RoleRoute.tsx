import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../auth/types';

interface RoleRouteProps {
  roles: UserRole[];
  redirectTo?: string;
}

const RoleRoute: React.FC<RoleRouteProps> = ({ roles, redirectTo = '/login' }) => {
  const { user } = useAuthStore();
  if (!user || !roles.includes(user.role as UserRole)) {
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
};

export default RoleRoute;
