import React, { useState } from 'react';
import type { ServiceResponseDto } from '../../types/service.type';
import MapPinIcon from '../icons/MapPinIcon';
import PlaceDisplayModal from '../common/modals/PlaceDisplayModal';

interface ServiceDetailsCardProps {
    service: ServiceResponseDto;
}

const ServiceDetailsCard: React.FC<ServiceDetailsCardProps> = ({ service }) => {
    const [showMap, setShowMap] = useState(false);
    return (
        <>
            <div className="bg-white border-2 border-sky-200 shadow-lg rounded-xl p-6 relative">
                <button
                    onClick={() => setShowMap(true)}
                    aria-label="View location"
                    className="absolute top-4 right-4 bg-sky-600 hover:bg-sky-700 p-3 rounded-full shadow-md transition-colors text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                    <MapPinIcon size={24} />
                </button>
                <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-2xl font-bold text-sky-900">{service.name}</h3>
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-bold border border-emerald-200">
                        {service.type}
                    </span>
                </div>
                <div className="space-y-3">
                    {service.address && (
                        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3">
                            <div className="text-sky-600 text-sm font-medium mb-1">Address</div>
                            <div className="text-sky-900 font-semibold">{service.address}</div>
                        </div>
                    )}
                    {service.description && (
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                            <div className="text-gray-600 text-sm font-medium mb-1">Description</div>
                            <div className="text-gray-900 font-semibold">{service.description}</div>
                        </div>
                    )}
                    <div className="bg-sky-50 border border-sky-200 rounded-xl p-3">
                        <div className="text-sky-600 text-sm font-medium mb-1">Created</div>
                        <div className="text-sky-900 font-semibold">{new Date(service.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</div>
                    </div>
                    {service.type === 'Transport' && service.transport && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="text-blue-600 text-sm font-medium mb-3">Transport Specialization</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-white rounded-lg p-3 border border-blue-100">
                                    <div className="text-blue-700 text-xs font-medium">Mode</div>
                                    <div className="text-blue-900 font-bold">{service.transport.mode}</div>
                                </div>
                                {service.transport.operator && (
                                    <div className="bg-white rounded-lg p-3 border border-blue-100">
                                        <div className="text-blue-700 text-xs font-medium">Operator</div>
                                        <div className="text-blue-900 font-bold">{service.transport.operator}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <PlaceDisplayModal
                isOpen={showMap}
                onClose={() => setShowMap(false)}
                latitude={Number(service.latitude)}
                longitude={Number(service.longitude)}
                placeName={service.name}
                address={service.address}
                title={service.name}
            />
        </>
    );
};

export default ServiceDetailsCard;
