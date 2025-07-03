import api from '../utils/api';
import type {
    ServiceCreateRequestDto,
    ServiceUpdateRequestDto,
    ServiceResponseDto,
    ServiceType
} from '../types/service.type';

const SERVICE_API_BASE = '/services';

export const createService = async (data: ServiceCreateRequestDto): Promise<ServiceResponseDto> => {
    const res = await api.post(SERVICE_API_BASE, data);
    return res.data.data;
};

export const getAllServices = async (filters: Partial<Record<string, any>> = {}): Promise<ServiceResponseDto[]> => {
    const res = await api.get(SERVICE_API_BASE, { params: filters });
    return res.data.data;
};

export const getServiceById = async (id: string): Promise<ServiceResponseDto> => {
    const res = await api.get(`${SERVICE_API_BASE}/${id}`);
    return res.data.data;
};

export const updateService = async (id: string, data: ServiceUpdateRequestDto): Promise<ServiceResponseDto> => {
    const res = await api.patch(`${SERVICE_API_BASE}/${id}`, data);
    return res.data.data;
};

export const deleteService = async (id: string): Promise<void> => {
    await api.delete(`${SERVICE_API_BASE}/${id}`);
};

export const findNearbyServices = async (params: { latitude: number; longitude: number; radius?: number }): Promise<ServiceResponseDto[]> => {
    const res = await api.get(`${SERVICE_API_BASE}/nearby`, { params });
    return res.data.data;
};
