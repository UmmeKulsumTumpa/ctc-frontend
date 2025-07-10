import React from 'react';
import BaseModal from './BaseModal';
import PlaceDisplayMap from '../maps/PlaceDisplayMap';

interface PlaceDisplayModalProps {
    isOpen: boolean;
    onClose: () => void;
    latitude?: number;
    longitude?: number;
    placeName?: string;
    address?: string;
    title?: string;
    mapHeight?: string;
    zoom?: number;
    markerColor?: string;
}

const PlaceDisplayModal: React.FC<PlaceDisplayModalProps> = ({
    isOpen,
    onClose,
    latitude,
    longitude,
    placeName = 'Location',
    address,
    title,
    mapHeight = '500px',
    zoom = 15,
    markerColor = 'blue'
}) => {
    const modalTitle = title || `Location: ${placeName}`;

    const validCoords = typeof latitude === 'number' && typeof longitude === 'number' && !isNaN(latitude) && !isNaN(longitude);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={modalTitle}
            size="lg"
        >
            <div className="space-y-4">
                {address && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <h4 className="font-bold text-gray-800 mb-2">📍 Location Details</h4>
                        <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Name:</span> {placeName}</p>
                            <p><span className="font-medium">Address:</span> {address}</p>
                            {validCoords && (
                                <p><span className="font-medium">Coordinates:</span> {latitude!.toFixed(6)}, {longitude!.toFixed(6)}</p>
                            )}
                        </div>
                    </div>
                )}

                {validCoords ? (
                    <PlaceDisplayMap
                        latitude={latitude!}
                        longitude={longitude!}
                        placeName={placeName}
                        address={address}
                        height={mapHeight}
                        zoom={zoom}
                        markerColor={markerColor}
                        showPopup={true}
                    />
                ) : (
                    <div className="p-6 text-center text-gray-500">No valid location data available.</div>
                )}

                <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default PlaceDisplayModal;
