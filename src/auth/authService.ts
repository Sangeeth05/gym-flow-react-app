import apiClient from '../api/axios';
import { LoginRequest, AuthResponse } from '../types';

const USE_MOCK = process.env.REACT_APP_USE_MOCK !== 'false';
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    if (USE_MOCK) {
      await delay(800);
      if (data.email === 'admin@gymflow.com' && data.password === 'Admin@123') {
        return {
          token: 'mock-jwt-token-' + Date.now(),
          refreshToken: 'mock-refresh-token',
          user: {
            id: '1',
            name: 'Admin User',
            email: data.email,
            role: 'Admin',
            gymId: 'GYM-001',
            gymName: 'GymFlow Fitness Center',
          },
        };
      }
      const error = new Error('Invalid credentials') as Error & {
        response?: { data?: { message?: string } };
      };
      error.response = { data: { message: 'Invalid credentials' } };
      throw error;
    }
    const res = await apiClient.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  logout: async () => {
    if (!USE_MOCK) await apiClient.post('/auth/logout');
  },
};
