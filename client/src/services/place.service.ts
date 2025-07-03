import api from '../utils/api';
import type { PlaceDto, PlaceFilters } from '../types/place.type';

const PLACE_API_BASE = '/places';

export const createPlace = async (data: PlaceDto): Promise<PlaceDto> => {
    const res = await api.post(PLACE_API_BASE, data);
    return res.data.data;
};

export const getAllPlaces = async (filters: PlaceFilters = {}): Promise<PlaceDto[]> => {
    const res = await api.get(PLACE_API_BASE, { params: filters });
    return res.data.data;
};

export const getPlaceById = async (id: string): Promise<PlaceDto> => {
    const res = await api.get(`${PLACE_API_BASE}/${id}`);
    return res.data.data;
};

export const updatePlace = async (id: string, data: Partial<PlaceDto>): Promise<PlaceDto> => {
    const res = await api.patch(`${PLACE_API_BASE}/${id}`, data);
    return res.data.data;
};

export const deletePlace = async (id: string): Promise<void> => {
    await api.delete(`${PLACE_API_BASE}/${id}`);
};
