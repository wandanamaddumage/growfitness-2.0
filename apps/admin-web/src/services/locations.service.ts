import { api } from './api';
import { Location, PaginatedResponse } from '@grow-fitness/shared-types';
import { CreateLocationDto, UpdateLocationDto } from '@grow-fitness/shared-schemas';

export type LocationSortField = 'name' | 'address' | 'placeUrl' | 'isActive' | 'createdAt';
export type SortOrder = 'asc' | 'desc';
export type LocationStatusFilter = 'active' | 'inactive';

export const locationsService = {
  getLocations: (
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
      status?: LocationStatusFilter;
      sortBy?: LocationSortField;
      sortOrder?: SortOrder;
    }
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('isActive', String(filters.status === 'active'));
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    return api.get<PaginatedResponse<Location>>(`/locations?${params.toString()}`);
  },
  getLocationById: (id: string) => api.get<Location>(`/locations/${id}`),
  createLocation: (data: CreateLocationDto) => api.post<Location>('/locations', data),
  updateLocation: (id: string, data: UpdateLocationDto) =>
    api.patch<Location>(`/locations/${id}`, data),
  deleteLocation: (id: string) => api.delete<void>(`/locations/${id}`),
};
