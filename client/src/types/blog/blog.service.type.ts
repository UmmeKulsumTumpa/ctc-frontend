export type ServiceType = 'Hotel' | 'Restaurant' | 'Attraction' | 'Transport';

export interface BlogService {
  service_id: string;
  name: string;
  type: ServiceType;
  latitude?: number;
  longitude?: number;
  address?: string;
  description?: string;
  created_at: string;
  transport?: any | null; // You can define a more specific type if needed
}
