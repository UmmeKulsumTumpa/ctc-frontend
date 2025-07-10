export type ServiceType = 'Hotel' | 'Restaurant' | 'Attraction' | 'Transport';

export interface TransportCreateDto {
    service_id: string;
    mode: string;
    operator?: string;
}

export interface TransportUpdateDto {
    mode?: string;
    operator?: string;
}

export interface Transport {
    service_id: string;
    mode: string;
    operator?: string;
    created_at: string;
}

export interface CreateServiceDto {
    name: string;
    type: ServiceType;
    latitude?: number;
    longitude?: number;
    address?: string;
    description?: string;
}

export interface UpdateServiceDto {
    name?: string;
    type?: ServiceType;
    latitude?: number;
    longitude?: number;
    address?: string;
    description?: string;
}

export interface ServiceCreateRequestDto extends CreateServiceDto {
    transport?: TransportCreateDto;
}

export interface ServiceUpdateRequestDto extends UpdateServiceDto {
    transport?: TransportUpdateDto;
}

export interface ServiceResponseDto {
    service_id: string;
    name: string;
    type: ServiceType;
    latitude?: number;
    longitude?: number;
    address?: string;
    description?: string;
    created_at: string;
    transport?: Transport | null;
}
