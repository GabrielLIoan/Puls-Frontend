import type { AuthResult, AuthUser } from '../types/auth';
import { api } from './client';

export const authApi = {
  signup: (email: string, password: string, displayName?: string) =>
    api.post<AuthResult>('/auth/signup', { email, password, displayName }),

  login: (email: string, password: string) =>
    api.post<AuthResult>('/auth/login', { email, password }),

  me: () => api.get<AuthUser>('/auth/me'),

  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    api.post<{ message: string }>('/auth/reset-password', {
      token,
      newPassword,
    }),
};