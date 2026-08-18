import { LoginRequest, AuthResponse } from '../types';
import { login, logout } from '../api/generated/auth/auth';

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
            role: 'GymAdmin',
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
    return login({ email: data.email, password: data.password }) as unknown as Promise<AuthResponse>;
  },

  logout: async (refreshToken?: string) => {
    if (!USE_MOCK) await logout({ refreshToken });
  },
};
