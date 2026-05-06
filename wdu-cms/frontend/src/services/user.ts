import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'EDITOR';
  createdAt?: string;
  updatedAt?: string;
}

export const userService = {
  getAll: () => api.get<User[]>('/users'),
  create: (data: Partial<User> & { password?: string }) => api.post<User>('/users', data),
  update: (id: string, data: Partial<User>) => api.put<User>(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  resetPassword: (id: string, password: string) => api.patch(`/users/${id}/reset-password`, { password }),
};
