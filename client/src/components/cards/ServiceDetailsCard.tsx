import React from 'react';
import type { ServiceResponseDto } from '../../types/service.type';

interface ServiceDetailsCardProps {
    service: ServiceResponseDto;
}

const ServiceDetailsCard: React.FC<ServiceDetailsCardProps> = ({ service }) => {
    return (
        <div className="bg-white rounded-lg shadow p-4 border mb-4 flex flex-col gap-2">
            <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold text-blue-800">{service.name}</h3>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full border border-blue-200 font-semibold">{service.type}</span>
            </div>
            
            {service.address && <div><span className="font-semibold">Address:</span> {service.address}</div>}
            {service.description && <div><span className="font-semibold">Description:</span> {service.description}</div>}
            {(service.latitude !== undefined && service.longitude !== undefined) && (
                <div><span className="font-semibold">Location:</span> {service.latitude}, {service.longitude}</div>
            )}
            <div><span className="font-semibold">Created At:</span> {new Date(service.created_at).toLocaleString()}</div>
            {service.type === 'Transport' && service.transport && (
                <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-100">
                    <div className="font-semibold text-blue-700 mb-1">Transport Details:</div>
                    <div><span className="font-semibold">Mode:</span> {service.transport.mode}</div>
                    {service.transport.operator && <div><span className="font-semibold">Operator:</span> {service.transport.operator}</div>}
                </div>
            )}
        </div>
    );
};

export default ServiceDetailsCard;
