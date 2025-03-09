// Definición de tipos para servicios y categorías

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  notes?: string;
}

export interface ServicesHookResult {
  categories: Category[];
  services: Service[];
  loading: boolean;
  error: string | null;
  getServicesByCategory: (categoryId: string) => Service[];
  getServiceById: (serviceId: string) => Service | undefined;
}
