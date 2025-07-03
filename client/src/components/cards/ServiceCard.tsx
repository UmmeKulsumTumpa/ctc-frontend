import React from 'react';
import type { ServiceResponseDto } from '../../types/service.type';
import { useNavigate } from 'react-router-dom';

interface ServiceCardProps {
    service: ServiceResponseDto;
    onDelete?: (id: string) => void;
    showActions?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onDelete, showActions }) => {
    const navigate = useNavigate();

    const handleEdit = () => navigate(`/services/${service.service_id}/edit`);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            onDelete && onDelete(service.service_id);
        }
    };

    return (
        <div className="bg-gray-50 rounded-xl shadow-lg p-6 border border-blue-200 flex flex-col gap-2 font-sans">
            <h3 className="text-xl font-bold text-blue-800 mb-1">{service.name}</h3>
            <p className="text-sm text-green-800">Type: {service.type}</p>
            {service.address && <p className="text-sm text-blue-900">Address: {service.address}</p>}
            {service.description && <p className="text-sm text-blue-900">Description: {service.description}</p>}
            {service.latitude && service.longitude && (
                <p className="text-sm text-blue-900">Location: {service.latitude}, {service.longitude}</p>
            )}
            {service.transport && (
                <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-100">
                    <strong className="font-semibold text-blue-700">Transport Specialization:</strong>
                    <div>Mode: {service.transport.mode}</div>
                    {service.transport.operator && <div>Operator: {service.transport.operator}</div>}
                </div>
            )}
            {showActions && (
                <div className="flex gap-2 mt-3">
                    <button onClick={handleEdit} className="px-4 py-2 rounded-lg bg-green-600 text-white text-xs font-semibold shadow hover:bg-green-700 transition">Edit</button>
                    <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold shadow hover:bg-red-600 transition">Delete</button>
                </div>
            )}
        </div>
    );
};

export default ServiceCard;
