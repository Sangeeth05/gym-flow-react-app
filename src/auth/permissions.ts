import { UserRole } from './types';
export type { UserRole };

export const DEFAULT_ROUTE: Record<UserRole, string> = {
  SuperAdmin: '/super-admin/dashboard',
  Admin: '/gym-admin/dashboard',
  Staff: '/gym-admin/dashboard',
  Trainer: '/trainer/dashboard',
  Member: '/member/dashboard',
};
