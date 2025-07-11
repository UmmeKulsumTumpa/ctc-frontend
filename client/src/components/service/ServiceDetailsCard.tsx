import React, { useState } from 'react';
import type { ServiceResponseDto } from '../../types/service.type';
import MapPinIcon from '../icons/MapPinIcon';
import PlaceDisplayModal from '../common/modals/PlaceDisplayModal';

interface ServiceDetailsCardProps {
    service: ServiceResponseDto;
}

const ServiceDetailsCard: React.FC<ServiceDetailsCardProps> = ({ service }) => {
    const [showMap, setShowMap] = useState(false);
    const [showTransportDetails, setShowTransportDetails] = useState(false);

    return (
        <>
            <div className="bg-white border-2 border-emerald-400 shadow-lg rounded-2xl p-7 relative">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => setShowMap(true)}
                        aria-label="View location"
                        className="bg-emerald-600 hover:bg-emerald-700 p-3 rounded-full shadow-md transition-colors text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                        <MapPinIcon size={24} />
                    </button>
                    <h3 className="text-2xl font-bold text-emerald-900">{service.name}</h3>
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-bold border border-emerald-200">
                        {service.type}
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Address */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 col-span-1">
                        <div className="text-emerald-600 text-sm font-medium mb-1">Address</div>
                        <div className="text-emerald-900 font-semibold">{service.address || <span className='text-gray-400'>N/A</span>}</div>
                    </div>
                    {/* Created */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 col-span-1">
                        <div className="text-emerald-600 text-sm font-medium mb-1">Created</div>
                        <div className="text-emerald-900 font-semibold">{new Date(service.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</div>
                    </div>
                    {/* Description (full width) */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 md:col-span-2">
                        <div className="text-gray-600 text-sm font-medium mb-1">Description</div>
                        <div className="text-gray-900 font-semibold">{service.description || <span className='text-gray-400'>No description</span>}</div>
                    </div>
                    {/* Transport Details Accordion (full width) */}
                    {service.type === 'Transport' && service.transport && (
                        <div className="md:col-span-2">
                            <button
                                type="button"
                                className="flex items-center gap-2 text-emerald-700 font-semibold text-sm py-2 px-4 rounded-lg hover:bg-emerald-50 transition mb-2"
                                onClick={() => setShowTransportDetails(v => !v)}
                                aria-expanded={showTransportDetails}
                                aria-controls={`transport-details-${service.service_id}`}
                            >
                                <span>{showTransportDetails ? 'Hide' : 'Show'} Transport Details</span>
                                <svg className={`transition-transform duration-200 w-4 h-4 ${showTransportDetails ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {showTransportDetails && (
                                <div id={`transport-details-${service.service_id}`} className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-1">
                                    <div className="text-emerald-700 text-sm font-medium mb-3">Transport Details</div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="bg-white rounded-lg p-3 border border-emerald-100">
                                            <div className="text-emerald-700 text-xs font-medium">Mode</div>
                                            <div className="text-emerald-900 font-bold">{service.transport.mode}</div>
                                        </div>
                                        {service.transport.operator && (
                                            <div className="bg-white rounded-lg p-3 border border-emerald-100">
                                                <div className="text-emerald-700 text-xs font-medium">Operator</div>
                                                <div className="text-emerald-900 font-bold">{service.transport.operator}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
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
