import React, { useState } from 'react';
import type { ServiceResponseDto } from '../../types/service.type';
import MapPinIcon from '../icons/MapPinIcon';
import PlaceDisplayModal from '../common/modals/PlaceDisplayModal';
import TransportCard from './TransportCard';

interface ServiceDetailsCardProps {
    service: ServiceResponseDto;
}

const ServiceDetailsCard: React.FC<ServiceDetailsCardProps> = ({ service }) => {
    const [showMap, setShowMap] = useState(false);
    const [showTransportDetails, setShowTransportDetails] = useState(false);

    return (
        <>
            <div className="bg-white border-2 border-emerald-400 shadow-lg rounded-2xl relative">
                <div className="p-6 pb-16 overflow-hidden rounded-t-2xl">
                    {/* Service Name with Map Button */}
                    <div className="flex items-start justify-between gap-4 mb-6">
                        <button
                            onClick={() => setShowMap(true)}
                            aria-label="View location"
                            className="bg-emerald-600 hover:bg-emerald-700 p-2 rounded-full shadow-md transition-colors text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-400 flex-shrink-0"
                        >
                            <MapPinIcon size={18} />
                        </button>
                        <h3 className="text-xl font-bold text-emerald-900 leading-tight flex-1">{service.name}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                            <div className="text-emerald-600 text-sm font-medium mb-1">Address</div>
                            <div className="text-emerald-900 font-semibold">{service.address || <span className='text-gray-400'>N/A</span>}</div>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                            <div className="text-emerald-600 text-sm font-medium mb-1">Created</div>
                            <div className="text-emerald-900 font-semibold">{new Date(service.created_at).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</div>
                        </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                        <div className="text-gray-600 text-sm font-medium mb-1">Description</div>
                        <div className="text-gray-900 font-semibold">{service.description || <span className='text-gray-400'>No description</span>}</div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="h-12 border-t border-emerald-200 rounded-b-2xl bg-emerald-50 flex items-center justify-between px-6">
                    <div className="flex-1">
                        {service.type === 'Transport' && service.transport && (
                            <button
                                type="button"
                                className="flex items-center gap-2 text-emerald-700 font-semibold text-sm hover:text-emerald-800 transition"
                                onClick={() => setShowTransportDetails(v => !v)}
                                aria-expanded={showTransportDetails}
                                aria-controls={`transport-details-${service.service_id}`}
                            >
                                <span>{showTransportDetails ? 'Hide' : 'Show'} Details</span>
                                <svg className={`transition-transform duration-200 w-3 h-3 ${showTransportDetails ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                            </button>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-bold border border-emerald-200">
                            {service.type}
                        </span>
                        {service.type === 'Transport' && service.transport && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold border border-blue-200">
                                {service.transport.mode}
                            </span>
                        )}
                    </div>
                </div>
                
                {service.type === 'Transport' && service.transport && showTransportDetails && (
                    <TransportCard transport={service.transport} />
                )}
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
