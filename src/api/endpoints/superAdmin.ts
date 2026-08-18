import {
  getGyms,
  activate,
  suspend,
} from '../generated/gyms/gyms';

export interface Gym {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  status: 'Active' | 'Suspended' | 'Pending';
  adminName?: string;
  adminEmail?: string;
  memberCount?: number;
  staffCount?: number;
  monthlyRevenue?: number;
  createdAt: string;
  logoUrl?: string;
}

export interface GymAdmin {
  id: string;
  name: string;
  email: string;
  phone: string;
  gymId: string;
  gymName: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

const cast = <T>(p: Promise<unknown>): Promise<T> => p as Promise<T>;

export const gymsApi = {
  getAll: (): Promise<Gym[]> => cast<Gym[]>(getGyms()),
  activate: (id: string): Promise<void> => activate(id) as Promise<void>,
  suspend: (id: string): Promise<void> => suspend(id) as Promise<void>,
};
