import api from './api';

export interface Client {
  id: string;
  name: string;
  logoUrl: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const clientService = {
  getAll: (activeOnly?: boolean) => 
    api.get<Client[]>('/clients', { params: activeOnly ? { active: 'true' } : {} }),
  create: (data: { name: string; logoUrl: string }) => 
    api.post<Client>('/clients', data),
  update: (id: string, data: Partial<Client>) => 
    api.put<Client>(`/clients/${id}`, data),
  delete: (id: string) => 
    api.delete(`/clients/${id}`),
  reorder: (orders: { id: string; order: number }[]) => 
    api.patch('/clients/reorder', { orders }),
};
