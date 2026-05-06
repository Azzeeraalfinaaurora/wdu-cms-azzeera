import api from './api';

export interface Gallery {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryInput {
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  isActive?: boolean;
}

export const galleryService = {
  getAll: (activeOnly?: boolean) =>
    api.get<Gallery[]>('/gallery', { 
      params: activeOnly ? { active: 'true' } : {} 
    }),
  
  create: (data: GalleryInput) =>
    api.post<Gallery>('/gallery', data),
  
  update: (id: string, data: Partial<GalleryInput>) =>
    api.put<Gallery>(`/gallery/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/gallery/${id}`),
  
  reorder: (orders: { id: string; order: number }[]) =>
    api.patch('/gallery/reorder', { orders }),
};
